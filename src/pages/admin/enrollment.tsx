import DataTable from "@/components/client/data-table";
import Access from "@/components/share/access";
import { callCreateEnrollment, callFetchCourse, callFetchEnrollments, callFetchUser } from "@/config/api";
import { Add01Icon } from "@/config/hugeicons";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { resolveUserAvatarUrl } from "@/config/utils";
import { ICourse, IEnrollment, IUser } from "@/types/backend";
import { ActionType, ModalForm, ProColumns } from "@ant-design/pro-components";
import { AutoComplete, Avatar, Button, Form, Input, Space, Tag, message, notification } from "antd";
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import queryString from "query-string";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

type SearchOption = {
    value: string;
    label: ReactNode;
    id: string;
    display: string;
};

const getEnrollmentCourse = (enrollment: IEnrollment) =>
    typeof enrollment.course === 'string' ? null : enrollment.course;

const getEnrollmentUser = (enrollment: IEnrollment) =>
    typeof enrollment.user === 'string' ? null : enrollment.user;

const AdminEnrollmentPage = () => {
    const tableRef = useRef<ActionType>();
    const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
    const [meta, setMeta] = useState({ current: 1, pageSize: 10, total: 0 });
    const [isFetching, setIsFetching] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [userOptions, setUserOptions] = useState<SearchOption[]>([]);
    const [courseOptions, setCourseOptions] = useState<SearchOption[]>([]);
    const [form] = Form.useForm();

    const reloadTable = () => tableRef.current?.reload();

    const buildQuery = (params: any, sort: any) => {
        const clone = { ...params };
        delete clone.course;
        delete clone.user;

        let temp = queryString.stringify(clone);
        let sortBy = "";
        if (sort?.progress) sortBy = sort.progress === 'ascend' ? "sort=progress" : "sort=-progress";
        if (sort?.enrolDate) sortBy = sort.enrolDate === 'ascend' ? "sort=enrolDate" : "sort=-enrolDate";
        temp = `${temp}&${sortBy || "sort=-enrolDate"}`;
        return temp;
    };

    const fetchUserOptions = async (keyword: string) => {
        const baseQuery = { current: 1, pageSize: 20 };
        const responses = keyword
            ? await Promise.all([
                callFetchUser(queryString.stringify({ ...baseQuery, email: `/${keyword}/i` })),
                callFetchUser(queryString.stringify({ ...baseQuery, name: `/${keyword}/i` })),
            ])
            : [await callFetchUser(queryString.stringify(baseQuery))];

        const users = responses
            .flatMap(res => res.data?.result || [])
            .filter((item, index, list) => item._id && list.findIndex(user => user._id === item._id) === index);

        setUserOptions(users.map((item: IUser) => {
            const avatar = (item as IUser & { avatar?: string }).avatar;
            return {
                value: item.email,
                id: item._id || '',
                display: `${item.name} (${item.email})`,
                label: (
                    <Space>
                        <Avatar size="small" src={resolveUserAvatarUrl(avatar)} />
                        <span>{item.name}</span>
                        <span style={{ color: '#8c8c8c' }}>{item.email}</span>
                    </Space>
                ),
            };
        }));
    };

    const fetchCourseOptions = async (keyword: string) => {
        const query = queryString.stringify({
            current: 1,
            pageSize: 20,
            ...(keyword ? { title: `/${keyword}/i` } : {}),
        });
        const res = await callFetchCourse(query);
        setCourseOptions((res.data?.result || []).map((item: ICourse) => ({
            value: item.title,
            id: item._id || '',
            display: item.title,
            label: item.title,
        })));
    };

    const debouncedFetchUsers = useMemo(() => debounce(fetchUserOptions, 500), []);
    const debouncedFetchCourses = useMemo(() => debounce(fetchCourseOptions, 500), []);

    const handleUserSearch = (keyword: string) => {
        form.setFieldValue('userId', undefined);
        debouncedFetchUsers(keyword);
    };

    const handleCourseSearch = (keyword: string) => {
        form.setFieldValue('courseId', undefined);
        debouncedFetchCourses(keyword);
    };

    const handleSubmit = async (values: any) => {
        const res = await callCreateEnrollment({
            userId: values.userId,
            courseId: values.courseId,
        });

        if (res.data) {
            message.success('Gán user vào course thành công');
            handleResetModal();
            reloadTable();
        } else {
            notification.error({ message: 'Có lỗi xảy ra', description: res.message });
        }
    };

    const handleResetModal = () => {
        form.resetFields();
        setUserOptions([]);
        setCourseOptions([]);
        setOpenModal(false);
    };

    const renderUserSearch = () => (
        <>
            <Form.Item
                name="userKeyword"
                label="User"
                rules={[
                    { required: true, message: 'Vui lòng nhập user' },
                    {
                        validator: () => form.getFieldValue('userId')
                            ? Promise.resolve()
                            : Promise.reject(new Error('Vui lòng chọn user từ gợi ý')),
                    },
                ]}
            >
                <AutoComplete
                    options={userOptions}
                    filterOption={false}
                    onSearch={handleUserSearch}
                    onFocus={() => fetchUserOptions('')}
                    onSelect={(_value, option) => {
                        form.setFieldsValue({
                            userId: (option as SearchOption).id,
                            userKeyword: (option as SearchOption).display,
                        });
                    }}
                >
                    <Input placeholder="Nhập tên/email user để tìm" allowClear />
                </AutoComplete>
            </Form.Item>
            <Form.Item name="userId" hidden>
                <Input />
            </Form.Item>
        </>
    );

    const renderCourseSearch = () => (
        <>
            <Form.Item
                name="courseKeyword"
                label="Course"
                rules={[
                    { required: true, message: 'Vui lòng nhập course' },
                    {
                        validator: () => form.getFieldValue('courseId')
                            ? Promise.resolve()
                            : Promise.reject(new Error('Vui lòng chọn course từ gợi ý')),
                    },
                ]}
            >
                <AutoComplete
                    options={courseOptions}
                    filterOption={false}
                    onSearch={handleCourseSearch}
                    onFocus={() => fetchCourseOptions('')}
                    onSelect={(_value, option) => {
                        form.setFieldsValue({
                            courseId: (option as SearchOption).id,
                            courseKeyword: (option as SearchOption).display,
                        });
                    }}
                >
                    <Input placeholder="Nhập tên course để tìm" allowClear />
                </AutoComplete>
            </Form.Item>
            <Form.Item name="courseId" hidden>
                <Input />
            </Form.Item>
        </>
    );
    const columns: ProColumns<IEnrollment>[] = [
        {
            title: 'Người dùng',
            dataIndex: 'user',
            hideInSearch: true,
            render: (_dom, entity) => {
                const user = getEnrollmentUser(entity);
                return user?.email || user?.name || (typeof entity.user === 'string' ? entity.user : '-');
            },
        },
        {
            title: 'Course',
            dataIndex: 'course',
            hideInSearch: true,
            render: (_dom, entity) => getEnrollmentCourse(entity)?.title || (typeof entity.course === 'string' ? entity.course : '-'),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            hideInSearch: true,
            render: (_dom, entity) => {
                const course = getEnrollmentCourse(entity);
                const isPaid = Number(course?.price || 0) > 0;
                return <Tag color={isPaid ? 'green' : 'blue'}>{isPaid ? 'PAID' : 'FREE'}</Tag>;
            },
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            sorter: true,
            hideInSearch: true,
            render: (_dom, entity) => `${Math.round(entity.progress || 0)}%`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            hideInSearch: true,
            render: (_dom, entity) => <Tag color={entity.isActive === false ? 'red' : 'lime'}>{entity.isActive === false ? 'INACTIVE' : 'ACTIVE'}</Tag>,
        },
        {
            title: 'Ngày enroll',
            dataIndex: 'enrolDate',
            sorter: true,
            hideInSearch: true,
            render: (_dom, entity) => entity.enrolDate ? dayjs(entity.enrolDate).format('DD-MM-YYYY HH:mm:ss') : '-',
        },
    ];

    return (
        <Access permission={ALL_PERMISSIONS.ENROLLMENTS.GET_PAGINATE}>
            <DataTable<IEnrollment>
                actionRef={tableRef}
                headerTitle="Danh sách Enrollment"
                rowKey="_id"
                loading={isFetching}
                columns={columns}
                dataSource={enrollments}
                request={async (params, sort): Promise<any> => {
                    setIsFetching(true);
                    const res = await callFetchEnrollments(buildQuery(params, sort));
                    if (res.data) {
                        setEnrollments(res.data.result);
                        setMeta({
                            current: res.data.meta.current,
                            pageSize: res.data.meta.pageSize,
                            total: res.data.meta.total,
                        });
                    }
                    setIsFetching(false);
                }}
                scroll={{ x: true }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => <div>{range[0]}-{range[1]} trên {total} rows</div>,
                }}
                rowSelection={false}
                toolBarRender={(): any => (
                    <Access permission={ALL_PERMISSIONS.ENROLLMENTS.CREATE} hideChildren>
                        <Button icon={<Add01Icon />} type="primary" onClick={() => setOpenModal(true)}>
                            Gán user vào course
                        </Button>
                    </Access>
                )}
            />

            <ModalForm
                title="Gán user vào course"
                open={openModal}
                form={form}
                onFinish={handleSubmit}
                preserve={false}
                modalProps={{
                    onCancel: handleResetModal,
                    afterClose: handleResetModal,
                    destroyOnClose: true,
                    okText: 'Gán',
                    cancelText: 'Hủy',
                }}
            >
                {renderUserSearch()}
                {renderCourseSearch()}
            </ModalForm>
        </Access>
    );
};

export default AdminEnrollmentPage;
