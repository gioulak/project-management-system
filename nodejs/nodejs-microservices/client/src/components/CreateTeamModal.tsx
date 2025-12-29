'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateTeamMutation, useGetUsersQuery } from '@/state/api';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateTeamModal({ isOpen, onClose}:
    CreateTeamModalProps) {
        const [createTeam, { isLoading }] = useCreateTeamMutation();
        const { data: usersData } = useGetUsersQuery();
        const [formData, setFormData] = useState({
            name: '',
            description: '',
            leader: 0,
        });
        const [error, setError] = useState('');

        const users = usersData || [];
        const teamLeaders = users.filter((user) =>
        user.role === 'TEAM_LEADER' || user.role === 'ADMIN');

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');

             console.log('Team API URL:', process.env.NEXT_PUBLIC_TEAM_API_URL);

            if (!formData.leader) {
                setError('Please select a team leader');
                return;
            }

            try {
                await createTeam({
                    name: formData.name,
                    description: formData.description,
                    leader: formData.leader,
                }).unwrap();

                onClose();
                setFormData({
                    name: '',
                    description: '',
                    leader: 0,
                });
            } catch (err: any) {
                setError(err?.data?.message || 'Failed to create team');
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
                            <h3 className="text-lg font-semibold text-gray-900">Create New Team</h3>
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

                            {/** team name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter team name"
                                />
                            </div>
                            {/** description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ting-blue=500"
                                    placeholder="Enter team description"
                                />
                            </div>
                            {/** team leader*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team Leader *
                                </label>
                                <select
                                    required
                                    value={formData.leader}
                                    onChange={(e) => setFormData({ ...formData, leader: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select a team leader</option>
                                        {teamLeaders.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.first_name} {user.last_name} ({user.role})
                                            </option>
                                        ))}
                                    </select>
                                    {teamLeaders.length === 0 && (
                                        <p className='mt-1 text-sm text-gray-500'>
                                            No team leaders available. Promote users first.
                                        </p>
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
                                                disabled={isLoading || teamLeaders.length === 0}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                                                    {isLoading ? 'Creating...' : 'Create Team'}
                                                </button>
                                    </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
