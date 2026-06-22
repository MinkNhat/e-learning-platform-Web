import { callFetchChildCategory, callFetchCourse, callFetchRootCategory } from '@/config/api';
import type { ICategory, ICourse } from '@/types/backend';
import { Button, Card, Progress, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clientStyles from 'styles/client.module.scss';
import styles from 'styles/explore.module.scss';
import CourseGrid from './course-grid';
import { pathCards, roleCards } from './explore.data';
import { fetchCoursesByCategoryIds } from './explore.helpers';
import ExploreCategoryDetailPage from './category-detail';
import CategorySection from '@/components/client/section/category.section';

const ExploreOverviewPage = () => {
    const [rootCategories, setRootCategories] = useState<ICategory[]>([]);
    const [popularCategorySlug, setPopularCategorySlug] = useState('all');
    const [overviewPopularCourses, setOverviewPopularCourses] = useState<ICourse[]>([]);
    const [isLoadingPopular, setIsLoadingPopular] = useState(false);

    useEffect(() => {
        const fetchRootCategories = async () => {
            try {
                const res = await callFetchRootCategory('current=1&pageSize=30&sort=createdAt');
                setRootCategories(res?.data ?? []);
            } catch {
                setRootCategories([]);
            }
        };

        fetchRootCategories();
    }, []);

    useEffect(() => {
        const fetchOverviewPopular = async () => {
            setIsLoadingPopular(true);
            try {
                if (popularCategorySlug === 'all') {
                    const res = await callFetchCourse('current=1&pageSize=4&sort=-enrollmentCount');
                    const data = res?.data;

                    setOverviewPopularCourses(data?.result ?? []);
                    return;
                }

                const selectedRoot = rootCategories.find((category) => category.slug === popularCategorySlug);
                if (!selectedRoot?._id) {
                    setOverviewPopularCourses([]);
                    return;
                }

                const childrenRes = await callFetchChildCategory(selectedRoot.slug || selectedRoot._id);
                const children = childrenRes?.data ?? [];
                const data = await fetchCoursesByCategoryIds(
                    [selectedRoot._id, ...children.map((child) => child._id)].filter(Boolean) as string[],
                    'sort=-enrollmentCount',
                );

                setOverviewPopularCourses(data.result);
            } finally {
                setIsLoadingPopular(false);
            }
        };

        fetchOverviewPopular();
    }, [popularCategorySlug, rootCategories]);

    return (
        <main className={`${clientStyles["container"]} ${styles["explore-page"]}`}>
            <CategorySection title='Khám phá danh mục học tập' />

            <section style={{marginTop: 38}}>
                <div>
                    <Typography.Text style={{ color: 'var(--primary-color-dark)', fontWeight: 700, textTransform: 'uppercase', fontSize: 16 }}>
                        Phổ biến nhất
                    </Typography.Text>
                    <Typography.Paragraph>
                        Khám phá những khóa học được nhiều người học lựa chọn nhất trong từng danh mục
                    </Typography.Paragraph>
                </div>

                <div className={styles["popular-filter-row"]}>
                    <button
                        type="button"
                        className={`${styles["filter-pill"]} ${popularCategorySlug === 'all' ? styles["active"] : ''}`}
                        onClick={() => setPopularCategorySlug('all')}
                    >
                        Tất cả
                    </button>
                    {rootCategories.slice(0, 8).map((category) => (
                        <button
                            key={category._id ?? category.slug}
                            type="button"
                            className={`${styles["filter-pill"]} ${popularCategorySlug === category.slug ? styles["active"] : ''}`}
                            onClick={() => setPopularCategorySlug(category.slug)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <CourseGrid
                    courses={overviewPopularCourses}
                    isLoading={isLoadingPopular}
                    emptyDescription="Chưa có khóa học phổ biến"
                />
            </section>

            <section style={{marginTop: 38}} className={styles["role-explorer"]}>
                <div className={styles["role-intro"]}>
                    <Typography.Title level={3}>Khám phá vai trò</Typography.Title>
                    <Typography.Paragraph>
                        Phát triển sự nghiệp và học hỏi kỹ năng thông qua các vai trò phổ biến trong các lĩnh vực.
                    </Typography.Paragraph>
                    <Button shape="round" type="primary">
                        Xem tất cả
                    </Button>
                </div>

                <div style={{ minWidth: 0 }}>
                    <div className={styles["role-filter-row"]}>
                        <Button type="primary" shape="round">Phổ biến</Button>
                        <Button shape="round">Kỹ thuật phần mềm & CNTT</Button>
                        <Button shape="round">Kinh doanh</Button>
                        <Button shape="round">Khoa học dữ liệu</Button>
                    </div>

                    <div className={styles["role-card-grid"]}>
                        {roleCards.map((role) => (
                            <Card key={role.id} className={styles["role-card"]}>
                                <div>
                                    <Typography.Title level={4}>{role.title}</Typography.Title>
                                    <Typography.Paragraph>{role.description}</Typography.Paragraph>
                                </div>
                                <img className={styles["role-image"]} src={role.img} alt={role.title} />
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{marginTop: 38}} className={styles["path-explorer"]}>
                <div style={{ minWidth: 0 }}>
                    <div className={styles["path-card-grid"]}>
                        {pathCards.map((path) => (
                            <Card key={path.id} className={styles["path-overview-card"]}>
                                <div className={styles["path-card-layout"]}>
                                    <div className={styles["path-image-wrap"]}>
                                        <img src={path.image} alt={path.title} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <Typography.Title level={4}>{path.title}</Typography.Title>
                                        <Typography.Paragraph>{path.description}</Typography.Paragraph>
                                        <div className={styles["path-skill-list"]}>
                                            {path.skills.map((skill) => (
                                                <Progress
                                                    key={skill.label}
                                                    type="circle"
                                                    percent={skill.progress}
                                                    size={42}
                                                    strokeWidth={8}
                                                    strokeColor="#00c26f"
                                                    trailColor="#dedfe3"
                                                    className={styles["path-skill-progress"]}
                                                    format={() => (
                                                        <span role="img" title={skill.label} aria-label={skill.label}>
                                                            {skill.icon}
                                                        </span>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className={styles["path-intro"]}>
                    <div className={styles["path-filter-row"]}>
                        <Button type="primary" shape="round">Phổ biến</Button>
                        <Button shape="round">Front-end</Button>
                        <Button shape="round">Back-end</Button>
                        <Button shape="round">Fullstack</Button>
                        <Button shape="round">DevOps</Button>
                    </div>

                    <div>
                        <Typography.Title level={3}>Khám phá lộ trình</Typography.Title>
                        <Typography.Paragraph>
                            Theo dõi các lộ trình học tập được thiết kế chuyên nghiệp để phát triển kỹ năng nghề nghiệp của bạn.
                        </Typography.Paragraph>
                        <Button shape="round" type="primary">
                            Xem tất cả
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
};

const ExplorePage = () => {
    const { slug } = useParams<{ slug?: string }>();

    if (slug) {
        return <ExploreCategoryDetailPage slug={slug} />;
    }

    return <ExploreOverviewPage />;
};

export default ExplorePage;
