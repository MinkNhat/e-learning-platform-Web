import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Avatar, Button, Empty, Image, Skeleton, Tabs, Typography, Upload, message, notification } from 'antd';
import type { UploadProps } from 'antd';
import {
    BookOpen02Icon,
    Calendar01Icon,
    Camera01Icon,
    ContentWritingIcon,
    FireIcon,
    LockPasswordIcon,
    Megaphone01Icon,
    SecurityLockIcon,
    UserLove01Icon,
    UserMultipleIcon,
} from '@/config/hugeicons';
import { callFetchBlogs, callFetchCourse, callFetchMyCourses, callFetchUserById, callUpdateUser, callUploadSingleFile } from '@/config/api';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IBlog, ICourse, IEnrollment, IUser } from '@/types/backend';
import { resolveUserAvatarUrl } from '@/config/utils';
import styles from '@/styles/profile.module.scss';

const { Text, Title } = Typography;

dayjs.locale('vi');

const hardcodedStats = {
    following: 18,
    followers: 247,
    streak: 7,
};

const heatmapLevels: Record<number, number> = {
    12: 1,
    41: 2,
    76: 1,
    118: 3,
    147: 2,
    214: 1,
    265: 4,
    300: 2,
    318: 3,
    334: 1,
};

const getAuthorName = (item?: ICourse | IBlog) => {
    if (!item) return 'Tác giả';

    if ('authors' in item) {
        return item.authors?.map(author => author.name).join(', ') || 'Tác giả';
    }

    if (!item.author || typeof item.author === 'string') {
        return 'Tác giả';
    }

    return item.author.name;
};

