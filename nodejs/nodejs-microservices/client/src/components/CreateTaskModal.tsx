'use client';

import { useState, useEffect } from "react";
import { X } from 'lucide-react';
import { useCreateTaskMutation, useGetTeamsQuery } from "@/state/api";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }:
    CreateTaskModalProps) {
        const [createTask, { isLoading }] = useCreateTaskMutation();
        const { data: teamsData } = useGetTeamsQuery();
        const [formData, setFormData] = useState({
            title: '',
            description: '',
            teamId: '',
            assignedTo: 0,
            priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
            dueDate: '',
        });
        const [error, setError] = useState('');
        const [currentUserId, setCurrentUserId] = useState<number>(0);

        useEffect(() => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                setCurrentUserId(user.id);
                setFormData((prev) => ({ ...prev, assignedTo: user.id }));
            }
        }, []);

        const teams = teamsData?.teams || [];

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');

            if (!formData.teamId) {
                setError('Please select a team');
                return;
            }

            try {
                await createTask({
                    title: formData.title,
                    description: formData.description,
                    teamId: formData.teamId,
                    createdBy: currentUserId,
                    assignedTo: formData.assignedTo,
                    status: 'TODO',
                    priority: formData.priority,
                    dueDate: formData.dueDate,
                }).unwrap();

                onClose();
                setFormData({
                    title: '',
                    description: '',
                    teamId: '',
                    assignedTo: currentUserId,
                    priority: 'MEDIUM',
                    dueDate: '',
                });
            } catch (err: any) {
                setError(err?.data?.message || 'Failed to create task');
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
                            <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
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

                            {/** title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter task title"
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
                                    placeholder="Enter task description"
                                />
                            </div>
                            {/** team */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team *
                                </label>
                                <select
                                    required
                                    value={formData.teamId}
                                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select a team</option>
                                        {teams.map((team) => (
                                            <option key={team._id} value={team._id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/** priority */}
                                <div>
                                    <label className="bolck text-sm font-medium text-gray-700 mb-1">
                                        Priority *
                                    </label>
                                    <select
                                        required
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 riunded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>

                                    {/** due date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Due Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
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
                                                disabled={isLoading}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                                                    {isLoading ? 'Creating...' : 'Create Task'}
                                                </button>
                                    </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }