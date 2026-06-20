export const ALL_PERMISSIONS = {
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
    },
    ROLES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/roles/:id', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/:id', module: "ROLES" },
    },
    USERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/users/:id', module: "USERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/users/:id', module: "USERS" },
    },
    COURSES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/courses', module: "COURSES" },
        GET_MANAGE: { method: "GET", apiPath: '/api/v1/courses/:id/manage', module: "COURSES" },
        CREATE: { method: "POST", apiPath: '/api/v1/courses', module: "COURSES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/courses/:id', module: "COURSES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/courses/:id', module: "COURSES" },
    },
    CATEGORIES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/categories', module: "CATEGORIES" },
        CREATE: { method: "POST", apiPath: '/api/v1/categories', module: "CATEGORIES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/categories/:id', module: "CATEGORIES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/categories/:id', module: "CATEGORIES" },
    },
    MODULES: {
        CREATE: { method: "POST", apiPath: '/api/v1/modules', module: "MODULES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/modules/:id', module: "MODULES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/modules/:id', module: "MODULES" },
    },
    LESSONS: {
        CREATE: { method: "POST", apiPath: '/api/v1/lessons', module: "LESSONS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/lessons/:id', module: "LESSONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/lessons/:id', module: "LESSONS" },
    },
    PAYMENTS: {
        CREATE: { method: "POST", apiPath: '/api/v1/payments/create', module: "PAYMENTS" },
    },
    ME: {
        GET_MY_COURSES: { method: "GET", apiPath: '/api/v1/me/courses', module: "ME" },
        GET_MY_RECENT_LESSON: { method: "GET", apiPath: '/api/v1/me/courses/:courseSlug/continue', module: "ME" },
        GET_MY_LESSON: { method: "GET", apiPath: '/api/v1/me/lessons/:lessonId', module: "ME" },
        COMPLETE_MY_LESSON: { method: "PATCH", apiPath: '/api/v1/me/lessons/:lessonId/complete', module: "ME" },
    }
}

export const ALL_MODULES = {
    AUTH: 'AUTH',
    FILES: 'FILES',
    PERMISSIONS: 'PERMISSIONS',
    ROLES: 'ROLES',
    USERS: 'USERS',
    SUBSCRIBERS: 'SUBSCRIBERS',
    COURSES: 'COURSES',
    CATEGORIES: 'CATEGORIES',
    MODULES: 'MODULES',
    LESSONS: 'LESSONS',
    PAYMENTS: 'PAYMENTS',
    ME: 'ME',
}
