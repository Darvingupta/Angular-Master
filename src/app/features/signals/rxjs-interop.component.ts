import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-rxjs-interop',
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <h2>5. RxJS ↔ Signals Interop</h2>
      <p class="subtitle">toSignal() & toObservable() — Bridging Two Worlds</p>

      <div class="explanation">
        <p>Signals and RxJS are <strong>not competitors</strong> — they're teammates. Use <code>toSignal()</code> to consume Observables in templates, and <code>toObservable()</code> to use RxJS operators on Signal values.</p>
      </div>

      <div class="decision-chart">
        <h3>When to Use What?</h3>
        <div class="chart-grid">
          <div class="chart-item signal-item">
            <div class="chart-icon">📡</div>
            <h4>Use Signals</h4>
            <ul>
              <li>UI component state</li>
              <li>Form values</li>
              <li>Toggle / visibility flags</li>
              <li>Computed derived values</li>
            </ul>
          </div>
          <div class="chart-item bridge-item">
            <div class="chart-icon">🌉</div>
            <h4>Bridge</h4>
            <p><code>toSignal()</code></p>
            <p><code>toObservable()</code></p>
          </div>
          <div class="chart-item rxjs-item">
            <div class="chart-icon">🔄</div>
            <h4>Use RxJS</h4>
            <ul>
              <li>HTTP requests</li>
              <li>WebSocket streams</li>
              <li>debounceTime / switchMap</li>
              <li>Complex async orchestration</li>
            </ul>
          </div>
        </div>
      </div>

      <section class="concept-block">
        <h3>toSignal() — Observable → Signal</h3>
        <p>Convert any Observable into a Signal for use in templates. <strong>Auto-unsubscribes</strong> on component destroy.</p>
        
        <div class="comparison-grid">
          <div class="card old">
            <h3>Old Way: async Pipe</h3>
            <pre><code>// Template:
// {{ '{{' }} timer$ | async {{ '}}' }}

// Must handle null-check!
// Adds overhead per subscription</code></pre>
          </div>
          <div class="card new">
            <h3>New Way: toSignal()</h3>
            <pre><code>timer = toSignal(interval(1000), 
  {{ '{' }} initialValue: 0 {{ '}' }});

// Template: {{ '{{' }} timer() {{ '}}' }}
// Typed, no null-check needed!</code></pre>
          </div>
        </div>

        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Live Timer</span>
            <span class="demo-hint">RxJS interval(1000) → toSignal()</span>
          </div>
          <div class="timer-display">
            <div class="timer-value">{{ timer() }}</div>
            <div class="timer-label">seconds (auto-incrementing via RxJS)</div>
          </div>
          <div class="timer-flow">
            <span class="flow-step rxjs">interval(1000)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-step bridge">toSignal()</span>
            <span class="flow-arrow">→</span>
            <span class="flow-step signal">timer()</span>
            <span class="flow-arrow">→</span>
            <span class="flow-step template">Template</span>
          </div>
        </div>
      </section>

      <section class="concept-block">
        <h3>toObservable() — Signal → Observable</h3>
        <p>Convert a Signal into an Observable to leverage RxJS operators like <code>debounceTime</code>, <code>switchMap</code>, <code>distinctUntilChanged</code>.</p>

        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Live Bridge Demo</span>
          </div>
          <div class="bridge-demo">
            <div class="bridge-panel">
              <div class="panel-label signal-label">Signal World</div>
              <p>Count: <strong>{{ count() }}</strong></p>
              <button class="btn-action btn-inc" (click)="increment()">➕ Increment Signal</button>
            </div>
            <div class="bridge-connector">
              <div class="bridge-text">toObservable()</div>
              <div class="bridge-arrow">⟹</div>
              <div class="bridge-text">pipe(map(...))</div>
              <div class="bridge-arrow">⟹</div>
              <div class="bridge-text">subscribe()</div>
            </div>
            <div class="bridge-panel">
              <div class="panel-label rxjs-label">RxJS World</div>
              <p>Stream says:</p>
              <div class="stream-output">{{ streamMessage() || 'Waiting for signal change...' }}</div>
            </div>
          </div>
        </div>
        
        <pre><code>count = signal(0);
count$ = toObservable(this.count);

