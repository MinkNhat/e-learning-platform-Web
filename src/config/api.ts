import { IBackendRes, IAccount, IUser, IModelPaginate, IGetAccount, ICourse, ICourseSearchResult, IPermission, IRole, IModule, ILesson, ICategory, ICreatePayment, IResponsePayment, IEnrollment, IMyLessonDetail, IBlog, IComment, IQuiz, IQuestion, IQuizAttempt, IDashboardStats, IPayment } from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', file);
    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folderType
        },
    });
}

/**
 * 
Module User
 */
export const callCreateUser = (user: Partial<IUser>) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (user: Partial<IUser>, id: string) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/users/${id}`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

/**
 * 
Module Course
 */
export const callCreateCourse = (course: ICourse) => {
    const formData = new FormData();
    Object.entries(course).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => { formData.append(`${key}[]`, item) });
        } else {
            formData.append(key, value);
        }
    });

    return axios.post<IBackendRes<ICourse>>('/api/v1/courses', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const callUpdateCourse = (course: ICourse, id: string) => {
    const formData = new FormData();
    Object.entries(course).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            if (value.length === 0) {
                formData.append(`${key}[]`, ''); 
            } else {
                value.forEach((item) => { 
                    formData.append(`${key}[]`, item); 
                });
            }
        } 
        else {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        }
    });

    return axios.patch<IBackendRes<ICourse>>(`/api/v1/courses/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export const callDeleteCourse = (id: string) => {
    return axios.delete<IBackendRes<ICourse>>(`/api/v1/courses/${id}`);
}

export const callFetchCourse = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICourse>>>(`/api/v1/courses?${query}`);
}

export const callSearchCourses = (keyword: string, page = 1, limit = 12) => {
    const params = new URLSearchParams({ q: keyword, page: String(page), limit: String(limit) });
    return axios.get<IBackendRes<IModelPaginate<ICourseSearchResult>>>(`/api/v1/courses/search?${params.toString()}`);
}

export const callSearchCourseSuggestions = (keyword: string, limit = 6) => {
    const params = new URLSearchParams({ q: keyword, page: '1', limit: String(limit), scope: 'course' });
    return axios.get<IBackendRes<IModelPaginate<ICourseSearchResult>>>(`/api/v1/courses/search?${params.toString()}`);
}

export const callFetchCourseById = (id: string) => {
    return axios.get<IBackendRes<ICourse>>(`/api/v1/courses/${id}`);
}

export const callFetchCourseForManage = (id: string) => {
    return axios.get<IBackendRes<ICourse>>(`/api/v1/courses/${id}/manage`);
}

/**
 * 
Module Category
 */
export const callCreateCategory = (category: ICategory) => {
    return axios.post<IBackendRes<ICategory>>('/api/v1/categories', { ...category })
}

export const callUpdateCategory = (category: ICategory, id: string) => {
    return axios.patch<IBackendRes<ICategory>>(`/api/v1/categories/${id}`, { ...category })
}

export const callDeleteCategory = (id: string) => {
    return axios.delete<IBackendRes<ICategory>>(`/api/v1/categories/${id}`);
}

export const callFetchCategory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICategory>>>(`/api/v1/categories?${query}`);
}

export const callFetchCategoryById = (id: string) => {
    return axios.get<IBackendRes<ICategory>>(`/api/v1/categories/${id}`);
}

export const callFetchRootCategory = (query: string) => {
    return axios.get<IBackendRes<ICategory[]>>(`/api/v1/categories/root?${query}`);
}

export const callFetchChildCategory = (categoryIdOrSlug: string) => {
    return axios.get<IBackendRes<ICategory[]>>(`/api/v1/categories/${categoryIdOrSlug}/children`);
}

/**
 * 
Module Module
 */
export const callCreateModule = (module: IModule) => {
    return axios.post<IBackendRes<IModule>>(`/api/v1/modules`, { ...module })
}

export const callUpdateModule = (module: IModule, moduleId: string) => {
    return axios.patch<IBackendRes<IModule>>(`/api/v1/modules/${moduleId}`, { ...module })
}

export const callDeleteModule = (moduleId: string) => {
    return axios.delete<IBackendRes<IModule>>(`/api/v1/modules/${moduleId}`);
}

/**
 * 
Module Lesson
 */
export const callCreateLesson = (lesson: ILesson) => {
    return axios.post<IBackendRes<ILesson>>(`/api/v1/lessons`, { ...lesson })
}

export const callUpdateLesson = (lesson: ILesson, lessonId: string) => {
    return axios.patch<IBackendRes<ILesson>>(`/api/v1/lessons/${lessonId}`, { ...lesson })
}

export const callDeleteLesson = (lessonId: string) => {
    return axios.delete<IBackendRes<ILesson>>(`/api/v1/lessons/${lessonId}`);
}

/**
 * 
Module Blog
 */
export const callFetchBlogs = (query = '') => {
    return axios.get<IBackendRes<IModelPaginate<IBlog>>>(`/api/v1/blogs?${query}`);
};

export const callFetchBlogsForManage = (query = '') => {
    return axios.get<IBackendRes<IModelPaginate<IBlog>>>(`/api/v1/blogs/manage?${query}`);
};

export const callFetchBlog = (idOrSlug: string) => {
    return axios.get<IBackendRes<IBlog>>(`/api/v1/blogs/${idOrSlug}`);
};

