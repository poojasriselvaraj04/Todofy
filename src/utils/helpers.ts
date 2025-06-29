import { Task, TaskFilters } from '../types';
import { isToday, isPast, isFuture } from 'date-fns';

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Due date filter
    if (filters.dueDate && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      switch (filters.dueDate) {
        case 'today':
          if (!isToday(dueDate)) return false;
          break;
        case 'overdue':
          if (!isPast(dueDate) || isToday(dueDate)) return false;
          break;
        case 'upcoming':
          if (!isFuture(dueDate)) return false;
          break;
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
};

export const paginateTasks = (tasks: Task[], page: number, itemsPerPage: number) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    tasks: tasks.slice(startIndex, endIndex),
    totalPages: Math.ceil(tasks.length / itemsPerPage),
    totalItems: tasks.length
  };
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'in-progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'pending':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};