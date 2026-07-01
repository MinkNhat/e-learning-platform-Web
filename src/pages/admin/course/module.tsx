import { useEffect, useState } from 'react';
import { IModule, ICourseItem } from "@/types/backend";
import { callCreateModule, callUpdateModule, callDeleteModule } from "@/config/api";
import { Button, Collapse, Empty, Form, Input, Modal, Popconfirm, Space, Switch, message, notification } from "antd";
import { Add01Icon, Delete02Icon, PencilEdit02Icon } from "@/config/hugeicons";
import LessonManager from './lesson';
import styles from '@/styles/admin.module.scss';

interface ModuleManagerProps {
    courseId: string;
    modules: IModule[] | undefined;
    onRefetch: () => Promise<void>;
}

const ModuleManager = ({ courseId, modules, onRefetch }: ModuleManagerProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingModule, setEditingModule] = useState<IModule | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [moduleForm] = Form.useForm();
    const maxOrder = modules && modules.length > 0 ? Math.max(...modules.map(m => m.order || 0)) : 0;

    const handleAddModule = () => {
        setEditingModule(null);
        moduleForm.resetFields();
        moduleForm.setFieldsValue({ order: maxOrder + 1 });
        setOpenModal(true);
    };

    const handleEditModule = (module: IModule) => {
        setEditingModule(module);
        moduleForm.setFieldsValue({
            name: module.name,
            description: module.description,
            order: module.order,
            isActive: module.isActive,
        });
        setOpenModal(true);
    };

    const handleSubmitModule = async (values: any) => {
        if (!courseId) return;
        setIsLoading(true);
        try {
            if (editingModule?._id) {
                const res = await callUpdateModule(
                    values as IModule,
                    editingModule._id
                );
                if (res?.data) {
                    message.success('Cập nhật module thành công');
                    await onRefetch();
                }
            } else {
                // Create
                const res = await callCreateModule(
                    { ...values, course: courseId } as IModule
                );
                if (res?.data) {
                    message.success('Tạo module thành công');
                    await onRefetch();
                }
            }
            setOpenModal(false);
            moduleForm.resetFields();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra'
            });
        }
        setIsLoading(false);
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!courseId) return;
        try {
            const res = await callDeleteModule(moduleId);
            if (res?.statusCode === 200) {
                message.success('Xóa module thành công');
                await onRefetch();
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra'
            });
        }
    };

    const getModuleItems = () => {
        return modules?.map((module) => ({
            key: module._id,
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>
                        <strong>{module.order || 0}. {module.name}</strong> 
                    </span>
                    <Space onClick={(e) => e.stopPropagation()}>
                        <PencilEdit02Icon
                            style={{ color: '#ffa500', cursor: 'pointer' }}
                            onClick={() => handleEditModule(module)}
                        />
                        <Popconfirm
                            title="Xác nhận xóa module"
                            description="Bạn có chắc chắn muốn xóa module này?"
                            onConfirm={() => handleDeleteModule(module._id!)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Delete02Icon style={{ color: '#ff4d4f', cursor: 'pointer' }} />
                        </Popconfirm>
                    </Space>
                </div>
            ),
            children: (
                <LessonManager
                    moduleOrder={module.order}
                    moduleId={module._id!}
                    items={(module.items || []) as ICourseItem[]}
                    onRefetch={onRefetch}
                />
            ),
        })) || [];
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<Add01Icon />}
                    onClick={handleAddModule}
                    style={{ position: 'absolute', top: '12px' }}
                >
                    Thêm Module
                </Button>
            </div>

            {getModuleItems().length > 0 ? (
                <Collapse items={getModuleItems()} className={styles.collapseNoPadding} />
            ) : (
                <Empty description="Chưa có module nào" style={{ margin: '40px 0' }} />
            )}
            

            {/* Modal */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={() => moduleForm.submit()}
                confirmLoading={isLoading}
            >
                <Form
                    form={moduleForm}
                    layout="vertical"
                    onFinish={handleSubmitModule}
                >
                    <Form.Item
                        label="Title"
                        name="name"
                        rules={[{ required: true, message: 'Title is required' }]}
                    >
                        <Input placeholder="Type a title" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input.TextArea placeholder="Type a description (optional)" rows={3} />
                    </Form.Item>
                    <Form.Item
                        label="Order"
                        name="order"
                        rules={[{ required: true, message: 'Please enter the order' }]}
                    >
                        <Input type="number" placeholder="Enter order" />
                    </Form.Item>
                    <Form.Item
                        label="Active"
                        name="isActive"
                        initialValue={true}
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModuleManager;
