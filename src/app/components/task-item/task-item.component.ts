import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="task-item" [class.completed]="task().status === 'COMPLETED'">
      <div class="task-content">
        <div class="task-header">
          <h3 class="task-title">{{ task().title }}</h3>
          <span [class]="'priority-badge priority-' + task().priority.toLowerCase()">
            {{ task().priority }}
          </span>
        </div>
        <p class="task-description">{{ task().description }}</p>
        <div class="task-meta">
          <span [class]="'status-badge status-' + task().status.toLowerCase()">
            {{ formatStatus(task().status) }}
          </span>
          @if (task().dueDate) {
            <span class="due-date" [class.overdue]="isOverdue()">
              Due: {{ task().dueDate | date: 'MMM d, y' }}
            </span>
          }
        </div>
      </div>
      <div class="task-actions">
        <app-button
          variant="secondary"
          size="small"
          (clicked)="onEdit()"
          ariaLabel="Edit task"
        >
          Edit
        </app-button>
        <app-button
          variant="danger"
          size="small"
          (clicked)="onDelete()"
          ariaLabel="Delete task"
        >
          Delete
        </app-button>
      </div>
    </div>
  `,
  styles: `
    .task-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      transition: all 0.2s;
    }

    .task-item:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .task-item.completed {
      opacity: 0.7;
    }

    .task-content {
      flex: 1;
      min-width: 0;
    }

    .task-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .task-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .task-item.completed .task-title {
      text-decoration: line-through;
    }

    .task-description {
      margin: 0 0 0.75rem 0;
      color: #6b7280;
      line-height: 1.5;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .priority-badge,
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .priority-badge.priority-high {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .priority-badge.priority-medium {
      background-color: #fef3c7;
      color: #92400e;
    }

    .priority-badge.priority-low {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .status-badge.status-todo {
      background-color: #f3f4f6;
      color: #374151;
    }

    .status-badge.status-in_progress {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .status-badge.status-completed {
      background-color: #d1fae5;
      color: #065f46;
    }

    .due-date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .due-date.overdue {
      color: #dc2626;
      font-weight: 600;
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    @media (max-width: 640px) {
      .task-item {
        flex-direction: column;
      }

      .task-actions {
        width: 100%;
      }

      .task-actions app-button {
        flex: 1;
      }
    }
  `,
})
export class TaskItemComponent {
  task = input.required<Task>();
  
  edit = output<Task>();
  delete = output<Task>();

  protected formatStatus(status: TaskStatus): string {
    return status.replace('_', ' ');
  }

  protected isOverdue(): boolean {
    const dueDate = this.task().dueDate;
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && this.task().status !== TaskStatus.COMPLETED;
  }

  protected onEdit(): void {
    this.edit.emit(this.task());
  }

  protected onDelete(): void {
    this.delete.emit(this.task());
  }
}
