import { Component, signal, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskFilter, TaskStatus, TaskSortBy, SortDirection } from '../../models/task.model';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { ButtonComponent } from '../../components/button/button.component';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-task-list',
  imports: [
    SearchInputComponent,
    TaskItemComponent,
    ButtonComponent,
    TaskEditModalComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  protected readonly tasks = this.taskService.filteredAndSortedTasks;
  protected readonly taskStats = this.taskService.taskStats;
  protected readonly searchQuery = signal('');
  protected readonly currentFilter = signal<TaskFilter>('ALL');
  protected readonly currentSort = signal<{ sortBy: TaskSortBy; direction: SortDirection }>({
    sortBy: 'createdAt',
    direction: 'desc',
  });

  protected readonly TaskStatus = TaskStatus;
  protected readonly filters: { label: string; value: TaskFilter }[] = [
    { label: 'All Tasks', value: 'ALL' },
    { label: 'To Do', value: TaskStatus.TODO },
    { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
    { label: 'Completed', value: TaskStatus.COMPLETED },
  ];

  protected readonly sortOptions: { label: string; value: TaskSortBy }[] = [
    { label: 'Created Date', value: 'createdAt' },
    { label: 'Title', value: 'title' },
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
    { label: 'Status', value: 'status' },
  ];

  protected readonly isEditing = signal(false);
  protected readonly editingTask = signal<Task | null>(null);
  protected readonly isConfirmingDelete = signal(false);
  protected readonly taskToDelete = signal<Task | null>(null);

  protected get deleteConfirmationMessage(): string {
    const task = this.taskToDelete();
    return task 
      ? `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
      : '';
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.taskService.setSearchQuery(query);
  }

  protected onFilterChange(filter: TaskFilter): void {
    this.currentFilter.set(filter);
    this.taskService.setFilter(filter);
  }

  protected onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const sortBy = select.value as TaskSortBy;
    const currentSort = this.currentSort();
    this.currentSort.set({ sortBy, direction: currentSort.direction });
    this.taskService.setSort(sortBy, currentSort.direction);
  }

  protected toggleSortDirection(): void {
    const currentSort = this.currentSort();
    const newDirection: SortDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
    this.currentSort.set({ ...currentSort, direction: newDirection });
    this.taskService.setSort(currentSort.sortBy, newDirection);
  }

  protected onAddTask(): void {
    this.editingTask.set(null);
    this.isEditing.set(true);
  }

  protected onEditTask(task: Task): void {
    this.editingTask.set(task);
    this.isEditing.set(true);
  }

  protected onDeleteTask(task: Task): void {
    this.taskToDelete.set(task);
    this.isConfirmingDelete.set(true);
  }

  protected onConfirmDelete(): void {
    const task = this.taskToDelete();
    if (task) {
      this.taskService.deleteTask(task.id);
    }
    this.onCancelDelete();
  }

  protected onCancelDelete(): void {
    this.isConfirmingDelete.set(false);
    this.taskToDelete.set(null);
  }

  protected onCloseModal(): void {
    this.isEditing.set(false);
    this.editingTask.set(null);
  }

  protected onSaveTask(taskData: any): void {
    if (this.editingTask()) {
      this.taskService.updateTask(this.editingTask()!.id, taskData);
    } else {
      this.taskService.createTask(taskData);
    }
    this.onCloseModal();
  }
}
