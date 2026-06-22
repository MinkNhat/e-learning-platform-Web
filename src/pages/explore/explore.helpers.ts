import { callFetchCourse } from '@/config/api';
import type { ICourse } from '@/types/backend';
import { mockInstructors } from './explore.data';
import type { CourseListState, Instructor } from './types';

export const emptyCourseListState: CourseListState = {
    latest: [],
    popular: [],
    totalLatest: 0,
    totalPopular: 0,
};

export const fetchCoursesByCategoryIds = async (categoryIds: string[], sortQuery: string) => {
    const uniqueIds = Array.from(new Set(categoryIds.filter(Boolean)));

    if (!uniqueIds.length) return { result: [] as ICourse[], total: 0 };

    const responses = await Promise.all(
        uniqueIds.map((id) => callFetchCourse(`current=1&pageSize=4&category=${id}&${sortQuery}`)),
    );

    const mergedCourses = new Map<string, ICourse>();
    let total = 0;

    responses.forEach((res) => {
        const coursePage = res?.data;
        total += coursePage?.meta?.total ?? 0;
        coursePage?.result?.forEach((course) => {
            mergedCourses.set(course._id || course.slug || course.title, course);
        });
    });

    return {
        result: Array.from(mergedCourses.values()).slice(0, 4),
        total,
    };
};

export const buildInstructors = (courses: ICourse[]): Instructor[] => {
    const authorMap = new Map<string, Instructor>();

    courses.forEach((course) => {
        course.authors?.forEach((author) => {
            const key = author._id || author.name;

            if (!authorMap.has(key)) {
                authorMap.set(key, {
                    id: key,
                    name: author.name,
                    title: typeof course.category === 'string' ? course.title : course.category?.name || course.title,
                    avatar: author.avatar,
                    rating: course.rating || 4.7,
                    learners: `${(course.enrollmentCount || 0).toLocaleString('vi-VN')} học viên`,
                    courses: '1 khóa học',
                });
                return;
            }

            const current = authorMap.get(key);
            if (current) {
                const courseCount = Number.parseInt(current.courses, 10) || 1;
                authorMap.set(key, {
                    ...current,
                    courses: `${courseCount + 1} khóa học`,
                });
            }
        });
    });

    return [...authorMap.values(), ...mockInstructors]
        .filter((author, index, list) => list.findIndex((item) => item.id === author.id) === index)
        .slice(0, 4);
};
