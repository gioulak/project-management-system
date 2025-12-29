'use client';

import { useEffect, useState } from "react";
import { useGetMyTasksQuery, useGetTeamsQuery } from "@/state/api";
import { CheckSquare, Clock, CheckCircle, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
    const { data: tasksData } = useGetMyTasksQuery({});
    const { data: teamsData } = useGetTeamsQuery();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if(userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const tasks = tasksData?.tasks || [];
    const teams = teamsData?.teams || [];

    const stats = [
        {
            name: 'Total Tasks',
            value: tasks.length,
            icon: CheckSquare,
            gradient: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-500',
        },
        {
            name: 'In Progress',
            value: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
            icon: Clock,
            gradient: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-500/10',
            textColor: 'text-yellow-500',
        },
        {
            name: 'Completed',
            value: tasks.filter((t) => t.status === 'DONE').length,
            icon: CheckCircle,
            gradient: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-500/10',
            textColor: 'text-green-500',
        },
        {
            name: 'Teams',
            value: teams.length,
            icon: Users,
            gradient: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-500',
        },
    ];

    const completRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0;

    return (
        <div className="space-y-8">
            {/** welcome header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-account rounded-2xl p-8 shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.first_name}!
                    </h1>
                    <p className=" text-blue-100">
                    Here are your projects.
                    </p>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16"></div>
                
            </div>

            {/** Stats grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-surface rounded-xl shadow-lg p-6 border border-border hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted mb-1">
                                            {stat.name}
                                        </p>
                                        <p className="text-3xl font-bold text-foreground">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                                    </div>
                                </div>
                            </div>
                    );
                })}
            </div>
            {/** complete rate */}
            <div className="bg-surface rounded-xl shadow-lg p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        <h3 className="text-lg font-semibold text-foreground">Task Completion</h3>
                    </div>
                    <span className="text-2xl font-bold text-success">{completRate}%</span>
                </div>
                <div className="w-full bg-surface-hover rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-success to-green-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completRate}%` }}
                ></div>
                </div>
            </div>

            {/** recent tasks */}
            <div className="bg-surface rounded-xl shadow-lg border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-surface-hover">
                    <h2 className="text-lg font-semibold text-foreground">My Recent Tasks</h2>
                </div>
                <div className="divide-y divide-border">
                    {tasks.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <CheckSquare className="h-12 w-12 text-muted mx-auto mb-3 opacity-50" />
                            <p className="text-muted">No tasks assigned to you</p>
                        </div>
                    ) : (
                        tasks.slice(0, 5).map((task) => (
                            <div key={task._id} className="px-6 py-4 hover:bg-surface-hover transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-foreground mb-1">
                                            {task.title}
                                        </h3>
                                        <p className="text-sm text-muted line-clamp-1">
                                            {task.description}
                                        </p>
                                    </div>
                                    <div className="ml-4 flex items-center space-x-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                task.status === 'DONE'
                                                ? 'bg-success/20 text-success'
                                                : task.status === 'IN_PROGRESS'
                                                ? 'bg-primary/20 text-primary0'
                                                : 'bg-muted/20 text-muted'
                                            }`}
                                        >
                                            {task.status.replace('_', ' ')}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                task.priority === 'HIGH'
                                                ? 'bg-danger/20 text-danger'
                                                : task.priority === 'MEDIUM'
                                                ? 'bg-warning/20 text-warning'
                                                : 'bg-success/20 text-success'
                                            }`}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}