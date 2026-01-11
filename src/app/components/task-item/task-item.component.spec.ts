import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { TaskStatus, TaskPriority } from '../../models/task.model';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2026-12-31'),
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-10')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should accept task input', () => {
      expect(component.task()).toEqual(mockTask);
    });
  });

  describe('Task Display', () => {
    it('should display task title', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.task-title')?.textContent).toContain('Test Task');
    });

    it('should display task description', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.task-description')?.textContent).toContain('Test Description');
    });

    it('should display priority badge', () => {
      const compiled = fixture.nativeElement;
      const priorityBadge = compiled.querySelector('.priority-badge');
      expect(priorityBadge).toBeTruthy();
      expect(priorityBadge?.textContent).toContain('MEDIUM');
    });

    it('should apply correct priority class', () => {
      const compiled = fixture.nativeElement;
      const priorityBadge = compiled.querySelector('.priority-badge');
      expect(priorityBadge?.classList.contains('priority-medium')).toBe(true);
    });

    it('should display status badge', () => {
      const compiled = fixture.nativeElement;
      const statusBadge = compiled.querySelector('.status-badge');
      expect(statusBadge).toBeTruthy();
    });

    it('should format status correctly', () => {
      const formatted = component['formatStatus'](TaskStatus.IN_PROGRESS);
      expect(formatted).toBe('In Progress');
    });

    it('should format TODO status', () => {
      const formatted = component['formatStatus'](TaskStatus.TODO);
      expect(formatted).toBe('To Do');
    });

    it('should format COMPLETED status', () => {
      const formatted = component['formatStatus'](TaskStatus.COMPLETED);
      expect(formatted).toBe('Completed');
    });
  });

  describe('Due Date', () => {
    it('should display due date when present', () => {
      const compiled = fixture.nativeElement;
      const dueDate = compiled.querySelector('.due-date');
      expect(dueDate).toBeTruthy();
      expect(dueDate?.textContent).toContain('Due:');
    });

    it('should not display due date when null', () => {
      const taskWithoutDate = { ...mockTask, dueDate: null };
      fixture.componentRef.setInput('task', taskWithoutDate);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const dueDate = compiled.querySelector('.due-date');
      expect(dueDate).toBeFalsy();
    });

    it('should detect overdue tasks', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const overdueTask = { ...mockTask, dueDate: yesterday, status: TaskStatus.TODO };
      fixture.componentRef.setInput('task', overdueTask);
      fixture.detectChanges();

      expect(component['isOverdue']()).toBe(true);
    });

    it('should not mark completed tasks as overdue', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const completedTask = { ...mockTask, dueDate: yesterday, status: TaskStatus.COMPLETED };
      fixture.componentRef.setInput('task', completedTask);
      fixture.detectChanges();

      expect(component['isOverdue']()).toBe(false);
    });

    it('should not mark future tasks as overdue', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const futureTask = { ...mockTask, dueDate: tomorrow };
      fixture.componentRef.setInput('task', futureTask);
      fixture.detectChanges();

      expect(component['isOverdue']()).toBe(false);
    });

    it('should not mark tasks without due date as overdue', () => {
      const taskWithoutDate = { ...mockTask, dueDate: null };
      fixture.componentRef.setInput('task', taskWithoutDate);
      fixture.detectChanges();

      expect(component['isOverdue']()).toBe(false);
    });
  });

  describe('Task Actions', () => {
    it('should emit edit event when edit button clicked', () => {
      let emittedTask: any = null;
      component.edit.subscribe((task) => {
        emittedTask = task;
      });

      component['onEdit']();
      
      expect(emittedTask).toEqual(mockTask);
    });

    it('should emit delete event when delete button clicked', () => {
      let emittedTask: any = null;
      component.delete.subscribe((task) => {
        emittedTask = task;
      });

      component['onDelete']();
      
      expect(emittedTask).toEqual(mockTask);
    });

    it('should have edit and delete buttons', () => {
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('app-button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Completed Task Styling', () => {
    it('should apply completed class for completed tasks', () => {
      const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
      fixture.componentRef.setInput('task', completedTask);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const taskItem = compiled.querySelector('.task-item');
      expect(taskItem?.classList.contains('completed')).toBe(true);
    });

    it('should not apply completed class for non-completed tasks', () => {
      const compiled = fixture.nativeElement;
      const taskItem = compiled.querySelector('.task-item');
      expect(taskItem?.classList.contains('completed')).toBe(false);
    });
  });

  describe('Priority Levels', () => {
    it('should display HIGH priority correctly', () => {
      const highPriorityTask = { ...mockTask, priority: TaskPriority.HIGH };
      fixture.componentRef.setInput('task', highPriorityTask);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const badge = compiled.querySelector('.priority-badge');
      expect(badge?.classList.contains('priority-high')).toBe(true);
    });

    it('should display LOW priority correctly', () => {
      const lowPriorityTask = { ...mockTask, priority: TaskPriority.LOW };
      fixture.componentRef.setInput('task', lowPriorityTask);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const badge = compiled.querySelector('.priority-badge');
      expect(badge?.classList.contains('priority-low')).toBe(true);
    });
  });

  describe('Status Types', () => {
    it('should display TODO status correctly', () => {
      const compiled = fixture.nativeElement;
      const statusBadge = compiled.querySelector('.status-badge');
      expect(statusBadge?.textContent).toContain('To Do');
    });

    it('should display IN_PROGRESS status correctly', () => {
      const inProgressTask = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      fixture.componentRef.setInput('task', inProgressTask);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const statusBadge = compiled.querySelector('.status-badge');
      expect(statusBadge?.textContent).toContain('In Progress');
    });

    it('should display COMPLETED status correctly', () => {
      const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
      fixture.componentRef.setInput('task', completedTask);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const statusBadge = compiled.querySelector('.status-badge');
      expect(statusBadge?.textContent).toContain('Completed');
    });
  });
});
