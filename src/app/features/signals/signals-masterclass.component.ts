import { Component, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signals-masterclass',
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <h2>1. Core Signal Concepts</h2>
      <p class="subtitle">The Foundation of Modern Angular Reactivity</p>

      <div class="explanation">
        <p><strong>Signals</strong> are Angular's new reactive primitive (v16+). They are <strong>synchronous, glitch-free</strong> wrappers around values that notify consumers when they change — replacing the need for Zone.js change detection.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Old Way: Zone.js Change Detection</h3>
          <pre><code>
// Component property — Zone.js checks EVERYTHING
export class AppComponent {{ '{' }}
  balance = 0;
  
  deposit() {{ '{' }}
    this.balance += 100;
    // Zone.js monkey-patches setTimeout, 
    // click events, promises...
    // Then runs change detection on ALL components 😱
  {{ '}' }}
{{ '}' }}
          </code></pre>
        </div>
        <div class="card new">
          <h3>New Way: Signals (Fine-Grained)</h3>
          <pre><code>
// Only the views reading this signal update ✅
export class AppComponent {{ '{' }}
  balance = signal(0);
  
  deposit() {{ '{' }}
    this.balance.update(v => v + 100);
    // Only components reading balance() re-render
    // No Zone.js needed!
  {{ '}' }}
{{ '}' }}
          </code></pre>
        </div>
      </div>

      <section class="concept-block">
        <h3>Writable Signals: <code>signal()</code></h3>
        <p>Create and modify state. Use <code>.set()</code> for replacement and <code>.update()</code> for computing from previous state.</p>
        
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Live Demo</span>
          </div>
          <p>Current Balance: <strong class="balance-display">{{ this.balance() | currency }}</strong></p>
          <div class="btn-group">
            <button class="btn-action btn-deposit" (click)="deposit()">💰 Deposit $100 (.update)</button>
            <button class="btn-action btn-reset" (click)="reset()">🔄 Reset to $0 (.set)</button>
          </div>
        </div>
        
        <pre><code>balance = signal(0);
this.balance.set(0);          // Replace value
this.balance.update(v => v + 100); // Compute from previous</code></pre>
      </section>

      <section class="concept-block">
        <h3>Computed Signals: <code>computed()</code></h3>
        <p>Read-only signals derived from others. <strong>Lazily evaluated</strong> and <strong>memoized</strong> — they only re-compute when their dependencies actually change.</p>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Derived Values</span>
          </div>
          <div class="computed-display">
            <div class="computed-item">
              <span class="computed-label">Balance</span>
              <span class="computed-value">{{ balance() | currency }}</span>
            </div>
            <div class="computed-arrow">→</div>
            <div class="computed-item">
              <span class="computed-label">Tax (10%)</span>
              <span class="computed-value tax">{{ tax() | currency }}</span>
            </div>
            <div class="computed-arrow">→</div>
            <div class="computed-item">
              <span class="computed-label">Net Amount</span>
              <span class="computed-value net">{{ net() | currency }}</span>
            </div>
          </div>
        </div>
        <pre><code>tax = computed(() => this.balance() * 0.1);
net = computed(() => this.balance() - this.tax());
// Memoized: won't recalculate unless balance changes</code></pre>
      </section>

      <section class="concept-block">
        <h3>Effects & Cleanup: <code>effect()</code></h3>
        <p>Side effects that run on every signal change. Use <code>onCleanup</code> to prevent memory leaks (clear timers, cancel requests).</p>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Effect Log</span>
            <span class="demo-hint">Deposit or reset above to see effects fire</span>
          </div>
          <div class="effect-log-container">
            @for (log of effectLogs(); track log) {
              <div class="effect-entry">📋 {{ log }}</div>
            } @empty {
              <div class="effect-entry empty">No effects logged yet. Change the balance!</div>
            }
          </div>
        </div>
        <pre><code>effect((onCleanup) => {{ '{' }}
  const val = this.balance();
  console.log('Balance changed:', val);
  
  const timer = setTimeout(() => console.log('Delayed'), 1000);
  onCleanup(() => clearTimeout(timer)); // Cleanup!
{{ '}' }}, {{ '{' }} allowSignalWrites: true {{ '}' }});</code></pre>
      </section>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Getter Functions:</strong> Signals are functions. You must call them: <code>mySignal()</code> in templates and TypeScript.</li>
          <li><strong>Memoization:</strong> Computed signals only re-run if their dependencies change AND they are being read.</li>
          <li><strong>Glitch-Free:</strong> Angular ensures no intermediate inconsistent states. If A and B both depend on C, both get the same consistent value.</li>
          <li><strong>vs RxJS:</strong> "Signals are for synchronous state, RxJS is for async streams." They coexist — use <code>toSignal()</code> and <code>toObservable()</code> to bridge.</li>
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
    .concept-block { margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0; }
    .demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .demo-hint { font-size: 0.75rem; color: #999; font-style: italic; }
    .balance-display { font-size: 1.6rem; color: #1a73e8; }
    .btn-group { display: flex; gap: 10px; margin-top: 12px; }
    .btn-action { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-deposit { background: linear-gradient(135deg, #43a047, #66bb6a); color: white; }
    .btn-deposit:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(67,160,71,0.3); }
    .btn-reset { background: #f5f5f5; color: #333; border: 1px solid #ddd; }
    .btn-reset:hover { background: #eee; }
    .computed-display { display: flex; align-items: center; gap: 15px; justify-content: center; flex-wrap: wrap; }
    .computed-item { text-align: center; padding: 12px 20px; background: white; border-radius: 8px; border: 1px solid #e0e0e0; min-width: 120px; }
    .computed-label { display: block; font-size: 0.75rem; color: #999; margin-bottom: 4px; }
    .computed-value { font-size: 1.3rem; font-weight: 700; color: #1a73e8; }
    .computed-value.tax { color: #d93025; }
    .computed-value.net { color: #188038; }
    .computed-arrow { font-size: 1.4rem; color: #ccc; }
    .effect-log-container { max-height: 150px; overflow-y: auto; background: #1e1e2e; border-radius: 6px; padding: 10px; }
    .effect-entry { font-family: monospace; font-size: 0.82rem; color: #a6e3a1; padding: 4px 8px; border-bottom: 1px solid #313244; }
    .effect-entry.empty { color: #6c7086; font-style: italic; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } .computed-display { flex-direction: column; } .computed-arrow { transform: rotate(90deg); } }
  `]
})
export class SignalsMasterclassComponent {
  balance = signal(0);
  tax = computed(() => this.balance() * 0.1);
  net = computed(() => this.balance() - this.tax());
  
  effectLogs = signal<string[]>([]);

  constructor() {
    effect((onCleanup) => {
      const b = this.balance();
      const logs = untracked(() => this.effectLogs());
      
      this.effectLogs.set([`Balance is now ${b}`, ...logs.slice(0, 4)]);
      
      const t = setTimeout(() => console.log('Async task for balance:', b), 1000);
      onCleanup(() => clearTimeout(t));
    }, { allowSignalWrites: true });
  }

  deposit() {
    this.balance.update(v => v + 100);
  }

  reset() {
    this.balance.set(0);
  }
}
