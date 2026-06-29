import { useEffect, useState } from 'react';
import { Button, Input, List, Space, Typography, notification } from 'antd';
import { callCreateComment, callFetchComments } from '@/config/api';
import { IComment } from '@/types/backend';
import { useAppSelector } from '@/redux/hooks';
import { useNavigate } from 'react-router-dom';

const { Text, Paragraph } = Typography;

export default function CommentSection({ targetType, targetId }: { targetType: IComment['targetType']; targetId: string }) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();

  const load = async () => {
    if (!targetId) return;
    try { const res: any = await callFetchComments(targetType, targetId); setComments(res.data?.data?.result || res.data?.result || []); } catch { setComments([]); }
  };
  useEffect(() => { load(); }, [targetType, targetId]);

  const submit = async () => {
    if (!user?._id) { navigate(`/login?callback=${encodeURIComponent(location.pathname)}`); return; }
    if (!content.trim()) return;
    setSaving(true);
    try {
      await callCreateComment({ targetType, targetId, content: content.trim() });
      setContent(''); await load();
    } catch { notification.error({ message: 'Không thể gửi bình luận' }); }
    finally { setSaving(false); }
  };

  return <div>
    <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
      <Input value={content} maxLength={3000} placeholder="Viết bình luận của bạn" onChange={(event) => setContent(event.target.value)} onPressEnter={submit} />
      <Button type="primary" loading={saving} onClick={submit}>Gửi</Button>
    </Space.Compact>
    <List dataSource={comments} locale={{ emptyText: 'Chưa có bình luận' }} renderItem={(comment) => (
      <List.Item>
        <div>
          <Text strong>{typeof comment.author === 'string' ? 'Người dùng' : comment.author?.name || 'Người dùng'}</Text>
          <Paragraph style={{ margin: '4px 0' }}>{comment.content}</Paragraph>
          {(comment.replies || []).map((reply) => <div key={reply._id} style={{ marginLeft: 20, borderLeft: '2px solid #eee', paddingLeft: 12 }}>
            <Text strong>{typeof reply.author === 'string' ? 'Người dùng' : reply.author?.name || 'Người dùng'}</Text><br />{reply.content}
          </div>)}
        </div>
      </List.Item>
    )} />
  </div>;
}
