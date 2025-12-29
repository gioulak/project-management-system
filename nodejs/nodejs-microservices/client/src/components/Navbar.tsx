'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, X } from 'lucide-react';
import { User as UserType } from '@/state/api';
import { useGetMyTasksQuery, useGetTeamsQuery, useGetUsersQuery } from '@/state/api';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    //gather data for search bar
    const { data: tasksData } = useGetMyTasksQuery({});
    const { data: teamsData } = useGetTeamsQuery();
    const { data: usersData } = useGetUsersQuery();
    
    const tasks = tasksData?.tasks || [];
    const teams = teamsData?.teams || [];
    const users = usersData || [];

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if(userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-accent/20 text-accent';
            case 'TEAM_LEADER':
                return 'bg-primary/20 text-primary';
            case 'MEMBER':
                return 'bg-success/20 text-success';
            default:
                return 'bg-mured/20 text-muted';
        }
    };

    //search filterss
    const filterTasks = tasks.filter((task) => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const filterTeams = teams.filter((team) => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) || team.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const filterUsers = users.filter((user) => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()) || `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()));

    const res = filterTasks.length > 0 || filterTeams.length > 0 || filterUsers.length > 0;

    const handleTask = (id: string) => {
        router.push('/dashboard/tasks');
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const handleTeam = (id: string) => {
        router.push(`/dashboard/teams/${id}`);
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const handleUser = (id: string) => {
        router.push('/dashboard/users');
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    
    

    return (
        <div className="sticky top-0 z-10 bg-surface border-b border-border backdrop-blur-sm bg-opacity-95">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                {/** Search bar */}
                <div className="flex-1 max-w-lg relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform - translate-y-1/2 h-5 w-5 text-muted" />
                        <input
                            type="text"
                            placeholder="Search tasks, teams, users"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearchOpen(e.target.value.length > 0);
                            }}
                            onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
                            className="w-full pl-10 pr-4 py-2 bg-input border border-input-border rounded-lg text-foreground placeholder-muted focus:border-primary focus:ring-2 focus:ring-bprimary/20 transition-smooth"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setIsSearchOpen(false);
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {isSearchOpen && searchQuery && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsSearchOpen(false)}
                            />

                            <div className="absolute top-full left-0 righ-0 mt-2 bg-surface border border-border rounded-lg shadow-xl max-h-96 overflow-y-auto z-20">
                                {!res ? (
                                    <div className="px-4 py-8 text-center text-muted">
                                        No results found for "{searchQuery}"
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        {filterTasks.length > 0 && (
                                            <div className="mb-2">
                                                <div className="px-4 py-2 text-xs font-semibold text-muted uppercase">
                                                    Tasks ({filterTasks.slice(0, 5).length})
                                                </div>
                                                {filterTasks.slice(0, 5).map((task) => (
                                                    <button
                                                        key={task._id}
                                                        onClick={() => handleTask(task._id)}
                                                        className="w-full px-4 py-2 gover:bg-surface-hover transition-colors text-left"
                                                    >
                                                        <div className="font-medium text-foreground text-sm">{task.title}</div>
                                                        <div className="text-xs text-muted line-clamp-1">{task.description}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {filterTeams.length > 0 && (
                                            <div className="mb-2">
                                                <div className="px-4 py-2 text-xs font-semibold text-muted uppercase">
                                                    Teams ({filterTeams.slice(0, 5).length})
                                                </div>
                                                {filterTeams.slice(0, 5).map((team) => (
                                                    <button
                                                        key={team._id}
                                                        onClick={() => handleTeam(team._id)}
                                                        className="w-full px-4 py-2 gover:bg-surface-hover transition-colors text-left"
                                                    >
                                                        <div className="font-medium text-foreground text-sm">{team.name}</div>
                                                        <div className="text-xs text-muted line-clamp-1">{team.description}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {filterUsers.length > 0 && user?.role === 'ADMIN' && (
                                            <div>
                                                <div className="px-4 py-2 text-xs font-semibold text-muted uppercase">
                                                    Users ({filterUsers.slice(0, 5).length})
                                                </div>
                                                {filterUsers.slice(0, 5).map((usr) => (
                                                    <button
                                                        key={usr.id}
                                                        onClick={() => handleUser}
                                                        className="w-full px-4 py-2 gover:bg-surface-hover transition-colors text-left"
                                                    >
                                                        <div className="font-medium text-foreground text-sm">{usr.first_name} {usr.last_name}</div>
                                                        <div className="text-xs text-muted">@{usr.username} • {usr.email}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            {/** Right section */}
            <div className="flex items-center space-x-4 ml-4">
                {/** Notifications */}
                <button className="relative p-2 text-muted hover:text-foreground rounded-lg hover:bg-surface-hover transition-all">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full ring-2 ring-surface"></span>
                </button>
                {/** User profile */}
                {user && (
                    <div className="flex items-center space-x-3 pl-4 border-l border-border">
                        <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                                {user.first_name} {user.last_name}
                            </p>
                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                                {user.role}
                            </span>
                        </div>
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-primary text-white font-medium shadow-lg">
                            {getInitials(user.first_name, user.last_name)}
                        </div>
                    </div> 
                )}
            </div>
            </div>
        </div>
    );
}