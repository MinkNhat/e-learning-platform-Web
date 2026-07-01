export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IModelPaginate<T> {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}

export interface IAccount {
    access_token: string;
    user: {
        _id: string;
        email: string;
        name: string;
        role: {
            _id: string;
            name: string;
        }
        permissions: {
            _id: string;
            name: string;
            apiPath: string;
            method: string;
            module: string;
        }[]
    }
}

export interface IGetAccount extends Omit<IAccount, "access_token"> { }


export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role?: string | {
        _id: string;
        name: string;
    }

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICourse {
    _id?: string;
    title: string;
    shortDescription: string;
    description: string;
    objectives: string[];
    requirement: string;
    price: number | null;
    slug?: string;
    thumbnail?: string;
    level: string;
    rating?: number;
    enrollmentCount?: number;
    isProcessLimit?: boolean;
    languages: string[];
    authors: {
        _id: string; 
        name: string;
        avatar?: string;
    }[];
    isPublished?: boolean;
    modules?: IModule[];
    category: string | ICategory;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

    totalLessons?: number;
    totalLength?: number;
}

export type ICourseSearchMatch = {
    type: 'course' | 'lesson';
    field: 'title' | 'name';
    id: string;
    title: string;
};

export type ICourseSearchResult = ICourse & {
    matches: ICourseSearchMatch[];
};

export interface ICategory {
    _id?: string;
    name: string;
    description?: string;
    slug?: string;
    level?: number;
    isActive?: boolean;
    parent?: ICategory | string;
    icon?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPermission {
    _id?: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

}

export interface IRole {
    _id?: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ILesson {
    _id?: string;
    name: string;
    content?: string;
    isActive?: boolean;
    isFree?: boolean;
    order?: number;
    type: 'video' | 'article';
    module?: string | IModule;
    metadata?: {
        duration?: number;
        durationString?: string;
        videoUrl?: string;
        ytbId?: string;
    };
    progressStatus?: 'not_started' | 'in_progress' | 'completed';
    completedAt?: string;
    lastAccessedAt?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IQuiz {
    _id?: string;
    type: 'quiz';
    title: string;
    description?: string;
    module?: string | IModule;
    order: number;
    isActive?: boolean;
    isFree?: boolean;
    timeLimitSeconds?: number;
    passingScore?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    showResultAfterSubmit?: boolean;
    questions?: IQuestion[];
}

export type ICourseLessonItem = Omit<ILesson, 'type'> & { type: 'lesson'; lessonType: 'video' | 'article' };
export type ICourseItem = ICourseLessonItem | IQuiz;

export interface IModule {
    _id?: string;
    name: string;
    description?: string;
    order: number;
    isActive?: boolean;
    course?: string | ICourse;
    items?: ICourseItem[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

    totalLessons?: number;
    totalLength?: number;
}

export interface IMyLessonDetail {
    lesson: ILesson;
    currentModule: IModule;
    course: Pick<ICourse, '_id' | 'title' | 'slug' | 'thumbnail' | 'totalLessons' | 'totalLength'>;
    modules: IModule[];
    progress: {
        coursePercent: number;
        completedLessonsCount: number;
        totalLessons: number;
        currentLessonStatus: 'not_started' | 'in_progress' | 'completed';
    };
}

export interface IEnrollment {
    _id?: string;
    course: string | ICourse;
    user?: string | Pick<IUser, '_id' | 'name' | 'email'>;
    order?: string | IOrder;
    isActive?: boolean;
    progress: number;
    completedLessonsCount?: number;
    totalLessonsSnapshot?: number;
    lastLesson?: string | ILesson;
    lastAccessedAt?: string;
    enrolDate: string;
    completedDate?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IOrder {
    _id?: string;
    user: string | Pick<IUser, '_id' | 'name' | 'email'>;
    course: string | Pick<ICourse, '_id' | 'title' | 'price'>;
    amount: number;
    currency?: string;
    payment?: string | IPayment;
    status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreatePayment {
    courseId: string;
    provider: string;
}

export interface IResponsePayment {
    paymentUrl: string;
    orderId: string;
}

export interface IPayment {
    _id?: string;
    order: string | IOrder;
    user: string | Pick<IUser, '_id' | 'name' | 'email'>;
    provider: string;
    amount: number;
    currency?: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
    createdAt?: string;
    updatedAt?: string;
}

export interface IDashboardStats {
    users: number;
    courses: number;
    publishedCourses: number;
    draftCourses: number;
    blogs: number;
    enrollments: number;
    orders: number;
    payments: number;
}

export interface IBlog {
    _id?: string;
    title: string;
    slug?: string;
    description?: string;
    content: string;
    coverImage?: string | File;
    author?: string | Pick<IUser, '_id' | 'name'> & { avatar?: string };
    category: string | ICategory;
    status?: 'draft' | 'published' | 'archived';
    publishedAt?: string;
    isFeatured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IComment {
    _id?: string;
    targetType: 'blog' | 'course';
    targetId: string;
    content: string;
    author?: string | Pick<IUser, '_id' | 'name'> & { avatar?: string };
    parent?: string | IComment;
    replies?: IComment[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IQuestionOption { 
    _id?: string; 
    content: string; 
    isCorrect?: boolean; 
    order: number; 
}

export interface IQuestion { 
    _id?: string; 
    quiz?: string; 
    type: 'single_choice' | 'multi_choice' | 'true_false' | 'fill_blank'; 
    content: string; 
    explanation?: string; 
    points?: number; 
    order: number; 
    options?: IQuestionOption[]; 
    acceptedAnswers?: string[]; 
    caseSensitive?: boolean; 
}

export interface IQuizAttempt { 
    _id?: string; 
    quiz: string | IQuiz; 
    status: 'in_progress' | 'submitted' | 'expired'; 
    attemptNumber: number; 
    score?: number; 
    maxScore?: number; 
    percentage?: number; 
    passed?: boolean; 
    startedAt?: string; 
    submittedAt?: string; 
}
