import CKEditorField from "@/components/share/CKEditorField";
import { callCreateBlog, callFetchRootCategory, callUpdateBlog } from "@/config/api";
import { Upload01Icon } from "@/config/hugeicons";
import { IBlog, ICategory } from "@/types/backend";
import { ModalForm, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row, Upload, message, notification } from "antd";
import { isMobile } from "react-device-detect";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IBlog | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalBlog = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    const fetchRootCategories = async (keyword = '') => {
        const res = await callFetchRootCategory(keyword ? `name=/${keyword}/i` : '');
        return (res.data || []).map((item: ICategory) => ({
            label: item.name,
            value: item._id,
        }));
    };

    const submitBlog = async (values: any) => {
        const payload: Partial<IBlog> = {
            title: values.title,
            description: values.description,
            content: values.content,
            category: values.category,
            status: values.status,
            isFeatured: values.isFeatured,
        };
        if (values.coverImage?.originFileObj) payload.coverImage = values.coverImage.originFileObj;

        const res = dataInit?._id
            ? await callUpdateBlog(dataInit._id, payload)
            : await callCreateBlog(payload as IBlog);

        if (res.data) {
            message.success(dataInit?._id ? 'Cập nhật blog thành công' : 'Tạo blog thành công');
            handleReset();
            reloadTable();
        } else {
            notification.error({ message: 'Có lỗi xảy ra', description: res.message });
        }
    };

    return (
        <ModalForm
            title={dataInit?._id ? 'Cập nhật Blog' : 'Tạo mới Blog'}
            open={openModal}
            form={form}
            onFinish={submitBlog}
            preserve={false}
            initialValues={dataInit?._id ? {
                ...dataInit,
                category: typeof dataInit.category === 'string' ? dataInit.category : dataInit.category?._id,
            } : { status: 'draft', isFeatured: false }}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 980,
                keyboard: false,
                maskClosable: false,
                okText: dataInit?._id ? 'Cập nhật' : 'Tạo mới',
                cancelText: 'Hủy',
            }}
        >
            <Row gutter={16}>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProFormText
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    />
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSelect
                        name="category"
                        label="Category root"
                        showSearch
                        request={async ({ keyWords }) => fetchRootCategories(keyWords)}
                        rules={[{ required: true, message: 'Vui lòng chọn category' }]}
                    />
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <ProFormSelect
                        label="Status"
                        name="status"
                        valueEnum={{ draft: 'draft', published: 'published', archived: 'archived' }}
                        rules={[{ required: true, message: 'Vui lòng chọn status' }]}
                    />
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <ProFormSwitch
                        label="Featured"
                        name="isFeatured"
                        checkedChildren="YES"
                        unCheckedChildren="NO"
                    />
                </Col>
                <Col span={24}>
                    <ProFormTextArea
                        label="Mô tả"
                        name="description"
                        fieldProps={{ rows: 3 }}
                    />
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Cover image"
                        name="coverImage"
                        valuePropName="file"
                        getValueFromEvent={(e) => e?.fileList?.[0]}
                    >
                        <Upload name="coverImage" accept="image/*" maxCount={1} beforeUpload={() => false}>
                            <button type="button" style={{ border: '1px solid #d9d9d9', borderRadius: '2px', padding: '4px 15px', cursor: 'pointer' }}>
                                <Upload01Icon /> Upload Cover
                            </button>
                        </Upload>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: 'Vui lòng nhập content' }]}
                    >
                        <CKEditorField placeholder="Nhập nội dung blog..." />
                    </Form.Item>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalBlog;
