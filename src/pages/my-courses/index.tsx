import MyCourseCard from '@/components/client/card/my-course.card';
import { callFetchMyCourses } from '@/config/api';
import { IEnrollment } from '@/types/backend';
import { BookOutlined } from '@ant-design/icons';
import { Empty, Pagination, Row, Col, Skeleton, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import styles from 'styles/client.module.scss';

const { Text, Title } = Typography;

const MyCoursesPage = () => {
    const [enrollments, setEnrollments] = useState<IEnrollment[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchMyCourses();
    }, [current, pageSize]);

    const fetchMyCourses = async () => {
        setIsLoading(true);
        try {
            const res = await callFetchMyCourses(`current=${current}&pageSize=${pageSize}`);
            if (res?.data) {
                setEnrollments(res.data.result);
                setTotal(res.data.meta.total);
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải danh sách khóa học của bạn'
            });
            setEnrollments([]);
            setTotal(0);
        } finally {
            setIsLoading(false);
        }
    }

    const completedCount = enrollments?.filter(item => item.progress >= 100).length ?? 0;
    const learningCount = Math.max((enrollments?.length ?? 0) - completedCount, 0);

    const renderMyCourseSkeletons = () => (
        Array.from({ length: pageSize }).map((_, index) => (
            <div
                key={`my-course-skeleton-${index}`}
                style={{
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 18,
                    overflow: 'hidden',
                    border: '1px solid #e7e9f0',
                    background: '#fff',
                    boxShadow: '0 14px 34px rgba(20, 31, 55, 0.06)',
                    padding: 10,
                }}
            >
                <div style={{ padding: '14px 8px 8px', flex: 1 }}>
                    <Skeleton
                        active
                        title={{ width: '82%' }}
                        paragraph={{ rows: 6, width: ['100%', '76%', '92%', '56%', '100%', '48%'] }}
                    />
                </div>
            </div>
        ))
    )

    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`} style={{ marginTop: 28, marginBottom: 56 }}>
            <section
                style={{
                    padding: '28px 28px 24px',
                    borderRadius: 24,
                    background: '#202230',
                    border: '1px solid #e4efe9',
                    marginBottom: 24,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ maxWidth: 680 }}>
                        <Text style={{ color: 'var(--primary-color-dark)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0, fontSize: 13 }}>
                            Khoá học của tôi
                        </Text>
                        <Title level={3} style={{ margin: '6px 0 8px', color: '#fff' }}>
                            Tiếp tục hành trình học tập của bạn
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: 15 }}>
                            Theo dõi tiến độ và quay lại bài học còn dang dở của bạn.
                        </Text>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ minWidth: 126, padding: '12px 16px', borderRadius: 16, background: '#fff', border: '1px solid #e7e9f0' }}>
                            <Text style={{ color: '#667085', fontSize: 13 }}>Đang học</Text>
                            <div style={{ color: 'var(--text-primary-dark)', fontSize: 24, fontWeight: 800 }}>{learningCount}</div>
                        </div>
                        <div style={{ minWidth: 126, padding: '12px 16px', borderRadius: 16, background: '#fff', border: '1px solid #e7e9f0' }}>
                            <Text style={{ color: '#667085', fontSize: 13 }}>Hoàn thành</Text>
                            <div style={{ color: 'var(--primary-color-dark)', fontSize: 24, fontWeight: 800 }}>{completedCount}</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles["my-course-grid"]}>
                {isLoading ? renderMyCourseSkeletons() : enrollments?.map(item => <MyCourseCard key={item._id} enrollment={item} />)}
            </div>

            {(!enrollments || enrollments.length === 0) && !isLoading &&
                <div className={styles["empty"]}>
                    <Empty description="Bạn chưa đăng ký khóa học nào" />
                </div>
            }

            <Row style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
                <Pagination
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    responsive
                    disabled={isLoading}
                    onChange={(page: number, size: number) => {
                        if (size !== pageSize) {
                            setPageSize(size);
                            setCurrent(1);
                            return;
                        }
                        setCurrent(page);
                    }}
                />
            </Row>
        </div>
    )
}

export default MyCoursesPage;
