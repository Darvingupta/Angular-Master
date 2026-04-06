import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error-log',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Error Handling & Debugging</h2>
      <p class="subtitle">NG5002, NG9, ErrorHandler & Common Pitfalls</p>

      <div class="explanation">
        <p>Angular has a rich error system with specific error codes. Understanding common compilation errors and runtime issues is crucial for debugging and <strong>interview mastery</strong>.</p>
      </div>

      <div class="error-categories">
        <h3>Common Angular Errors</h3>
        <div class="category-tabs">
          <button [class.active]="activeTab() === 'compile'" (click)="activeTab.set('compile')">🔴 Compile-Time</button>
          <button [class.active]="activeTab() === 'runtime'" (click)="activeTab.set('runtime')">🟡 Runtime</button>
          <button [class.active]="activeTab() === 'signals'" (click)="activeTab.set('signals')">🔵 Signal-Specific</button>
        </div>

        @if (activeTab() === 'compile') {
          <div class="error-list">
            <div class="error-card">
              <div class="error-code">NG5002</div>
              <div class="error-body">
                <strong>Parser Error: Unknown element</strong>
                <p>You used a component in a template but forgot to add it to the <code>imports</code> array.</p>
                <pre><code>// ❌ Error
&#64;Component({{ '{' }}
  template: '&lt;app-header /&gt;'
  // Missing imports: [HeaderComponent]
{{ '}' }})

// ✅ Fix
&#64;Component({{ '{' }}
  imports: [HeaderComponent],
  template: '&lt;app-header /&gt;'
{{ '}' }})</code></pre>
              </div>
            </div>
            <div class="error-card">
              <div class="error-code">NG9</div>
              <div class="error-body">
                <strong>Property does not exist on component</strong>
                <p>Template references a property not defined in the component class.</p>
                <pre><code>// ❌ Template has {{ '{{' }} username {{ '}}' }}
// but component has no 'username' property

