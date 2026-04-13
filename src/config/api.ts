import { IBackendRes, IAccount, IUser, IModelPaginate, IGetAccount, ICourse, IPermission, IRole, ISubscribers, IModule, ILesson } from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
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
Module Company
 */
// export const callCreateCompany = (name: string, address: string, description: string, logo: string) => {
//     return axios.post<IBackendRes<ICompany>>('/api/v1/companies', { name, address, description, logo })
// }

// export const callUpdateCompany = (id: string, name: string, address: string, description: string, logo: string) => {
//     return axios.patch<IBackendRes<ICompany>>(`/api/v1/companies/${id}`, { name, address, description, logo })
// }

// export const callDeleteCompany = (id: string) => {
//     return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
// }

// export const callFetchCompany = (query: string) => {
//     return axios.get<IBackendRes<IModelPaginate<ICompany>>>(`/api/v1/companies?${query}`);
// }

// export const callFetchCompanyById = (id: string) => {
//     return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
// }


/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (user: IUser, id: string) => {
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
    return axios.post<IBackendRes<ICourse>>('/api/v1/courses', { ...course })
}

export const callUpdateCourse = (course: ICourse, id: string) => {
    return axios.patch<IBackendRes<ICourse>>(`/api/v1/courses/${id}`, { ...course })
}

export const callDeleteCourse = (id: string) => {
    return axios.delete<IBackendRes<ICourse>>(`/api/v1/courses/${id}`);
}

export const callFetchCourse = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICourse>>>(`/api/v1/courses?${query}`);
}

export const callFetchCourseById = (id: string) => {
    return axios.get<IBackendRes<ICourse>>(`/api/v1/courses/${id}`);
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
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers', { ...subs })
}

export const callGetSubscriberSkills = () => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers/skills')
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
    return axios.patch<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, { ...subs })
}

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(`/api/v1/subscribers?${query}`);
}

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

