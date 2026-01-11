import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { TaskStatus, TaskPriority } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
  });

  describe('Initial State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have mock tasks on initialization', () => {
      const tasks = service.allTasks();
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should calculate task stats correctly', () => {
      const stats = service.taskStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('todo');
      expect(stats).toHaveProperty('inProgress');
      expect(stats).toHaveProperty('completed');
      expect(stats.total).toBe(stats.todo + stats.inProgress + stats.completed);
    });
  });

  describe('CRUD Operations', () => {
    it('should create a new task', () => {
      const initialCount = service.allTasks().length;
      const newTask = service.createTask({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null
      });

      expect(newTask).toBeTruthy();
      expect(newTask.id).toBeTruthy();
      expect(newTask.title).toBe('Test Task');
      expect(service.allTasks().length).toBe(initialCount + 1);
    });

    it('should update an existing task', () => {
      const tasks = service.allTasks();
      const taskToUpdate = tasks[0];
      const updatedTitle = 'Updated Title';

      const result = service.updateTask(taskToUpdate.id, { title: updatedTitle });
      expect(result).toBe(true);

      const updatedTask = service.getTaskById(taskToUpdate.id);
      expect(updatedTask?.title).toBe(updatedTitle);
      expect(updatedTask?.updatedAt).toBeInstanceOf(Date);
    });

    it('should not update non-existent task', () => {
      const result = service.updateTask('non-existent-id', { title: 'Test' });
      expect(result).toBe(false);
    });

    it('should delete a task', () => {
      const tasks = service.allTasks();
      const taskToDelete = tasks[0];
      const initialCount = tasks.length;

      const result = service.deleteTask(taskToDelete.id);
      expect(result).toBe(true);
      expect(service.allTasks().length).toBe(initialCount - 1);
      expect(service.getTaskById(taskToDelete.id)).toBeUndefined();
    });

    it('should not delete non-existent task', () => {
      const initialCount = service.allTasks().length;
      const result = service.deleteTask('non-existent-id');
      expect(result).toBe(false);
      expect(service.allTasks().length).toBe(initialCount);
    });

    it('should get task by id', () => {
      const tasks = service.allTasks();
      const firstTask = tasks[0];
      const foundTask = service.getTaskById(firstTask.id);

      expect(foundTask).toBeTruthy();
      expect(foundTask?.id).toBe(firstTask.id);
    });

    it('should return undefined for non-existent task id', () => {
      const task = service.getTaskById('non-existent-id');
      expect(task).toBeUndefined();
    });
  });

  describe('Search Functionality', () => {
    it('should filter tasks by search query in title', () => {
      service.setSearchQuery('Angular');
      const filteredTasks = service.filteredAndSortedTasks();
      
      expect(filteredTasks.length).toBeGreaterThan(0);
      filteredTasks.forEach(task => {
        expect(
          task.title.toLowerCase().includes('angular') ||
          task.description.toLowerCase().includes('angular')
        ).toBe(true);
      });
    });

    it('should filter tasks by search query in description', () => {
      service.setSearchQuery('service');
      const filteredTasks = service.filteredAndSortedTasks();
      
      expect(filteredTasks.length).toBeGreaterThan(0);
      filteredTasks.forEach(task => {
        expect(
          task.title.toLowerCase().includes('service') ||
          task.description.toLowerCase().includes('service')
        ).toBe(true);
      });
    });

    it('should return all tasks when search query is empty', () => {
      service.setSearchQuery('');
      const filteredTasks = service.filteredAndSortedTasks();
      expect(filteredTasks.length).toBe(service.allTasks().length);
    });

    it('should be case insensitive', () => {
      service.setSearchQuery('ANGULAR');
      const filteredTasks = service.filteredAndSortedTasks();
      expect(filteredTasks.length).toBeGreaterThan(0);
    });
  });

  describe('Filter Functionality', () => {
    it('should filter tasks by TODO status', () => {
      service.setFilter(TaskStatus.TODO);
      const filteredTasks = service.filteredAndSortedTasks();
      
      filteredTasks.forEach(task => {
        expect(task.status).toBe(TaskStatus.TODO);
      });
    });

    it('should filter tasks by IN_PROGRESS status', () => {
      service.setFilter(TaskStatus.IN_PROGRESS);
      const filteredTasks = service.filteredAndSortedTasks();
      
      filteredTasks.forEach(task => {
        expect(task.status).toBe(TaskStatus.IN_PROGRESS);
      });
    });

    it('should filter tasks by COMPLETED status', () => {
      service.setFilter(TaskStatus.COMPLETED);
      const filteredTasks = service.filteredAndSortedTasks();
      
      filteredTasks.forEach(task => {
        expect(task.status).toBe(TaskStatus.COMPLETED);
      });
    });

    it('should show all tasks when filter is ALL', () => {
      service.setFilter('ALL');
      const filteredTasks = service.filteredAndSortedTasks();
      expect(filteredTasks.length).toBe(service.allTasks().length);
    });
  });

  describe('Sort Functionality', () => {
    it('should sort tasks by title ascending', () => {
      service.setSort('title', 'asc');
      const sortedTasks = service.filteredAndSortedTasks();
      
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        expect(sortedTasks[i].title.localeCompare(sortedTasks[i + 1].title)).toBeLessThanOrEqual(0);
      }
    });

    it('should sort tasks by title descending', () => {
      service.setSort('title', 'desc');
      const sortedTasks = service.filteredAndSortedTasks();
      
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        expect(sortedTasks[i].title.localeCompare(sortedTasks[i + 1].title)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should sort tasks by priority', () => {
      service.setSort('priority', 'desc');
      const sortedTasks = service.filteredAndSortedTasks();
      
      const priorityOrder: Record<TaskPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        expect(priorityOrder[sortedTasks[i].priority]).toBeGreaterThanOrEqual(
          priorityOrder[sortedTasks[i + 1].priority]
        );
      }
    });

    it('should sort tasks by status', () => {
      service.setSort('status', 'asc');
      const sortedTasks = service.filteredAndSortedTasks();
      
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        expect(sortedTasks[i].status.localeCompare(sortedTasks[i + 1].status)).toBeLessThanOrEqual(0);
      }
    });

    it('should sort tasks by created date', () => {
      service.setSort('createdAt', 'asc');
      const sortedTasks = service.filteredAndSortedTasks();
      
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        expect(sortedTasks[i].createdAt.getTime()).toBeLessThanOrEqual(
          sortedTasks[i + 1].createdAt.getTime()
        );
      }
    });

    it('should sort tasks by due date', () => {
      service.setSort('dueDate', 'asc');
      const sortedTasks = service.filteredAndSortedTasks();
      
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        const aDate = sortedTasks[i].dueDate?.getTime() ?? 0;
        const bDate = sortedTasks[i + 1].dueDate?.getTime() ?? 0;
        expect(aDate).toBeLessThanOrEqual(bDate);
      }
    });
  });

  describe('Combined Search, Filter, and Sort', () => {
    it('should apply search, filter, and sort together', () => {
      service.setSearchQuery('task');
      service.setFilter(TaskStatus.TODO);
      service.setSort('title', 'asc');

      const results = service.filteredAndSortedTasks();
      
      // All should match search
      results.forEach(task => {
        expect(
          task.title.toLowerCase().includes('task') ||
          task.description.toLowerCase().includes('task')
        ).toBe(true);
      });

      // All should match filter
      results.forEach(task => {
        expect(task.status).toBe(TaskStatus.TODO);
      });

      // All should be sorted
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].title.localeCompare(results[i + 1].title)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('Task Stats', () => {
    it('should update stats after creating a task', () => {
      const initialStats = service.taskStats();
      
      service.createTask({
        title: 'New Task',
        description: 'Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: null
      });

      const newStats = service.taskStats();
      expect(newStats.total).toBe(initialStats.total + 1);
      expect(newStats.todo).toBe(initialStats.todo + 1);
    });

    it('should update stats after deleting a task', () => {
      const tasks = service.allTasks();
      const todoTask = tasks.find(t => t.status === TaskStatus.TODO);
      
      if (todoTask) {
        const initialStats = service.taskStats();
        service.deleteTask(todoTask.id);

        const newStats = service.taskStats();
        expect(newStats.total).toBe(initialStats.total - 1);
        expect(newStats.todo).toBe(initialStats.todo - 1);
      }
    });

    it('should update stats after updating task status', () => {
      const tasks = service.allTasks();
      const todoTask = tasks.find(t => t.status === TaskStatus.TODO);
      
      if (todoTask) {
        const initialStats = service.taskStats();
        service.updateTask(todoTask.id, { status: TaskStatus.COMPLETED });

        const newStats = service.taskStats();
        expect(newStats.todo).toBe(initialStats.todo - 1);
        expect(newStats.completed).toBe(initialStats.completed + 1);
        expect(newStats.total).toBe(initialStats.total);
      }
    });
  });
});
