import { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Dropdown, Empty, Skeleton, Typography } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FavouriteIcon,
  MoreHorizontalIcon,
  ShareKnowledgeIcon,
} from '@/config/hugeicons';
import { callFetchBlogs, callFetchRootCategory } from '@/config/api';
import { IBlog, ICategory } from '@/types/backend';
import blogStyles from 'styles/blog.module.scss';

const { Title, Paragraph, Text } = Typography;

dayjs.extend(relativeTime);
dayjs.locale('vi');

const bannerItems = [
  {
    title: 'Banner-1',
    image: 'https://blog.phx-smartschool.com/wp-content/uploads/2024/12/E-Learning-la-gi-Tong-quan-ve-dao-tao-E-Learning.jpeg',
  },
  {
    title: 'Banner-2',
    image: 'https://blog.phx-smartschool.com/wp-content/uploads/2024/12/Hinh-thuc-dao-tao-truc-tuyen-E-Learning-1.jpeg',
  },
  {
    title: 'Banner-3',
    image: 'https://blog.phx-smartschool.com/wp-content/uploads/2024/12/Moi-nguoi-duoc-mo-rong-co-hoi-hoc-tap-voi-giai-phap-E-learning.jpeg',
  },
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [rootCategories, setRootCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

  const fetchBlogs = async () => {
    try {
      const res = await callFetchBlogs("pageSize=12");
      if (res.data) {
        setBlogs(res.data?.result || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchRootCategories = async () => {
    try {
      const res = await callFetchRootCategory('current=1&pageSize=30&sort=createdAt');
      if (res.data) {
        setRootCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching root categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
    fetchRootCategories();
  }, []);

  

  const getAuthorName = (blog: IBlog) => {
    if (!blog.author || typeof blog.author === 'string') {
      return 'Tác giả';
    }

    return blog.author.name;
  }

  const getAuthorAvatar = (blog: IBlog) => {
    if (!blog.author || typeof blog.author === 'string' || !blog.author.avatar) {
      return undefined;
    }

    return `${BASE_URL}/upload/avatars/${blog.author.avatar}`;
  }

  const getBlogCategoryValues = (blog: IBlog) => {
    const category = blog.category as ICategory | undefined;
    if (!category) return [];

    return [category._id, category.slug].filter(Boolean);
  }

  const filteredBlogs = useMemo(() => {
    if (selectedCategory === 'all') return blogs;

    return blogs.filter((blog) => getBlogCategoryValues(blog).includes(selectedCategory));
  }, [blogs, selectedCategory]);

  // banner
  const activeBanner = bannerItems[activeBannerIndex];

  useEffect(() => {
    const bannerTimer = window.setInterval(() => {
      setActiveBannerIndex((currentIndex) => (currentIndex + 1) % bannerItems.length);
    }, 5000);

    return () => window.clearInterval(bannerTimer);
  }, []);

  const showPreviousBanner = () => {
    setActiveBannerIndex((currentIndex) => (
      currentIndex === 0 ? bannerItems.length - 1 : currentIndex - 1
    ));
  }

  const showNextBanner = () => {
    setActiveBannerIndex((currentIndex) => (currentIndex + 1) % bannerItems.length);
  }

  const renderBlogSkeletons = () => (
    Array.from({ length: 4 }).map((_, index) => (
      <div key={`blog-row-skeleton-${index}`} className={blogStyles["forum-card-skeleton"]}>
        <div className={blogStyles["forum-card-skeleton-topline"]}>
          <Skeleton.Avatar active size="small" />
          <Skeleton.Button active size="small" />
        </div>
        <div className={blogStyles["forum-card-skeleton-main"]}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      </div>
    ))
  )

  return (
    <main className={blogStyles["blog-forum-page"]}>
      <section className={blogStyles["blog-forum-hero"]}>
        <Text style={{ color: 'var(--primary-color-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0, fontSize: 16 }}>
          Diễn đàn trao đổi
        </Text>
        <Paragraph className={blogStyles["blog-forum-subtitle"]}>
          Tổng hợp các bài viết chia sẻ về kinh nghiệm và kiến thức trong các lĩnh vực của cuộc sống và công việc. Hãy cùng nhau học hỏi và phát triển!
        </Paragraph>
      </section>

      <div className={blogStyles["blog-forum-layout"]}>
        <section className={blogStyles["blog-forum-feed"]} aria-label="Danh sách bài viết">
          {loading
            ? renderBlogSkeletons()
            : filteredBlogs.length > 0
              ? filteredBlogs.map((blog) => (
                <article key={blog._id ?? blog.slug ?? blog.title} className={blogStyles["forum-card"]}>
                  <div className={blogStyles["forum-card-topline"]}>
                    <div className={blogStyles["forum-card-author"]}>
                      <Avatar src={getAuthorAvatar(blog)} className={blogStyles["forum-card-avatar"]}>
                        {getAuthorName(blog).slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Text className={blogStyles["forum-card-author-name"]}>{getAuthorName(blog)}</Text>
                    </div>

                    <div className={blogStyles["forum-card-actions"]}>
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

                  <div className={`${blogStyles["forum-card-main"]} ${!blog.coverImage ? blogStyles["forum-card-main-no-cover"] : ''}`}>
                    <div className={blogStyles["forum-card-text"]}>
                      <Link to={`/blog/${blog.slug || blog._id}`} className={blogStyles["forum-card-title-link"]}>
                        <Title level={3} className={blogStyles["forum-card-title"]}>
                          {blog.title}
                        </Title>
                      </Link>

                      <Paragraph ellipsis={{ rows: 2 }} className={blogStyles["forum-card-description"]}>
                        {blog.description}
                      </Paragraph>

                      <div className={blogStyles["forum-card-meta"]}>
                        <span className={blogStyles["forum-card-category"]}>{(blog.category as ICategory).name}</span>
                        <span>{dayjs(blog.updatedAt).fromNow()}</span>
                        <span>10 phút đọc</span>
                      </div>
                    </div>

                    {blog.coverImage &&
                      <Link to={`/blog/${blog.slug || blog._id}`} className={blogStyles["forum-card-cover-link"]}>
                        <img
                          className={blogStyles["forum-card-cover"]}
                          alt={blog.title}
                          src={`${BASE_URL}/upload/coverImages/${blog.coverImage}`}
                        />
                      </Link>
                    }
                  </div>
                </article>
              ))
              : <div className={blogStyles["blog-forum-empty"]}>
                <Empty description="Chưa có bài viết phù hợp" />
              </div>
          }
        </section>

        <aside className={blogStyles["blog-forum-sidebar"]}>
          <section className={blogStyles["blog-category-panel"]} aria-label="Lọc bài viết theo chủ đề">
            <Text className={blogStyles["sidebar-eyebrow"]}>Xem các bài viết theo chủ đề</Text>

            <div className={blogStyles["blog-category-list"]}>
              <button
                type="button"
                className={`${blogStyles["blog-category-chip"]} ${selectedCategory === 'all' ? blogStyles["blog-category-chip-active"] : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Tất cả
              </button>

              {loadingCategories
                ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton.Button key={`category-skeleton-${index}`} active className={blogStyles["blog-category-skeleton"]} />
                ))
                : rootCategories.map((category) => {
                  const categoryKey = category.slug || category._id || category.name;

                  return (
                    <button
                      key={category._id ?? category.slug}
                      type="button"
                      className={`${blogStyles["blog-category-chip"]} ${selectedCategory === categoryKey ? blogStyles["blog-category-chip-active"] : ''}`}
                      onClick={() => setSelectedCategory(categoryKey)}
                    >
                      {category.name}
                    </button>
                  );
                })
              }
            </div>
          </section>

          <section className={blogStyles["blog-banner-panel"]} aria-label="Banner nổi bật">
            <div key={activeBanner.title} className={blogStyles["blog-banner-card"]}>
              <img src={activeBanner.image} alt={activeBanner.title} className={blogStyles["blog-banner-image"]} />
              <Button
                type="default"
                shape="circle"
                aria-label="Banner trước"
                className={`${blogStyles["blog-banner-nav"]} ${blogStyles["blog-banner-nav-prev"]}`}
                icon={<ArrowLeft01Icon />}
                onClick={showPreviousBanner}
              />
              <Button
                type="default"
                shape="circle"
                aria-label="Banner tiếp theo"
                className={`${blogStyles["blog-banner-nav"]} ${blogStyles["blog-banner-nav-next"]}`}
                icon={<ArrowRight01Icon />}
                onClick={showNextBanner}
              />
            </div>

            <div className={blogStyles["blog-banner-controls"]}>
              <div className={blogStyles["blog-banner-dots"]}>
                {bannerItems.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Xem banner ${index + 1}`}
                    className={activeBannerIndex === index ? blogStyles["blog-banner-dot-active"] : ''}
                    onClick={() => setActiveBannerIndex(index)}
                  />
                ))}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
