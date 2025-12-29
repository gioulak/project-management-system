'use client';

import { useState } from "react";
import { useGetMyTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { Plus, Calendar, User, AlertCircle } from 'lucide-react';
import CreateTaskModal from '@/components/CreateTaskModal';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

const columns: { id: TaskStatus; title:string; color: string }[] = [
    { id: 'TODO', title: 'To Do', color: 'bg-gray-100' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100'},
    { id: 'DONE', title: 'Done', color: 'bg-green-100'},
];

export default function TasksPage() {
    const { data, isLoading } = useGetMyTasksQuery({});
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tasks = data?.tasks || [];

    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter((task) => task.status === status);
    };

    const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
        try {
            await updateTaskStatus({ taskId, status: newStatus }).unwrap();
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch(priority) {
            case 'HIGH':
                return 'bg-red-100 text-red-800';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800';
            case 'LOW':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('el-GR', {
            month: 'short',
            day: 'numeric',
        });
    };

    if(isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/** header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                    <p className="mt-2 text-gray-600">Manage and track your tasks</p>
                </div>
                <button onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-5 w-5 mr-2" />
                    New Task
                </button>
            </div>
            {/** Kanban noard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map((column) => {
                    const colTasks = getTasksByStatus(column.id);
                    
                    return (
                        <div key={column.id} className="flex flex-col">
                            {/** column header */}
                            <div className={`${column.color} rounded-t-lg px-4 py-3 border-b-2 border-border`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                                    <span className="text-sm font-medium text-gray-600 bg-background px-2 py-1 rounded">
                                        {colTasks.length}
                                    </span>
                            </div>
                        </div>

                        {/*** body */}
                        <div className="flex-1 bg-background rounded-b-lg p-4 space-y-3 min-h-[500px]">
                            {colTasks.length === 0 ? (
                                <p className="text-center text-gray-500 text-sm mt-8">No tasks</p>
                            ): (
                                colTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                                            {/** task title */}
                                            <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                                            {/** task descr */}
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {task.description}
                                            </p>

                                            {/** priority */}
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    {task.priority}
                                                </span>
                                            </div>

                                            {/** due date */}
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(task.dueDate)}
                                            </div>

                                            {/** status change btn */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <div className="flex space-x-1">
                                                    {column.id !== 'TODO' && (
                                                        <button
                                                            onClick={() => handleStatusChange(task._id, column.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')}
                                                            className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                                                            >
                                                                ← {column.id === 'DONE' ? 'In Progress' : 'To Do'}
                                                        </button>
                                                    )}
                                                    {column.id !== 'DONE' && (
                                                        <button
                                                            onClick={() => handleStatusChange(task._id, column.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                                                            className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                                                            >
                                                                {column.id === 'TODO' ? 'Start' :
                                                                'Complete'} →
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                ))
                            )}
                        </div>
                    </div>
                    );
                })}
            </div>
            {/** task modal */}
            {isModalOpen && (
                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}