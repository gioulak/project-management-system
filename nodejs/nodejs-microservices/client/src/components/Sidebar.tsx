'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    UsersRound,
    CheckSquare,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard},
    { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare},
    { name: 'Teams', href: '/dashboard/teams', icon: UsersRound },
    { name: 'Users', href: '/dashboard/users', icon: Users},
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
    };

    return (
        <>
            {/** Mobile menu button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface border border-border shadow-lg"
            >
                {isSidebarOpen ? (
                    <X size={24} className="text-foreground" /> 
                ) : ( 
                    <Menu size={24} className="text-foreground" />
                )}
            </button>

            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border transition-transform duration-300 ease-in-out flex flex-col`}
            >
                {/** Logo */}
                <div className="flex items-center justify-center h-16 px-4 border-b border-border">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">PM System</h1>
                </div>
                
                {/** Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                        pathname.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-muted hover:bg-surface-hover hover:text-foreground'
                                }`}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/** Logout Button */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-danger rounded-lg hover:bg-danger/10 transition-all"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>
            {/** for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
}