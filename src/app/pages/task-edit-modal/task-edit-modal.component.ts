import { Component, input, output, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { ModalComponent } from '../../components/modal/modal.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-task-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent, ButtonComponent],
  templateUrl: './task-edit-modal.component.html',
  styleUrl: './task-edit-modal.component.css',
})
export class TaskEditModalComponent {
  isOpen = input<boolean>(false);
  task = input<Task | null>(null);

  closed = output<void>();
  saved = output<Partial<Task>>();

  protected taskForm: FormGroup;
  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskPriority = TaskPriority;

  protected readonly statusOptions = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.COMPLETED, label: 'Completed' },
  ];

  protected readonly priorityOptions = [
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.HIGH, label: 'High' },
  ];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.createForm();

    effect(() => {
      const currentTask = this.task();
      if (currentTask) {
        this.taskForm.patchValue({
          title: currentTask.title,
          description: currentTask.description,
          status: currentTask.status,
          priority: currentTask.priority,
          dueDate: currentTask.dueDate ? this.formatDateForInput(currentTask.dueDate) : '',
        });
      } else {
        this.taskForm.reset({
          title: '',
          description: '',
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          dueDate: '',
        });
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      status: [TaskStatus.TODO, Validators.required],
      priority: [TaskPriority.MEDIUM, Validators.required],
      dueDate: [''],
    });
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData: Partial<Task> = {
        title: formValue.title.trim(),
        description: formValue.description.trim(),
        status: formValue.status,
        priority: formValue.priority,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : null,
      };

      this.saved.emit(taskData);
    } else {
      this.markFormGroupTouched(this.taskForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  protected onCancel(): void {
    this.taskForm.reset();
    this.closed.emit();
  }

  protected getErrorMessage(fieldName: string): string {
    const control = this.taskForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      title: 'Title',
      description: 'Description',
      status: 'Status',
      priority: 'Priority',
      dueDate: 'Due Date',
    };
    return labels[fieldName] || fieldName;
  }

  protected hasError(fieldName: string): boolean {
    const control = this.taskForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
