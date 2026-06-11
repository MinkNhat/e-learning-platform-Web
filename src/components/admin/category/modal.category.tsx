import { ModalForm, ProFormDigit, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";
import { callCreateCategory, callFetchCategory, callUpdateCategory } from "@/config/api";
import { ICategory } from "@/types/backend";
import { DebounceSelect } from "@/components/admin/user/debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICategory | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface ICategorySelect {
    label: string;
    value: string;
    key?: string;
}

const ModalCategory = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();
    const [parents, setParents] = useState<ICategorySelect[]>([]);

    useEffect(() => {
        if (dataInit?._id && dataInit.parent && typeof dataInit.parent !== 'string') {
            setParents([
                {
                    label: dataInit.parent.name,
                    value: dataInit.parent._id as string,
                    key: dataInit.parent._id as string,
                }
            ]);
        }
    }, [dataInit]);

    const submitCategory = async (valuesForm: any) => {
        const { name, description, slug, isActive, parent, icon } = valuesForm;
        const parentValue = Array.isArray(parent) ? parent[0] : parent;
        const category = {
            name,
            description,
            slug,
            isActive,
            icon,
            parent: parentValue?.value ?? parentValue?._id,
        } as ICategory;

        if (dataInit?._id) {
            const res = await callUpdateCategory(category, dataInit._id);
            if (res.data) {
                message.success("Cập nhật category thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callCreateCategory(category);
            if (res.data) {
                message.success("Thêm mới category thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setParents([]);
        setOpenModal(false);
    }

    async function fetchParentList(name: string): Promise<ICategorySelect[]> {
        const res = await callFetchCategory(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            return list
                .filter(item => item._id !== dataInit?._id)
                .map(item => ({
                    label: item.name as string,
                    value: item._id as string,
                }));
        }
        return [];
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?._id ? "Cập nhật Category" : "Tạo mới Category"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitCategory}
                initialValues={dataInit?._id ? dataInit : { isActive: true }}
            >
                <Row gutter={16}>
                    <Col lg={16} md={16} sm={24} xs={24}>
                        <ProFormText
                            label="Tên category"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên category"
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormSwitch
                            label="Trạng thái"
                            name="isActive"
                            checkedChildren="ACTIVE"
                            unCheckedChildren="INACTIVE"
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormText
                            label="Slug"
                            name="slug"
                            placeholder="Nhập slug"
                        />
                    </Col>

                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormText
                            label={<a href="https://ant.design/components/icon/" target="_blank" rel="noopener noreferrer">Antd Icons</a>}
                            name="icon"
                            placeholder="<StepForwardOutlined />"
                        />
                    </Col>
                    
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name="parent"
                            label="Category cha"
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={parents}
                                value={parents}
                                placeholder="Chọn category cha"
                                fetchOptions={fetchParentList}
                                onChange={(newValue: any) => {
                                    if (!newValue) {
                                        setParents([]);
                                        return;
                                    }
                                    if (Array.isArray(newValue)) {
                                        if (newValue.length <= 1) {
                                            setParents(newValue as ICategorySelect[]);
                                        }
                                        return;
                                    }
                                    setParents([newValue as ICategorySelect]);
                                }}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            label="Mô tả"
                            name="description"
                            placeholder="Nhập mô tả"
                            fieldProps={{
                                rows: 3,
                            }}
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalCategory;
