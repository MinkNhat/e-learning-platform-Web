import { ICourse } from "@/types/backend";
import { Badge, Descriptions, Drawer, Tag } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: ICourse | null;
    setDataInit: (v: any) => void;
}

const ViewDetailCourse = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <>
            <Drawer
                title="Thông Tin Khóa Học"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Tên Khóa Học">{dataInit?.title}</Descriptions.Item>
                    <Descriptions.Item label="Slug">{dataInit?.slug}</Descriptions.Item>

                    <Descriptions.Item label="Giá" span={1}>
                        {dataInit?.price?.toLocaleString('vi-VN')} đ
                    </Descriptions.Item>
                    <Descriptions.Item label="Level">{dataInit?.level}</Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color={dataInit?.isPublished ? "lime" : "red"}>
                            {dataInit?.isPublished ? "PUBLISHED" : "DRAFT"}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Đánh giá">{dataInit?.rating}/5</Descriptions.Item>

                    <Descriptions.Item label="Mô tả ngắn" span={2}>
                        {dataInit?.shortDescription}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả chi tiết" span={2}>
                        {dataInit?.description}
                    </Descriptions.Item>

                    <Descriptions.Item label="Yêu cầu" span={2}>
                        {dataInit?.requirement}
                    </Descriptions.Item>

                    <Descriptions.Item label="Mục tiêu" span={2}>
                        {dataInit?.objectives?.join(', ')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngôn ngữ" span={2}>
                        {dataInit?.languages?.join(', ')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Tác giả" span={2}>
                        {dataInit?.authors?.join(', ')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số học viên">
                        {dataInit?.enrollmentCount}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hạn chế tiến độ">
                        {dataInit?.isProcessLimit ? "Có" : "Không"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tạo">
                        {dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailCourse;
