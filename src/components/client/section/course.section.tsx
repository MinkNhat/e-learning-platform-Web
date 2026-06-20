import { ICourse } from '@/types/backend';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Button, Empty, Pagination, Row, Select, Skeleton, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import CourseCard from '../card/course.card';

interface IProps {
    courses?: ICourse[] | null;
    isLoading?: boolean;
    showPagination?: boolean;
    title?: string;
    description?: string;
    viewAllText?: string;
    current?: number;
    pageSize?: number;
    total?: number;
    filter?: string;
    sortQuery?: string;
    onChangePage?: (pagination: { current: number, pageSize: number }) => void;
    onChangeFilter?: (filter: string) => void;
    onChangeSort?: (sortQuery: string) => void;
}

const CourseSection = (props: IProps) => {
    const {
        courses = [],
        isLoading = false,
        showPagination = false,
        title,
        description,
        viewAllText = "Xem thêm",
        current = 1,
        pageSize = showPagination ? 8 : 4,
        total = courses?.length ?? 0,
        filter = "",
        sortQuery = "sort=-updatedAt",
        onChangePage,
        onChangeFilter,
        onChangeSort,
    } = props;

    const navigate = useNavigate();

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        onChangePage?.(pagination);
    }

    const handleViewDetailCourse = (item: ICourse) => {
        navigate(`/course/${item.slug}`)
    }

    const renderCourseSkeletons = () => (
        Array.from({ length: pageSize }).map((_, index) => (
            <div
                key={`course-skeleton-${index}`}
                style={{
                    borderRadius: 18,
                    overflow: 'hidden',
                    width: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    border: '1px solid #e7e9f0',
                    background: '#fff',
                    boxShadow: '0 14px 34px rgba(20, 31, 55, 0.06)',
                    padding: 10,
                }}
            >
                <div style={{ padding: '12px 8px' }}>
                    <Skeleton
                        active
                        title={{ width: '78%' }}
                        paragraph={{ rows: 6, width: ['100%', '100%', '72%', '92%', '64%', '48%'] }}
                    />
                </div>
            </div>
        ))
    )

    return (
       <section style={{ width: '100%' }}>
            <div
                className={styles["section-heading"]}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: 20,
                    marginBottom: 12,
                }}
            >
                <div style={{ maxWidth: 680 }}>
                    <Typography.Text style={{ color: 'var(--primary-color-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0, fontSize: 16 }}>
                        {title}
                    </Typography.Text>
                    <Typography.Paragraph style={{ margin: 0, color: '#667085', fontSize: 15, maxWidth: 620 }}>
                        {description}
                    </Typography.Paragraph>
                </div>

                {!showPagination &&
                    <Link to="/course" style={{textDecoration: 'none'}}>
                        <Button type="default" shape="round" style={{display: 'flex', alignItems: 'center', gap: 4}}>
                            {viewAllText}
                        </Button>
                    </Link>
                }
            </div>

            {showPagination &&
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
                    <Space wrap>
                        <Select
                            value={filter || 'all'}
                            style={{ minWidth: 180 }}
                            suffixIcon={<FilterOutlined />}
                            options={[
                                { value: 'all', label: 'Tất cả danh mục' },
                            ]}
                            onChange={(value) => {
                                onChangeFilter?.(value === 'all' ? '' : value);
                            }}
                        />
                        <Select
                            value={sortQuery}
                            style={{ minWidth: 190 }}
                            suffixIcon={<SortAscendingOutlined />}
                            options={[
                                { value: 'sort=-updatedAt', label: 'Mới cập nhật' },
                                { value: 'sort=price', label: 'Giá tăng dần' },
                                { value: 'sort=-price', label: 'Giá giảm dần' },
                                { value: 'sort=-rating', label: 'Đánh giá cao' },
                            ]}
                            onChange={(value) => {
                                onChangeSort?.(value);
                            }}
                        />
                    </Space>
                    <Typography.Text type="secondary" style={{ alignSelf: 'center' }}>
                        {total} khóa học
                    </Typography.Text>
                </div>
            }

            <div className={styles["course-grid"]}>
                {isLoading ? renderCourseSkeletons() : courses?.map(item => <CourseCard key={item._id} course={item} onClick={() => handleViewDetailCourse(item)} />)}
            </div>

            {(!courses || courses && courses.length === 0)
                && !isLoading &&
                <div className={styles["empty"]}>
                    <Empty description="Không có dữ liệu" />
                </div>
            }

            {showPagination && <>
                <div style={{ marginTop: 30 }}></div>
                <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination
                        current={current}
                        total={total}
                        pageSize={pageSize}
                        responsive
                        disabled={isLoading}
                        onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                    />
                </Row>
            </>}
       </section>
    )
}

export default CourseSection;
