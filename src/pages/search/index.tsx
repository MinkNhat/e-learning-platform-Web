import CourseCard from '@/components/client/card/course.card';
import { callSearchCourses } from '@/config/api';
import { ICourseSearchResult } from '@/types/backend';
import { BookOutlined, FilterOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Empty, Pagination, Select, Skeleton, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '@/styles/client.module.scss';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const keyword = searchParams.get('q')?.trim() ?? '';
    const [results, setResults] = useState<ICourseSearchResult[]>([]);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('all');
    const [language, setLanguage] = useState('all');
    const [level, setLevel] = useState('all');
    const [rating, setRating] = useState('all');
    const [sort, setSort] = useState('relevant');
    const pageSize = 12;

    useEffect(() => {
        setCurrent(1);
        setCategory('all');
        setLanguage('all');
        setLevel('all');
        setRating('all');
    }, [keyword]);

    useEffect(() => {
        if (!keyword) {
            setResults([]);
            setTotal(0);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            const res = await callSearchCourses(keyword, current, pageSize);
            setResults(res?.data?.result ?? []);
            setTotal(res?.data?.meta?.total ?? 0);
            setLoading(false);
        };
        fetchResults();
    }, [keyword, current]);

    const categoryOptions = useMemo(() => Array.from(new Set(results.map((course) =>
        typeof course.category === 'string' ? course.category : course.category?.name
    ).filter(Boolean))).map((value) => ({ value, label: value })), [results]);
    const languageOptions = useMemo(() => Array.from(new Set(results.flatMap((course) => course.languages ?? [])))
        .map((value) => ({ value, label: value })), [results]);
    const levelOptions = useMemo(() => Array.from(new Set(results.map((course) => course.level).filter(Boolean)))
        .map((value) => ({ value, label: value })), [results]);

    const filteredResults = useMemo(() => {
        const filtered = results.filter((course) => {
            const courseCategory = typeof course.category === 'string' ? course.category : course.category?.name;
            return (category === 'all' || courseCategory === category)
                && (language === 'all' || course.languages?.includes(language))
                && (level === 'all' || course.level === level)
                && (rating === 'all' || (course.rating ?? 0) >= Number(rating));
        });
        return [...filtered].sort((a, b) => {
            if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
            if (sort === 'price-low') return a.price - b.price;
            if (sort === 'price-high') return b.price - a.price;
            return b.matches.length - a.matches.length;
        });
    }, [results, category, language, level, rating, sort]);

    return (
        <main className={`${styles.container} ${styles['home-section']}`} style={{ marginTop: 32, marginBottom: 56 }}>
            <Typography.Title level={2} style={{ marginBottom: 4, color: '#182033' }}>Kết quả tìm kiếm</Typography.Title>
            <Typography.Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 24 }}>
                {keyword ? <>Khám phá {total} khóa học phù hợp với <strong>“{keyword}”</strong></> : 'Nhập từ khóa để tìm khóa học, nội dung module và bài học.'}
            </Typography.Paragraph>

            {!!keyword && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '14px 0 22px', borderTop: '1px solid #e7e9f0' }}>
                <Space wrap size={[10, 10]}>
                    <Select value={category} onChange={setCategory} style={{ minWidth: 158 }} suffixIcon={<FilterOutlined />} options={[{ value: 'all', label: 'Tất cả bộ lọc' }, ...categoryOptions]} />
                    <Select value={language} onChange={setLanguage} style={{ minWidth: 132 }} options={[{ value: 'all', label: 'Ngôn ngữ' }, ...languageOptions]} />
                    <Select value={level} onChange={setLevel} style={{ minWidth: 120 }} options={[{ value: 'all', label: 'Cấp độ' }, ...levelOptions]} />
                    <Select value={rating} onChange={setRating} style={{ minWidth: 132 }} options={[{ value: 'all', label: 'Xếp hạng' }, { value: '4', label: 'Từ 4 sao' }, { value: '3', label: 'Từ 3 sao' }]} />
                </Space>
                <Select value={sort} onChange={setSort} style={{ minWidth: 160 }} options={[{ value: 'relevant', label: 'Liên quan nhất' }, { value: 'rating', label: 'Đánh giá cao' }, { value: 'price-low', label: 'Giá thấp đến cao' }, { value: 'price-high', label: 'Giá cao đến thấp' }]} />
            </div>}

            {loading ? <div className={styles['course-grid']}>{Array.from({ length: 6 }).map((_, index) => <Skeleton.Node key={index} active style={{ width: '100%', height: 480, borderRadius: 18 }} />)}</div>
                : !keyword ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn muốn học gì hôm nay?" />
                    : filteredResults.length === 0 ? <Empty description="Không tìm thấy khóa học phù hợp với bộ lọc hiện tại." />
                        : <div className={styles['course-grid']}>
                            {filteredResults.map((course) => {
                                const hasSearchMatches = course.matches.some((match) => match.type !== 'course');
                                return <div
                                    key={course._id}
                                    style={hasSearchMatches ? {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: 18,
                                        boxShadow: '0 14px 34px rgba(20, 31, 55, 0.08)',
                                    } : undefined}
                                >
                                    <CourseCard course={course} hasSearchMatches={hasSearchMatches} onClick={() => navigate(`/course/${course.slug}`)} />
                                    <MatchPanel matches={course.matches} keyword={keyword} />
                                </div>;
                            })}
                        </div>}

            {!!keyword && total > pageSize && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <Pagination current={current} total={total} pageSize={pageSize} onChange={setCurrent} disabled={loading} />
            </div>}
        </main>
    );
};

const MatchPanel = ({ matches, keyword }: { matches: ICourseSearchResult['matches']; keyword: string }) => {
    const contentMatches = matches.filter((match) => match.type !== 'course');
    const visibleMatches = contentMatches.slice(0, 3);
    if (!visibleMatches.length) return null;

    const remainingMatches = contentMatches.length - visibleMatches.length;
    return <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px 16px 16px', border: '1px solid #e7e9f0', borderTop: '1px solid #edf0f3', borderRadius: '0 0 18px 18px', background: '#fff' }}>
        <div style={{ flex: 1, display: 'grid', alignContent: 'start', gap: 8, padding: 12, borderRadius: 12, background: '#f6f9f7' }}>
            {visibleMatches.map((match) => <div key={`${match.type}-${match.id}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#4f5f57', fontSize: 14 }}>
                {match.type === 'lesson'
                    ? <PlayCircleOutlined style={{ color: '#00a65a', marginTop: 2 }} />
                    : <BookOutlined style={{ color: '#00a65a', marginTop: 2 }} />}
                <span>{match.title}</span>
            </div>)}
        </div>
        {remainingMatches > 0 && <Typography.Text type="secondary" style={{ display: 'block', marginTop: 'auto', paddingTop: 12, fontSize: 13 }}>
            Khám phá thêm {remainingMatches} kết quả phù hợp về “{keyword}”
        </Typography.Text>}
    </div>;
};

export default SearchPage;
