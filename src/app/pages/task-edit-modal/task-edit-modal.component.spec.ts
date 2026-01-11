import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskEditModalComponent } from './task-edit-modal.component';
import { TaskStatus, TaskPriority } from '../../models/task.model';

describe('TaskEditModalComponent', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditModalComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component['taskForm']).toBeTruthy();
      expect(component['taskForm'].get('title')?.value).toBe('');
      expect(component['taskForm'].get('description')?.value).toBe('');
      expect(component['taskForm'].get('status')?.value).toBe(TaskStatus.TODO);
      expect(component['taskForm'].get('priority')?.value).toBe(TaskPriority.MEDIUM);
    });

    it('should have status options', () => {
      const statusOptions = component['statusOptions'];
      expect(statusOptions.length).toBe(3);
      expect(statusOptions[0].value).toBe(TaskStatus.TODO);
      expect(statusOptions[1].value).toBe(TaskStatus.IN_PROGRESS);
      expect(statusOptions[2].value).toBe(TaskStatus.COMPLETED);
    });

    it('should have priority options', () => {
      const priorityOptions = component['priorityOptions'];
      expect(priorityOptions.length).toBe(3);
      expect(priorityOptions[0].value).toBe(TaskPriority.LOW);
      expect(priorityOptions[1].value).toBe(TaskPriority.MEDIUM);
      expect(priorityOptions[2].value).toBe(TaskPriority.HIGH);
    });
  });

  describe('Form Validation', () => {
    it('should require title', () => {
      const titleControl = component['taskForm'].get('title');
      titleControl?.setValue('');
      
      expect(titleControl?.hasError('required')).toBe(true);
      expect(component['taskForm'].valid).toBe(false);
    });

    it('should enforce minimum title length', () => {
      const titleControl = component['taskForm'].get('title');
      titleControl?.setValue('ab');
      
      expect(titleControl?.hasError('minlength')).toBe(true);
    });

    it('should enforce maximum title length', () => {
      const titleControl = component['taskForm'].get('title');
      titleControl?.setValue('a'.repeat(101));
      
      expect(titleControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept valid title', () => {
      const titleControl = component['taskForm'].get('title');
      titleControl?.setValue('Valid Task Title');
      
      expect(titleControl?.valid).toBe(true);
    });

    it('should require description', () => {
      const descControl = component['taskForm'].get('description');
      descControl?.setValue('');
      
      expect(descControl?.hasError('required')).toBe(true);
    });

    it('should enforce minimum description length', () => {
      const descControl = component['taskForm'].get('description');
      descControl?.setValue('short');
      
      expect(descControl?.hasError('minlength')).toBe(true);
    });

    it('should enforce maximum description length', () => {
      const descControl = component['taskForm'].get('description');
      descControl?.setValue('a'.repeat(501));
      
      expect(descControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept valid description', () => {
      const descControl = component['taskForm'].get('description');
      descControl?.setValue('This is a valid description for the task');
      
      expect(descControl?.valid).toBe(true);
    });

    it('should require status', () => {
      const statusControl = component['taskForm'].get('status');
      statusControl?.setValue(null);
      
      expect(statusControl?.hasError('required')).toBe(true);
    });

    it('should require priority', () => {
      const priorityControl = component['taskForm'].get('priority');
      priorityControl?.setValue(null);
      
      expect(priorityControl?.hasError('required')).toBe(true);
    });

    it('should allow null due date', () => {
      const dueDateControl = component['taskForm'].get('dueDate');
      dueDateControl?.setValue(null);
      
      expect(dueDateControl?.valid).toBe(true);
    });

    it('should accept valid due date', () => {
      const dueDateControl = component['taskForm'].get('dueDate');
      dueDateControl?.setValue('2026-12-31');
      
      expect(dueDateControl?.valid).toBe(true);
    });
  });

  describe('Error Messages', () => {
    it('should return required error message for title', () => {
      const titleControl = component['taskForm'].get('title')!;
      titleControl.setValue('');
      titleControl.markAsTouched();
      
      const error = component['getErrorMessage']('title');
      expect(error).toBe('Title is required');
    });

    it('should return minlength error message for title', () => {
      const titleControl = component['taskForm'].get('title')!;
      titleControl.setValue('ab');
      titleControl.markAsTouched();
      
      const error = component['getErrorMessage']('title');
      expect(error).toBe('Title must be at least 3 characters');
    });

    it('should return maxlength error message for title', () => {
      const titleControl = component['taskForm'].get('title')!;
      titleControl.setValue('a'.repeat(101));
      titleControl.markAsTouched();
      
      const error = component['getErrorMessage']('title');
      expect(error).toBe('Title cannot exceed 100 characters');
    });

    it('should return empty string when no errors', () => {
      const titleControl = component['taskForm'].get('title')!;
      titleControl.setValue('Valid Title');
      titleControl.markAsTouched();
      
      const error = component['getErrorMessage']('title');
      expect(error).toBe('');
    });

    it('should return required error message for description', () => {
      const descControl = component['taskForm'].get('description')!;
      descControl.setValue('');
      descControl.markAsTouched();
      
      const error = component['getErrorMessage']('description');
      expect(error).toBe('Description is required');
    });

    it('should return minlength error message for description', () => {
      const descControl = component['taskForm'].get('description')!;
      descControl.setValue('short');
      descControl.markAsTouched();
      
      const error = component['getErrorMessage']('description');
      expect(error).toBe('Description must be at least 10 characters');
    });
  });

  describe('Form Population', () => {
    it('should populate form when task input changes', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-12-31'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      fixture.componentRef.setInput('task', task);
      fixture.detectChanges();

      expect(component['taskForm'].get('title')?.value).toBe('Test Task');
      expect(component['taskForm'].get('description')?.value).toBe('Test Description');
      expect(component['taskForm'].get('status')?.value).toBe(TaskStatus.IN_PROGRESS);
      expect(component['taskForm'].get('priority')?.value).toBe(TaskPriority.HIGH);
    });

    it('should reset form when task is null', () => {
      // First set a task
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-12-31'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      fixture.componentRef.setInput('task', task);
      fixture.detectChanges();

      // Then set to null
      fixture.componentRef.setInput('task', null);
      fixture.detectChanges();

      expect(component['taskForm'].get('title')?.value).toBe('');
      expect(component['taskForm'].get('description')?.value).toBe('');
      expect(component['taskForm'].get('status')?.value).toBe(TaskStatus.TODO);
      expect(component['taskForm'].get('priority')?.value).toBe(TaskPriority.MEDIUM);
    });
  });

  describe('Modal Actions', () => {
    it('should emit closed event on cancel', () => {
      let emitted = false;
      component.closed.subscribe(() => {
        emitted = true;
      });

      component['onCancel']();
      
      expect(emitted).toBe(true);
    });

    it('should not submit invalid form', () => {
      let emitted = false;
      component.saved.subscribe(() => {
        emitted = true;
      });

      component['taskForm'].get('title')?.setValue('');
      component['onSubmit']();
      
      expect(emitted).toBe(false);
    });

    it('should emit saved event with valid form data', () => {
      let savedData: any = null;
      component.saved.subscribe((data) => {
        savedData = data;
      });

      component['taskForm'].patchValue({
        title: 'Valid Title',
        description: 'Valid description for the task',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: '2026-12-31'
      });

      component['onSubmit']();
      
      expect(savedData).toBeTruthy();
      expect(savedData.title).toBe('Valid Title');
      expect(savedData.description).toBe('Valid description for the task');
      expect(savedData.status).toBe(TaskStatus.TODO);
      expect(savedData.priority).toBe(TaskPriority.MEDIUM);
    });

    it('should convert date string to Date object on submit', () => {
      let savedData: any = null;
      component.saved.subscribe((data) => {
        savedData = data;
      });

      component['taskForm'].patchValue({
        title: 'Valid Title',
        description: 'Valid description for the task',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: '2026-12-31'
      });

      component['onSubmit']();
      
      expect(savedData.dueDate).toBeInstanceOf(Date);
    });

    it('should handle null due date on submit', () => {
      let savedData: any = null;
      component.saved.subscribe((data) => {
        savedData = data;
      });

      component['taskForm'].patchValue({
        title: 'Valid Title',
        description: 'Valid description for the task',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: null
      });

      component['onSubmit']();
      
      expect(savedData.dueDate).toBeNull();
    });
  });

  describe('Form State', () => {
    it('should reset form when task is null', () => {
      fixture.componentRef.setInput('task', null);
      fixture.detectChanges();
      
      expect(component['taskForm'].get('title')?.value).toBe('');
      expect(component['taskForm'].get('status')?.value).toBe(TaskStatus.TODO);
    });

    it('should populate form when task is provided', () => {
      const task = {
        id: '1',
        title: 'Test',
        description: 'Test Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      fixture.componentRef.setInput('task', task);
      fixture.detectChanges();
      
      expect(component['taskForm'].get('title')?.value).toBe('Test');
    });
  });
});
