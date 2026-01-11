import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="handleClick($event)"
      [attr.aria-label]="ariaLabel()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: `
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 500;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }

    .btn-small {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    .btn-medium {
      padding: 0.625rem 1.25rem;
      font-size: 1rem;
    }

    .btn-large {
      padding: 0.875rem 1.75rem;
      font-size: 1.125rem;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #d1d5db;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
    }

    .btn-success {
      background-color: #10b981;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #059669;
    }
  `,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  ariaLabel = input<string | undefined>(undefined);
  
  clicked = output<Event>();

  protected buttonClasses(): string {
    return `btn btn-${this.variant()} btn-${this.size()}`;
  }

  protected handleClick(event: Event): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}
