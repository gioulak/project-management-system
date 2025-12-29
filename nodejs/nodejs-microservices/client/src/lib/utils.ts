import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString('el-GR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getPriorityColor(priority: 'LOW' | 'MEDIUM' | 'HIGH') {
    switch (priority) {
        case 'HIGH':
            return 'text-red-600 bg-red-100';
        case 'MEDIUM':
            return 'text-yellow-600 bg-yellow-100';
        case 'LOW':
            return 'text-green-600 bg-green-100';
    }
}

export function getStatusColor(status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    switch(status) {
        case 'TODO':
            return 'text-gary-600 bg-gray-100';
        case 'IN_PROGRESS':
            return 'text-blue-600 bg-blue-100';
        case 'DONE':
            return 'text-green-600 bg-green-100';
    }
}