import CourseSection from '@/components/client/section/course.section';
import { callFetchCourse } from '@/config/api';
import { ICourse } from '@/types/backend';
import {PlayCircleOutlined} from '@ant-design/icons';
import { Button, Col, ConfigProvider, Progress, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import styles from 'styles/client.module.scss';

const HomePage = () => {
    const [highlightCourses, setHighlightCourses] = useState<ICourse[] | null>(null);
    const [isLoadingHighlightCourses, setIsLoadingHighlightCourses] = useState<boolean>(false);

    const recentCourses = [
        { title: 'React thực chiến', meta: 'Module 4: State management', progress: 64 },
        { title: 'NestJS căn bản', meta: 'Module 2: REST API', progress: 38 },
    ];

    useEffect(() => {
        fetchHighlightCourses();
    }, []);

    const fetchHighlightCourses = async () => {
        setIsLoadingHighlightCourses(true);
        const res = await callFetchCourse('current=1&pageSize=4&sort=-updatedAt');
        if (res && res.data) {
            setHighlightCourses(res.data.result);
        }
        setIsLoadingHighlightCourses(false);
    }

    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`} style={{ paddingTop: 28, paddingBottom: 56 }}>
            <div style={{ display: 'grid', gap: 42 }}>
                <CourseSection
                    title='Khoá học nổi bật'
                    courses={highlightCourses}
                    isLoading={isLoadingHighlightCourses}
                />

                <section>
                    <div className={styles["section-heading"]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, marginBottom: 20 }}>
                        <div>
                            <Typography.Text style={{ color: 'var(--primary-color-dark)', fontWeight: 700, textTransform: 'uppercase', fontSize: 16 }}>
                                Khóa học đã xem
                            </Typography.Text>
                            <Typography.Paragraph style={{ margin: 0, color: '#667085', maxWidth: 620 }}>
                                Lịch sử khóa học của bạn sẽ được lưu lại, giúp bạn dễ dàng tiếp tục học tập và theo dõi tiến trình của mình.
                            </Typography.Paragraph>
                        </div>
                        <ConfigProvider
                            theme={{
                                token: {
                                colorPrimary: '#00c26f',
                                },
                            }}
                        >
                            <Button shape="round" type="default">Xem lịch sử</Button>
                        </ConfigProvider>
                    </div>
                    <Row gutter={[16, 16]}>
                        {recentCourses.map((item) => (
                            <Col xs={24} md={12} key={item.title}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center', border: '1px solid #e7e9f0', borderRadius: 18, padding: 16, background: '#fff' }}>
                                    <div style={{ width: 72, height: 72, flex: '0 0 72px', borderRadius: 16, display: 'grid', placeItems: 'center', background: '#101828', color: '#fff', fontSize: 24 }}>
                                        <PlayCircleOutlined />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Typography.Title level={4} ellipsis style={{ margin: 0, color: '#182033' }}>{item.title}</Typography.Title>
                                        <Typography.Text type="secondary">{item.meta}</Typography.Text>
                                        <Progress percent={item.progress} size="small" showInfo={false} style={{ marginTop: 10 }} />
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </section>
            </div>
        </div>
    )
}

export default HomePage;
