import CourseSection from '@/components/client/section/course.section';
import { callFetchCourse, callFetchRootCategory } from '@/config/api';
import { getAntdIconComponent } from '@/config/utils';
import { ICategory, ICourse, IModelPaginate } from '@/types/backend';
import { BulbOutlined, PlayCircleOutlined, SketchOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, Progress, Row, Skeleton, Typography } from 'antd';
import { createElement, useEffect, useState } from 'react';
import styles from 'styles/client.module.scss';

const HomePage = () => {
    const [highlightCourses, setHighlightCourses] = useState<ICourse[] | null>(null);
    const [isLoadingHighlightCourses, setIsLoadingHighlightCourses] = useState<boolean>(false);
    const [rootCategories, setRootCategories] = useState<ICategory[]>([]);
    const [isLoadingRootCategories, setIsLoadingRootCategories] = useState<boolean>(false);

    const recentCourses = [
        { title: 'React thực chiến', meta: 'Module 4: State management', progress: 64 },
        { title: 'NestJS căn bản', meta: 'Module 2: REST API', progress: 38 },
    ];

    const aiCareerBenefits = [
        { icon: <SketchOutlined />, title: 'Tìm hiểu về AI và nhiều chủ đề khác', color: '#c9bcff' },
        { icon: <TrophyOutlined />, title: 'Luyện thi chứng chỉ', color: '#b9ecd5' },
        { icon: <PlayCircleOutlined />, title: 'Thực hành huấn luyện AI', color: '#ffe1a8' },
        { icon: <BulbOutlined />, title: 'Thăng tiến sự nghiệp của chính bạn', color: '#c9f2ee' },
    ];

    useEffect(() => {
        fetchHighlightCourses();
        fetchRootCategories();
    }, []);

    const fetchHighlightCourses = async () => {
        setIsLoadingHighlightCourses(true);
        const res = await callFetchCourse('current=1&pageSize=4&sort=-updatedAt');
        if (res && res.data) {
            setHighlightCourses(res.data.result);
        }
        setIsLoadingHighlightCourses(false);
    }

    const fetchRootCategories = async () => {
        setIsLoadingRootCategories(true);
        const res = await callFetchRootCategory('current=1&pageSize=20&sort=createdAt');
        const data = res?.data as unknown as ICategory[] | ICategory | IModelPaginate<ICategory> | undefined;

        if (Array.isArray(data)) {
            setRootCategories(data);
        } else if (data && 'result' in data && Array.isArray(data.result)) {
            setRootCategories(data.result);
        } else if (data && '_id' in data) {
            setRootCategories([data]);
        }

        setIsLoadingRootCategories(false);
    }

    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`} style={{ paddingTop: 28, paddingBottom: 56 }}>
            <div style={{ display: 'grid', gap: 42 }}>
                {/* Top Banner Section */}
                <section
                    className={styles["career-ai-banner"]}
                    style={{
                        background: '#202230',
                        borderRadius: 28,
                        color: '#fff',
                        overflow: 'hidden',
                        padding: '24px 72px',
                    }}
                >
                    <div className={styles["career-ai-banner-content"]} style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'center' }}>
                        <div>
                            <Typography.Title
                                level={1}
                                className={styles["career-ai-banner-title"]}
                                style={{
                                    color: '#fff',
                                    fontSize: 32,
                                    lineHeight: 1.15,
                                    letterSpacing: 0,
                                    margin: 0,
                                    maxWidth: 540,
                                }}
                            >
                                Tái định hình sự nghiệp của bạn trong thời đại AI
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: 'rgba(255, 255, 255, 0.72)',
                                    fontSize: 14,
                                    lineHeight: 1.7,
                                    margin: '18px 0 0',
                                    maxWidth: 600,
                                }}
                            >
                                Chuẩn bị kỹ năng cho tương lai với Gói Cá nhân. Truy cập nhiều nội dung mới từ các chuyên gia trong ngành.
                            </Typography.Paragraph>

                            <div className={styles["career-ai-benefits"]} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '28px 44px', marginTop: 42 }}>
                                {aiCareerBenefits.map((item) => (
                                    <div key={item.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <span
                                            style={{
                                                width: 30,
                                                height: 30,
                                                flex: '0 0 30px',
                                                borderRadius: '50%',
                                                display: 'grid',
                                                placeItems: 'center',
                                                background: item.color,
                                                color: '#202230',
                                                fontSize: 17,
                                                marginTop: 2,
                                            }}
                                        >
                                            {item.icon}
                                        </span>
                                        <Typography.Text style={{ color: '#fff', fontSize: 14, lineHeight: 1.45, fontWeight: 500 }}>
                                            {item.title}
                                        </Typography.Text>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles["career-ai-banner-visual"]} style={{ minWidth: 0 }}>
                            <img
                                src="/bento-banner.png"
                                alt="Học kỹ năng AI với nội dung bento trực quan"
                                style={{ width: '90%', display: 'block', objectFit: 'contain', margin: '0 auto' }}
                            />
                        </div>
                    </div>
                </section>

                {/* Highlight Courses Section */}
                <CourseSection
                    title='Khoá học nổi bật'
                    courses={highlightCourses}
                    isLoading={isLoadingHighlightCourses}
                />

                {/* Recent Courses Section */}
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
                                <div style={{ cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center', border: '1px solid #e7e9f0', borderRadius: 18, padding: 16, background: '#fff' }}>
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

                {/* For-You Courses Section */}
                <CourseSection
                    title='Khoá học dành cho bạn'
                    courses={highlightCourses}
                    isLoading={isLoadingHighlightCourses}
                />

                {/* Categories Section */}
                <section>
                    <div className={styles["section-heading"]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, marginBottom: 18 }}>
                        <div>
                            <Typography.Text style={{ color: 'var(--primary-color-dark)', fontWeight: 700, textTransform: 'uppercase', fontSize: 16 }}>
                                Khám phá danh mục
                            </Typography.Text>
                        </div>
                    </div>

                    <div className={styles["category-chip-cloud"]} style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                        {isLoadingRootCategories &&
                            Array.from({ length: 8 }).map((_, index) => (
                                <Skeleton.Button
                                    key={index}
                                    active
                                    size="large"
                                    shape="round"
                                    style={{ width: index % 3 === 0 ? 220 : 180, height: 54 }}
                                />
                            ))
                        }

                        {!isLoadingRootCategories && rootCategories.map((category, index) => (
                            (() => {
                                const IconComponent = getAntdIconComponent(category.icon);

                                return (
                                    <div
                                        key={category._id ?? category.slug}
                                        className={styles["category-chip"]}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            minHeight: 54,
                                            padding: '0 24px',
                                            borderRadius: 999,
                                            background: '#eef5ff',
                                            color: '#111827',
                                            border: '1px solid rgba(209, 223, 244, 0.72)',
                                            fontSize: 16,
                                            cursor: 'pointer',
                                            
                                        }}
                                    >
                                        {IconComponent && createElement(IconComponent, { style: { fontSize: 20, flex: '0 0 auto' } })}
                                        <Typography.Text>{category.name}</Typography.Text>
                                    </div>
                                )
                            })()
                        ))}
                        
                    </div>
                </section>
            </div>
        </div>
    )
}

export default HomePage;