constructor() {{ '{' }}
  this.count$.pipe(
    map(v => 'RxJS received: ' + v)
  ).subscribe(msg => this.streamMessage.set(msg));
{{ '}' }}</code></pre>
      </section>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>When to use what?</strong> "Signals for synchronous UI state. RxJS for events, timers, HTTP, WebSockets, and complex async orchestration."</li>
          <li><strong>Injection Context:</strong> <code>toSignal</code> and <code>toObservable</code> must be called in an <strong>injection context</strong> (constructor, field initializer, or inside <code>runInInjectionContext</code>).</li>
          <li><strong>Auto Cleanup:</strong> Unlike manual subscriptions, <code>toSignal()</code> handles unsubscription automatically when the component is destroyed.</li>
          <li><strong>requireSync option:</strong> Use <code>toSignal(obs$, {{ '{' }} requireSync: true {{ '}' }})</code> for synchronous Observables (like BehaviorSubject) to avoid the <code>undefined</code> initial value.</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .feature-page { padding: 20px; }
    .subtitle { color: #5f6368; font-style: italic; margin-top: -5px; margin-bottom: 20px; }
    .explanation { background: linear-gradient(135deg, #e3f2fd, #e8eaf6); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1a73e8; }
    .decision-chart { margin-bottom: 30px; }
    .chart-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 15px; align-items: start; }
    .chart-item { padding: 20px; border-radius: 10px; }
    .signal-item { background: #e3f2fd; border: 2px solid #90caf9; }
    .bridge-item { text-align: center; padding: 30px 15px; background: #f3e5f5; border: 2px solid #ce93d8; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .rxjs-item { background: #fce4ec; border: 2px solid #ef9a9a; }
    .chart-icon { font-size: 2rem; margin-bottom: 5px; }
    .chart-item h4 { margin: 4px 0 8px; }
    .chart-item ul { margin: 0; padding-left: 18px; font-size: 0.85rem; }
    .chart-item li { margin-bottom: 4px; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .card { padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
    .old { border-left: 5px solid #d93025; background: #fff8f8; }
    .new { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; }
    .concept-block { margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0; }
    .demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .demo-hint { font-size: 0.75rem; color: #999; font-style: italic; }
    .timer-display { text-align: center; margin: 20px 0; }
    .timer-value { font-size: 3.5rem; font-weight: 700; color: #1a73e8; font-family: monospace; }
    .timer-label { font-size: 0.8rem; color: #999; }
    .timer-flow { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 15px; flex-wrap: wrap; }
    .flow-step { padding: 6px 14px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; font-weight: 600; }
    .flow-step.rxjs { background: #fce4ec; color: #c62828; }
    .flow-step.bridge { background: #f3e5f5; color: #7b1fa2; }
    .flow-step.signal { background: #e3f2fd; color: #1565c0; }
    .flow-step.template { background: #e8f5e9; color: #2e7d32; }
    .flow-arrow { color: #999; font-weight: 700; }
    .bridge-demo { display: grid; grid-template-columns: 1fr auto 1fr; gap: 15px; align-items: stretch; }
    .bridge-panel { padding: 20px; background: white; border-radius: 8px; border: 1px solid #e0e0e0; }
    .panel-label { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 700; margin-bottom: 10px; }
    .signal-label { background: #e3f2fd; color: #1565c0; }
    .rxjs-label { background: #fce4ec; color: #c62828; }
    .bridge-connector { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
    .bridge-text { font-family: monospace; font-size: 0.7rem; color: #7b1fa2; font-weight: 600; }
    .bridge-arrow { font-size: 1.2rem; color: #ce93d8; }
    .btn-action { padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-inc { background: linear-gradient(135deg, #1a73e8, #448aff); color: white; }
    .btn-inc:hover { transform: translateY(-1px); }
    .stream-output { background: #1e1e2e; color: #a6e3a1; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; min-height: 20px; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @media (max-width: 768px) { .comparison-grid, .bridge-demo, .chart-grid { grid-template-columns: 1fr; } }
  `]
})
export class RxjsInteropComponent {
  private timer$ = interval(1000);
  timer = toSignal(this.timer$, { initialValue: 0 });

  count = signal(0);
  streamMessage = signal('');
  private count$ = toObservable(this.count);

  constructor() {
    this.count$.pipe(
      map(v => `RxJS received Signal change: ${v}`)
    ).subscribe(msg => {
      this.streamMessage.set(msg);
    });
  }

  increment() {
    this.count.update(v => v + 1);
  }
}
