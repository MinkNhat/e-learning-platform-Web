import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ICategory } from "@/types/backend";
import { AddIcon, DeleteIcon, EditIcon } from "@/components/share/hugeicons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef, createElement } from 'react';
import dayjs from 'dayjs';
import { callDeleteCategory } from "@/config/api";
import queryString from 'query-string';
import { fetchCategory } from "@/redux/slice/categorySlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import ModalCategory from "@/components/admin/category/modal.category";
import { getHugeIconComponent } from "@/config/utils";

const CategoryPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ICategory | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.category.isFetching);
    const meta = useAppSelector(state => state.category.meta);
    const categories = useAppSelector(state => state.category.result);
    const dispatch = useAppDispatch();

    const handleDeleteCategory = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteCategory(_id);
            if (res && res.data) {
                message.success('Xóa category thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<ICategory>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (_text, _record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.current - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Tên category',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
            align: "center",
            width: 80,
            render: (_dom, entity) => {
                const IconComponent = getHugeIconComponent(entity.icon);

                return IconComponent ? createElement(IconComponent, { style: { fontSize: 20 } }) : '-';
            },
            hideInSearch: true,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Level',
            dataIndex: 'level',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: (_dom, entity) => {
                return (
                    <Tag color={entity.isActive ? "lime" : "red"}>
                        {entity.isActive ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Category cha',
            dataIndex: 'parent',
            render: (_dom, entity) => {
                if (!entity.parent) return '-';
                if (typeof entity.parent === 'string') return entity.parent;
                return entity.parent.name;
            },
            hideInSearch: true,
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (_text, record) => {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (_text, record) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 80,
            render: (_value, entity) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.CATEGORIES.UPDATE}
                        hideChildren
                    >
                        <EditIcon
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.CATEGORIES.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa category"}
                            description={"Bạn có chắc chắn muốn xóa category này ?"}
                            onConfirm={() => handleDeleteCategory(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteIcon
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any) => {
        const clone = { ...params };
        if (clone.name) clone.name = `/${clone.name}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name" : "sort=-name";
        }
        if (sort && sort.level) {
            sortBy = sort.level === 'ascend' ? "sort=level" : "sort=-level";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        temp += "&populate=parent&fields=parent._id,parent.name";

        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.CATEGORIES.GET_PAGINATE}
            >
                <DataTable<ICategory>
                    actionRef={tableRef}
                    headerTitle="Danh sách Categories"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={categories}
                    request={async (params, sort): Promise<any> => {
                        const query = buildQuery(params, sort);
                        dispatch(fetchCategory({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(): any => {
                        return (
                            <Button
                                icon={<AddIcon />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Thêm mới
                            </Button>
                        );
                    }}
                />
            </Access>
            <ModalCategory
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default CategoryPage;
