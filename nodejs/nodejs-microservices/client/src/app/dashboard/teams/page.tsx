'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetTeamsQuery } from "@/state/api";
import { Users, Plus, UserPlus } from 'lucide-react';
import CreateTeamModal from '@/components/CreateTeamModal';

export default function TeamsPage() {
    const router = useRouter();
    const { data, isLoading } = useGetTeamsQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserRole(user.role);
        }
    }, []);

    const teams = data?.teams || [];

    if(isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const canCreateTeam = userRole === 'ADMIN';

    return (
        <div className="space-y-6">
            {/** Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Teams</h1>
                    <p className="mt-2 text-muted">Manage and collaborate with your teams</p>
                </div>
                {canCreateTeam && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all shadow-lg">
                            <Plus className="h-5 w-5 mr-2" />
                            New Team
                        </button>
                )}
            </div>

            {/** teams grid */}
            {teams.length === 0 ? (
                <div className="text-center py-12 bg-background rounded-xl border border-border">
                    <Users className="h-12 w-12 text-muted mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No teams yet</h3>
                    <p className="text-muted">
                        {canCreateTeam
                            ? 'Create your first team to get started'
                            : 'You arent part of any team yet'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <div
                            key={team._id}
                            className="bg-background rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer"
                            onClick={() => router.push(`/dashboard/teams/${team._id}`)}
                        >
                                {/** team icon */}
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 mb-4">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>

                                {/** team name */}
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {team.name}
                                </h3>

                                {/** team description */}
                                <p className="text-sm text-muted mb-4 line-clamp-2">
                                    {team.description}
                                </p>

                                {/** team stats */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center text-sm text-muted">
                                        <UserPlus className="h-4 w-4 mr-1" />
                                        {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                                    </div>
                                    <span className="text-sm text-primary hover:text-primary-light font-medium">
                                        View Details →
                                    </span>
                                </div>
                            </div>
                    ))}
                </div>
            )}

            {/** create team modal */}
            {isModalOpen && (
                <CreateTeamModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}