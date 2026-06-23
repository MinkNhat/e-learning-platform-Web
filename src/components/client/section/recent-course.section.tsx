import { callFetchMyCourses, callFetchMyRecentLesson } from '@/config/api';
import { IEnrollment, ILesson } from '@/types/backend';
import { FireIconStroke } from '@/components/share/hugeicons';
import { Button, Col, Image, Progress, Row, Skeleton, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'styles/course.module.scss';

const motivationMessages = [
    'Giữ nhịp học hôm nay',
    'Thêm một bài là gần mục tiêu hơn',
    'Quay lại mạch kiến thức của bạn',
    'Học tiếp khi cảm hứng còn nóng',
    'Tiến thêm một chút nữa'
];

const getMotivationMessage = (seed: string | undefined, index: number) => {
    const source = seed || `${index}`;
    const score = source.split('').reduce((total, char) => total + char.charCodeAt(0), index);
    return motivationMessages[score % motivationMessages.length];
}

const RecentCourseSection = () => {
    const [recentCourses, setRecentCourses] = useState<IEnrollment[] | null>(null);
    const [isLoadingRecentCourses, setIsLoadingRecentCourses] = useState<boolean>(false);
    const [navigatingEnrollmentId, setNavigatingEnrollmentId] = useState<string | null>(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecentCourses();
    }, []);

    const fetchRecentCourses = async () => {
        setIsLoadingRecentCourses(true);
        const res = await callFetchMyCourses('current=1&pageSize=2&sort=-updatedAt');
        if (res && res.data) {
            setRecentCourses(res.data.result);
        }
        setIsLoadingRecentCourses(false);
    }

    const handleContinueRecentCourse = async (enrollment: IEnrollment) => {
        const course = typeof enrollment.course === 'string' ? null : enrollment.course;
        const courseSlug = course?.slug;

        if (!courseSlug || navigatingEnrollmentId) return;

        setNavigatingEnrollmentId(enrollment._id ?? courseSlug);
        try {
            const res = await callFetchMyRecentLesson(courseSlug);
            const lessonId = res.data?._id;

            if (lessonId) {
                navigate(`/my-course/${courseSlug}/${lessonId}`);
                return;
            }

            notification.warning({
                message: 'Chưa có bài học',
                description: 'Khóa học này chưa có bài học để tiếp tục'
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể mở bài học gần đây của khóa học'
            });
        } finally {
            setNavigatingEnrollmentId(null);
        }
    }

    if (isLoadingRecentCourses && !recentCourses) {
        return (
            <section className={styles["recent-learning-section"]}>
                <div className={styles["recent-learning-heading"]}>
                    <div>
                        <Skeleton.Button active size="small" style={{ width: 132, height: 18 }} />
                        <div style={{ height: 10 }} />
                        <Skeleton.Button active size="small" style={{ width: 280, height: 18 }} />
                    </div>
                    <Skeleton.Button active size="large" shape="round" style={{ width: 150, height: 42 }} />
                </div>
                <Row gutter={[16, 16]}>
                    {Array.from({ length: 2 }).map((_, index) => (
                        <Col xs={24} md={12} key={index}>
                            <div className={styles["recent-course-card"]}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Skeleton active title={{ width: '74%' }} paragraph={{ rows: 3, width: ['92%', '54%', '100%'] }} />
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </section>
        )
    }

    if (!recentCourses || recentCourses.length === 0) {
        return null;
    }

    return (
        <section className={styles["recent-learning-section"]}>
            <div className={styles["recent-learning-heading"]}>
                <div style={{ maxWidth: 620 }}>
                    <Typography.Text style={{ color: 'var(--primary-color-dark)', fontWeight: 700, textTransform: 'uppercase', fontSize: 16 }}>
                        Quay lại nhịp học của bạn
                    </Typography.Text>
                    <Typography.Paragraph style={{ margin: 0, color: '#667085', maxWidth: 560, fontSize: 15 }}>
                        Hãy tiếp tục hành trình học tập của bạn với những khóa học gần đây nhất.
                    </Typography.Paragraph>
                </div>
                <Button
                    shape="round"
                    type="default"
                    onClick={() => navigate('/my-courses')}
                >
                    Khoá học của tôi
                </Button>
            </div>
            <Row gutter={[16, 16]}>
                {recentCourses.map((item, index) => {
                    const course = typeof item.course === 'string' ? null : item.course;
                    const lastLesson = typeof item.lastLesson === 'string' ? null : item.lastLesson as ILesson | undefined;
                    const progress = Math.min(Math.max(item.progress || 0, 0), 100);
                    const isNavigating = navigatingEnrollmentId === (item._id ?? course?.slug);
                    const motivationMessage = getMotivationMessage(item._id ?? course?.slug ?? course?.title, index);

                    return (
                        <Col xs={24} md={12} key={item._id ?? course?.slug ?? course?.title}>
                            <article
                                className={styles["recent-course-card"]}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleContinueRecentCourse(item)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        handleContinueRecentCourse(item);
                                    }
                                }}
                                style={{
                                    cursor: isNavigating ? 'wait' : 'pointer',
                                    opacity: isNavigating ? 0.72 : 1,
                                }}
                            >
                                <div className={styles["recent-course-thumb-wrap"]}>
                                    <Image
                                        preview={false}
                                        src={course?.thumbnail ? `${BASE_URL}/upload/thumbnails/${course.thumbnail}` : undefined}
                                        width={118}
                                        height={118}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: 18,
                                            background: '#eef2f7',
                                        }}
                                    />
                                </div>
                                <div className={styles["recent-course-content"]}>
                                    <div>
                                        <Typography.Title
                                            level={5}
                                            style={{
                                                margin: 0,
                                                paddingTop: 4,
                                                color: '#172033',
                                                lineHeight: 1.35,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {course?.title || 'Khóa học'}
                                        </Typography.Title>
                                        <Typography.Text
                                            className={styles["recent-course-lesson"]}
                                            style={{
                                                marginTop: 4,
                                            }}
                                        >
                                            Bạn đang dừng tại{' '}
                                            <span className={styles["recent-course-lesson-name"]}>
                                                {lastLesson?.name || 'bài học tiếp theo'}
                                            </span>
                                        </Typography.Text>
                                    </div>
                                    <div className={styles["recent-course-progress-row"]}>
                                        <Progress
                                            percent={progress}
                                            showInfo={false}
                                            strokeColor={{ '0%': '#2f7055', '100%': '#73c69b' }}
                                            trailColor="#e8eee9"
                                            strokeWidth={9}
                                            style={{ width: '70%' }}
                                        />
                                        <Typography.Text strong style={{ color: '#245a45', fontSize: 13, minWidth: 40, textAlign: 'right' }}>
                                            {progress}%
                                        </Typography.Text>
                                    </div>
                                    <span className={styles["recent-course-action"]}>
                                        {isNavigating ? 'Đang mở' : motivationMessage} <FireIconStroke style={{color: '#e76666'}} />
                                    </span>
                                </div>
                            </article>
                        </Col>
                    )
                })}
            </Row>
        </section>
    )
}

export default RecentCourseSection;
