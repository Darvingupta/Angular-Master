import { Component, Directive, HostBinding, HostListener, Input, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Attribute Directive Example ---
@Directive({
  selector: '[appPremiumHighlight]',
  standalone: true
})
export class PremiumHighlightDirective {
  private el = inject(ElementRef);
  
  @Input() appPremiumHighlight = '';
  @Input() defaultColor = '#fef08a'; // Tailwind yellow-200

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appPremiumHighlight || this.defaultColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.transform = color ? 'scale(1.02)' : 'scale(1)';
    this.el.nativeElement.style.transition = 'all 0.2s ease-in-out';
    this.el.nativeElement.style.borderRadius = '4px';
    this.el.nativeElement.style.padding = color ? '2px 6px' : '0';
  }
}

// --- Component ---
@Component({
  selector: 'app-directives',
  standalone: true,
  imports: [CommonModule, PremiumHighlightDirective],
  template: `
    <div class="feature-page">
      <h2>Advanced Directives</h2>
      <p class="subtitle">Extending HTML with Custom Behaviors</p>

      <div class="explanation">
        <p>Directives allow you to attach behavior to elements in the DOM. Angular 15+ standalone directives are exceptionally powerful, concise, and heavily rely on <code>inject()</code>, <code>&#64;HostListener</code>, and Signals.</p>
      </div>

      <div class="comparison-grid">
        <div class="card structural">
          <h3>Structural Directives</h3>
          <p>Modify the DOM layout by adding, removing, or replacing elements.</p>
          <pre><code>// Legacy Way:
*ngIf="isAdmin"
*ngFor="let user of users"

// Angular 17+ Way (Control Flow):
&#64;if (isAdmin) {{ '{' }} ... {{ '}' }}
&#64;for (user of users; track user.id) {{ '{' }} ... {{ '}' }}</code></pre>
          <small>Note: Structural directives are largely replaced by native Control Flow syntax in Modern Angular.</small>
        </div>
        <div class="card attribute">
          <h3>Attribute Directives</h3>
          <p>Change the appearance or behavior of an existing element or component.</p>
          <pre><code>&#64;Directive({{ '{' }}
  selector: '[appHighlight]',
  standalone: true
{{ '}' }})
export class HighlightDirective {{ '{' }}
  private el = inject(ElementRef);

  &#64;HostListener('mouseenter') enter() {{ '{' }}
    this.el.nativeElement.style.background = 'yellow';
  {{ '}' }}
{{ '}' }}</code></pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>Live Demo: Custom Attribute Directive</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Interactive</span>
          </div>
          
          <div class="directive-demo">
            <p>Hover over the words below to see the <code>[appPremiumHighlight]</code> directive in action!</p>
            
            <div class="text-block">
              Angular is a <span appPremiumHighlight>platform</span> that makes it easy to build 
              <span appPremiumHighlight="#bbf7d0">applications</span> with the web. Directives are 
              <span appPremiumHighlight="#bfdbfe">instructions</span> in the DOM.
            </div>

            <div class="controls">
              <p>Bind dynamic colors using signals:</p>
              <div class="color-picker">
                @for (color of colors; track color) {
                  <button 
                    class="color-btn" 
                    [style.backgroundColor]="color"
                    [class.active]="selectedColor() === color"
                    (click)="selectedColor.set(color)"></button>
                }
              </div>
              
              <div class="dynamic-target" [appPremiumHighlight]="selectedColor()">
                Hover over me! My highlight color is reactive!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Pro-Tips:</h4>
        <ul>
          <li><strong>HostListener vs Events:</strong> <code>&#64;HostListener</code> is the preferred way to listen to DOM events inside a directive without causing memory leaks. Angular cleans it up automatically.</li>
          <li><strong>inject():</strong> Modern directives use <code>inject(ElementRef)</code> instead of constructor injection, making the class extremely clean.</li>
          <li><strong>HostBinding:</strong> Used to bind a host element property (like a class or style) to a directive's property string.</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .feature-page { padding: 20px; }
    .subtitle { color: #5f6368; font-style: italic; margin-top: -5px; margin-bottom: 20px; }
    .explanation { background: linear-gradient(135deg, #e3f2fd, #e8eaf6); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1a73e8; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .card { padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
    .structural { border-left: 5px solid #d93025; background: #fff8f8; }
    .attribute { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; margin-bottom: 10px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { margin-bottom: 15px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .directive-demo { background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; }
    .text-block { font-size: 1.1rem; line-height: 2; margin: 20px 0; padding: 20px; background: #f1f3f4; border-radius: 8px; cursor: default; }
    .controls { border-top: 1px dashed #ccc; padding-top: 20px; margin-top: 20px; }
    .color-picker { display: flex; gap: 10px; margin: 15px 0; }
    .color-btn { width: 30px; height: 30px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.2s; }
    .color-btn:hover { transform: scale(1.1); }
    .color-btn.active { border-color: #333; transform: scale(1.1); box-shadow: 0 0 0 2px white, 0 0 0 4px #333; }
    .dynamic-target { padding: 20px; text-align: center; border: 2px dashed #bbb; border-radius: 8px; font-weight: bold; background: white; cursor: pointer; margin-top: 15px;}
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
  `]
})
export class DirectivesComponent {
  colors = ['#fecaca', '#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff'];
  selectedColor = signal(this.colors[1]);
}
