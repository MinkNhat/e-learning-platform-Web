import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICourse } from "@/types/backend";
import { callFetchCourseById } from "@/config/api";
import { Card, Descriptions, Spin, Tag, notification } from "antd";
import dayjs from 'dayjs';
import ModuleManager from './module';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const AdminCourseDetail = () => {
    const { id: courseId } = useParams<{ id: string }>();
    const [courseDetail, setCourseDetail] = useState<ICourse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            if (courseId) {
                setIsLoading(true);
                try {
                    const res = await callFetchCourseById(courseId);
                    if (res?.data) {
                        setCourseDetail(res.data);
                    }
                } catch (error) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể tải thông tin khóa học'
                    });
                }
                setIsLoading(false);
            }
        };
        
        init();
    }, [courseId]);

    const refetchCourse = async () => {
        if (courseId) {
            try {
                const res = await callFetchCourseById(courseId);
                if (res?.data) {
                    setCourseDetail(res.data);
                }
            } catch (error) {
                console.error('Error refetching course', error);
            }
        }
    };

    return (
        <Spin spinning={isLoading}>
            {courseDetail && (
                <>
                    <Card style={{ marginBottom: '16px' }}>
                        <Title level={4}>{courseDetail.title}</Title>
                        <Text style={{marginBottom: '8px', marginTop: '-8px', display: 'block'}}>
                            {courseDetail.description}
                        </Text>

                        <Descriptions bordered column={2} size="middle">
                            <Descriptions.Item label="Price">{courseDetail.price?.toLocaleString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Slug">{courseDetail.slug}</Descriptions.Item>
                            <Descriptions.Item label="Level">{courseDetail.level}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={courseDetail.isPublished ? "lime" : "red"}>
                                    {courseDetail.isPublished ? "PUBLISHED" : "DRAFT"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Languages">{courseDetail.languages?.join(', ')}</Descriptions.Item>
                            <Descriptions.Item label="Authors">{courseDetail.authors?.join(', ')}</Descriptions.Item>
                            <Descriptions.Item label="Created At">
                                {dayjs(courseDetail.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Updated At">
                                {dayjs(courseDetail.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card title="Lessons" headStyle={{ borderBottom: 'none' }} bodyStyle={{ paddingTop: 0 }}>
                        {courseId && (
                            <ModuleManager
                                courseId={courseId}
                                modules={courseDetail?.modules}
                                onRefetch={refetchCourse}
                            />
                        )}
                    </Card>
                </>
            )}
        </Spin>
    );
};

export default AdminCourseDetail;
