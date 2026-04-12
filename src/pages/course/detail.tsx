import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICourse } from "@/types/backend";
import { callFetchCourseById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag, Rate } from "antd";
import { DollarOutlined, HistoryOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)


const ClientCourseDetailPage = (props: any) => {
    const [courseDetail, setCourseDetail] = useState<ICourse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // course id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCourseById(id);
                if (res?.data) {
                    setCourseDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {courseDetail && courseDetail._id &&
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {courseDetail.title}
                                </div>
                                <Divider />
                                <div className={styles["price"]}>
                                    <DollarOutlined />
                                    <span>&nbsp;{(courseDetail.price + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                </div>
                                <div className={styles["rating"]}>
                                    <Rate disabled allowHalf value={courseDetail.rating} />
                                    <span style={{ marginLeft: '8px' }}>{courseDetail.rating}</span>
                                </div>
                                <div className={styles["enrollment"]}>
                                    <TeamOutlined />
                                    <span>&nbsp;{courseDetail.enrollmentCount} học viên</span>
                                </div>
                                <div className={styles["languages"]}>
                                    {courseDetail?.languages?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="blue" >
                                                {item}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div className={styles["authors"]}>
                                    <strong>Giảng viên: </strong>
                                    {courseDetail?.authors?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="cyan" >
                                                {item}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div>
                                    <HistoryOutlined /> {dayjs(courseDetail.updatedAt).fromNow()}
                                </div>
                                <Divider />
                                <div><strong>Yêu cầu:</strong> {courseDetail.requirement}</div>
                                <Divider />
                                <div><strong>Mục tiêu:</strong></div>
                                <ul>
                                    {courseDetail?.objectives?.map((item, index) => (
                                        <li key={`${index}-obj`}>{item}</li>
                                    ))}
                                </ul>
                                <Divider />
                                {parse(courseDetail.description)}
                            </Col>
                        </>
                    }
                </Row>
            }
        </div>
    )
}
export default ClientCourseDetailPage;