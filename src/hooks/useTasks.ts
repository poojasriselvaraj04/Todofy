import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilters } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const dummyTasks: Task[] = [
  {
    id: '1',
    title: 'Project Planning & Requirements Gathering',
    description: 'Define project scope, gather requirements from stakeholders, create project timeline and resource allocation plan.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    userId: '1',
    sharedWith: ['team.lead@company.com']
  },
  {
    id: '2',
    title: 'System Architecture Design',
    description: 'Design system architecture, database schema, API endpoints, and technology stack selection.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-01-25'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-25'),
    userId: '1',
    sharedWith: ['architect@company.com']
  },
  {
    id: '3',
    title: 'UI/UX Design & Prototyping',
    description: 'Create wireframes, mockups, and interactive prototypes. Design user interface components and user experience flow.',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-02-05'),
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-02-05'),
    userId: '1',
    sharedWith: ['designer@company.com']
  },
  {
    id: '4',
    title: 'Backend Development - Core APIs',
    description: 'Develop REST APIs, implement authentication, database models, and core business logic functionality.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2024-02-20'),
    createdAt: new Date('2024-02-06'),
    updatedAt: new Date('2024-02-15'),
    userId: '1',
    sharedWith: ['backend.dev@company.com']
  },
  {
    id: '5',
    title: 'Frontend Development - User Interface',
    description: 'Build responsive frontend components, implement state management, integrate with backend APIs.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2024-02-25'),
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-18'),
    userId: '1',
    sharedWith: ['frontend.dev@company.com']
  },
  {
    id: '6',
    title: 'Testing & Quality Assurance',
    description: 'Perform unit testing, integration testing, user acceptance testing, and bug fixes.',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-03-05'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    userId: '1',
    sharedWith: ['qa.tester@company.com']
  },
  {
    id: '7',
    title: 'Deployment & DevOps Setup',
    description: 'Set up CI/CD pipeline, configure production environment, deploy application to cloud infrastructure.',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-03-10'),
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25'),
    userId: '1',
    sharedWith: ['devops@company.com']
  },
  {
    id: '8',
    title: 'Documentation & Project Handover',
    description: 'Create technical documentation, user manuals, API documentation, and conduct knowledge transfer sessions.',
    status: 'pending',
    priority: 'low',
    dueDate: new Date('2024-03-15'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    userId: '1',
    sharedWith: ['tech.writer@company.com']
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  const loadTasks = useCallback(() => {
    if (!user) return;
    
    const storedTasks = localStorage.getItem('todofy_tasks');
    let allTasks: Task[] = [];
    
    if (storedTasks) {
      allTasks = JSON.parse(storedTasks);
    } else {
      // Initialize with dummy tasks if no tasks exist
      allTasks = dummyTasks;
      localStorage.setItem('todofy_tasks', JSON.stringify(dummyTasks));
    }
    
    // Filter tasks for current user or shared with user
    const userTasks = allTasks.filter(task => 
      task.userId === user.id || task.sharedWith.includes(user.email)
    );
    
    setTasks(userTasks);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'sharedWith'>) => {
    if (!user) return;

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      sharedWith: []
    };

    const storedTasks = localStorage.getItem('todofy_tasks');
    const allTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    const updatedTasks = [...allTasks, newTask];
    
    localStorage.setItem('todofy_tasks', JSON.stringify(updatedTasks));
    setTasks(prev => [...prev, newTask]);
    addToast('Task created successfully', 'success');
  }, [user, addToast]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const storedTasks = localStorage.getItem('todofy_tasks');
    const allTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    
    const updatedTasks = allTasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    
    localStorage.setItem('todofy_tasks', JSON.stringify(updatedTasks));
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
    addToast('Task updated successfully', 'success');
  }, [addToast]);

  const deleteTask = useCallback(async (id: string) => {
    const storedTasks = localStorage.getItem('todofy_tasks');
    const allTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    
    const updatedTasks = allTasks.filter(task => task.id !== id);
    
    localStorage.setItem('todofy_tasks', JSON.stringify(updatedTasks));
    setTasks(prev => prev.filter(task => task.id !== id));
    addToast('Task deleted successfully', 'success');
  }, [addToast]);

  const shareTask = useCallback(async (taskId: string, email: string) => {
    const storedTasks = localStorage.getItem('todofy_tasks');
    const allTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    
    const updatedTasks = allTasks.map(task => 
      task.id === taskId 
        ? { ...task, sharedWith: [...task.sharedWith, email] }
        : task
    );
    
    localStorage.setItem('todofy_tasks', JSON.stringify(updatedTasks));
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, sharedWith: [...task.sharedWith, email] }
        : task
    ));
    addToast(`Task shared with ${email}`, 'success');
  }, [addToast]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    shareTask,
    refreshTasks: loadTasks
  };
};