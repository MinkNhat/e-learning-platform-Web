import { useState } from 'react';
import { ILesson } from "@/types/backend";
import { callCreateLesson, callUpdateLesson, callDeleteLesson } from "@/config/api";
import { Button, Col, Empty, Form, Input, Modal, Popconfirm, Row, Select, Space, Switch, Tag, message, notification } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import CKEditorField from '@/components/share/CKEditorField';

interface LessonManagerProps {
    moduleOrder: number;
    moduleId: string;
    lessons: ILesson[] | undefined;
    onRefetch: () => Promise<void>;
}

const LessonManager = ({ moduleOrder, moduleId, lessons, onRefetch }: LessonManagerProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lessonForm] = Form.useForm();
    const [lessonType, setLessonType] = useState<string>("video");
    const maxOrder = lessons && lessons.length > 0 ? Math.max(...lessons.map(l => l.order || 0)) : 0;

    const handleAddLesson = () => {
        setEditingLesson(null);
        lessonForm.resetFields();
        lessonForm.setFieldsValue({ order: maxOrder + 1 });
        setOpenModal(true);
    };

    const handleEditLesson = (lesson: ILesson) => {
        setEditingLesson(lesson);
        setLessonType(lesson.type);
        lessonForm.setFieldsValue({
            name: lesson.name,
            type: lesson.type,
            order: lesson.order,
            isActive: lesson.isActive,
            isFree: lesson.isFree,
            videoUrl: lesson.metadata?.videoUrl,
            content: lesson.content,
        });
        setOpenModal(true);
    };

    const handleSubmitLesson = async (values: any) => {
        if (!moduleId) return;
        setIsLoading(true);
        try {
            if (editingLesson?._id) {
                // Update
                const res = await callUpdateLesson(
                    { ...values, module: moduleId, metadata: { videoUrl: values.videoUrl } } as ILesson,
                    editingLesson._id
                );
                if (res?.data) {
                    message.success('Cập nhật bài học thành công');
                    await onRefetch();
                }
            } else {
                // Create
                const res = await callCreateLesson(
                    { ...values, module: moduleId, metadata: { videoUrl: values.videoUrl } } as ILesson
                );
                if (res?.data) {
                    message.success('Tạo bài học thành công');
                    await onRefetch();
                }
            }
            setOpenModal(false);
            lessonForm.resetFields();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra'
            });
        }
        setIsLoading(false);
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!moduleId) return;
        try {
            const res = await callDeleteLesson(lessonId);
            if (res?.statusCode === 200) {
                message.success('Xóa bài học thành công');
                await onRefetch();
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra'
            });
        }
    };

    return (
        <>
            {lessons && lessons.length > 0 ? (
                <div>
                    {lessons.map((lesson) => (
                        <div
                            key={lesson._id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 0',
                                borderBottom: lesson._id !== lessons[lessons.length - 1]._id ? '1px solid #f0f0f0' : 'none',
                            }}
                        >
                            <div>
                                <div>{moduleOrder}.{lesson.order || 0}. {lesson.name}</div>
                            </div>
                            <Space onClick={(e) => e.stopPropagation()}>
                                <EditOutlined
                                    style={{ color: '#ffa500', cursor: 'pointer' }}
                                    onClick={() => handleEditLesson(lesson)}
                                />
                                <Popconfirm
                                    title="Xác nhận xóa bài học"
                                    description="Bạn có chắc chắn muốn xóa bài học này?"
                                    onConfirm={() => handleDeleteLesson(lesson._id!)}
                                    okText="Xác nhận"
                                    cancelText="Hủy"
                                >
                                    <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
                                </Popconfirm>
                            </Space>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty description="Chưa có bài học nào" style={{ margin: '20px 0' }} />
            )}

            <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={handleAddLesson}
                style={{ marginBottom: '16px' }}
            >
                Thêm bài học
            </Button>

            {/* Modal */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={() => lessonForm.submit()}
                confirmLoading={isLoading}
            >
                <Form
                    form={lessonForm}
                    layout="vertical"
                    onFinish={handleSubmitLesson}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Lesson name is required' }]}
                    >
                        <Input placeholder="Enter lesson name" />
                    </Form.Item>
                    
                    <Row gutter={24}>
                        <Col span={16}>
                            <Form.Item
                                label="Type"
                                name="type"
                                rules={[{ required: true, message: 'Please select a type' }]}
                                initialValue="video"
                            >
                                <Select onChange={(val) => setLessonType(val)}>
                                    <Select.Option value="video">Video</Select.Option>
                                    <Select.Option value="article">Article</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Active"
                                name="isActive"
                                initialValue={true}
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="Free"
                                name="isFree"
                                initialValue={false}
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    {lessonType === "video" && (
                        <Form.Item
                            label="Video URL"
                            name="videoUrl"
                            rules={[
                                { required: true, message: 'Please enter video URL' },
                                { type: 'url', message: 'Please enter a valid URL' }
                            ]}
                        >
                            <Input placeholder="Enter video URL" />
                        </Form.Item>
                    )}

                    <Form.Item label="Content" name="content">
                        <CKEditorField placeholder="Enter content..." />
                    </Form.Item>

                    <Form.Item
                        label="Order"
                        name="order"
                        rules={[{ required: true, message: 'Please enter the order' }]}
                        initialValue={maxOrder + 1}
                    >
                        <Input type="number" placeholder="Enter order"/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default LessonManager;
