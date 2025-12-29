import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'ADMIN' | 'TEAM_LEADER' | 'MEMBER';
    is_active: boolean;
    created_at: string;
}

export interface Team {
    _id: string;
    name: string;
    description: string;
    leader: number;
    members: number[];
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    teamId: string;
    createdBy: number;
    assignedTo: number;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: string;
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    text: string;
    userId: number;
    createdAt: string;
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: async (args, api, extraOptions) => {
        //
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

        if(typeof args === 'object' && args.url) {
            if (args.url.includes('/api/teams')) {
                baseUrl = process.env.NEXT_PUBLIC_TEAM_API_URL || 'http://localhost:8081';
            } else if (args.url.includes('/api/tasks')) {
                baseUrl = process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8082';
            }
        }
        const result = await fetchBaseQuery({
            baseUrl,
            prepareHeaders: (headers) => {
                const token = localStorage.getItem('accessToken');
                if(token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                return  headers;
            },
        })(args, api, extraOptions);

        return result;
    },
    tagTypes: ['Users', 'Teams', 'Tasks'],
    endpoints: (builder) => ({
        //auth endpoints
        signin: builder.mutation<{ accessToken: string; user: User }, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/api/auth/signin',
                method: 'POST',
                body: credentials,
            }),
        }),
        signup: builder.mutation<{ message: string; userId: number }, Omit<User, 'id' | 'role' | 'is_active' | 'created_at'> & { password: string }>({
            query: (userData) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body: userData,
            }),
        }),
        getProfile: builder.query<{ user: User }, void>({
            query: () => '/api/auth/profile',
            providesTags: ['Users'],
        }),
        //user management (admin)
        getUsers: builder.query<User[], void>({
            query: () => '/api/admin/users',
            providesTags: ['Users',]
        }),
        activateUser: builder.mutation<{ message: string }, number>({
            query: (userId) => ({
                url: `/api/admin/users/${userId}/activate`,
                method: 'PUT',
            }),
            invalidatesTags: ['Users'],
        }),
        updateUserRole: builder.mutation<{ message: string }, { userId: number; role: string }>({
            query: ({ userId, role }) => ({
                url: `/api/admin/users/${userId}/role`,
                method: 'PUT',
                body: { role },
            }),
            invalidatesTags: ['Users'],
        }),

        //team endpoints
        getTeams: builder.query<{ teams: Team[] }, void>({
            query: () => ({
                url: '/api/teams',
                //baseUrl: process.env.NEXT_PUBLIC_TEAM_API_URL || 'http://localhost:8081',
            }),
            providesTags: ['Teams'],
        }),
        getTeam: builder.query<{ team: Team }, string>({
            query: (teamId) => ({
                url: `/api/teams/${teamId}`,
                //baseUrl: process.env.NEXT_PUBLIC_TEAM_API_URL || 'http://localhost:8081',
            }),
            providesTags: [ 'Teams'],
        }),
        createTeam: builder.mutation<{ team: Team }, { name: string; description: string; leader: number }>({
            query: (teamData) => ({
                url: '/api/teams',
                method: 'POST',
                body: teamData,
                //baseUrl: process.env.NEXT_PUBLIC_TEAM_API_URL || 'http://localhost:8081',
            }),
            invalidatesTags: ['Teams'],
        }),
        addTeamMember: builder.mutation<{ team: Team }, { teamId: string; userId: number }>({
            query: ({ teamId, userId}) => ({
                url: `/api/teams/${teamId}/members`,
                method: 'POST',
                body: { userId },
                //baseUrl: process.env.NEXT_PUBLIC_TEAM_API_URL || 'http://localhost:8081',
            }),
            invalidatesTags: ['Teams'],
        }),

        //task endpoints
        getTasks: builder.query<{ tasks: Task[] }, { teamId?: string; status?: string }>({
            query: (params) => ({
                url: '/api/tasks',
                params,
                //baseUrl:  process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8082',
            }),
            providesTags: ['Tasks'],
        }),
        getMyTasks: builder.query<{ tasks: Task[] }, { status?: string }>({
            query: (params) => ({
                url: '/api/tasks/my-tasks',
                params,
                //baseUrl: process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8082',
            }),
            providesTags: ['Tasks'],
        }),
        createTask: builder.mutation<{ task: Task }, Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'comments'>>({
            query: (taskData) => ({
                url: '/api/tasks',
                method: 'POST',
                body: taskData,
                //baseUrl: process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8082',
            }),
            invalidatesTags: ['Tasks'],
        }),
        updateTaskStatus: builder.mutation<{ task: Task }, { taskId: string; status: string}>({
            query: ({ taskId, status }) => ({
                url: `/api/tasks/${taskId}/status`,
                method: 'PATCH',
                body: { status },
                //baseUrl: process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8082',
            }),
            invalidatesTags: ['Tasks'],
        }),
        addComment: builder.mutation<{ task: Task }, { taskId: string; text: string}>({
            query: ({ taskId, text }) => ({
                url: `/api/tasks/${taskId}/comments`,
                method: 'POST',
                body: { text },
                //baseUrl: process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8082',
            }),
            invalidatesTags: ['Tasks'],
        }),
    }),
});

export const {
    useSigninMutation,
    useSignupMutation,
    useGetProfileQuery,
    useGetUsersQuery,
    useActivateUserMutation,
     useUpdateUserRoleMutation,
    useGetTeamsQuery,
    useGetTeamQuery,
    useCreateTeamMutation,
    useAddTeamMemberMutation,
    useGetTasksQuery,
    useGetMyTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useAddCommentMutation,
} = api;