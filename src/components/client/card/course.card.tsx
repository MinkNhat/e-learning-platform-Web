import { ICourse } from '@/types/backend';
import { ClockIcon, UsersIcon } from '@/components/share/hugeicons';
import { Image, Rate, Tag, Typography } from 'antd';

const { Text } = Typography;

interface IProps {
    course: ICourse;
    onClick?: () => void;
    hasSearchMatches?: boolean;
}

const CourseCard = ({ course, onClick, hasSearchMatches = false }: IProps) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

    const formatAuthorsToMentions = (authors?: ICourse["authors"]) => {
        return authors?.map(author => `${author.name}`).join(", ") ?? "";
    }

    const categoryName = typeof course.category === "string" ? course.category : course.category?.name;

    return (
        <div
            onClick={onClick}
            style={{
                borderRadius: hasSearchMatches ? '18px 18px 0 0' : 18,
                overflow: 'hidden',
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
                border: '1px solid #e7e9f0',
                borderBottom: hasSearchMatches ? 0 : undefined,
                background: '#fff',
                boxShadow: hasSearchMatches ? 'none' : '0 14px 34px rgba(20, 31, 55, 0.08)',
                padding: 10,
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(event) => {
                if (hasSearchMatches) return;
                event.currentTarget.style.transform = 'translateY(-4px)';
                event.currentTarget.style.boxShadow = '0 20px 42px rgba(20, 31, 55, 0.12)';
                event.currentTarget.style.borderColor = '#cfd7e8';
            }}
            onMouseLeave={(event) => {
                if (hasSearchMatches) return;
                event.currentTarget.style.transform = 'translateY(0)';
                event.currentTarget.style.boxShadow = '0 14px 34px rgba(20, 31, 55, 0.08)';
                event.currentTarget.style.borderColor = '#e7e9f0';
            }}
        >
            <div style={{ position: 'relative' }}>
                <Image
                    preview={false}
                    src={`${BASE_URL}/upload/thumbnails/${course?.thumbnail}`}
                    width="100%"
                    height={178}
                    style={{
                        objectFit: 'cover',
                        borderRadius: '14px',
                        background: '#eef2f7',
                    }}
                />
                {categoryName &&
                    <Tag
                        color="default"
                        style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            margin: 0,
                            borderRadius: 999,
                            border: '1px solid rgba(255,255,255,0.72)',
                            background: 'rgba(210, 239, 176)',
                            color: '#273348',
                            fontWeight: 600,
                        }}
                    >
                        {categoryName}
                    </Tag>
                }
            </div>

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
                        color: '#182033',
                        lineHeight: 1.45,
                    }}
                >
                    {course.title}
                </Text>

                <div style={{ marginTop: 6, minHeight: 22 }}>
                    <Text type="secondary" ellipsis style={{ display: 'block' }}>
                        {formatAuthorsToMentions(course.authors)}
                    </Text>
                </div>

                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, color: '#667085' }}>
                    <span style={{fontSize: 14}}>
                        <span style={{marginRight: 16}}><UsersIcon /> {course.enrollmentCount ?? 0}</span>
                        {course.totalLessons && <span><ClockIcon /> {course.totalLessons} bài học</span>}
                    </span>
                    <Rate
                        disabled
                        allowHalf
                        value={course.rating as number}
                        style={{ fontSize: 13 }}
                    />
                </div>
                
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <Text strong style={{ fontSize: 20, color: 'var(--primary-color-dark)'}}>
                        {course.price.toLocaleString('vi-VN')} đ
                    </Text>
                    {/* <Text delete type="secondary" style={{ fontSize: 14 }}>
                        {course.price.toLocaleString('vi-VN')} đ
                    </Text> */}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
