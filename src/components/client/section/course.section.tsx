import { ICourse } from '@/types/backend';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Empty, Pagination, Row, Select, Space, Spin, Typography } from 'antd';
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
        pageSize = showPagination ? 8 : 6,
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
                        <ConfigProvider
                            theme={{
                                token: {
                                colorPrimary: '#00c26f',
                                },
                            }}
                            >
                            <Button type="default" shape="round" style={{display: 'flex', alignItems: 'center', gap: 4}}>
                                {viewAllText}
                            </Button>
                        </ConfigProvider>
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

            <Spin spinning={isLoading} tip="Loading...">
            <div className={styles["course-grid"]}>
                {courses?.map(item => <CourseCard key={item._id} course={item} onClick={() => handleViewDetailCourse(item)} />)}
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
                        onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                    />
                </Row>
            </>}
        </Spin>
       </section>
    )
}

export default CourseSection;
