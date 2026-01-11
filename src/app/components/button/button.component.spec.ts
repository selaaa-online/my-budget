import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, ButtonVariant, ButtonSize } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default variant as primary', () => {
      expect(component.variant()).toBe('primary');
    });

    it('should have default size as medium', () => {
      expect(component.size()).toBe('medium');
    });

    it('should have default type as button', () => {
      expect(component.type()).toBe('button');
    });

    it('should not be disabled by default', () => {
      expect(component.disabled()).toBe(false);
    });
  });

  describe('Button Variants', () => {
    it('should apply primary variant class', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn-primary');
    });

    it('should apply secondary variant class', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn-secondary');
    });

    it('should apply danger variant class', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();
      
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn-danger');
    });

    it('should apply success variant class', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn-success');
    });
  });

  describe('Button Sizes', () => {
    it('should apply small size class', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn-small');
    });

    it('should apply medium size class', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();
      
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn-medium');
    });

    it('should apply large size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn-large');
    });
  });

  describe('Button State', () => {
    it('should apply disabled attribute when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should not apply disabled attribute when enabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(false);
    });
  });

  describe('Button Type', () => {
    it('should set button type attribute', () => {
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('button');
      expect(button.type).toBe('submit');
    });

    it('should default to button type', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.type).toBe('button');
    });
  });

  describe('Accessibility', () => {
    it('should apply aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test Button');
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Test Button');
    });

    it('should not have aria-label when not provided', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBeFalsy();
    });
  });

  describe('Click Events', () => {
    it('should emit clicked event when button is clicked', () => {
      let clickedEmitted = false;
      component.clicked.subscribe(() => {
        clickedEmitted = true;
      });

      const button = fixture.nativeElement.querySelector('button');
      button.click();
      
      expect(clickedEmitted).toBe(true);
    });

    it('should not emit clicked event when disabled', () => {
      let clickCount = 0;
      component.clicked.subscribe(() => {
        clickCount++;
      });

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      button.click();
      
      expect(clickCount).toBe(0);
    });
  });

  describe('CSS Classes', () => {
    it('should always include btn base class', () => {
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn');
    });

    it('should combine variant and size classes', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      
      const classes = component['buttonClasses']();
      expect(classes).toContain('btn');
      expect(classes).toContain('btn-danger');
      expect(classes).toContain('btn-large');
    });
  });

  describe('Content Projection', () => {
    it('should display projected content', () => {
      const testContent = 'Click Me';
      const newFixture = TestBed.createComponent(ButtonComponent);
      const buttonElement = newFixture.nativeElement.querySelector('button');
      buttonElement.innerHTML = testContent;
      newFixture.detectChanges();
      
      expect(buttonElement.textContent).toContain(testContent);
    });
  });
});
