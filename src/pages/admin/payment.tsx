import DataTable from "@/components/client/data-table";
import Access from "@/components/share/access";
import { callFetchPayments } from "@/config/api";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { IOrder, IPayment } from "@/types/backend";
import { ActionType, ProColumns, ProFormSelect } from "@ant-design/pro-components";
import { Tag } from "antd";
import dayjs from "dayjs";
import queryString from "query-string";
import { useRef, useState } from "react";

const formatMoney = (amount?: number, currency = 'VND') =>
    `${Number(amount || 0).toLocaleString('vi-VN')} ${currency}`;

const getPaymentStatusColor = (status?: IPayment['status']) => {
    if (status === 'paid') return 'green';
    if (status === 'failed' || status === 'cancelled') return 'red';
    if (status === 'refunded') return 'orange';
    return 'blue';
};

const getOrder = (payment: IPayment) =>
    typeof payment.order === 'string' ? null : payment.order;

const AdminPaymentPage = () => {
    const tableRef = useRef<ActionType>();
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [meta, setMeta] = useState({ current: 1, pageSize: 10, total: 0 });
    const [isFetching, setIsFetching] = useState(false);

    const buildQuery = (params: any, sort: any) => {
        const clone = { ...params };
        if (clone.status?.length) clone.status = clone.status.join(',');
        if (clone.provider) clone.provider = `/${clone.provider}/i`;

        let temp = queryString.stringify(clone);
        let sortBy = "";
        if (sort?.amount) sortBy = sort.amount === 'ascend' ? "sort=amount" : "sort=-amount";
        if (sort?.createdAt) sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        temp = `${temp}&${sortBy || "sort=-createdAt"}`;
        return temp;
    };

    const columns: ProColumns<IPayment>[] = [
        {
            title: 'Người dùng',
            dataIndex: 'user',
            hideInSearch: true,
            render: (_dom, entity) => {
                if (typeof entity.user === 'string') return entity.user;
                return entity.user?.email || entity.user?.name || '-';
            },
        },
        {
            title: 'Course',
            dataIndex: 'course',
            hideInSearch: true,
            render: (_dom, entity) => {
                const order = getOrder(entity);
                if (!order) return '-';
                return typeof order.course === 'string' ? order.course : order.course?.title;
            },
        },
        {
            title: 'Provider',
            dataIndex: 'provider',
            width: 120,
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            sorter: true,
            hideInSearch: true,
            render: (_dom, entity) => formatMoney(entity.amount, entity.currency),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            renderFormItem: () => (
                <ProFormSelect
                    mode="multiple"
                    valueEnum={{ pending: 'pending', paid: 'paid', failed: 'failed', refunded: 'refunded', cancelled: 'cancelled' }}
                    placeholder="Chọn status"
                />
            ),
            render: (_dom, entity) => <Tag color={getPaymentStatusColor(entity.status)}>{entity.status?.toUpperCase()}</Tag>,
        },
        {
            title: 'Order',
            dataIndex: 'order',
            hideInSearch: true,
            render: (_dom, entity) => {
                const order = getOrder(entity) as IOrder | null;
                return order?._id || (typeof entity.order === 'string' ? entity.order : '-');
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            sorter: true,
            hideInSearch: true,
            render: (_dom, entity) => entity.createdAt ? dayjs(entity.createdAt).format('DD-MM-YYYY HH:mm:ss') : '-',
        },
    ];

    return (
        <Access permission={ALL_PERMISSIONS.PAYMENTS.GET_PAGINATE}>
            <DataTable<IPayment>
                actionRef={tableRef}
                headerTitle="Danh sách Payment"
                rowKey="_id"
                loading={isFetching}
                columns={columns}
                dataSource={payments}
                request={async (params, sort): Promise<any> => {
                    setIsFetching(true);
                    const res = await callFetchPayments(buildQuery(params, sort));
                    if (res.data) {
                        setPayments(res.data.result);
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
                toolBarRender={(): any => <></>}
            />
        </Access>
    );
};

export default AdminPaymentPage;
