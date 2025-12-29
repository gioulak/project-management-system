'use client';

import { useEffect, useState } from "react";
import { useGetUsersQuery, useActivateUserMutation, useUpdateUserRoleMutation } from "@/state/api";
import { User, Shield, UserCheck, UserX} from 'lucide-react';

export default function UsersPage() {
    const { data: users, isLoading} = useGetUsersQuery();
    const [activateUser] = useActivateUserMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if(userData) {
            const user = JSON.parse(userData);
            setUserRole(user.role);
        }
    }, []);

    const handleActive = async (userId: number) => {
        try {
            await activateUser(userId).unwrap();
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
           await updateUserRole({ userId, role: newRole }).unwrap(); 
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    if(userRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <Shield className="h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
                <p className="text-gray-600">You dont have permission to view this page.</p>
            </div>
        );
    }

    if(isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-800';
            case 'TEAM_LEADER':
                return 'bg-blue-100 text-blue-800';
            case 'MEMBER':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-bray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/** header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="mt-2 text-gray-600">Mange users, roles and permissions</p>
            </div>
            {/** users table */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                            {user.first_name.charAt(0)}
                                            {user.last_name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">@{user.username}</div>
                                        </div>
                                    </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className={`text-xs font-medium px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)} border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        >
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="TEAM_LEADER">TEAM_LEADER</option>
                                            <option value="MEMBER">MEMBER</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.is_active ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <UserCheck className="h-3 w-3 mr-1" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                <UserX className="h-3 w-3 mr-1" />
                                                Inactive
                                            </span>
                                        )}

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {!user.is_active && (
                                            <button
                                                onClick={() => handleActive(user.id)}
                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                            >
                                                Activate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/** stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                            <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Activate Users</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users?.filter((u) => u.is_active).length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                            <Shield className="h-6 w-7 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text=gray-900">
                                {users?.filter((u) => u.role === 'ADMIN').length || 0}
                            </p>
                        </div>
                    </div>
                </div>
        </div>
        </div>
    );
}