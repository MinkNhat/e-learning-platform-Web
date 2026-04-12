import { ModalForm, ProFormDigit, ProFormSelect, ProFormText, ProFormCheckbox } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState } from "react";
import { callCreateCourse, callUpdateCourse } from "@/config/api";
import { ICourse } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICourse | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalCourse = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    const submitCourse = async (valuesForm: any) => {
        const { title, shortDescription, description, objectives, requirement, price, slug, level, languages, authors, isPublished, isProcessLimit } = valuesForm;
        
        if (dataInit?._id) {
            //update
            const course = {
                title,
                shortDescription,
                description,
                objectives: objectives ? objectives.split(',').map((item: string) => item.trim()) : [],
                requirement,
                price,
                slug,
                level,
                languages: languages ? languages.split(',').map((item: string) => item.trim()) : [],
                authors: authors ? authors.split(',').map((item: string) => item.trim()) : [],
                isPublished: isPublished || false,
                isProcessLimit: isProcessLimit || false,
            }

            const res = await callUpdateCourse(course, dataInit._id);
            if (res.data) {
                message.success("Cập nhật khóa học thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const course = {
                title,
                shortDescription,
                description,
                objectives: objectives ? objectives.split(',').map((item: string) => item.trim()) : [],
                requirement,
                price,
                slug,
                level,
                languages: languages ? languages.split(',').map((item: string) => item.trim()) : [],
                authors: authors ? authors.split(',').map((item: string) => item.trim()) : [],
                isPublished: isPublished || false,
                isProcessLimit: isProcessLimit || false,
            }
            
            const res = await callCreateCourse(course);
            if (res.data) {
                message.success("Thêm mới khóa học thành công");
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
        setOpenModal(false);
    }

    const initialValues = dataInit?._id ? {
        ...dataInit,
        objectives: dataInit.objectives?.join(', '),
        languages: dataInit.languages?.join(', '),
        authors: dataInit.authors?.join(', '),
    } : {};

    return (
        <>
            <ModalForm
                title={<>{dataInit?._id ? "Cập nhật Khóa Học" : "Tạo mới Khóa Học"}</>}
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
                onFinish={submitCourse}
                initialValues={initialValues}
            >
                <Row gutter={16}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProFormText
                            label="Tên Khóa Học"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên khóa học"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Slug"
                            name="slug"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập slug"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormDigit
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập giá"
                            min={0}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormSelect
                            name="level"
                            label="Level"
                            valueEnum={{
                                INTERN: 'INTERN',
                                FRESHER: 'FRESHER',
                                JUNIOR: 'JUNIOR',
                                MIDDLE: 'MIDDLE',
                                SENIOR: 'SENIOR',
                            }}
                            placeholder="Chọn level"
                            rules={[{ required: true, message: 'Vui lòng chọn level!' }]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Mô tả ngắn"
                            name="shortDescription"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập mô tả ngắn"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Mô tả chi tiết"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập mô tả chi tiết"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Yêu cầu"
                            name="requirement"
                            placeholder="Nhập yêu cầu"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Mục tiêu (cách nhau bằng dấu phẩy)"
                            name="objectives"
                            placeholder="Ví dụ: Mục tiêu 1, Mục tiêu 2"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Ngôn ngữ (cách nhau bằng dấu phẩy)"
                            name="languages"
                            placeholder="Ví dụ: Tiếng Việt, Tiếng Anh"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tác giả (cách nhau bằng dấu phẩy)"
                            name="authors"
                            placeholder="Ví dụ: Tác giả 1, Tác giả 2"
                        />
                    </Col>
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <ProFormCheckbox name="isPublished">
                            Công bố
                        </ProFormCheckbox>
                    </Col>
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <ProFormCheckbox name="isProcessLimit">
                            Hạn chế tiến độ
                        </ProFormCheckbox>
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalCourse;
