import { Component, signal, effect, OnInit, OnDestroy, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-lifecycle',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Component Lifecycle & Effects</h2>
      <p class="subtitle">Hooks, afterRender, afterNextRender & effect() — When Code Runs</p>

      <div class="explanation">
        <p>Angular provides lifecycle hooks to execute code at specific moments. Modern Angular adds <strong>signal-based effects</strong> and <strong>afterRender/afterNextRender</strong> to replace common patterns.</p>
      </div>

      <div class="lifecycle-flow">
        <h3>Lifecycle Timeline</h3>
        <div class="timeline">
          <div class="timeline-item" [class.active]="currentPhase() >= 1">
            <div class="timeline-dot" (click)="currentPhase.set(1)">1</div>
            <div class="timeline-label">
              <strong>constructor</strong>
              <small>DI injection</small>
            </div>
          </div>
          <div class="timeline-item" [class.active]="currentPhase() >= 2">
            <div class="timeline-dot" (click)="currentPhase.set(2)">2</div>
            <div class="timeline-label">
              <strong>ngOnChanges</strong>
              <small>Input changes</small>
            </div>
          </div>
          <div class="timeline-item" [class.active]="currentPhase() >= 3">
            <div class="timeline-dot" (click)="currentPhase.set(3)">3</div>
            <div class="timeline-label">
              <strong>ngOnInit</strong>
              <small>First render</small>
            </div>
          </div>
          <div class="timeline-item" [class.active]="currentPhase() >= 4">
            <div class="timeline-dot" (click)="currentPhase.set(4)">4</div>
            <div class="timeline-label">
              <strong>ngAfterViewInit</strong>
              <small>View ready</small>
            </div>
          </div>
          <div class="timeline-item" [class.active]="currentPhase() >= 5">
            <div class="timeline-dot" (click)="currentPhase.set(5)">5</div>
            <div class="timeline-label">
              <strong>ngOnDestroy</strong>
              <small>Cleanup</small>
            </div>
          </div>
        </div>

        <div class="phase-controls">
          <button class="btn-action btn-next" (click)="nextPhase()">▶ Next Phase</button>
          <button class="btn-action btn-reset" (click)="currentPhase.set(0)">🔄 Reset</button>
        </div>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Old Way: Lifecycle Hooks</h3>
          <pre><code>export class MyComp implements OnInit, 
  AfterViewInit, OnDestroy {{ '{' }}
  
  ngOnInit() {{ '{' }}
    this.loadData();
  {{ '}' }}
  
  ngAfterViewInit() {{ '{' }}
    // Access DOM elements
    this.chart.render();
  {{ '}' }}
  
  ngOnDestroy() {{ '{' }}
    this.sub.unsubscribe();
  {{ '}' }}
{{ '}' }}</code></pre>
        </div>
        <div class="card new">
          <h3>New Way: Effects + afterRender</h3>
          <pre><code>export class MyComp {{ '{' }}
  // Auto runs when signals change
  _ = effect(() => {{ '{' }}
    this.loadData(this.query());
  {{ '}' }});

  constructor() {{ '{' }}
    // Runs after every render
    afterRender(() => {{ '{' }}
      this.chart.render();
    {{ '}' }});
    
    // Runs once after first render
    afterNextRender(() => {{ '{' }}
      this.initThirdPartyLib();
    {{ '}' }});
  {{ '}' }}
  // No manual cleanup for effects!
{{ '}' }}</code></pre>
        </div>
      </div>

      <div class="hook-matrix">
        <h3>When to Use What</h3>
        <div class="matrix-grid">
          <div class="matrix-row header">
            <div>Purpose</div>
            <div>Classic Hook</div>
            <div>Modern Alternative</div>
          </div>
          <div class="matrix-row">
            <div>React to data changes</div>
            <div class="old-approach">ngOnChanges + ngDoCheck</div>
            <div class="new-approach">effect() / computed()</div>
          </div>
          <div class="matrix-row">
            <div>Initial data loading</div>
            <div class="old-approach">ngOnInit</div>
            <div class="new-approach">resource() / constructor effect</div>
          </div>
          <div class="matrix-row">
            <div>DOM manipulation</div>
            <div class="old-approach">ngAfterViewInit</div>
            <div class="new-approach">afterNextRender()</div>
          </div>
          <div class="matrix-row">
            <div>Repeated DOM updates</div>
            <div class="old-approach">ngAfterViewChecked</div>
            <div class="new-approach">afterRender()</div>
          </div>
          <div class="matrix-row">
            <div>Cleanup</div>
            <div class="old-approach">ngOnDestroy</div>
            <div class="new-approach">DestroyRef.onDestroy()</div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>Live Demo: Effect Lifecycle</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Effect Log</span>
            <span class="demo-hint">Change the counter to see effects fire</span>
          </div>
          <div class="demo-controls">
            <button class="btn-action btn-inc" (click)="incrementCounter()">➕ Increment ({{ counter() }})</button>
          </div>
          <div class="effect-log">
            @for (log of effectLog(); track log) {
              <div class="log-entry">
                <span class="log-time">{{ log.time }}</span>
                <span class="log-msg">{{ log.msg }}</span>
              </div>
            } @empty {
              <div class="log-entry empty">Waiting for signal changes...</div>
            }
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>effect() vs ngOnChanges:</strong> "Effects react to <em>any</em> signal dependency, not just inputs. And they're cleaner — no <code>SimpleChanges</code> map."</li>
          <li><strong>afterRender:</strong> Runs after <em>every</em> render cycle. Use for DOM measurement, third-party chart libs. Not SSR-safe!</li>
          <li><strong>afterNextRender:</strong> Runs only once after the <em>next</em> render. Perfect for initialization. Also not SSR-safe.</li>
          <li><strong>DestroyRef:</strong> <code>inject(DestroyRef).onDestroy(() => ...)</code> replaces <code>ngOnDestroy</code> — works anywhere, including services and functions.</li>
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
    .old { border-left: 5px solid #d93025; background: #fff8f8; }
    .new { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; }
    .timeline { display: flex; align-items: flex-start; justify-content: space-between; position: relative; padding: 20px 0; margin: 0 20px; }
    .timeline::before { content: ''; position: absolute; top: 34px; left: 0; right: 0; height: 3px; background: #e0e0e0; }
    .timeline-item { text-align: center; position: relative; z-index: 1; flex: 1; }
    .timeline-dot { width: 30px; height: 30px; border-radius: 50%; background: #e0e0e0; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 8px; cursor: pointer; transition: all 0.3s; font-size: 0.85rem; }
    .timeline-item.active .timeline-dot { background: #1a73e8; transform: scale(1.2); }
    .timeline-label strong { display: block; font-size: 0.8rem; }
    .timeline-label small { font-size: 0.65rem; color: #999; }
    .phase-controls { display: flex; gap: 10px; justify-content: center; margin-top: 15px; }
    .btn-action { padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-next { background: linear-gradient(135deg, #1a73e8, #448aff); color: white; }
    .btn-reset { background: #f5f5f5; color: #333; border: 1px solid #ddd; }
    .btn-inc { background: linear-gradient(135deg, #43a047, #66bb6a); color: white; margin-bottom: 15px; }
    .btn-action:hover { transform: translateY(-1px); }
    .matrix-grid { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; margin: 15px 0; }
    .matrix-row { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid #e0e0e0; }
    .matrix-row:last-child { border-bottom: none; }
    .matrix-row.header { background: #1e1e2e; color: #cdd6f4; font-weight: 700; }
    .matrix-row div { padding: 10px 15px; font-size: 0.85rem; }
    .old-approach { color: #d93025; }
    .new-approach { color: #188038; font-weight: 600; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .demo-hint { font-size: 0.75rem; color: #999; font-style: italic; }
    .effect-log { max-height: 200px; overflow-y: auto; background: #1e1e2e; border-radius: 6px; padding: 10px; margin-top: 10px; }
    .log-entry { display: flex; gap: 10px; padding: 6px 8px; border-bottom: 1px solid #313244; font-family: monospace; font-size: 0.82rem; }
    .log-entry.empty { color: #6c7086; font-style: italic; }
    .log-time { color: #89b4fa; min-width: 80px; }
    .log-msg { color: #a6e3a1; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } .timeline { flex-direction: column; gap: 10px; } .timeline::before { display: none; } }
  `]
})
export class LifecycleComponent {
  counter = signal(0);
  currentPhase = signal(0);
  effectLog = signal<Array<{time: string, msg: string}>>([]);

  constructor() {
    effect(() => {
      const c = this.counter();
      const now = new Date().toLocaleTimeString();
      const logs = untracked(() => this.effectLog());
      
      this.effectLog.set([
        { time: now, msg: `effect() fired: counter is now ${c}` },
        ...logs.slice(0, 9)
      ]);
    }, { allowSignalWrites: true });
  }

  nextPhase() {
    this.currentPhase.update(p => p < 5 ? p + 1 : 1);
  }

  incrementCounter() {
    this.counter.update(v => v + 1);
  }
}