const MinimalItemCard = ({
    title,
    author,
    thumbnail,
    to,
}: {
    title: string;
    author: string;
    thumbnail?: string;
    to?: string;
}) => {
    const content = (
        <article className={styles['profile-minimal-card']}>
            <div className={styles['profile-minimal-thumb']}>
                {thumbnail
                    ? <img src={thumbnail} alt={title} />
                    : <div className={styles['profile-minimal-thumb-empty']}><BookOpen02Icon /></div>
                }
            </div>
            <div className={styles['profile-minimal-content']}>
                <Text strong className={styles['profile-minimal-title']}>
                    {title}
                </Text>
                <Text type="secondary" ellipsis className={styles['profile-minimal-author']}>
                    {author}
                </Text>
            </div>
        </article>
    );

    return to ? <Link to={to} className={styles['profile-minimal-link']}>{content}</Link> : content;
};

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.account.user);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
    const { userId } = useParams<{ userId?: string }>();
    const location = useLocation();
    const routeProfileUser = (location.state as { profileUser?: Partial<IUser> } | null)?.profileUser;
    const isOwnProfile = !userId || userId === user._id;
    const profileUserId = isOwnProfile ? user._id : userId;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [profileUser, setProfileUser] = useState<Partial<IUser> | null>(null);
    const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
    const [authoredCourses, setAuthoredCourses] = useState<ICourse[]>([]);
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingAuthoredCourses, setLoadingAuthoredCourses] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const displayUser = isOwnProfile ? user : profileUser;

    const avatarUrl = useMemo(() => resolveUserAvatarUrl(displayUser?.avatar), [displayUser?.avatar]);

    const joinedDate = displayUser?.createdAt && dayjs(displayUser.createdAt).isValid() ? dayjs(displayUser.createdAt).format('DD/MM/YYYY') : 'Chưa cập nhật';

    useEffect(() => {
        if (isOwnProfile) {
            setProfileUser(null);
            setLoadingProfile(false);
            return;
        }

        setProfileUser(routeProfileUser ?? null);

        if (!userId) return;

        const fetchProfileUser = async () => {
            setLoadingProfile(true);
            try {
                const res = await callFetchUserById(userId);
                setProfileUser(res?.data ?? routeProfileUser ?? null);
            } catch (error) {
                if (!routeProfileUser) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể tải thông tin người dùng',
                    });
                }
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfileUser();
    }, [isOwnProfile, routeProfileUser, userId]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!isOwnProfile) {
                setEnrollments([]);
                setLoadingCourses(false);
                return;
            }

            setLoadingCourses(true);
            try {
                const res = await callFetchMyCourses('current=1&pageSize=8');
                setEnrollments(res?.data?.result ?? []);
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải khoá học đã đăng ký',
                });
                setEnrollments([]);
            } finally {
                setLoadingCourses(false);
            }
        };

        const fetchBlogs = async () => {
            setLoadingBlogs(true);
            try {
                const res = await callFetchBlogs('current=1&pageSize=24');
                const result = res?.data?.result ?? [];
                setBlogs(result.filter(blog => (
                    blog.author &&
                    typeof blog.author !== 'string' &&
                    blog.author._id === profileUserId
                )));
            } catch (error) {
                setBlogs([]);
            } finally {
                setLoadingBlogs(false);
            }
        };

        const fetchAuthoredCourses = async () => {
            if (!profileUserId) {
                setAuthoredCourses([]);
                setLoadingAuthoredCourses(false);
                return;
            }

            setLoadingAuthoredCourses(true);
            try {
                const query = new URLSearchParams({
                    current: '1',
                    pageSize: '8',
                    authors: profileUserId,
                });
                const res = await callFetchCourse(query.toString());
                setAuthoredCourses(res?.data?.result ?? []);
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải khoá học của tác giả',
                });
                setAuthoredCourses([]);
            } finally {
                setLoadingAuthoredCourses(false);
            }
        };

        fetchCourses();
        fetchAuthoredCourses();
        if (profileUserId) {
            fetchBlogs();
        } else {
            setLoadingBlogs(false);
        }
    }, [isOwnProfile, profileUserId]);

    const handleAvatarUpload: UploadProps['beforeUpload'] = async (file) => {
        if (!user._id) {
            message.warning('Bạn cần đăng nhập để đổi ảnh đại diện');
            return Upload.LIST_IGNORE;
        }

        if (!file.type.startsWith('image/')) {
            message.error('Vui lòng chọn một file ảnh');
            return Upload.LIST_IGNORE;
        }

        setUploadingAvatar(true);
        try {
            const uploadRes = await callUploadSingleFile(file, 'avatar');
            const fileName = uploadRes?.data?.fileName;

            if (!fileName) {
                throw new Error('Missing uploaded file name');
            }

            const updateRes = await callUpdateUser({ avatar: fileName }, user._id);
            const nextAvatar = updateRes?.data?.avatar ?? fileName;

            dispatch(setUserLoginInfo({
                ...user,
                avatar: nextAvatar,
            }));
            message.success('Cập nhật ảnh đại diện thành công');
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật ảnh đại diện',
            });
        } finally {
            setUploadingAvatar(false);
        }

        return Upload.LIST_IGNORE;
    };

    const renderCourseList = () => {
        if (loadingCourses) {
            return Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`profile-course-skeleton-${index}`} active avatar paragraph={{ rows: 1 }} />
            ));
        }

        if (!enrollments.length) {
            return <Empty description={isOwnProfile ? 'Bạn chưa đăng ký khoá học nào' : 'Chưa có dữ liệu khoá học'} />;
        }

        return enrollments.map((enrollment) => {
            const course = typeof enrollment.course === 'string' ? undefined : enrollment.course;

            return (
                <MinimalItemCard
                    key={enrollment._id ?? course?._id ?? course?.title}
                    title={course?.title ?? 'Khoá học'}
                    author={getAuthorName(course)}
                    thumbnail={course?.thumbnail ? `${BASE_URL}/upload/thumbnails/${course.thumbnail}` : undefined}
                    to={course?.slug ? `/course/${course.slug}` : undefined}
                />
            );
        });
    };

    const renderAuthoredCourseList = () => {
        if (loadingAuthoredCourses) {
            return Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`profile-authored-course-skeleton-${index}`} active avatar paragraph={{ rows: 1 }} />
            ));
        }

        if (!authoredCourses.length) {
            return <Empty description={isOwnProfile ? 'Bạn chưa là tác giả của khoá học nào' : 'Người này chưa là tác giả của khoá học nào'} />;
        }

        return authoredCourses.map((course) => (
            <MinimalItemCard
                key={course._id ?? course.title}
                title={course.title}
                author={getAuthorName(course)}
                thumbnail={course.thumbnail ? `${BASE_URL}/upload/thumbnails/${course.thumbnail}` : undefined}
                to={course.slug ? `/course/${course.slug}` : undefined}
            />
        ));
    };

    const renderBlogList = () => {
        if (loadingBlogs) {
            return Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`profile-blog-skeleton-${index}`} active avatar paragraph={{ rows: 1 }} />
            ));
        }

        if (!blogs.length) {
            return <Empty description="Bạn chưa đăng bài viết nào" />;
        }

        return blogs.map((blog) => (
            <MinimalItemCard
                key={blog._id ?? blog.slug ?? blog.title}
                title={blog.title}
                author={getAuthorName(blog)}
                thumbnail={typeof blog.coverImage === 'string' ? `${BASE_URL}/upload/coverImages/${blog.coverImage}` : undefined}
                to={blog.slug || blog._id ? `/blog/${blog.slug || blog._id}` : undefined}
            />
        ));
    };

    return (
        <main className={`${styles['container']} ${styles['profile-page']}`}>
            <section className={styles['profile-layout']}>
                <aside className={styles['profile-sidebar']}>
                    <div className={styles['profile-avatar-wrap']}>
                        <button
                            type="button"
                            className={styles['profile-avatar-button']}
                            onClick={() => avatarUrl && setPreviewOpen(true)}
                            aria-label="Xem ảnh đại diện"
                        >
                            <Avatar size={136} src={avatarUrl} />
                        </button>
                        {isOwnProfile &&
                            <Upload
                                showUploadList={false}
                                accept="image/*"
                                beforeUpload={handleAvatarUpload}
                                disabled={uploadingAvatar}
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<Camera01Icon />}
                                    loading={uploadingAvatar}
                                    aria-label="Đổi ảnh đại diện"
                                    className={styles['profile-avatar-upload']}
                                />
                            </Upload>
                        }
                        <Image
                            src={avatarUrl}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: setPreviewOpen,
                            }}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className={styles['profile-heading']}>
                        {loadingProfile
                            ? <Skeleton active paragraph={{ rows: 1 }} />
                            : <>
                                <Title level={2}>{displayUser?.name || 'Người dùng'}</Title>
                                <Text type='secondary'>{displayUser?.email || 'Chưa cập nhật email'}</Text>
                            </>
                        }
                    </div>

                    <div className={styles['profile-meta-list']}>
                        <div>
                            <span><UserMultipleIcon /> {hardcodedStats.following} đang theo dõi</span>
                            
                        </div>
                        <div>
                            <span><UserLove01Icon /> {hardcodedStats.followers} người theo dõi</span>
                        </div>
                        <div>
                            <FireIcon />
                            <span>{hardcodedStats.streak} ngày học liên tiếp</span>
                        </div>
                        <div>
                            <Calendar01Icon />
                            <span>Tham gia từ {joinedDate}</span>
                        </div>
                    </div>

                    {isOwnProfile &&
                        <div className={styles['profile-actions']}>
                            <Button icon={<LockPasswordIcon />}>Đổi mật khẩu</Button>
                            <Button icon={<Megaphone01Icon />}>Cài đặt thông báo</Button>
                            <Button icon={<SecurityLockIcon />}>Bảo mật tài khoản</Button>
                        </div>
                    }
                </aside>

                <section className={styles['profile-main']}>
                    <section className={styles['profile-heatmap-panel']}>
                        <div className={styles['profile-heatmap-header']}>
                            <Title level={4}>{hardcodedStats.streak} hoạt động trong 12 tháng qua</Title>
                            <Text type="secondary">2026</Text>
                        </div>
                        <div className={styles['profile-heatmap-scroll']}>
                            <div className={styles['profile-heatmap-months']}>
                                {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => (
                                    <span key={month}>{month}</span>
                                ))}
                            </div>
                            <div className={styles['profile-heatmap-body']}>
                                <div className={styles['profile-heatmap-days']}>
                                    <span>Mon</span>
                                    <span>Wed</span>
                                    <span>Fri</span>
                                </div>
                                <div className={styles['profile-heatmap-grid']}>
                                    {Array.from({ length: 53 * 7 }).map((_, index) => {
                                        const level = heatmapLevels[index] ?? 0;

                                        return (
                                            <span
                                                key={`activity-${index}`}
                                                className={`${styles['profile-heatmap-cell']} ${styles[`profile-heatmap-level-${level}`]}`}
                                                aria-label={`${level} hoạt động`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={styles['profile-heatmap-legend']}>
                                <span>Ít hơn</span>
                                {[0, 1, 2, 3, 4].map(level => (
                                    <span
                                        key={`legend-${level}`}
                                        className={`${styles['profile-heatmap-cell']} ${styles[`profile-heatmap-level-${level}`]}`}
                                    />
                                ))}
                                <span>Nhiều hơn</span>
                            </div>
                        </div>
                    </section>

                    <Tabs
                        className={styles['profile-tabs']}
                        items={[
                            ...(isOwnProfile
                                ? [{
                                    key: 'courses',
                                    label: (
                                        <span className={styles['profile-tab-label']}>
                                            Khoá học đã đăng ký ({enrollments.length})
                                        </span>
                                    ),
                                    children: <div className={styles['profile-list']}>{renderCourseList()}</div>,
                                }]
                                : []),
                            {
                                key: 'authored-courses',
                                label: (
                                    <span className={styles['profile-tab-label']}>
                                        Khoá học ({authoredCourses.length})
                                    </span>
                                ),
                                children: <div className={styles['profile-list']}>{renderAuthoredCourseList()}</div>,
                            },
                            {
                                key: 'blogs',
                                label: (
                                    <span className={styles['profile-tab-label']}>
                                        Bài viết ({blogs.length})
                                    </span>
                                ),
                                children: <div className={styles['profile-list']}>{renderBlogList()}</div>,
                            },
                        ]}
                    />
                </section>
            </section>
        </main>
    );
};

export default ProfilePage;
