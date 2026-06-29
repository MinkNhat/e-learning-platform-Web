import CategorySection from '@/components/client/section/category.section';
import CourseSection from '@/components/client/section/course.section';
import RecentCourseSection from '@/components/client/section/recent-course.section';
import { callFetchCourse } from '@/config/api';
import { ICourse } from '@/types/backend';
import { Award01Icon, BulbIcon, PlayCircleIcon, SketchIcon } from '@/config/hugeicons';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import styles from 'styles/client.module.scss';

const HomePage = () => {
    const [highlightCourses, setHighlightCourses] = useState<ICourse[] | null>(null);
    const [isLoadingHighlightCourses, setIsLoadingHighlightCourses] = useState<boolean>(false);
    const [freeCourses, setFreeCourses] = useState<ICourse[] | null>(null);
    const [isLoadingFreeCourses, setIsLoadingFreeCourses] = useState<boolean>(false);
    const user = useAppSelector(state => state.account.user);

    const aiCareerBenefits = [
        { icon: <SketchIcon />, title: 'Tìm hiểu về AI và nhiều chủ đề khác', color: '#c9bcff' },
        { icon: <Award01Icon />, title: 'Luyện thi chứng chỉ', color: '#b9ecd5' },
        { icon: <PlayCircleIcon />, title: 'Thực hành huấn luyện AI', color: '#ffe1a8' },
        { icon: <BulbIcon />, title: 'Thăng tiến sự nghiệp của chính bạn', color: '#c9f2ee' },
    ];

    useEffect(() => {
        fetchHighlightCourses();
        fetchFreeCourses();
    }, [user._id]);

    const fetchHighlightCourses = async () => {
        setIsLoadingHighlightCourses(true);
        const res = await callFetchCourse('current=1&pageSize=4&sort=-updatedAt');
        if (res && res.data) {
            setHighlightCourses(res.data.result);
        }
        setIsLoadingHighlightCourses(false);
    }

    const fetchFreeCourses = async () => {
        setIsLoadingFreeCourses(true);

        const freeCourseFilter = encodeURIComponent(JSON.stringify({
            $or: [{ price: null }, { price: 0 }],
        }));

        const enrollmentFilter = user._id ? `&excludeEnrolled=true&userId=${encodeURIComponent(user._id)}`: '';
        
        const res = await callFetchCourse(`current=1&pageSize=4&sort=-updatedAt&filter=${freeCourseFilter}${enrollmentFilter}`);
        if (res && res.data) {
            setFreeCourses(res.data.result);
        }
        setIsLoadingFreeCourses(false);
    }

    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`} style={{ paddingTop: 28, paddingBottom: 56 }}>
            <div style={{ display: 'grid', gap: 42 }}>
                {/* Top Banner Section */}
                <section
                    className={styles["career-ai-banner"]}
                    style={{
                        background: '#202230',
                        borderRadius: 28,
                        color: '#fff',
                        overflow: 'hidden',
                        padding: '24px 72px',
                    }}
                >
                    <div className={styles["career-ai-banner-content"]} style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'center' }}>
                        <div>
                            <Typography.Title
                                level={1}
                                className={styles["career-ai-banner-title"]}
                                style={{
                                    color: '#fff',
                                    fontSize: 32,
                                    lineHeight: 1.15,
                                    letterSpacing: 0,
                                    margin: 0,
                                    maxWidth: 540,
                                }}
                            >
                                Tái định hình sự nghiệp của bạn trong thời đại AI
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: 'rgba(255, 255, 255, 0.72)',
                                    fontSize: 14,
                                    lineHeight: 1.7,
                                    margin: '18px 0 0',
                                    maxWidth: 600,
                                }}
                            >
                                Chuẩn bị kỹ năng cho tương lai với Gói Cá nhân. Truy cập nhiều nội dung mới từ các chuyên gia trong ngành.
                            </Typography.Paragraph>

                            <div className={styles["career-ai-benefits"]} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '28px 44px', marginTop: 42 }}>
                                {aiCareerBenefits.map((item) => (
                                    <div key={item.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <span
                                            style={{
                                                width: 30,
                                                height: 30,
                                                flex: '0 0 30px',
                                                borderRadius: '50%',
                                                display: 'grid',
                                                placeItems: 'center',
                                                background: item.color,
                                                color: '#202230',
                                                fontSize: 17,
                                                marginTop: 2,
                                            }}
                                        >
                                            {item.icon}
                                        </span>
                                        <Typography.Text style={{ color: '#fff', fontSize: 14, lineHeight: 1.45, fontWeight: 500 }}>
                                            {item.title}
                                        </Typography.Text>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles["career-ai-banner-visual"]} style={{ minWidth: 0 }}>
                            <img
                                src="/bento-banner.png"
                                alt="Học kỹ năng AI với nội dung bento trực quan"
                                style={{ width: '90%', display: 'block', objectFit: 'contain', margin: '0 auto' }}
                            />
                        </div>
                    </div>
                </section>

                <CourseSection
                    title='Khoá học nổi bật'
                    courses={highlightCourses}
                    isLoading={isLoadingHighlightCourses}
                />

                <RecentCourseSection />

                <CourseSection
                    title='Khoá học miễn phí dành cho bạn'
                    courses={freeCourses}
                    isLoading={isLoadingFreeCourses}
                />

                <CategorySection />
            </div>
        </div>
    )
}

export default HomePage;