// ✅ Fix: Add the property
username = signal('darvin');</code></pre>
              </div>
            </div>
            <div class="error-card">
              <div class="error-code">NG8001</div>
              <div class="error-body">
                <strong>Unknown attribute or input</strong>
                <p>Using a directive attribute that isn't imported (e.g., <code>*ngIf</code> without <code>CommonModule</code>).</p>
              </div>
            </div>
          </div>
        }

        @if (activeTab() === 'runtime') {
          <div class="error-list">
            <div class="error-card">
              <div class="error-code warn">NG0100</div>
              <div class="error-body">
                <strong>ExpressionChangedAfterItHasBeenChecked</strong>
                <p>The most infamous Angular error. A binding changed between change detection cycles.</p>
                <pre><code>// ❌ Modifying state in lifecycle hooks
ngAfterViewInit() {{ '{' }}
  this.title = 'Updated!'; // Error!
{{ '}' }}

// ✅ Fix: Use setTimeout or signals
ngAfterViewInit() {{ '{' }}
  setTimeout(() => this.title = 'Updated!');
{{ '}' }}

// ✅ Better: Use signals (no CD issues!)
title = signal('Initial');
// Signals don't have this problem!</code></pre>
              </div>
            </div>
            <div class="error-card">
              <div class="error-code warn">NG0200</div>
              <div class="error-body">
                <strong>Circular Dependency in DI</strong>
                <p>Two services depend on each other. Fix with <code>forwardRef()</code> or refactor.</p>
              </div>
            </div>
          </div>
        }

        @if (activeTab() === 'signals') {
          <div class="error-list">
            <div class="error-card">
              <div class="error-code signal-err">NG0600</div>
              <div class="error-body">
                <strong>Writing to signals not allowed</strong>
                <p>Writing to a signal inside a <code>computed()</code> or <code>effect()</code> without <code>allowSignalWrites</code>.</p>
                <pre><code>// ❌ Error
effect(() => {{ '{' }}
  this.count.set(this.other() + 1);
{{ '}' }});

// ✅ Fix: Allow signal writes
effect(() => {{ '{' }}
  this.count.set(this.other() + 1);
{{ '}' }}, {{ '{' }} allowSignalWrites: true {{ '}' }});</code></pre>
              </div>
            </div>
            <div class="error-card">
              <div class="error-code signal-err">NG0601</div>
              <div class="error-body">
                <strong>Computed signal is read-only</strong>
                <p>Attempting to <code>.set()</code> on a <code>computed()</code> signal. Computed signals are derived — use <code>signal()</code> or <code>linkedSignal()</code> instead.</p>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="debug-section">
        <h3>Debugging Toolkit</h3>
        <div class="tools-grid">
          <div class="tool-card">
            <div class="tool-icon">🧪</div>
            <h4>Angular DevTools</h4>
            <p>Chrome extension for inspecting component trees, profiling change detection, and viewing injector hierarchies.</p>
          </div>
          <div class="tool-card">
            <div class="tool-icon">🔍</div>
            <h4>ng.getComponent()</h4>
            <p>Access any component instance from the browser console: <code>ng.getComponent(document.querySelector('app-root'))</code></p>
          </div>
          <div class="tool-card">
            <div class="tool-icon">📊</div>
            <h4>ng.profiler</h4>
            <p>Profile change detection timing with <code>ng.profiler.timeChangeDetection()</code></p>
          </div>
          <div class="tool-card">
            <div class="tool-icon">💡</div>
            <h4>ErrorHandler</h4>
            <p>Custom global error handler: <code>class MyErrorHandler implements ErrorHandler</code> — report to Sentry, etc.</p>
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>ExpressionChanged:</strong> "This exists because Angular checks bindings in dev mode to catch bugs. Signals eliminate this class of errors entirely."</li>
          <li><strong>Custom ErrorHandler:</strong> Override <code>ErrorHandler</code> to send errors to monitoring services (Sentry, DataDog): <code>{{ '{' }} provide: ErrorHandler, useClass: MyErrorHandler {{ '}' }}</code></li>
          <li><strong>Strict mode:</strong> Enable <code>strictTemplates: true</code> in tsconfig to catch more errors at compile time.</li>
          <li><strong>Error codes:</strong> Always reference the Angular error code (NGxxxx) when discussing issues. It shows you know the framework deeply.</li>
        </ul>
      </div>
    </div>
  `,
    styles: [`
    .feature-page { padding: 20px; }
    .subtitle { color: #5f6368; font-style: italic; margin-top: -5px; margin-bottom: 20px; }
    .explanation { background: linear-gradient(135deg, #e3f2fd, #e8eaf6); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1a73e8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; }
    .category-tabs { display: flex; gap: 4px; margin-bottom: 15px; }
    .category-tabs button { padding: 10px 20px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .category-tabs button:hover { border-color: #1a73e8; }
    .category-tabs button.active { background: #1a73e8; color: white; border-color: #174ea6; }
    .error-list { display: flex; flex-direction: column; gap: 12px; animation: fadeIn 0.3s ease; }
    .error-card { display: flex; gap: 15px; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; }
    .error-code { background: #d93025; color: white; padding: 6px 12px; border-radius: 6px; font-family: monospace; font-weight: 700; font-size: 0.85rem; white-space: nowrap; height: fit-content; }
    .error-code.warn { background: #e37400; }
    .error-code.signal-err { background: #1a73e8; }
    .error-body { flex: 1; }
    .error-body strong { display: block; margin-bottom: 4px; }
    .error-body p { font-size: 0.85rem; color: #666; margin: 0 0 8px; }
    .tools-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 15px 0; }
    .tool-card { text-align: center; padding: 20px 15px; border: 1px solid #e0e0e0; border-radius: 10px; background: white; transition: transform 0.2s; }
    .tool-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .tool-icon { font-size: 2rem; margin-bottom: 8px; }
    .tool-card h4 { margin: 4px 0; font-size: 0.9rem; }
    .tool-card p { font-size: 0.78rem; color: #666; margin: 4px 0 0; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @media (max-width: 768px) { .error-card { flex-direction: column; } .tools-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class ErrorLogComponent {
  activeTab = signal('compile');
}
