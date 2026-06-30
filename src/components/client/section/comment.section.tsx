import { useEffect, useState } from 'react';
import { Avatar, Button, Empty, Input, Typography, notification } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { callCreateComment, callFetchComments } from '@/config/api';
import { IComment } from '@/types/backend';
import { useAppSelector } from '@/redux/hooks';
import { useNavigate } from 'react-router-dom';
import styles from 'styles/comment.module.scss';

const { Text, Paragraph } = Typography;

dayjs.extend(relativeTime);
dayjs.locale('vi');

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const getAuthorName = (comment: IComment) => {
  if (!comment.author || typeof comment.author === 'string') {
    return 'Người dùng';
  }

  return comment.author.name || 'Người dùng';
};

const getAuthorAvatar = (comment: IComment) => {
  if (!comment.author || typeof comment.author === 'string' || !comment.author.avatar) {
    return undefined;
  }

  return `${BASE_URL}/upload/avatars/${comment.author.avatar}`;
};

const getInitials = (name: string) => name.trim().slice(0, 2).toUpperCase();

const getCommentTime = (comment: IComment) => {
  if (!comment.createdAt) {
    return 'Vừa xong';
  }

  return dayjs(comment.createdAt).fromNow();
};

export default function CommentSection({ targetType, targetId }: { targetType: IComment['targetType']; targetId: string }) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [replySaving, setReplySaving] = useState(false);
  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();

  const loadComments = async () => {
    if (!targetId) return;

    try {
      const res: any = await callFetchComments(targetType, targetId);
      setComments(res.data?.data?.result || res.data?.result || []);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    loadComments();
  }, [targetType, targetId]);

  const goToLogin = () => {
    navigate(`/login?callback=${encodeURIComponent(window.location.pathname)}`);
  };

  const submit = async () => {
    if (!user?._id) {
      goToLogin();
      return;
    }

    if (!content.trim()) return;

    setSaving(true);
    try {
      await callCreateComment({ targetType, targetId, content: content.trim() });
      setContent('');
      await loadComments();
    } catch {
      notification.error({ message: 'Không thể gửi bình luận' });
    } finally {
      setSaving(false);
    }
  };

  const toggleReply = (commentId?: string) => {
    if (!user?._id) {
      goToLogin();
      return;
    }

    setActiveReplyId((currentId) => currentId === commentId ? undefined : commentId);
    setReplyContent('');
  };

  const submitReply = async (parent?: string) => {
    if (!parent || !replyContent.trim()) return;

    setReplySaving(true);
    try {
      await callCreateComment({ targetType, targetId, content: replyContent.trim(), parent });
      setReplyContent('');
      setActiveReplyId(undefined);
      await loadComments();
    } catch {
      notification.error({ message: 'Không thể gửi phản hồi' });
    } finally {
      setReplySaving(false);
    }
  };

  const renderComment = (comment: IComment, isReply = false) => {
    const authorName = getAuthorName(comment);

    return (
      <article className={`${styles.commentItem} ${isReply ? styles.replyItem : ''}`} key={comment._id}>
        <Avatar src={getAuthorAvatar(comment)} className={styles.commentAvatar}>
          {getInitials(authorName)}
        </Avatar>

        <div className={styles.commentMain}>
          <div className={styles.commentBubble}>
            <div className={styles.commentHeader}>
              <Text className={styles.commentAuthor}>{authorName}</Text>
            </div>

            <Paragraph className={styles.commentContent}>{comment.content}</Paragraph>
          </div>

          <div className={styles.commentActions}>
            <Text className={styles.commentTime}>{getCommentTime(comment)}</Text>
            {!isReply && (
              <Button type="text" size="small" className={styles.replyButton} onClick={() => toggleReply(comment._id)}>
                Trả lời
              </Button>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className={styles.commentSection}>
      <div className={styles.composer}>
        <Input
          value={content}
          maxLength={3000}
          placeholder="Viết bình luận của bạn"
          className={styles.composerInput}
          onChange={(event) => setContent(event.target.value)}
          onPressEnter={submit}
        />
        <Button type="primary" loading={saving} onClick={submit}>
          Gửi
        </Button>
      </div>

      <div className={styles.commentList}>
        {!comments.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có bình luận" />}

        {comments.map((comment) => (
          <div className={styles.commentGroup} key={comment._id}>
            {renderComment(comment)}

            {!!comment.replies?.length && (
              <div className={styles.replyList}>
                {comment.replies.map((reply) => renderComment(reply, true))}
              </div>
            )}

            {activeReplyId === comment._id && (
              <div className={styles.replyComposer}>
                <Input
                  value={replyContent}
                  maxLength={3000}
                  placeholder={`Phản hồi ${getAuthorName(comment)}`}
                  className={styles.composerInput}
                  onChange={(event) => setReplyContent(event.target.value)}
                  onPressEnter={() => submitReply(comment._id)}
                />
                <Button type="primary" loading={replySaving} onClick={() => submitReply(comment._id)}>
                  Gửi
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
