import { useEffect, useMemo, useState } from "react";
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Avatar, Col, Form, Mentions, Row, Space, message, notification, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { isMobile } from 'react-device-detect';
import { callCreateCourse, callFetchCategory, callFetchUser, callUpdateCourse } from "@/config/api";
import { ICategory, ICourse, IUser } from "@/types/backend";
import { COURSE_LEVEL_LIST } from "@/config/enum";
import { useAppSelector } from "@/redux/hooks";

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
    const currentUser = useAppSelector(state => state.account.user);
    const [authorOptions, setAuthorOptions] = useState<{ label: React.ReactNode; value: string }[]>([]);
    const [authorMap, setAuthorMap] = useState<Record<string, { _id: string; name: string; avatar?: string }>>({});

    const formatAuthorsToMentions = (authors?: ICourse["authors"]) => {
        return authors?.map(author => `@${author.name}`).join("; ") ?? "";
    }

    const parseAuthorsFromMentions = (authors: string = "") => {
        const authorNames = authors
            .split(";")
            .map(item => item.trim().replace(/^@/, ""))
            .filter(Boolean);

        return authorNames
            .map(name => authorMap[name]?._id)
            .filter(Boolean);
    }

    const submitCourse = async (valuesForm: any) => {
        const { title, shortDescription, description, objectives, requirement, price, level, languages, authors, thumbnail, category } = valuesForm;
        const authorIds = parseAuthorsFromMentions(authors);
        
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
                authors: authorIds,
                category,
                thumbnail: thumbnail?.originFileObj || dataInit.thumbnail,
            } as any;

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
                authors: authorIds,
                category,
                thumbnail: thumbnail?.originFileObj,
            } as any;
            
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
        setAuthorMap({});
        setAuthorOptions([]);
        setDataInit(null);
        setOpenModal(false);
    }

    const categoryInit = dataInit?.category as ICategory | string | undefined;
    const defaultAuthor = currentUser?._id ? {
        _id: currentUser._id,
        name: currentUser.name,
    } : null;

    const initialValues = dataInit?._id ? {
        ...dataInit,
        objectives: dataInit.objectives?.join('; '),
        languages: dataInit.languages?.join('; '),
        authors: formatAuthorsToMentions(dataInit.authors),
        category: typeof categoryInit === 'string' ? categoryInit : categoryInit?._id,
    } : {
        authors: defaultAuthor ? formatAuthorsToMentions([defaultAuthor]) : "",
    };

    const mentionOptions = useMemo(() => authorOptions, [authorOptions]);

    useEffect(() => {
        if (!openModal) return;

        const authors = dataInit?._id ? dataInit.authors : defaultAuthor ? [defaultAuthor] : [];
        const nextAuthorMap = authors.reduce((acc, author) => {
            acc[author.name] = author;
            return acc;
        }, {} as Record<string, { _id: string; name: string; avatar?: string }>);

        setAuthorMap(nextAuthorMap);
        form.setFieldsValue({
            authors: dataInit?._id ? formatAuthorsToMentions(dataInit.authors) : formatAuthorsToMentions(defaultAuthor ? [defaultAuthor] : []),
        });
    }, [openModal, dataInit?._id, currentUser?._id]);

    async function fetchCategoryList(name: string = "") {
        const res = await callFetchCategory(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            return res.data.result.map(item => ({
                label: item.name as string,
                value: item._id as string,
            }));
        }
        return [];
    }

    async function fetchUserList(keyword: string = "") {
        const res = await callFetchUser(`current=1&pageSize=20&name=/${keyword}/i`);
        if (res && res.data) {
            const users = res.data.result;
            setAuthorMap(prev => {
                const next = { ...prev };
                users.forEach(user => {
                    if (user._id) {
                        next[user.name] = {
                            _id: user._id,
                            name: user.name,
                            avatar: (user as IUser & { avatar?: string }).avatar,
                        };
                    }
                });
                return next;
            });
            setAuthorOptions(users
                .filter(user => user._id)
                .map(user => ({
                    value: user.name,
                    label: (
                        <Space>
                            <Avatar size="small" src={(user as IUser & { avatar?: string }).avatar}>
                                {user.name?.substring(0, 2)?.toUpperCase()}
                            </Avatar>
                            <span>{user.name}</span>
                        </Space>
                    ),
                }))
            );
        }
    }

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
                        <ProFormSelect
                            name="category"
                            label="Category"
                            showSearch
                            allowClear
                            placeholder="Choose category"
                            rules={[{ required: true, message: 'Choose category' }]}
                            request={async ({ keyWords }) => fetchCategoryList(keyWords)}
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
                        <Form.Item
                            label="CO-Authors"
                            name="authors"
                            rules={[{ required: true, message: 'Please choose at least one author' }]}
                        >
                            <Mentions
                                options={mentionOptions}
                                placeholder="@author; @co-author"
                                split=";"
                                notFoundContent="No users found"
                                onSearch={fetchUserList}
                                onFocus={() => fetchUserList()}
                            />
                        </Form.Item>
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
