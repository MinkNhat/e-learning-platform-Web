import { useEffect, useState } from 'react';
import { Avatar, Button, Dropdown, Empty, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { callFetchBlog } from '@/config/api';
import ClientBreadcrumb from '@/components/client/breadcrumb.client';
import CommentSection from '@/components/client/section/comment.section';
import { IBlog } from '@/types/backend';
import {
  FavouriteIcon,
  MoreHorizontalIcon,
  ShareKnowledgeIcon,
} from '@/config/hugeicons';
import blogStyles from 'styles/blog.module.scss';

const { Title, Text } = Typography;
export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<IBlog>();
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    if (slug) {
      callFetchBlog(slug)
        .then((res: any) => setBlog(res.data?.data || res.data))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const getAuthorName = (item: IBlog) => {
    if (!item.author || typeof item.author === 'string') {
      return 'Chưa rõ tác giả';
    }

    return item.author.name;
  }

  const getAuthorAvatar = (item: IBlog) => {
    if (!item.author || typeof item.author === 'string' || !item.author.avatar) {
      return undefined;
    }

    return `${BASE_URL}/upload/avatars/${item.author.avatar}`;
  }

  const getUpdatedDate = (item: IBlog) => {
    if (!item.updatedAt) {
      return 'Chưa cập nhật';
    }

    return dayjs(item.updatedAt).format('DD/MM/YYYY');
  }

  if (loading) return <Skeleton active style={{ margin: 40 }} />;
  if (!blog?._id) return <Empty description="Không tìm thấy bài viết" />;

  return <div className={blogStyles["blog-detail-page"]}>
    <ClientBreadcrumb
      className={blogStyles["blog-detail-breadcrumb"]}
      items={[
        { title: 'Trang chủ', path: '/' },
        { title: 'Diễn đàn', path: '/blog' },
        { title: `Bài viết ${blog.title}` },
      ]}
    />

    <article className={blogStyles["blog-detail-article"]}>
      <header className={blogStyles["blog-detail-header"]}>
        <Title className={blogStyles["blog-detail-title"]}>{blog.title}</Title>

        <div className={blogStyles["blog-detail-topline"]}>
          <div className={blogStyles["blog-detail-author"]}>
            <Avatar src={getAuthorAvatar(blog)} className={blogStyles["blog-detail-avatar"]}>
              {getAuthorName(blog).slice(0, 2).toUpperCase()}
            </Avatar>

            <div className={blogStyles["blog-detail-author-info"]}>
              <Text className={blogStyles["blog-detail-author-name"]}>{getAuthorName(blog)}</Text>
              <Text className={blogStyles["blog-detail-meta"]}>
                Cập nhật {getUpdatedDate(blog)} • 10 phút đọc
              </Text>
            </div>
          </div>

          <div className={blogStyles["blog-detail-actions"]}>
            <Button
              type="text"
              shape="circle"
              aria-label="Lưu bài viết"
              icon={<FavouriteIcon />}
            />
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'share',
                    label: 'Chia sẻ',
                    icon: <ShareKnowledgeIcon />,
                  },
                  {
                    key: 'report',
                    label: 'Báo cáo',
                  },
                ],
              }}
            >
              <Button
                type="text"
                shape="circle"
                aria-label="Tuỳ chọn bài viết"
                icon={<MoreHorizontalIcon />}
              />
            </Dropdown>
          </div>
        </div>
      </header>

      <div className={blogStyles["blog-detail-content"]} dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>

    <section className={blogStyles["blog-comments"]}>
      <Title level={3} className={blogStyles["blog-comments-title"]}>Bình luận</Title>
      <CommentSection targetType="blog" targetId={blog._id} />
    </section>
  </div>;
}
