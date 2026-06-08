import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICourse } from "@/types/backend";
import { callFetchCourseBySlug } from "@/config/api";
import { Col, Divider, Row, Rate, Typography, Card, Space, Collapse, List, Image, Button, Spin, Empty, notification } from "antd";
import { CheckOutlined, PlayCircleOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
const { Title, Paragraph, Text } = Typography;
dayjs.extend(relativeTime)


const ClientCourseDetailPage = (props: any) => {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<ICourse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const init = async () => {
            if (slug) {
                setIsLoading(true);
                try {
                    const res = await callFetchCourseBySlug(slug);
                    const courseDetail = res?.data?.result?.[0] || null;
                    setCourse(courseDetail);
                } catch (error) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể tải thông tin khóa học'
                    });
                    setCourse(null);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        init();
    }, [slug]);

   return (
        <Spin spinning={isLoading}>
            {!isLoading && !course && (
                <Empty description="Không tìm thấy khóa học" />
            )}

            {course && (
                <>   
                    <div
                        style={{
                            background: '#1c1d1f',
                            padding: '48px 0',
                            marginBottom: 32,
                        }}
                    >
                        <div
                            style={{
                                maxWidth: 1200,
                                margin: '0 auto',
                                padding: '0 24px',
                            }}
                        >
                            <Row>
                                <Col xs={24} lg={16}>
                                    <Title
                                        level={1}
                                        style={{
                                            color: '#fff',
                                            marginBottom: 16,
                                        }}
                                    >
                                        {course.title}
                                    </Title>

                                    <Paragraph
                                        style={{
                                            color: '#fff',
                                            fontSize: 18,
                                        }}
                                    >
                                        {course.shortDescription}
                                    </Paragraph>

                                    <Space wrap size="large">
                                        <Space>
                                            <Rate
                                                disabled
                                                allowHalf
                                                value={course.rating}
                                            />
                                            <Text style={{ color: '#fff' }}>
                                                {course.rating}
                                            </Text>
                                        </Space>

                                        <Space>
                                            <TeamOutlined
                                                style={{ color: '#fff' }}
                                            />
                                            <Text style={{ color: '#fff' }}>
                                                {course.enrollmentCount || 0} học viên
                                            </Text>
                                        </Space>

                                        <Text style={{ color: '#fff' }}>
                                            {course.level}
                                        </Text>
                                    </Space>

                                    <div
                                        style={{
                                            marginTop: 16,
                                            color: '#fff',
                                        }}
                                    >
                                        Giảng viên:{' '}
                                        <strong>
                                            {course.authors?.join(', ')}
                                        </strong>
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 8,
                                            color: '#fff',
                                        }}
                                    >
                                        Cập nhật lần cuối:{' '}
                                        {dayjs(course.updatedAt).format(
                                            'DD/MM/YYYY'
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div
                        style={{
                            maxWidth: 1200,
                            margin: '0 auto',
                            padding: '0 24px',
                        }}
                    >
                        <Row gutter={[32, 32]}>
                            {/* LEFT */}
                            <Col xs={24} lg={16}>
                                {/* Objectives */}
                                <Card
                                    title="Bạn sẽ học được gì"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Row gutter={[16, 16]}>
                                        {course.objectives?.map((item, index) => (
                                            <Col
                                                xs={24}
                                                md={12}
                                                key={index}
                                            >
                                                <Space align="start">
                                                    <CheckOutlined />
                                                    <span>{item}</span>
                                                </Space>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card>

                                {/* Description */}
                                <Card
                                    title="Mô tả khóa học"
                                    style={{ marginBottom: 24 }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: course.description,
                                        }}
                                    />
                                </Card>

                                {/* Requirement */}
                                <Card
                                    title="Yêu cầu"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Paragraph>
                                        {course.requirement}
                                    </Paragraph>
                                </Card>

                                {/* Curriculum */}
                                <Card
                                    title="Nội dung khóa học"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Collapse
                                        items={
                                            course.modules?.map((module) => ({
                                                key: module._id || module.name,
                                                label: module.name,
                                                children: (
                                                    <List
                                                        dataSource={
                                                            module.lessons || []
                                                        }
                                                        renderItem={(lesson) => (
                                                            <List.Item>
                                                                <Space>
                                                                    <PlayCircleOutlined />
                                                                    {lesson.name}
                                                                </Space>
                                                            </List.Item>
                                                        )}
                                                    />
                                                ),
                                            })) || []
                                        }
                                    />
                                </Card>
                            </Col>

                            {/* RIGHT */}
                            <Col xs={24} lg={8}>
                                <Card
                                    style={{
                                        position: 'sticky',
                                        top: 24,
                                    }}
                                >
                                    <Image
                                        preview={false}
                                        src={`${BASE_URL}/images/thumbnails/${course.thumbnail}`}
                                        width="100%"
                                    />

                                    <Divider />

                                    <Title
                                        level={2}
                                        style={{
                                            marginBottom: 24,
                                        }}
                                    >
                                        {course.price?.toLocaleString('vi-VN')} đ
                                    </Title>

                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                    >
                                        Đăng ký ngay
                                    </Button>

                                    <Button
                                        size="large"
                                        block
                                        style={{
                                            marginTop: 12,
                                        }}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </Spin>
    );
}
export default ClientCourseDetailPage;
