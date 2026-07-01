import DataTable from "@/components/client/data-table";
import { callDeleteBlog, callFetchBlogsForManage } from "@/config/api";
import { Add01Icon, Delete02Icon, PencilEdit02Icon } from "@/config/hugeicons";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { IBlog } from "@/types/backend";
import { ActionType, ProColumns, ProFormSelect } from "@ant-design/pro-components";
import { Button, Image, Popconfirm, Space, Tag, message, notification } from "antd";
import dayjs from "dayjs";
import queryString from "query-string";
import { useRef, useState } from "react";
import Access from "@/components/share/access";
import ModalBlog from "@/components/admin/blog/modal.blog";

const BlogAdminPage = () => {
    const tableRef = useRef<ActionType>();
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [meta, setMeta] = useState({ current: 1, pageSize: 10, total: 0 });
    const [isFetching, setIsFetching] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IBlog | null>(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

    const reloadTable = () => tableRef.current?.reload();

    const handleDeleteBlog = async (id?: string) => {
        if (!id) return;
        const res = await callDeleteBlog(id);
        if (res?.data) {
            message.success('Xóa blog thành công');
            reloadTable();
        } else {
            notification.error({ message: 'Có lỗi xảy ra', description: res.message });
        }
    };

    const buildQuery = (params: any, sort: any) => {
        const clone = { ...params };
        if (clone.title) clone.title = `/${clone.title}/i`;
        if (clone.status?.length) clone.status = clone.status.join(',');

        let temp = queryString.stringify(clone);
        let sortBy = "";
        if (sort?.title) sortBy = sort.title === 'ascend' ? "sort=title" : "sort=-title";
        if (sort?.updatedAt) sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        temp = `${temp}&${sortBy || "sort=-updatedAt"}`;
        return temp;
    };

    const columns: ProColumns<IBlog>[] = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            sorter: true,
        },
        {
            title: 'Cover',
            dataIndex: 'coverImage',
            hideInSearch: true,
            width: 90,
            render: (_dom, entity) => entity.coverImage
                ? <Image width={64} height={40} src={`${BASE_URL}/upload/coverImages/${entity.coverImage}`} style={{ objectFit: 'cover', borderRadius: 4 }} />
                : '-',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,
            render: (_dom, entity) => typeof entity.category === 'string' ? entity.category : entity.category?.name,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            renderFormItem: () => (
                <ProFormSelect
                    mode="multiple"
                    valueEnum={{ draft: 'draft', published: 'published', archived: 'archived' }}
                    placeholder="Chọn status"
                />
            ),
            render: (_dom, entity) => {
                const color = entity.status === 'published' ? 'green' : entity.status === 'archived' ? 'orange' : 'default';
                return <Tag color={color}>{(entity.status || 'draft').toUpperCase()}</Tag>;
            },
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            sorter: true,
            hideInSearch: true,
            render: (_dom, entity) => entity.updatedAt ? dayjs(entity.updatedAt).format('DD-MM-YYYY HH:mm:ss') : '',
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 90,
            render: (_value, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.BLOGS.UPDATE} hideChildren>
                        <PencilEdit02Icon
                            style={{ fontSize: 20, color: '#ffa500', cursor: 'pointer' }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.BLOGS.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa blog"
                            description="Bạn có chắc chắn muốn xóa blog này?"
                            onConfirm={() => handleDeleteBlog(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Delete02Icon style={{ fontSize: 20, color: '#ff4d4f', cursor: 'pointer' }} />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    return (
        <Access permission={ALL_PERMISSIONS.BLOGS.GET_PAGINATE}>
            <DataTable<IBlog>
                actionRef={tableRef}
                headerTitle="Danh sách Blog"
                rowKey="_id"
                loading={isFetching}
                columns={columns}
                dataSource={blogs}
                request={async (params, sort): Promise<any> => {
                    setIsFetching(true);
                    const res = await callFetchBlogsForManage(buildQuery(params, sort));
                    if (res.data) {
                        setBlogs(res.data.result);
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
                    <Button icon={<Add01Icon />} type="primary" onClick={() => setOpenModal(true)}>
                        Thêm mới
                    </Button>
                )}
            />

            <ModalBlog
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </Access>
    );
};

export default BlogAdminPage;
