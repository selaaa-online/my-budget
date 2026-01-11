import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  template: `
    <div class="search-container">
      <label [for]="inputId()" class="sr-only">{{ label() }}</label>
      <input
        [id]="inputId()"
        type="text"
        class="search-input"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onInputChange($event)"
        [attr.aria-label]="label()"
      />
      <svg
        class="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  `,
  styles: `
    .search-container {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.25rem;
      height: 1.25rem;
      color: #9ca3af;
      pointer-events: none;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `,
})
export class SearchInputComponent {
  value = input<string>('');
  placeholder = input<string>('Search...');
  label = input<string>('Search');
  inputId = input<string>('search-input');
  
  valueChange = output<string>();

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
