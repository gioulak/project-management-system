'use client';

import React, { useState } from "react";
import { X } from 'lucide-react';
import { useAddTeamMemberMutation, useGetUsersQuery } from "@/state/api";

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamId: string;
    currentMembers: number[];
}

export default function AddMemberModal({ isOpen, onClose, teamId, currentMembers }: AddMemberModalProps) {
    const [addMemebr, { isLoading }] = useAddTeamMemberMutation();
    const { data: usersData } = useGetUsersQuery();
    const [selectedUserId, setSelectedUserId] = useState<number>(0);
    const [error, setError ] = useState('');

    const allUsers = usersData || [];

    //filter users who are members
    const availableUsers = allUsers.filter(
        (user) => !currentMembers.includes(user.id) && user.is_active
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if(!selectedUserId) {
            setError('Please select a user');
            return;
        }

        try {
            await addMemebr({ teamId, userId: selectedUserId }).unwrap();
            onClose();
            setSelectedUserId(0);
        } catch (err: any) {
            setError(err?.data?.message || 'Failed to add member');
        }
    };

    if(!isOpen) return null;

    return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/** backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={onClose}
                />
                {/** modal */}
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        {/** header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add Team Member</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                        </div>

                        {/** form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red text-red-800 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/** user selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select User *
                                </label>
                                {availableUsers.length === 0 ? (
                                    <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                                        No available users to add. All active users are already members of this team.
                                    </div>
                                ): (
                                    <select
                                        required
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Choose a user...</option>
                                        {availableUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.first_name} {user.last_name} ({user.role}) - @{user.username}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                </div>

                                    {/** buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading || availableUsers.length === 0}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                                                    {isLoading ? 'Adding...' : 'Add Member'}
                                                </button>
                                    </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    
}