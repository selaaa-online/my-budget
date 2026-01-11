import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default title', () => {
      expect(component.title()).toBe('Confirm Action');
    });

    it('should have default message', () => {
      expect(component.message()).toBe('Are you sure you want to proceed?');
    });

    it('should have default confirm text', () => {
      expect(component.confirmText()).toBe('Yes');
    });
  });

  describe('Custom Content', () => {
    it('should accept custom title', () => {
      fixture.componentRef.setInput('title', 'Delete Item');
      fixture.detectChanges();
      
      expect(component.title()).toBe('Delete Item');
    });

    it('should accept custom message', () => {
      const message = 'This action cannot be undone';
      fixture.componentRef.setInput('message', message);
      fixture.detectChanges();
      
      expect(component.message()).toBe(message);
    });

    it('should accept custom confirm text', () => {
      fixture.componentRef.setInput('confirmText', 'Delete');
      fixture.detectChanges();
      
      expect(component.confirmText()).toBe('Delete');
    });
  });

  describe('Modal Visibility', () => {
    it('should not display modal when isOpen is false', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();
      
      const modal = fixture.nativeElement.querySelector('app-modal');
      expect(modal).toBeTruthy();
    });

    it('should display modal when isOpen is true', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const modal = fixture.nativeElement.querySelector('app-modal');
      expect(modal).toBeTruthy();
    });
  });

  describe('User Actions', () => {
    it('should emit confirmed event when confirm button clicked', () => {
      let confirmed = false;
      component.confirmed.subscribe(() => {
        confirmed = true;
      });

      component['onConfirm']();
      
      expect(confirmed).toBe(true);
    });

    it('should emit cancelled event when cancel button clicked', () => {
      let cancelled = false;
      component.cancelled.subscribe(() => {
        cancelled = true;
      });

      component['onCancel']();
      
      expect(cancelled).toBe(true);
    });
  });

  describe('Button Configuration', () => {
    it('should have cancel button with secondary variant', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('app-button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should have confirm button with danger variant', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('app-button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Accessibility', () => {
    it('should display confirmation icon', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const icon = fixture.nativeElement.querySelector('.confirmation-icon');
      expect(icon).toBeTruthy();
    });

    it('should display title', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();
      
      const title = fixture.nativeElement.querySelector('.confirmation-title');
      expect(title?.textContent).toContain('Test Title');
    });

    it('should display message', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('message', 'Test Message');
      fixture.detectChanges();
      
      const message = fixture.nativeElement.querySelector('.confirmation-message');
      expect(message?.textContent).toContain('Test Message');
    });
  });

  describe('Styling', () => {
    it('should have confirmation content container', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const content = fixture.nativeElement.querySelector('.confirmation-content');
      expect(content).toBeTruthy();
    });

    it('should have actions container', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const actions = fixture.nativeElement.querySelector('.confirmation-actions');
      expect(actions).toBeTruthy();
    });
  });
});
