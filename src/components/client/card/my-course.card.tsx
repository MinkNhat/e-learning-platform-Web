import { callFetchMyRecentLesson } from "@/config/api";
import { ICourse, IEnrollment } from "@/types/backend";
import { Image, notification, Progress, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface IProps {
    enrollment: IEnrollment;
}

const MyCourseCard = ({ enrollment }: IProps) => {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
    const [isNavigating, setIsNavigating] = useState(false);
    const course = typeof enrollment.course === 'string' ? null : enrollment.course;
    const progress = Math.min(Math.max(enrollment.progress || 0, 0), 100);
    const courseSlug = (enrollment.course as ICourse)?.slug || '';

    const formatAuthorsToMentions = (authors?: ICourse["authors"]) => {
        return authors?.map(author => `${author.name}`).join(", ") ?? "";
    }

    const handleContinueCourse = async () => {
        if (!courseSlug || isNavigating) return;

        setIsNavigating(true);
        try {
            const res = await callFetchMyRecentLesson(courseSlug);
            const lessonId = res.data?._id;
            if (lessonId) {
                navigate(`/my-course/${courseSlug}/${lessonId}`);
                return;
            }

            notification.warning({
                message: 'Chưa có bài học',
                description: 'Khóa học này chưa có bài học để tiếp tục'
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể mở bài học gần đây của khóa học'
            });
        } finally {
            setIsNavigating(false);
        }
    }

    return (
        <div
            style={{
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid #e7e9f0',
                background: '#fff',
                boxShadow: '0 14px 34px rgba(20, 31, 55, 0.08)',
                padding: 10,
                cursor: isNavigating ? 'wait' : 'pointer',
                opacity: isNavigating ? 0.72 : 1,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(event) => {
                event.currentTarget.style.transform = 'translateY(-4px)';
                event.currentTarget.style.boxShadow = '0 20px 42px rgba(20, 31, 55, 0.12)';
                event.currentTarget.style.borderColor = '#cfd7e8';
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'translateY(0)';
                event.currentTarget.style.boxShadow = '0 14px 34px rgba(20, 31, 55, 0.08)';
                event.currentTarget.style.borderColor = '#e7e9f0';
            }}
            onClick={handleContinueCourse}
        >
            <Image
                preview={false}
                src={course?.thumbnail ? `${BASE_URL}/upload/thumbnails/${course.thumbnail}` : undefined}
                width="100%"
                height={168}
                style={{
                    objectFit: 'cover',
                    borderRadius: 14,
                    background: '#eef2f7',
                }}
            />

            <div style={{ padding: '14px 8px 8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Text
                    strong
                    style={{
                        fontSize: 16,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 48,
                        color: 'var(--text-primary-dark)',
                        lineHeight: 1.45,
                    }}
                >
                    {course?.title || 'Khóa học'}
                </Text>
                <Text style={{ color: '#667085', fontSize: 13, marginTop: 4 }}>
                    {formatAuthorsToMentions(course?.authors)}
                </Text>

                <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                        <Progress
                            percent={progress}
                            showInfo={false}
                            strokeColor="var(--primary-color)"
                            trailColor="#edf1f6"
                            strokeWidth={8}
                            style={{ flex: 1, marginBottom: 0 }}
                        />
                        <Text
                            strong
                            style={{
                                minWidth: 38,
                                textAlign: 'right',
                                color: 'var(--primary-color-dark)',
                                fontSize: 13,
                            }}
                        >
                            {progress}%
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyCourseCard;
