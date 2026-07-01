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
        GET_ROOT: { method: "GET", apiPath: '/api/v1/categories/root', module: "CATEGORIES" },
        GET_DETAIL: { method: "GET", apiPath: '/api/v1/categories/:id', module: "CATEGORIES" },
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
    QUIZZES: {
        GET_DETAIL: { method: "GET", apiPath: '/api/v1/quizzes/:id', module: "QUIZZES" },
        GET_MANAGE: { method: "GET", apiPath: '/api/v1/quizzes/:id/manage', module: "QUIZZES" },
        CREATE: { method: "POST", apiPath: '/api/v1/quizzes', module: "QUIZZES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/quizzes/:id', module: "QUIZZES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/quizzes/:id', module: "QUIZZES" },
        CREATE_QUESTION: { method: "POST", apiPath: '/api/v1/quizzes/questions', module: "QUIZZES" },
        UPDATE_QUESTION: { method: "PATCH", apiPath: '/api/v1/quizzes/questions/:id', module: "QUIZZES" },
        DELETE_QUESTION: { method: "DELETE", apiPath: '/api/v1/quizzes/questions/:id', module: "QUIZZES" },
    },
    BLOGS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/blogs/manage', module: "BLOGS" },
        CREATE: { method: "POST", apiPath: '/api/v1/blogs', module: "BLOGS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/blogs/:id', module: "BLOGS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/blogs/:id', module: "BLOGS" },
    },
    ENROLLMENTS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/enrollments', module: "ENROLLMENTS" },
        CREATE: { method: "POST", apiPath: '/api/v1/enrollments', module: "ENROLLMENTS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/enrollments/:id', module: "ENROLLMENTS" },
    },
    ORDERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/orders', module: "ORDERS" },
        GET_DETAIL: { method: "GET", apiPath: '/api/v1/orders/:id', module: "ORDERS" },
    },
    PAYMENTS: {
        CREATE: { method: "POST", apiPath: '/api/v1/payments/create', module: "PAYMENTS" },
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/payments', module: "PAYMENTS" },
    },
    DASHBOARD: {
        GET_STATS: { method: "GET", apiPath: '/api/v1/dashboard/stats', module: "DASHBOARD" },
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
    DASHBOARD: 'DASHBOARD',
    PERMISSIONS: 'PERMISSIONS',
    ROLES: 'ROLES',
    USERS: 'USERS',
    COURSES: 'COURSES',
    CATEGORIES: 'CATEGORIES',
    MODULES: 'MODULES',
    LESSONS: 'LESSONS',
    QUIZZES: 'QUIZZES',
    BLOGS: 'BLOGS',
    COMMENTS: 'COMMENTS',
    ENROLLMENTS: 'ENROLLMENTS',
    ORDERS: 'ORDERS',
    PAYMENTS: 'PAYMENTS',
    ME: 'ME',
}
