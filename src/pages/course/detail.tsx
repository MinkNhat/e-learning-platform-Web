import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICourse } from "@/types/backend";
import { Col, Divider, Row, Rate, Typography, Card, Space, Collapse, List, Image, Button, Spin, Empty, notification, Tag, Statistic } from "antd";
import { CalendarOutlined, CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, DesktopOutlined, FileTextOutlined, MobileOutlined, PlayCircleOutlined, SafetyCertificateOutlined, TeamOutlined, TrophyOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { callFetchCourseById } from "@/config/api";
import ClientBreadcrumb from "@/components/client/breadcrumb.client";
const { Title, Paragraph, Text } = Typography;
dayjs.extend(relativeTime)


const ClientCourseDetailPage = (props: any) => {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<ICourse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

    const formatAuthorsToMentions = (authors?: ICourse["authors"]) => {
        return authors?.map(author => `${author.name}`).join(", ") ?? "";
    }

    useEffect(() => {
        const init = async () => {
            if (slug) {
                setIsLoading(true);
                try {
                    const res = await callFetchCourseById(slug);
                    if (res.data) {
                        setCourse(res.data);
                    }
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
                    <div style={{ background: '#1c1d1f', paddingTop: 24, position: 'relative' }}>
                        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                            <Row>
                                <Col xs={24} lg={16}>
                                    <ClientBreadcrumb
                                        variant="light"
                                        style={{ marginBottom: 24 }}
                                        items={[
                                            { title: 'Trang chủ', path: '/' },
                                            { title: 'Khóa học', path: '/course' },
                                            { title: course.title },
                                        ]}
                                    />
                                    <Tag color="purple" style={{ marginBottom: 12 }}>{course.level}</Tag>
                                    <Title level={1} style={{ color: '#fff', marginBottom: 12 }}>
                                        {course.title}
                                    </Title>
                                    <Paragraph style={{color: '#9ca3af', fontSize: 16, marginBottom: 16,}}>
                                        {course.shortDescription}
                                    </Paragraph>

                                    <div style={{ color: '#9ca3af', fontSize: 14, marginBottom: 6 }}>
                                        <UserOutlined style={{ marginRight: 4 }}/>
                                        Giảng viên:{' '}
                                        <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                                            {formatAuthorsToMentions(course.authors)}
                                        </span>
                                    </div>

                                    <div style={{ color: '#9ca3af', fontSize: 14 }}>
                                        <CalendarOutlined style={{ marginRight: 4 }} />
                                        Cập nhật lần cuối:{' '}
                                        {dayjs(course.updatedAt).format('MM/YYYY')}
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 0',position: 'relative', zIndex: 1}}>
                            <div
	                                style={{
	                                    backgroundColor: 'white',
		                                maxWidth: 680,
	                                    margin: '0 24px',
	                                    border: '1px solid #ccc',
	                                    borderRadius: 12,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    zIndex: 1,
                                }}
                            >
                                <Row align="middle" wrap={false}>
                                    <Col flex="0 0 124px">
                                        <div
                                            style={{
                                                minHeight: 80,
                                                background: '#5624d0',
                                                color: '#fff',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 12,
                                                fontSize: 16,
                                                fontWeight: 600,
                                            }}
                                        >
                                            <SafetyCertificateOutlined style={{ fontSize: 20 }} />
                                            Cao cấp
                                        </div>
                                    </Col>

                                    <Col flex="0 0 240px">
                                        <div style={{ padding: '0 16px', fontSize: 13, lineHeight: 1.45, color: 'var(--text-primary)' }}>
                                            Truy cập các khóa học xếp hạng đầu với gói cấp cao.
                                        </div>
                                    </Col>

	                                    <Col flex="none" style={{ padding: '0 12px' }}>
	                                        <Divider type="vertical" style={{ height: 72, margin: 0, borderColor: '#d1d5db' }} />
	                                    </Col>

                                    <Col flex="0 0 120px">
                                        <Statistic
                                            title={
                                                <Space size={2}>
                                                    <Rate disabled allowHalf value={course.rating} style={{ fontSize: 14 }}/>
                                                </Space>
                                            }
                                            value={course.rating}
                                            precision={1}
                                            valueStyle={{ color: '#f4a307', fontSize: 22, fontWeight: 700, textAlign: 'center' }}
                                        />
                                        <span style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', display: 'block' }}>
                                            ({course.enrollmentCount || 0} Đánh giá)
                                        </span>
                                    </Col>
                                    
                                    <Col flex="none" style={{ padding: '0 12px' }}>
                                        <Divider type="vertical" style={{ height: 72, margin: 0, borderColor: '#d1d5db' }} />
                                    </Col>

                                    <Col flex="0 0 120px">
                                        <Statistic
                                            title={<div style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center' }}><UsergroupAddOutlined /></div>}
                                            value={course.enrollmentCount || 0}
                                            valueStyle={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 700, textAlign: 'center' }}
                                        />
                                        <span style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', display: 'block' }}>
                                            Học viên
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        <div style={{background: '#f7f9fa', height: 56, position: 'absolute', width: '100%', bottom: 0, left: 0, zIndex: 0 }}/>
                    </div>

                    <div style={{ background: '#f7f9fa', paddingBottom: 64 }}>
                        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }} >
                            <Row gutter={[32, 32]}>
                                <Col xs={24} lg={16}>
                                    <Card
                                        title="Bạn sẽ học được gì"
                                        style={{ marginBottom: 20, marginTop: 24, borderRadius: 16 }}
                                    >
                                        <Row gutter={[12, 12]}>
                                            {course.objectives?.map((item, index) => (
                                                <Col xs={24} md={12} key={index}>
                                                    <Space align="start">
                                                        <CheckCircleOutlined
                                                            style={{ color: 'var(--primary-color)', marginTop: 3 }}
                                                        />
                                                        <span style={{ fontSize: 13 }}>{item}</span>
                                                    </Space>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Card>

                                    <Card
                                        title="Mô tả khóa học"
                                        style={{ marginBottom: 20, borderRadius: 16 }}
                                    >
                                        <div
                                            style={{ fontSize: 14, lineHeight: 1.7 }}
                                            dangerouslySetInnerHTML={{ __html: course.description }}
                                        />
                                    </Card>

                                    <Card
                                        title="Yêu cầu"
                                        style={{ marginBottom: 20, borderRadius: 16 }}
                                    >
                                        <Paragraph style={{ fontSize: 14, marginBottom: 0 }}>
                                            {course.requirement}
                                        </Paragraph>
                                    </Card>

                                    <Card
                                        title="Nội dung khóa học"
                                        style={{ marginBottom: 20, borderRadius: 16 }}
                                        extra={
                                            <Text type="secondary" style={{ fontSize: 13 }}>
                                                {course.modules?.length || 0} chương •{' '}
                                                {course.modules?.reduce(
                                                    (acc, m) => acc + (m.lessons?.length || 0),
                                                    0
                                                )}{' '}
                                                bài giảng
                                            </Text>
                                        }
                                    >
                                        <Collapse
                                            items={
                                                course.modules?.map((module) => ({
                                                    key: module._id || module.name,
                                                    label: (
                                                        <Space>
                                                            <Text strong>{module.name}</Text>
                                                        </Space>
                                                    ),
                                                    children: (
                                                        <List
                                                            size="small"
                                                            dataSource={module.lessons || []}
                                                            renderItem={(lesson) => (
                                                                <List.Item style={{ padding: '8px 0' }}>
                                                                    <Space>
                                                                        <PlayCircleOutlined
                                                                            style={{ color: 'var(--primary-color)', fontSize: 13 }}
                                                                        />
                                                                        <Text style={{ fontSize: 13 }}>
                                                                            {lesson.name}
                                                                        </Text>
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

                                <Col xs={24} lg={8}>
                                    <div style={{ position: 'sticky', top: 16, marginTop: -190, zIndex: 10, }} >
                                        <Card
                                            bodyStyle={{ padding: 0 }}
                                            style={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0'}} >
                                            <Image
                                                preview={false}
                                                src={`${BASE_URL}/upload/thumbnails/${course.thumbnail}`}
                                                width="100%"
                                                style={{ display: 'block' }}
                                            />

                                            <div style={{ padding: 20 }}>
                                                <Space align="baseline" style={{ marginBottom: 16 }}>
                                                    <Title level={2} style={{ marginBottom: 0 }}>
                                                        {course.price?.toLocaleString('vi-VN')} đ
                                                    </Title>
                                                    {course.price && (
                                                        <Text delete type="secondary" style={{ fontSize: 14 }}>
                                                            {course.price.toLocaleString('vi-VN')} đ
                                                        </Text>
                                                    )}
                                                </Space>

                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    block
                                                    style={{
                                                        background: 'var(--primary-color)',
                                                        fontWeight: 600,
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    Đăng ký ngay
                                                </Button>

                                                <Button size="large" block style={{ fontWeight: 600 }}>
                                                    Thêm vào giỏ hàng
                                                </Button>

                                                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 10, marginTop: 20 }}>
                                                    Khóa học bao gồm:
                                                </Text>
                                                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                                                    <Space>
                                                        <DesktopOutlined style={{ fontSize: 13, color: '#374151' }} />
                                                        <Text style={{ fontSize: 12 }}>
                                                            {course.totalLength
                                                                ? `${course.totalLength} giờ video theo yêu cầu`
                                                                : 'Video theo yêu cầu'}
                                                        </Text>
                                                    </Space>
                                                    <Space>
                                                        <FileTextOutlined style={{ fontSize: 13, color: '#374151' }} />
                                                        <Text style={{ fontSize: 12 }}>Tài nguyên có thể tải về</Text>
                                                    </Space>
                                                    <Space>
                                                        <MobileOutlined style={{ fontSize: 13, color: '#374151' }} />
                                                        <Text style={{ fontSize: 12 }}>Truy cập trên mobile & desktop</Text>
                                                    </Space>
                                                    <Space>
                                                        <TrophyOutlined style={{ fontSize: 13, color: '#374151' }} />
                                                        <Text style={{ fontSize: 12 }}>Chứng chỉ hoàn thành</Text>
                                                    </Space>
                                                </Space>
                                            </div>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </>
            )}
        </Spin>
    );
}
export default ClientCourseDetailPage;
