import { callFetchCategoryById, callFetchChildCategory } from '@/config/api';
import { getAntdIconComponent } from '@/config/utils';
import type { ICategory } from '@/types/backend';
import {
    ReadOutlined,
    StarFilled,
    TeamOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Empty, Row, Skeleton, Space, Tabs, Tag, Typography } from 'antd';
import { createElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clientStyles from 'styles/client.module.scss';
import styles from 'styles/explore.module.scss';
import CourseGrid from './course-grid';
import { buildInstructors, emptyCourseListState, fetchCoursesByCategoryIds } from './explore.helpers';
import type { CourseListState } from './types';

type ExploreCategoryDetailPageProps = {
    slug: string;
};

const ExploreCategoryDetailPage = ({ slug }: ExploreCategoryDetailPageProps) => {
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [topicRootCategory, setTopicRootCategory] = useState<ICategory | null>(null);
    const [relatedTopics, setRelatedTopics] = useState<ICategory[]>([]);
    const [courses, setCourses] = useState<CourseListState>(emptyCourseListState);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

    useEffect(() => {
        const fetchCategoryDetail = async () => {
            setIsLoadingDetail(true);
            try {
                const categoryRes = await callFetchCategoryById(slug);
                const category = categoryRes?.data;

                if (!category) {
                    setSelectedCategory(null);
                    setTopicRootCategory(null);
                    setRelatedTopics([]);
                    setCourses(emptyCourseListState);
                    return;
                }

                setSelectedCategory(category);

                let rootCategory = category;
                const parent = category.parent;

                if (parent) {
                    if (typeof parent === 'string') {
                        const parentRes = await callFetchCategoryById(parent);
                        rootCategory = parentRes?.data ?? category;
                    } else {
                        rootCategory = parent;
                    }
                }

                setTopicRootCategory(rootCategory);

                const childRef = rootCategory.slug || rootCategory._id || category.slug;
                const childrenRes = childRef ? await callFetchChildCategory(childRef) : null;
                const children = childrenRes?.data ?? [];
                const shouldIncludeChildren = !category.parent;
                const courseCategoryIds = [
                    category._id,
                    ...(shouldIncludeChildren ? children.map((child) => child._id) : []),
                ].filter(Boolean) as string[];
                const [latestData, popularData] = await Promise.all([
                    fetchCoursesByCategoryIds(courseCategoryIds, 'sort=-updatedAt'),
                    fetchCoursesByCategoryIds(courseCategoryIds, 'sort=-enrollmentCount'),
                ]);

                setRelatedTopics(children);
                setCourses({
                    latest: latestData.result,
                    popular: popularData.result,
                    totalLatest: latestData.total,
                    totalPopular: popularData.total,
                });
            } finally {
                setIsLoadingDetail(false);
            }
        };

        fetchCategoryDetail();
    }, [slug]);

    const instructors = useMemo(
        () => buildInstructors([...courses.popular, ...courses.latest]),
        [courses.latest, courses.popular],
    );

    return (
        <main className={`${clientStyles["container"]} ${styles["explore-page"]}`}>
            <section>
                <Typography.Text className={styles["section-title"]}>
                    Các khoá học {selectedCategory?.name}
                </Typography.Text>

                <Tabs
                    className={styles["course-tabs"]}
                    defaultActiveKey="latest"
                    items={[
                        {
                            key: 'latest',
                            label: `Mới cập nhật`,
                            children: (
                                <CourseGrid
                                    courses={courses.latest}
                                    isLoading={isLoadingDetail}
                                    emptyDescription="Chưa có khóa học trong danh mục này"
                                />
                            ),
                        },
                        {
                            key: 'popular',
                            label: `Phổ biến nhất`,
                            children: (
                                <CourseGrid
                                    courses={courses.popular}
                                    isLoading={isLoadingDetail}
                                    emptyDescription="Chưa có khóa học trong danh mục này"
                                />
                            ),
                        },
                    ]}
                />
            </section>

            <section className={styles["category-section"]}>
                <Typography.Text className={styles["section-title"]}>Các chủ đề liên quan</Typography.Text>

                {isLoadingDetail ? (
                    <div className={styles["topic-grid"]}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Skeleton.Button key={index} active block className={styles["topic-skeleton"]} />
                        ))}
                    </div>
                ) : relatedTopics.length > 0 ? (
                    <div className={styles["topic-grid"]}>
                        {relatedTopics.map((topic) => {
                            const TopicIcon = getAntdIconComponent(topic.icon);
                            return (
                                <Link
                                    key={topic._id ?? topic.slug}
                                    to={`/explore/${topic.slug}`}
                                    className={styles["topic-card"]}
                                >
                                    <span>{TopicIcon ? createElement(TopicIcon) : <ReadOutlined />}</span>
                                    <strong>{topic.name}</strong>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles["empty-block"]}>
                        <Empty description="Chưa có chủ đề liên quan" />
                    </div>
                )}
            </section>

            <section className={styles["category-section"]}>
                <Typography.Text className={styles["section-title"]}>Giảng viên hàng đầu</Typography.Text>

                <Row gutter={[18, 18]}>
                    {instructors.map((instructor) => (
                        <Col xs={24} md={12} lg={6} key={instructor.id}>
                            <Card className={styles["instructor-card"]}>
                                <div className={styles["instructor-top"]}>
                                    <Avatar
                                        size={62}
                                        src={instructor.avatar ? `${BASE_URL}/upload/avatars/${instructor.avatar}` : undefined}
                                        icon={!instructor.avatar ? <TeamOutlined /> : undefined}
                                    >
                                        {instructor.name.slice(0, 2).toUpperCase()}
                                    </Avatar>
                                    <div>
                                        <Typography.Title level={4}>{instructor.name}</Typography.Title>
                                        <Typography.Text>{instructor.title}</Typography.Text>
                                    </div>
                                </div>
                                <Space size={[8, 8]} wrap className={styles["instructor-meta"]}>
                                    <Tag bordered={false} color="green">
                                        {instructor.rating.toFixed(1)} <StarFilled />
                                    </Tag>
                                    <Tag bordered={false}>{instructor.learners}</Tag>
                                    <Tag bordered={false}>{instructor.courses}</Tag>
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            {!selectedCategory && !isLoadingDetail && (
                <div className={styles["empty-block"]}>
                    <Empty description="Không tìm thấy danh mục" />
                </div>
            )}
        </main>
    );
};

export default ExploreCategoryDetailPage;
