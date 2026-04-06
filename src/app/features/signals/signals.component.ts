import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signals',
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <h2>Angular Signals (v16+)</h2>
      
      <div class="explanation">
        <p>Signals are a new way of managing fine-grained reactivity in Angular. Unlike Zone.js, which checks the entire component tree, Signals tell Angular exactly which part of the UI needs to update.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Old Way: BehaviorSubject</h3>
          <pre><code>
private count$ = new BehaviorSubject(0);
currentCount$ = this.count$.asObservable();

// Template
{{ '{{' }} currentCount$ | async {{ '}}' }}
          </code></pre>
        </div>
        <div class="card new">
          <h3>New Way: Signals</h3>
          <pre><code>
count = signal(0);

// Template
{{ count() }}
          </code></pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>Live Demo</h3>
        <div class="counter-box">
          <button (click)="decrement()">-</button>
          <span class="count-display">{{ count() }}</span>
          <button (click)="increment()">+</button>
        </div>
        <p>Computed (Count x 2): <strong>{{ doubleCount() }}</strong></p>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>What is a Signal?</strong> A wrapper around a value that notifies interested consumers when that value changes.</li>
          <li><strong>Glitch-free:</strong> Signals ensure that derived values (computed) always stay in sync, avoiding the "diamond problem" in reactive programming.</li>
          <li><strong>Effect:</strong> Use <code>effect()</code> for side-effects (logging, API calls) when a signal changes. It runs at least once and then whenever its dependencies change.</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .feature-page { padding: 20px; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .card { padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
    .old { border-left: 5px solid #d93025; background: #fff8f8; }
    .new { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #eee; padding: 10px; border-radius: 4px; overflow-x: auto; }
    .counter-box { display: flex; align-items: center; gap: 20px; font-size: 1.5rem; margin: 20px 0; }
    button { padding: 10px 20px; font-size: 1.2rem; cursor: pointer; border: none; border-radius: 4px; background: #1a73e8; color: white; }
    .count-display { font-weight: bold; min-width: 40px; text-align: center; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
  `]
})
export class SignalsComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log(`Current count is: ${this.count()}`);
    });
  }

  increment() {
    this.count.update(c => c + 1);
  }

  decrement() {
    this.count.update(c => Math.max(0, c - 1));
  }
}
