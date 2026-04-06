import { Component, input, output, model, viewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-component-api-child',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="child-box">
      <div class="child-header">👶 Child Component</div>
      <div class="child-body">
        <p>Signal Input (Read-only): <strong>{{ label() }}</strong></p>
        <p>Model (Two-way): <input [(ngModel)]="countModel" type="number" class="model-input"></p>
        <button class="child-btn" (click)="emitEvent()">📤 Emit Output Signal</button>
        <div #myDiv class="viewchild-target">I am a reactive viewChild target</div>
      </div>
    </div>
  `,
  styles: [`
    .child-box { border: 2px dashed #7c4dff; border-radius: 10px; overflow: hidden; margin-top: 10px; }
    .child-header { background: #7c4dff; color: white; padding: 8px 15px; font-weight: 700; font-size: 0.85rem; }
    .child-body { padding: 15px; background: #f5f0ff; }
    .model-input { padding: 6px 10px; border: 2px solid #7c4dff; border-radius: 4px; width: 80px; font-family: monospace; text-align: center; }
    .child-btn { padding: 8px 16px; background: #7c4dff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .child-btn:hover { background: #651fff; transform: translateY(-1px); }
    .viewchild-target { margin-top: 10px; padding: 8px; background: white; border: 1px dashed #b388ff; border-radius: 4px; font-size: 0.8rem; color: #7c4dff; text-align: center; }
  `]
})
export class ComponentApiChildComponent {
  label = input.required<string>();
  countModel = model(0);
  action = output<string>();
  divRef = viewChild<ElementRef>('myDiv');

  emitEvent() {
    this.action.emit('Child Button Clicked at ' + new Date().toLocaleTimeString());
  }
}

@Component({
  selector: 'app-component-api',
  imports: [CommonModule, ComponentApiChildComponent],
  template: `
    <div class="feature-page">
      <h2>3. Signal-Based Component APIs</h2>
      <p class="subtitle">input(), model(), output(), viewChild() — The Modern Component Toolkit</p>

      <div class="explanation">
        <p>Angular 17+ introduces <strong>function-based component APIs</strong> that replace decorators. They integrate natively with the Signal system, providing better type safety, reactivity, and DX.</p>
      </div>

      <div class="api-cards">
        <div class="api-card" [class.active]="activeApi() === 'input'" (click)="activeApi.set('input')">
          <div class="api-icon">📥</div>
          <h4>input()</h4>
          <small>Read-only signal input</small>
        </div>
        <div class="api-card" [class.active]="activeApi() === 'model'" (click)="activeApi.set('model')">
          <div class="api-icon">🔄</div>
          <h4>model()</h4>
          <small>Two-way binding</small>
        </div>
        <div class="api-card" [class.active]="activeApi() === 'output'" (click)="activeApi.set('output')">
          <div class="api-icon">📤</div>
          <h4>output()</h4>
          <small>Event emitter</small>
        </div>
        <div class="api-card" [class.active]="activeApi() === 'viewchild'" (click)="activeApi.set('viewchild')">
          <div class="api-icon">🔍</div>
          <h4>viewChild()</h4>
          <small>DOM query</small>
        </div>
      </div>

      <div class="api-detail" [ngSwitch]="activeApi()">
        <div *ngSwitchCase="'input'" class="comparison-grid">
          <div class="card old">
            <h3>Old: &#64;Input() Decorator</h3>
            <pre><code>&#64;Input() name: string = '';
&#64;Input(&#123; required: true &#125;) id!: number;
&#64;Input(&#123; transform: booleanAttribute &#125;)
  disabled = false;</code></pre>
          </div>
          <div class="card new">
            <h3>New: input() Function</h3>
            <pre><code>name = input('');              // optional
id = input.required&lt;number&gt;();  // required
disabled = input(false, &#123;
  transform: booleanAttribute
&#125;);</code></pre>
          </div>
        </div>
        <div *ngSwitchCase="'model'" class="comparison-grid">
          <div class="card old">
            <h3>Old: Input + Output Pair</h3>
            <pre><code>&#64;Input() value = 0;
&#64;Output() valueChange = new EventEmitter();

// Parent: [(value)]="myProp"</code></pre>
          </div>
          <div class="card new">
            <h3>New: model() — One Line!</h3>
            <pre><code>value = model(0);

// That's it! Writable + auto-emits changes.
// Parent: [(value)]="myProp"</code></pre>
          </div>
        </div>
        <div *ngSwitchCase="'output'" class="comparison-grid">
          <div class="card old">
            <h3>Old: EventEmitter</h3>
            <pre><code>&#64;Output() clicked = new EventEmitter&lt;string&gt;();

this.clicked.emit('hello');</code></pre>
          </div>
          <div class="card new">
            <h3>New: output()</h3>
            <pre><code>clicked = output&lt;string&gt;();

this.clicked.emit('hello');
// Same API, but no RxJS dependency!</code></pre>
          </div>
        </div>
        <div *ngSwitchCase="'viewchild'" class="comparison-grid">
          <div class="card old">
            <h3>Old: &#64;ViewChild Decorator</h3>
            <pre><code>&#64;ViewChild('myDiv') divRef!: ElementRef;

ngAfterViewInit() &#123;
  // Must wait for this lifecycle hook
  console.log(this.divRef.nativeElement);
&#125;</code></pre>
          </div>
          <div class="card new">
            <h3>New: viewChild() Signal</h3>
            <pre><code>divRef = viewChild&lt;ElementRef&gt;('myDiv');

// It's a signal! Available reactively.
effect(() =&gt; &#123;
  console.log(this.divRef()?.nativeElement);
&#125;);</code></pre>
          </div>
        </div>
      </div>

      <section class="concept-block">
        <h3>Live Demo: All APIs Working Together</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Parent ↔ Child</span>
          </div>
          <p>Parent's value: <strong class="parent-value">{{ parentCount() }}</strong></p>
          <app-component-api-child 
            [label]="'Modern Angular'" 
            [(countModel)]="parentCount"
            (action)="onChildAction($event)" />
          
          <div class="child-message" *ngIf="lastChildMessage()">
            <span>📨 From child:</span> {{ lastChildMessage() }}
          </div>
        </div>
      </section>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Input Transform:</strong> Transform input values inline (e.g., string to number) without a setter.</li>
          <li><strong>output() is NOT a signal:</strong> It's part of the new API but doesn't wrap a value. It's a lightweight replacement for <code>EventEmitter</code>.</li>
          <li><strong>Reactive Queries:</strong> Signal queries (<code>viewChild</code>, <code>contentChildren</code>) are more predictable — you don't need <code>ngAfterViewInit</code> anymore.</li>
          <li><strong>required inputs:</strong> <code>input.required()</code> gives compile-time errors if the parent forgets to pass the value. Much better than runtime crashes!</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .feature-page { padding: 20px; }
    .subtitle { color: #5f6368; font-style: italic; margin-top: -5px; margin-bottom: 20px; }
    .explanation { background: linear-gradient(135deg, #e3f2fd, #e8eaf6); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1a73e8; }
    .api-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; }
    .api-card { text-align: center; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .api-card:hover { border-color: #1a73e8; transform: translateY(-2px); }
    .api-card.active { background: #1a73e8; color: white; border-color: #174ea6; }
    .api-icon { font-size: 1.8rem; margin-bottom: 4px; }
    .api-card h4 { margin: 4px 0; font-size: 0.9rem; }
    .api-card small { font-size: 0.7rem; opacity: 0.7; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .card { padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
    .old { border-left: 5px solid #d93025; background: #fff8f8; }
    .new { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; }
    .concept-block { margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0; }
    .demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .parent-value { font-size: 1.4rem; color: #1a73e8; }
    .child-message { margin-top: 12px; padding: 10px; background: #e8f5e9; border-radius: 6px; color: #2e7d32; font-weight: 500; animation: fadeIn 0.3s ease; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @media (max-width: 768px) { .api-cards { grid-template-columns: 1fr 1fr; } .comparison-grid { grid-template-columns: 1fr; } }
  `]
})
export class ComponentApiComponent {
  parentCount = signal(10);
  activeApi = signal('input');
  lastChildMessage = signal('');

  onChildAction(msg: string) {
    this.lastChildMessage.set(msg);
  }
}
