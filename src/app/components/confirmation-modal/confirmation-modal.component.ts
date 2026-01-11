import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirmation-modal',
  imports: [ModalComponent, ButtonComponent],
  standalone: true,
  template: `
    <app-modal [isOpen]="isOpen()" (closed)="onCancel()">
      <div class="confirmation-content">
        <div class="confirmation-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 class="confirmation-title">{{ title() }}</h2>
        <p class="confirmation-message">{{ message() }}</p>

        <div class="confirmation-actions">
          <app-button
            variant="secondary"
            (clicked)="onCancel()"
            ariaLabel="Cancel"
          >
            Cancel
          </app-button>
          <app-button
            variant="danger"
            (clicked)="onConfirm()"
            ariaLabel="Confirm"
          >
            {{ confirmText() }}
          </app-button>
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    .confirmation-content {
      padding: 1.5rem;
      text-align: center;
    }

    .confirmation-icon {
      margin: 0 auto 1.5rem;
      width: 4rem;
      height: 4rem;
      background: #fef2f2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .confirmation-icon svg {
      width: 2.5rem;
      height: 2.5rem;
      color: #dc2626;
    }

    .confirmation-title {
      margin: 0 0 0.75rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .confirmation-message {
      margin: 0 0 2rem 0;
      color: #6b7280;
      line-height: 1.5;
    }

    .confirmation-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }
  `]
})
export class ConfirmationModalComponent {
  isOpen = input.required<boolean>();
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure you want to proceed?');
  confirmText = input<string>('Yes');
  
  confirmed = output<void>();
  cancelled = output<void>();

  protected onConfirm(): void {
    this.confirmed.emit();
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }
}
