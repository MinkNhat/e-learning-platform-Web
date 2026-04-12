import { callFetchCourse } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { ICourse } from '@/types/backend';
import { DollarOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Spin, Rate } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

interface IProps {
    showPagination?: boolean;
}

const CourseCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayCourse, setDisplayCourse] = useState<ICourse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourse();
    }, [current, pageSize, filter, sortQuery]);

    const fetchCourse = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchCourse(query);
        if (res && res.data) {
            setDisplayCourse(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }



    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailCourse = (item: ICourse) => {
        const slug = convertSlug(item.title);
        navigate(`/course/${slug}?id=${item._id}`)
    }

    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className={`${styles["job-content"]}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Khóa Học Mới Nhất</span>
                                {!showPagination &&
                                    <Link to="course">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayCourse?.map(item => {
                            return (
                                <Col span={24} md={12} key={item._id}>
                                    <Card size="small" title={null} hoverable
                                        onClick={() => handleViewDetailCourse(item)}
                                    >
                                        <div className={styles["card-job-content"]}>
                                            <div className={styles["card-job-right"]}>
                                                <div className={styles["job-title"]}>{item.title}</div>
                                                <div className={styles["job-description"]}>{item.shortDescription}</div>
                                                <div><DollarOutlined style={{ color: 'green' }} />&nbsp;{(item.price + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</div>
                                                <div><TeamOutlined />&nbsp;{item.enrollmentCount} học viên</div>
                                                <div><Rate disabled allowHalf value={item.rating} />&nbsp;{item.rating}</div>
                                                <div className={styles["job-updatedAt"]}>{dayjs(item.updatedAt).fromNow()}</div>
                                            </div>
                                        </div>

                                    </Card>
                                </Col>
                            )
                        })}


                        {(!displayCourse || displayCourse && displayCourse.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
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
            </div>
        </div>
    )
}

export default CourseCard;