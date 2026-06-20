import { callCompleteMyLesson, callFetchMyLessonById } from '@/config/api';
import { getYoutubeId } from '@/config/utils';
import { ILesson, IMyLessonDetail } from '@/types/backend';
import {
    CheckCircleOutlined,
    FrownOutlined,
    LeftOutlined,
    MenuOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Button, Collapse, Drawer, Empty, Progress, Skeleton, Space, Typography, notification } from 'antd';
import { type UIEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from 'styles/lesson.module.scss';

const { Text } = Typography;

declare global {
    interface Window {
        YT?: any;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const ClientLessonDetailPage = () => {
    const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
    const [lessonDetail, setLessonDetail] = useState<IMyLessonDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isNavOpen, setIsNavOpen] = useState<boolean>(true);
    const [isLessonDrawerOpen, setIsLessonDrawerOpen] = useState<boolean>(false);
    const [isBottomBarVisible, setIsBottomBarVisible] = useState<boolean>(true);

    const playerRef = useRef<any>(null);
    const playerNodeIdRef = useRef(`youtube-player-${Math.random().toString(36).slice(2)}`);
    const hasHandledVideoEndRef = useRef(false);
    const isUpdatingProgressRef = useRef(false);
    const lastLessonScrollTopRef = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            if (!courseSlug || !lessonId) return;
            setIsLoading(true);
            try {
                const res = await callFetchMyLessonById(courseSlug, lessonId);
                if (res.data) {
                    setLessonDetail(res.data);
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải thông tin bài học'
                });
                setLessonDetail(null);
            } finally {
                setIsLoading(false);
            }
        }

        init();
    }, [courseSlug, lessonId]);

    useEffect(() => {
        setIsBottomBarVisible(true);
        setIsLessonDrawerOpen(false);
        lastLessonScrollTopRef.current = 0;
    }, [lessonId]);

    const lesson = lessonDetail?.lesson || null;
    const module = lessonDetail?.currentModule || null;
    const course = lessonDetail?.course || null;
    const progress = lessonDetail?.progress || null;

    const courseModules = useMemo(() => {
        return [...(lessonDetail?.modules || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [lessonDetail?.modules]);

    const allLessons = useMemo(() => {
        return courseModules.flatMap(moduleItem =>
            [...(moduleItem.lessons || [])]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(item => ({ ...item, moduleName: moduleItem.name }))
        );
    }, [courseModules]);

    const currentIndex = allLessons.findIndex(item => item._id === lesson?._id);
    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
    const activeModuleKey = module?._id || module?.name;

    const youtubeId = lesson?.metadata?.ytbId || getYoutubeId(lesson?.metadata?.videoUrl);
    const hasLessonContent = Boolean(lesson?.content && lesson.content.trim() !== '');

    const handleNavigateLesson = useCallback((target?: ILesson | null) => {
        const targetCourseSlug = course?.slug || courseSlug;
        if (target?._id && targetCourseSlug) {
            setIsLessonDrawerOpen(false);
            navigate(`/my-course/${targetCourseSlug}/${target._id}`);
        }
    }, [course?.slug, courseSlug, navigate]);

    const handleToggleLessonNavigation = useCallback(() => {
        setIsBottomBarVisible(true);
        if (window.innerWidth <= 991) {
            setIsLessonDrawerOpen(true);
            return;
        }
        setIsNavOpen(prev => !prev);
    }, []);

    const handleLessonScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
        if (window.innerWidth > 991) return;

        const currentScrollTop = event.currentTarget.scrollTop;
        const scrollDelta = currentScrollTop - lastLessonScrollTopRef.current;

        if (currentScrollTop < 12) {
            setIsBottomBarVisible(true);
        } else if (scrollDelta > 8) {
            setIsBottomBarVisible(false);
        } else if (scrollDelta < -8) {
            setIsBottomBarVisible(true);
        }

        lastLessonScrollTopRef.current = Math.max(currentScrollTop, 0);
    }, []);

    const handleVideoEnded = useCallback(async () => {
        if (!courseSlug || !lesson?._id || isUpdatingProgressRef.current) return;

        isUpdatingProgressRef.current = true;
        try {
            const res = await callCompleteMyLesson(courseSlug, lesson._id);
            if (res.data) {
                setLessonDetail(prev => prev ? {
                    ...prev,
                    progress: res.data!,
                    modules: prev.modules.map(moduleItem => ({
                        ...moduleItem,
                        lessons: moduleItem.lessons?.map(item => item._id === lesson._id
                            ? { ...item, progressStatus: 'completed' }
                            : item
                        )
                    }))
                } : prev);
            }
            if (nextLesson) {
                handleNavigateLesson(nextLesson);
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật tiến độ bài học'
            });
        } finally {
            isUpdatingProgressRef.current = false;
        }
    }, [courseSlug, lesson?._id, nextLesson, handleNavigateLesson]);

    useEffect(() => {
        if (!youtubeId) return;

        hasHandledVideoEndRef.current = false;

        const createPlayer = () => {
            playerRef.current?.destroy?.();
            playerRef.current = new window.YT.Player(playerNodeIdRef.current, {
                videoId: youtubeId,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    playsinline: 1,
                    rel: 0,
                    modestbranding: 1,
                },
                events: {
                    onStateChange: (event: any) => {
                        if (event.data === window.YT.PlayerState.ENDED && !hasHandledVideoEndRef.current) {
                            hasHandledVideoEndRef.current = true;
                            handleVideoEnded();
                        }
                    },
                },
            });
        }

        if (window.YT?.Player) {
            createPlayer();
        } else {
            const previousReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                previousReady?.();
                createPlayer();
            };

            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                document.body.appendChild(script);
            }
        }

        return () => {
            playerRef.current?.destroy?.();
            playerRef.current = null;
        }
    }, [youtubeId, handleVideoEnded]);

    const renderLessonButton = (item: ILesson, index: number) => {
        const isActive = item._id === lesson?._id;
        return (
            <button
                key={item._id || `${item.name}-${index}`}
                type="button"
                onClick={() => handleNavigateLesson(item)}
                className={`${styles["lesson-nav-item"]} ${isActive ? styles["lesson-nav-item-active"] : ''}`}
            >
                <span className={styles["lesson-nav-index"]}>{index + 1}</span>
                <span className={styles["lesson-nav-title"]}>{item.name}</span>
                {item.progressStatus === 'completed' && <CheckCircleOutlined />}
            </button>
        )
    }

    const renderCourseNavigation = () => (
        <div className={styles["lesson-side-nav-card"]}>
            <div className={styles["lesson-side-nav-header"]}>
                <Text strong>Nội dung khóa học</Text>
                <span>{courseModules.length} module • {allLessons.length} bài học</span>
            </div>

            {courseModules.length > 0 ? (
                <Collapse
                    key={activeModuleKey}
                    defaultActiveKey={activeModuleKey ? [activeModuleKey] : undefined}
                    className={styles["lesson-module-collapse"]}
                    bordered={false}
                    items={courseModules.map((moduleItem) => {
                        const lessons = [...(moduleItem.lessons || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
                        return {
                            key: moduleItem._id || moduleItem.name,
                            label: (
                                <span className={styles["lesson-module-label"]}>
                                    <span>{moduleItem.name}</span>
                                    <small>{lessons.length} bài học</small>
                                </span>
                            ),
                            children: lessons.length > 0
                                ? lessons.map(renderLessonButton)
                                : <Empty description="Module chưa có bài học" />,
                        }
                    })}
                />
            ) : (
                <Empty description="Không có danh sách bài học" />
            )}
        </div>
    )

    const renderLessonVideo = () => (
        <section className={styles["lesson-video-card"]}>
            <div className={styles["lesson-video-frame"]}>
                {youtubeId ? (
                    <div
                        key={youtubeId}
                        id={playerNodeIdRef.current}
                        title={lesson?.name}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    />
                ) : (
                    <div className={styles["lesson-video-empty"]}>
                        <Space direction="vertical" align="center">
                            <FrownOutlined style={{ fontSize: 42, color: 'rgba(255,255,255,0.78)' }} />
                            <Text style={{ color: 'rgba(255,255,255,0.78)' }}>
                                Bài học chưa sẵn sàng!
                            </Text>
                        </Space>
                    </div>
                )}
            </div>
        </section>
    )

    const renderLessonContent = () => hasLessonContent && (
        <section
            className={styles["lesson-content-card"]}
        >
            <div
                className={styles["lesson-content"]}
                dangerouslySetInnerHTML={{ __html: lesson?.content || '' }}
            />
        </section>
    )

    const renderMobileLessonDrawer = () => (
        <Drawer
            title="Nội dung khoá học"
            placement="left"
            open={isLessonDrawerOpen}
            onClose={() => setIsLessonDrawerOpen(false)}
            width="90%"
            className={styles["lesson-mobile-drawer"]}
        >
            <div className={styles["lesson-drawer-progress"]}>
                <span>
                    {progress && `${progress.completedLessonsCount}/${progress.totalLessons} bài học`}
                </span>

                <Progress
                    percent={progress?.coursePercent || 0}
                    strokeColor="var(--primary-color)"
                    trailColor="#edf1f6"
                />
            </div>
            {renderCourseNavigation()}
        </Drawer>
    )

    return (
        <div className={styles["lesson-page"]}>
            <div className={styles["lesson-shell"]}>
                <Skeleton active loading={isLoading} paragraph={{ rows: 8 }}>
                    {!isLoading && !lesson && (
                        <Empty description="Không tìm thấy bài học" />
                    )}

                    {lesson && (
                        <div
                            className={`${styles["lesson-study-layout"]} ${isNavOpen ? styles["lesson-study-layout-open"] : ''}`}
                            onScroll={handleLessonScroll}
                        >
                            <main className={styles["lesson-main-scroll"]}>
                                {renderLessonVideo()}
                                {renderLessonContent()}
                            </main>

                            {isNavOpen && (
                                <aside className={styles["lesson-side-nav"]}>
                                    {renderCourseNavigation()}
                                </aside>
                            )}

                            <div
                                className={`${styles["lesson-bottom-bar"]} ${!isBottomBarVisible ? styles["lesson-bottom-bar-hidden"] : ''}`}
                            >
                                <div className={styles["lesson-bottom-title"]}>
                                    <span>
                                        {progress && `${progress.completedLessonsCount}/${progress.totalLessons} bài học`}
                                    </span>

                                    <div className={styles["lesson-bottom-progress"]}>
                                        <Progress
                                            percent={progress?.coursePercent || 0}
                                            showInfo={true}
                                            strokeColor="var(--primary-color)"
                                            trailColor="#edf1f6"
                                        />
                                    </div>
                                </div>

                                <div className={styles["lesson-bottom-actions"]}>
                                    <Button
                                        disabled={!previousLesson}
                                        onClick={() => handleNavigateLesson(previousLesson)}
                                        shape='round'
                                        size='large'
                                        icon={<LeftOutlined />}
                                    >
                                        Bài trước
                                    </Button>
                                    <Button
                                        type="primary"
                                        disabled={!nextLesson}
                                        onClick={() => handleNavigateLesson(nextLesson)}
                                        style={{ background: 'var(--primary-color)' }}
                                        shape='round'
                                        size='large'
                                    >
                                        <span> Bài tiếp theo <RightOutlined /></span>
                                    </Button>
                                </div>                         

                                <Button
                                    icon={<MenuOutlined />}
                                    onClick={handleToggleLessonNavigation}
                                    className={styles["lesson-bottom-toggle"]}
                                >
                                    <span className={styles["lesson-bottom-toggle-text"]}>
                                        {isNavOpen ? 'Ẩn nội dung' : 'Hiện nội dung'}
                                    </span>
                                </Button>
                            </div>

                            {renderMobileLessonDrawer()}
                        </div>
                    )}
                </Skeleton>
            </div>
        </div>
    )
}

export default ClientLessonDetailPage;
