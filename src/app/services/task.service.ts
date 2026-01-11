import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus, TaskPriority, TaskFilter, TaskSortBy, SortDirection } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<Task[]>(this.generateMockTasks());
  private searchQuery = signal<string>('');
  private filterBy = signal<TaskFilter>('ALL');
  private sortBy = signal<TaskSortBy>('createdAt');
  private sortDirection = signal<SortDirection>('desc');

  readonly allTasks = this.tasks.asReadonly();
  readonly filteredAndSortedTasks = computed(() => {
    let result = [...this.tasks()];

    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    const filter = this.filterBy();
    if (filter !== 'ALL') {
      result = result.filter((task) => task.status === filter);
    }

    const sortByField = this.sortBy();
    const direction = this.sortDirection();
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortByField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          const aDate = a.dueDate?.getTime() ?? 0;
          const bDate = b.dueDate?.getTime() ?? 0;
          comparison = aDate - bDate;
          break;
        case 'priority':
          const priorityOrder: Record<TaskPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  readonly taskStats = computed(() => {
    const tasks = this.tasks();
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    };
  });

  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): boolean {
    const taskIndex = this.tasks().findIndex((t) => t.id === id);
    if (taskIndex === -1) return false;

    this.tasks.update((tasks) => {
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
      };
      return updatedTasks;
    });
    return true;
  }

  deleteTask(id: string): boolean {
    const initialLength = this.tasks().length;
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
    return this.tasks().length < initialLength;
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks().find((t) => t.id === id);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setFilter(filter: TaskFilter): void {
    this.filterBy.set(filter);
  }

  setSort(sortBy: TaskSortBy, direction: SortDirection): void {
    this.sortBy.set(sortBy);
    this.sortDirection.set(direction);
  }

  private generateId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMockTasks(): Task[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    return [
      {
        id: '1',
        title: 'Complete Angular project setup',
        description: 'Set up the initial Angular project structure with all necessary dependencies',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        dueDate: yesterday,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-05'),
      },
      {
        id: '2',
        title: 'Implement task service with signals',
        description: 'Create a task service using Angular signals for reactive state management',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: tomorrow,
        createdAt: new Date('2026-01-05'),
        updatedAt: new Date('2026-01-10'),
      },
      {
        id: '3',
        title: 'Design task list UI',
        description: 'Create mockups and design the user interface for the task list page',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        dueDate: tomorrow,
        createdAt: new Date('2026-01-06'),
        updatedAt: new Date('2026-01-09'),
      },
      {
        id: '4',
        title: 'Write unit tests',
        description: 'Implement comprehensive unit tests for all components and services',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: nextWeek,
        createdAt: new Date('2026-01-07'),
        updatedAt: new Date('2026-01-07'),
      },
      {
        id: '5',
        title: 'Add form validation',
        description: 'Implement proper form validation for the task edit modal',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: nextWeek,
        createdAt: new Date('2026-01-08'),
        updatedAt: new Date('2026-01-08'),
      },
      {
        id: '6',
        title: 'Implement search functionality',
        description: 'Add search capability to filter tasks by title and description',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: null,
        createdAt: new Date('2026-01-09'),
        updatedAt: new Date('2026-01-09'),
      },
      {
        id: '7',
        title: 'Add accessibility features',
        description: 'Ensure all components are accessible with proper ARIA labels and keyboard navigation',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: nextWeek,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-01-10'),
      },
    ];
  }
}
