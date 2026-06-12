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
    age: number;
    gender: string;
    address: string;
    role?: {
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
    price: number;
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

export interface ICategory {
    _id?: string;
    name: string;
    description?: string;
    slug: string;
    level: number;
    isActive: boolean;
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
        videoUrl?: string;
        duration?: string;
        ytbId?: string;
    };

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IModule {
    _id?: string;
    name: string;
    description?: string;
    order: number;
    isActive?: boolean;
    course: string | ICourse;
    lessons?: ILesson[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

    totalLessons?: number;
    totalLength?: number;
}

export interface ISubscribers {
    _id?: string;
    name?: string;
    email?: string;
    skills: string[];
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}