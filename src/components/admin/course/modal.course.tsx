import { ModalForm, ProFormDigit, ProFormSelect, ProFormText, ProFormCheckbox, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { isMobile } from 'react-device-detect';
import { useState } from "react";
import { callCreateCourse, callUpdateCourse } from "@/config/api";
import { ICourse } from "@/types/backend";
import { COURSE_LEVEL_LIST } from "@/config/enum";

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
    debugger

    const submitCourse = async (valuesForm: any) => {
        const { title, shortDescription, description, objectives, requirement, price, level, languages, authors, thumbnail } = valuesForm;
        
        if (dataInit?._id) {
            //update
            const course = {
                title,
                shortDescription,
                description,
                objectives: objectives ? objectives.split(';').map((item: string) => item.trim()) : [],
                requirement,
                price,
                level,
                languages: languages ? languages.split(';').map((item: string) => item.trim()) : [],
                authors: authors ? authors.split(';').map((item: string) => item.trim()) : [],
                thumbnail: thumbnail?.originFileObj || dataInit.thumbnail,
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
                objectives: objectives ? objectives.split(';').map((item: string) => item.trim()) : [],
                requirement,
                price,
                level,
                languages: languages ? languages.split(';').map((item: string) => item.trim()) : [],
                authors: authors ? authors.split(';').map((item: string) => item.trim()) : [],
                thumbnail: thumbnail?.originFileObj,
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
        objectives: dataInit.objectives?.join('; '),
        languages: dataInit.languages?.join('; '),
        authors: dataInit.authors?.join('; '),
    } : {};

    return (
        <>
            <ModalForm
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?._id ? "Update" : "Create"}</>,
                    cancelText: "Cancel",
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
                            label="Course Name"
                            name="title"
                            rules={[{ required: true, message: 'Please enter the value' }]}
                            placeholder="Enter course name"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <ProFormDigit
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please enter the value' }]}
                            placeholder="Enter price"
                            min={0}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <ProFormSelect
                            name="level"
                            label="Level"
                            valueEnum={COURSE_LEVEL_LIST.reduce((acc, level) => {
                                acc[level.value] = level.label;
                                return acc;
                            }, {} as Record<string, string>)}
                            placeholder="Choose level"
                            rules={[{ required: true, message: 'Please enter the value' }]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Short Description"
                            name="shortDescription"
                            rules={[{ required: true, message: 'Please enter the value' }]}
                            placeholder="Enter short description"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormTextArea
                            label="Detailed Description"
                            name="description"
                            rules={[{ required: true, message: 'Please enter the value' }]}
                            placeholder="Enter detailed description"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormTextArea
                            label="Requirement"
                            name="requirement"
                            placeholder="Enter requirement"
                        />
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProFormText
                            label="Objectives"
                            name="objectives"
                            placeholder="e.g.; Objective 1; Objective 2"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Languages"
                            name="languages"
                            placeholder="e.g.; Vietnamese; English"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="CO-Authors"
                            name="authors"
                            placeholder="e.g.; Author 1; Author 2 (included creator)"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Thumbnail"
                            name="thumbnail"
                            valuePropName="file"
                            getValueFromEvent={(e) => e?.fileList?.[0]}
                            rules={[{ required: !dataInit?._id, message: 'Please upload thumbnail' }]}
                        >
                            <Upload
                                name="thumbnail"
                                accept="image/*"
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <button type="button" style={{ border: '1px solid #d9d9d9', borderRadius: '2px', padding: '4px 15px', cursor: 'pointer' }}>
                                    <UploadOutlined /> Upload Thumbnail
                                </button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalCourse;