export const callCreateBlog = (blog: IBlog) => {
    const formData = new FormData();
    Object.entries(blog).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as any);
        }
    });

    return axios.post<IBackendRes<IBlog>>('/api/v1/blogs', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const callUpdateBlog = (id: string, blog: Partial<IBlog>) => {
    const formData = new FormData();
    Object.entries(blog).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as any);
        }
    });

    return axios.patch<IBackendRes<IBlog>>(`/api/v1/blogs/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const callDeleteBlog = (id: string) => {
    return axios.delete<IBackendRes<IBlog>>(`/api/v1/blogs/${id}`);
};


/** Module Comment */
export const callFetchComments = (targetType: IComment['targetType'], targetId: string, current = 1, pageSize = 10) => {
    return axios.get<IBackendRes<IModelPaginate<IComment>>>(`/api/v1/comments?targetType=${targetType}&targetId=${targetId}&current=${current}&pageSize=${pageSize}`);
};

export const callCreateComment = (comment: Pick<IComment, 'targetType' | 'targetId' | 'content' | 'parent'>) => {
    return axios.post<IBackendRes<IComment>>('/api/v1/comments', comment);
};

export const callUpdateComment = (id: string, content: string) => {
    return axios.patch<IBackendRes<IComment>>(`/api/v1/comments/${id}`, { content });
};

export const callDeleteComment = (id: string) => {
    return axios.delete<IBackendRes<IComment>>(`/api/v1/comments/${id}`);
};


/** Module Quiz */
export const callCreateQuiz = (quiz: IQuiz) => {
    return axios.post<IBackendRes<IQuiz>>('/api/v1/quizzes', quiz);
};

export const callUpdateQuiz = (id: string, quiz: Partial<IQuiz>) => {
    return axios.patch<IBackendRes<IQuiz>>(`/api/v1/quizzes/${id}`, quiz);
};

export const callDeleteQuiz = (id: string) => {
    return axios.delete<IBackendRes<IQuiz>>(`/api/v1/quizzes/${id}`);
};

export const callFetchQuiz = (id: string) => {
    return axios.get<IBackendRes<IQuiz>>(`/api/v1/quizzes/${id}`);
};

export const callFetchQuizForManage = (id: string) => {
    return axios.get<IBackendRes<IQuiz>>(`/api/v1/quizzes/${id}/manage`);
};


export const callCreateQuestion = (question: IQuestion) => {
    return axios.post<IBackendRes<IQuestion>>('/api/v1/quizzes/questions', question);
};

export const callUpdateQuestion = (id: string, question: Partial<IQuestion>) => {
    return axios.patch<IBackendRes<IQuestion>>(`/api/v1/quizzes/questions/${id}`, question);
};

export const callDeleteQuestion = (id: string) => {
    return axios.delete<IBackendRes<IQuestion>>(`/api/v1/quizzes/questions/${id}`);
};


export const callStartQuizAttempt = (quizId: string) => {
    return axios.post<IBackendRes<{ attempt: IQuizAttempt; quiz: IQuiz; questions: IQuestion[] }>>(`/api/v1/quizzes/${quizId}/attempts`);
};

export const callSaveQuizAnswer = (attemptId: string, questionId: string, answer: { selectedOptionIds?: string[]; textAnswer?: string }) => {
    return axios.put<IBackendRes<unknown>>(`/api/v1/quizzes/attempts/${attemptId}/answers/${questionId}`, answer);
};

export const callSubmitQuizAttempt = (attemptId: string) => {
    return axios.post<IBackendRes<unknown>>(`/api/v1/quizzes/attempts/${attemptId}/submit`);
};

export const callFetchMyQuizAttempts = (quizId: string) => {
    return axios.get<IBackendRes<IQuizAttempt[]>>(`/api/v1/quizzes/${quizId}/attempts/me`);
};


/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.patch<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`, { ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.patch<IBackendRes<IRole>>(`/api/v1/roles/${id}`, { ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

/**
 * 
Module Payment
 */
export const callCreatePayment = (payment: ICreatePayment) => {
    return axios.post<IBackendRes<IResponsePayment>>('/api/v1/payments/create', { ...payment })
}

export const callFetchPayments = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPayment>>>(`/api/v1/payments?${query}`);
}

/**
 * 
Module Me
 */
export const callFetchMyCourses = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IEnrollment>>>(`/api/v1/me/courses?${query}`)
}

export const callFetchMyRecentLesson = (courseSlug: string) => {
    return axios.get<IBackendRes<ILesson>>(`/api/v1/me/courses/${courseSlug}/continue`)
}

export const callFetchMyLessonById = (courseSlug: string, lessonId: string) => {
    return axios.get<IBackendRes<IMyLessonDetail>>(`/api/v1/me/lessons/${lessonId}?course=${courseSlug}`);
}

export const callCompleteMyLesson = (courseSlug: string, lessonId: string) => {
    return axios.patch<IBackendRes<IMyLessonDetail['progress']>>(`/api/v1/me/lessons/${lessonId}/complete?course=${courseSlug}`);
}

export const callCheckEnrollment = (courseId: string, userId: string) => {
    return axios.get<IBackendRes<{ isEnrolled: boolean }>>(`/api/v1/enrollments/check?courseId=${courseId}&userId=${userId}`);
}

export const callEnrollFreeCourse = (courseId: string) => {
    return axios.post<IBackendRes<IEnrollment>>('/api/v1/enrollments/free', { courseId });
}

export const callFetchEnrollments = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IEnrollment>>>(`/api/v1/enrollments?${query}`);
}

export const callCreateEnrollment = (payload: { userId: string; courseId: string }) => {
    return axios.post<IBackendRes<IEnrollment>>('/api/v1/enrollments', payload);
}

/**
 * 
Module Dashboard
 */
export const callFetchDashboardStats = () => {
    return axios.get<IBackendRes<IDashboardStats>>('/api/v1/dashboard/stats');
}
