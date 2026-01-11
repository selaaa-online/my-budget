import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { TaskStatus, TaskPriority } from '../../models/task.model';
import { signal } from '@angular/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [TaskService]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default filter and sort', () => {
      expect(component['currentFilter']()).toBe('ALL');
      expect(component['currentSort']().sortBy).toBe('createdAt');
      expect(component['currentSort']().direction).toBe('desc');
    });

    it('should load tasks from service', () => {
      const tasks = component['tasks']();
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should load task stats from service', () => {
      const stats = component['taskStats']();
      expect(stats).toBeTruthy();
      expect(stats.total).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    it('should update search query', () => {
      const searchQuery = 'test search';
      component['onSearchChange'](searchQuery);
      
      expect(component['searchQuery']()).toBe(searchQuery);
    });

    it('should call taskService.setSearchQuery', () => {
      const spy = vi.spyOn(taskService, 'setSearchQuery');
      const searchQuery = 'angular';
      
      component['onSearchChange'](searchQuery);
      
      expect(spy).toHaveBeenCalledWith(searchQuery);
    });
  });

  describe('Filter Functionality', () => {
    it('should update current filter', () => {
      component['onFilterChange'](TaskStatus.TODO);
      expect(component['currentFilter']()).toBe(TaskStatus.TODO);
    });

    it('should call taskService.setFilter', () => {
      const spy = vi.spyOn(taskService, 'setFilter');
      
      component['onFilterChange'](TaskStatus.IN_PROGRESS);
      
      expect(spy).toHaveBeenCalledWith(TaskStatus.IN_PROGRESS);
    });

    it('should have correct filter options', () => {
      const filters = component['filters'];
      expect(filters.length).toBe(4);
      expect(filters[0].value).toBe('ALL');
      expect(filters[1].value).toBe(TaskStatus.TODO);
      expect(filters[2].value).toBe(TaskStatus.IN_PROGRESS);
      expect(filters[3].value).toBe(TaskStatus.COMPLETED);
    });
  });

  describe('Sort Functionality', () => {
    it('should update sort field on change', () => {
      const event = {
        target: { value: 'title' }
      } as any;

      component['onSortChange'](event);
      
      expect(component['currentSort']().sortBy).toBe('title');
    });

    it('should call taskService.setSort on sort change', () => {
      const spy = vi.spyOn(taskService, 'setSort');
      const event = {
        target: { value: 'priority' }
      } as any;

      component['onSortChange'](event);
      
      expect(spy).toHaveBeenCalledWith('priority', 'desc');
    });

    it('should toggle sort direction', () => {
      const initialDirection = component['currentSort']().direction;
      
      component['toggleSortDirection']();
      
      const newDirection = component['currentSort']().direction;
      expect(newDirection).toBe(initialDirection === 'asc' ? 'desc' : 'asc');
    });

    it('should toggle from asc to desc', () => {
      component['currentSort'].set({ sortBy: 'title', direction: 'asc' });
      
      component['toggleSortDirection']();
      
      expect(component['currentSort']().direction).toBe('desc');
    });

    it('should toggle from desc to asc', () => {
      component['currentSort'].set({ sortBy: 'title', direction: 'desc' });
      
      component['toggleSortDirection']();
      
      expect(component['currentSort']().direction).toBe('asc');
    });

    it('should have correct sort options', () => {
      const sortOptions = component['sortOptions'];
      expect(sortOptions.length).toBe(5);
      expect(sortOptions.map(o => o.value)).toContain('title');
      expect(sortOptions.map(o => o.value)).toContain('dueDate');
      expect(sortOptions.map(o => o.value)).toContain('priority');
      expect(sortOptions.map(o => o.value)).toContain('status');
      expect(sortOptions.map(o => o.value)).toContain('createdAt');
    });
  });

  describe('Add Task', () => {
    it('should open modal for adding task', () => {
      component['onAddTask']();
      
      expect(component['isEditing']()).toBe(true);
      expect(component['editingTask']()).toBeNull();
    });
  });

  describe('Edit Task', () => {
    it('should open modal for editing task', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      component['onEditTask'](task);
      
      expect(component['isEditing']()).toBe(true);
      expect(component['editingTask']()).toEqual(task);
    });
  });

  describe('Delete Task', () => {
    it('should show confirmation modal when deleting', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      component['onDeleteTask'](task);
      
      expect(component['isConfirmingDelete']()).toBe(true);
      expect(component['taskToDelete']()).toEqual(task);
    });

    it('should delete task on confirmation', () => {
      const task = taskService.allTasks()[0];
      const spy = vi.spyOn(taskService, 'deleteTask');

      component['taskToDelete'].set(task);
      component['onConfirmDelete']();
      
      expect(spy).toHaveBeenCalledWith(task.id);
    });

    it('should close confirmation modal after delete', () => {
      const task = taskService.allTasks()[0];
      
      component['taskToDelete'].set(task);
      component['isConfirmingDelete'].set(true);
      component['onConfirmDelete']();
      
      expect(component['isConfirmingDelete']()).toBe(false);
      expect(component['taskToDelete']()).toBeNull();
    });

    it('should cancel delete and close modal', () => {
      const task = taskService.allTasks()[0];
      
      component['taskToDelete'].set(task);
      component['isConfirmingDelete'].set(true);
      component['onCancelDelete']();
      
      expect(component['isConfirmingDelete']()).toBe(false);
      expect(component['taskToDelete']()).toBeNull();
    });

    it('should generate correct delete confirmation message', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      component['taskToDelete'].set(task);
      const message = component['deleteConfirmationMessage'];
      
      expect(message).toContain('Test Task');
      expect(message).toContain('cannot be undone');
    });
  });

  describe('Modal Management', () => {
    it('should close edit modal', () => {
      component['isEditing'].set(true);
      component['editingTask'].set({
        id: '1',
        title: 'Test',
        description: 'Desc',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      component['onCloseModal']();
      
      expect(component['isEditing']()).toBe(false);
      expect(component['editingTask']()).toBeNull();
    });
  });

  describe('Save Task', () => {
    it('should create new task when editing task is null', () => {
      const spy = vi.spyOn(taskService, 'createTask');
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: null
      };

      component['editingTask'].set(null);
      component['onSaveTask'](taskData);
      
      expect(spy).toHaveBeenCalledWith(taskData);
    });

    it('should update task when editing existing task', () => {
      const existingTask = taskService.allTasks()[0];
      const spy = vi.spyOn(taskService, 'updateTask');
      const updates = {
        title: 'Updated Title'
      };

      component['editingTask'].set(existingTask);
      component['onSaveTask'](updates);
      
      expect(spy).toHaveBeenCalledWith(existingTask.id, updates);
    });

    it('should close modal after saving', () => {
      const taskData = {
        title: 'New Task',
        description: 'Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null
      };

      component['isEditing'].set(true);
      component['onSaveTask'](taskData);
      
      expect(component['isEditing']()).toBe(false);
      expect(component['editingTask']()).toBeNull();
    });
  });
});
