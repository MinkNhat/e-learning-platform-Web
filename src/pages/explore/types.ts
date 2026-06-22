import type { ICourse } from '@/types/backend';
import type { ReactNode } from 'react';

export type CourseListState = {
    latest: ICourse[];
    popular: ICourse[];
    totalLatest: number;
    totalPopular: number;
};

export type Instructor = {
    id: string;
    name: string;
    title: string;
    avatar?: string;
    rating: number;
    learners: string;
    courses: string;
};

export type RoleCard = {
    id: string;
    title: string;
    description: string;
    img: string;
};

export type PathCard = {
    id: string;
    title: string;
    description: string;
    image: string;
    skills: Array<{
        label: string;
        icon: ReactNode;
        progress: number;
    }>;
};
