import { Component, signal, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-async-forms',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="feature-page">
      <h2>4. Async Data & Signal Forms</h2>
      <p class="subtitle">resource(), Zoneless & The Future of Angular</p>

      <div class="explanation">
        <p>The <code>resource()</code> API is Angular's declarative approach to <strong>async data fetching</strong> within the Signal ecosystem. Combined with upcoming Signal Forms, it represents the future of Angular development.</p>
      </div>

      <section class="concept-block">
        <h3>resource() — Declarative Async <span class="version-badge exp">Experimental</span></h3>
        
        <div class="comparison-grid">
          <div class="card old">
            <h3>Old Way: Subscribe Manually</h3>
            <pre><code>loading = false;
data: Todo | null = null;
error: string | null = null;

ngOnInit() {{ '{' }}
  this.loading = true;
  this.http.get&lt;Todo&gt;('/api/todo/1')
    .subscribe({{ '{' }}
      next: d => {{ '{' }} this.data = d; this.loading = false; {{ '}' }},
      error: e => {{ '{' }} this.error = e.message; this.loading = false; {{ '}' }}
    {{ '}' }});
{{ '}' }}
// 😩 8 lines just to fetch one thing!</code></pre>
          </div>
          <div class="card new">
            <h3>New Way: resource()</h3>
            <pre><code>data = resource({{ '{' }}
  loader: async () => {{ '{' }}
    const r = await fetch('/api/todo/1');
    return r.json();
  {{ '}' }}
{{ '}' }});

// Access in template:
// data.value()     — the data
// data.isLoading() — loading state
// data.error()     — error state
// data.reload()    — manual refresh
// ✅ 1 declaration, everything built-in!</code></pre>
          </div>
        </div>

        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Live Resource Demo</span>
          </div>
          <div class="resource-panel">
            <div class="resource-status">
              <span class="status-dot" [class.loading]="dataResource.isLoading()" [class.ready]="!dataResource.isLoading()"></span>
              <span>{{ dataResource.isLoading() ? 'Fetching...' : 'Ready' }}</span>
            </div>
            <button class="btn-action btn-reload" (click)="dataResource.reload()">🔄 Reload Data</button>
          </div>
          @if (!dataResource.isLoading() && dataResource.value()) {
            <div class="data-display">
              <div class="data-row">
                <span class="data-key">id</span>
                <span class="data-val">{{ dataResource.value()?.id }}</span>
              </div>
              <div class="data-row">
                <span class="data-key">title</span>
                <span class="data-val">{{ dataResource.value()?.title }}</span>
              </div>
              <div class="data-row">
                <span class="data-key">completed</span>
                <span class="data-val" [class.bool-true]="dataResource.value()?.completed" [class.bool-false]="!dataResource.value()?.completed">{{ dataResource.value()?.completed }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <section class="concept-block">
        <h3>Signal Forms <span class="version-badge future">Future</span></h3>
        <p>Signal-based forms will replace <code>FormGroup</code> / <code>FormControl</code> with reactive signals for values, validation, and status. Until then, use <code>model()</code> for simplified reactive forms.</p>
        
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Preview with model()</span>
          </div>
          <div class="form-demo">
            <div class="form-field">
              <label>Username</label>
              <input [(ngModel)]="username" placeholder="Enter username" class="form-input" />
            </div>
            <div class="form-field">
              <label>Email</label>
              <input [(ngModel)]="email" placeholder="Enter email" class="form-input" />
            </div>
            <div class="form-preview">
              <div class="preview-label">Live Signal Values:</div>
              <pre><code>{{ '{' }}
  username: "{{ username() }}",
  email: "{{ email() }}",
  isValid: {{ isFormValid() }}
{{ '}' }}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section class="concept-block">
        <h3>The Zoneless Future</h3>
        <div class="roadmap">
          <div class="roadmap-item done">
            <div class="roadmap-dot"></div>
            <div class="roadmap-content">
              <strong>v16: Signals Introduced</strong>
              <p>signal(), computed(), effect() — the primitives</p>
            </div>
          </div>
          <div class="roadmap-item done">
            <div class="roadmap-dot"></div>
            <div class="roadmap-content">
              <strong>v17: Signal Inputs & Queries</strong>
              <p>input(), viewChild(), model() — component APIs</p>
            </div>
          </div>
          <div class="roadmap-item done">
            <div class="roadmap-dot"></div>
            <div class="roadmap-content">
              <strong>v19: resource() & linkedSignal</strong>
              <p>Async data + advanced patterns</p>
            </div>
          </div>
          <div class="roadmap-item future">
            <div class="roadmap-dot"></div>
            <div class="roadmap-content">
              <strong>Future: Signal Forms & Zoneless</strong>
              <p>Reactive forms + no Zone.js = smaller, faster apps</p>
            </div>
          </div>
        </div>
      </section>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Zoneless:</strong> Signals are the foundation for "Zoneless Angular," removing <code>zone.js</code> entirely. Apps become ~50KB smaller.</li>
          <li><strong>Hydration:</strong> <code>resource()</code> is designed to work seamlessly with SSR and partial hydration.</li>
          <li><strong>resource vs HttpClient:</strong> resource() is for signal-native async. HttpClient still works but returns Observables. Bridge with <code>toSignal()</code>.</li>
          <li><strong>Simplicity:</strong> "The Angular team is moving from complex RxJS streams for UI state to simple, predictable Signals."</li>
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
    .version-badge { font-size: 0.65rem; background: #1a73e8; color: white; padding: 2px 8px; border-radius: 10px; vertical-align: middle; margin-left: 6px; }
    .version-badge.exp { background: #e37400; }
    .version-badge.future { background: #7c4dff; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0; }
    .demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .resource-panel { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .resource-status { display: flex; align-items: center; gap: 8px; font-weight: 600; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; }
    .status-dot.loading { background: #e37400; animation: blink 1s infinite; }
    .status-dot.ready { background: #43a047; }
    .btn-action { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-reload { background: linear-gradient(135deg, #1a73e8, #448aff); color: white; }
    .btn-reload:hover { transform: translateY(-1px); }
    .data-display { background: #1e1e2e; border-radius: 6px; overflow: hidden; }
    .data-row { display: flex; padding: 10px 15px; border-bottom: 1px solid #313244; }
    .data-key { color: #89b4fa; font-family: monospace; font-weight: 600; min-width: 100px; }
    .data-val { color: #a6e3a1; font-family: monospace; }
    .bool-true { color: #a6e3a1; }
    .bool-false { color: #f38ba8; }
    .form-demo { display: flex; flex-direction: column; gap: 15px; }
    .form-field { display: flex; flex-direction: column; gap: 4px; }
    .form-field label { font-weight: 600; font-size: 0.85rem; }
    .form-input { padding: 10px 14px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 1rem; transition: border-color 0.2s; }
    .form-input:focus { outline: none; border-color: #1a73e8; }
    .form-preview { margin-top: 10px; }
    .preview-label { font-size: 0.8rem; color: #999; margin-bottom: 6px; }
    .roadmap { position: relative; padding-left: 30px; }
    .roadmap::before { content: ''; position: absolute; left: 9px; top: 0; bottom: 0; width: 2px; background: #e0e0e0; }
    .roadmap-item { position: relative; margin-bottom: 25px; }
    .roadmap-dot { position: absolute; left: -26px; top: 4px; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; }
    .roadmap-item.done .roadmap-dot { background: #43a047; }
    .roadmap-item.future .roadmap-dot { background: #7c4dff; animation: glow 2s infinite; }
    .roadmap-content strong { display: block; margin-bottom: 2px; }
    .roadmap-content p { font-size: 0.85rem; color: #666; margin: 0; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    @keyframes glow { 0%, 100% { box-shadow: 0 0 4px #7c4dff; } 50% { box-shadow: 0 0 12px #7c4dff; } }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } }
  `]
})
export class AsyncFormsComponent {
  username = signal('darvin_user');
  email = signal('darvin@angular.dev');
  isFormValid = signal(true);

  dataResource = resource({
    loader: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { id: 1, title: 'Learn Signals', completed: false };
    }
  });
}
