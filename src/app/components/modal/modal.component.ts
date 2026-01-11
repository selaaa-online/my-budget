import { Component, input, output, effect } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    @if (isOpen()) {
      <div
        class="modal-overlay"
        (click)="onOverlayClick()"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="titleId()"
      >
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 [id]="titleId()" class="modal-title">
              <ng-content select="[slot='title']"></ng-content>
            </h2>
            <button
              type="button"
              class="modal-close"
              (click)="onClose()"
              aria-label="Close modal"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: white;
      border-radius: 0.75rem;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow: auto;
      animation: slideUp 0.2s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }

    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: #6b7280;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      color: #111827;
    }

    .modal-close svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    .modal-close:focus {
      outline: none;
      color: #111827;
    }

    .modal-body {
      padding: 1.5rem;
    }

    @media (max-width: 640px) {
      .modal-content {
        max-height: 100vh;
        border-radius: 0;
      }
    }
  `,
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  titleId = input<string>('modal-title');
  
  closed = output<void>();

  private previousActiveElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.previousActiveElement = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        if (this.previousActiveElement) {
          this.previousActiveElement.focus();
        }
      }
    });
  }

  protected onClose(): void {
    this.closed.emit();
  }

  protected onOverlayClick(): void {
    this.onClose();
  }
}
