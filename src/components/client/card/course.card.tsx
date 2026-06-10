import { ICourse } from '@/types/backend';
import { Card, Image, Rate, Typography } from 'antd';

const { Text } = Typography;

interface IProps {
    course: ICourse;
    onClick?: () => void;
}

const CourseCard = ({ course, onClick }: IProps) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const formatAuthorsToMentions = (authors?: ICourse["authors"]) => {
        return authors?.map(author => `${author.name}`).join(", ") ?? "";
    }

    return (
        <div
            onClick={onClick}
            style={{
                borderRadius: 16,
                overflow: 'hidden',
                width: 320,
                border: '1px solid #ccc',
                padding: 8,
                cursor: 'pointer',
            }}
        >
            <Image
                preview={false}
                src={`${BASE_URL}/images/thumbnails/${course?.thumbnail}`}
                width="100%"
                height={180}
                style={{
                    objectFit: 'cover',
                    borderRadius: '12px',
                }}
            />

            <div style={{ padding: '12px 8px' }}>
                <Text
                    strong
                    style={{
                        fontSize: 16,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 48,
                    }}
                >
                    {course.title}
                </Text>

                <div style={{ marginTop: 4 }}>
                    <Text type="secondary">
                        {formatAuthorsToMentions(course.authors)}
                    </Text>
                </div>

                <Rate
                    disabled
                    allowHalf
                    value={course.rating as number}
                    style={{ fontSize: 14, marginTop: 4 }}
                />
                
                <div style={{ marginTop: 12 }}>
                    <Text strong style={{ fontSize: 18, color: 'var(--primary-color-dark)'}}>
                        {course.price.toLocaleString('vi-VN')} đ
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;