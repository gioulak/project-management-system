'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useGetTeamQuery, useGetUsersQuery, useAddTeamMemberMutation } from "@/state/api";
import { Users, UserPlus, ArrowLeft, Trash2 } from 'lucide-react';
import AddMemberModal from '@/components/AddMemberModal';

export default function TeamDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.id as string;

    const { data: teamData, isLoading: teamLoading } = useGetTeamQuery(teamId);
    const { data: usersData } = useGetUsersQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if(userData) {
            const user = JSON.parse(userData);
            setUserRole(user.role);
        }
    }, []);

    const team = teamData?.team;
    const allUsers = usersData || [];

    //get members details
    const members = allUsers.filter((user) => team?.members.includes(user.id));
    const leader = allUsers.find((user) => user.id === team?.leader);

    const canManageTeam = userRole === 'ADMIN' || (team && userRole === 'TEAM_LEADER');

    if(teamLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-border"></div>
            </div>
        );
    }

    if(!team) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold text-muted mb-2">Team not found</h2>
                <button
                    onClick={() => router.push('/dashboard/teams')}
                    className="text-muted hover:text-blue-700"
                >
                    Back To Teams
        
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/** header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.push('/dashboard/teams')}
                    className="p-2 hover:bg-background rounded-lg transition-colors">
                    <ArrowLeft className="h-5 w-5 text-muted" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                    <p className="mt-2 text-gray-600">{team.description}</p>
                </div>
            </div>
            {canManageTeam && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-background rounded-lg hover:bg-background transition-colors">
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add Member
                    </button>
            )}
            </div>
            {/** team info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background rounded-lg shadow p-6 border border-border">
                    <div className="flex items-center">
                        <div className="flex shrink-0 bg-background rounded-lg p-3">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Members</p>
                            <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-background rounded-lg shadow p-6 border border-border">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-background rounded-lg p-3">
                            <UserPlus className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Team Leader</p>
                            <p className="text-lg font-bold text-gray-900">
                                {leader ? `${leader.first_name} ${leader.last_name}`: 'Unknown'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-background rounded-lg shadow p-6 border border-border">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-background rounded-lg p-3">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Activate Members</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {members.filter((m) => m.is_active).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/** members list */}
            <div className="bg-background rounded-lg shadow border border-border">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-muted">Team Members</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {members.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No members yet. Add members to get started.</p>
                        </div>
                    ) : (
                        members.map((member) => (
                            <div key={member.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                        {member.first_name.charAt(0)}
                                        {member.last_name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {member.first_name} {member.last_name}
                                            {member.id === team.leader && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                    Leader
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {member.email} • @{member.username}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            member.role === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-800'
                                            : member.role === 'TEAM_LEADER'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}
                                    >
                                        {member.role}
                                    </span>
                                    {canManageTeam && member.id !== team.leader && (
                                        <button
                                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                                            title="Remove member"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
                            {isModalOpen && (
                                <AddMemberModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    teamId={teamId}
                                    currentMembers={team.members}
                                />
                             )}
                        </div>
                    );
}

                           
