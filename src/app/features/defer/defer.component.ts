import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-defer',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Deferrable Views (&#64;defer)</h2>
      <p class="subtitle">Lazy-Load Template Sections — Declaratively (v17+)</p>

      <div class="explanation">
        <p><code>&#64;defer</code> is a <strong>declarative way to lazy-load</strong> specific parts of a template. The Angular compiler automatically splits the content into separate JS chunks — reducing initial bundle size with zero manual effort.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Old Way: Dynamic Component Loading</h3>
          <pre><code>// Manual, imperative, verbose
&#64;ViewChild('container', {{ '{' }} read: ViewContainerRef {{ '}' }})
container!: ViewContainerRef;

async loadHeavyComp() {{ '{' }}
  const {{ '{' }} HeavyComponent {{ '}' }} = 
    await import('./heavy.component');
  this.container.createComponent(HeavyComponent);
{{ '}' }}</code></pre>
        </div>
        <div class="card new">
          <h3>New Way: &#64;defer Block</h3>
          <pre><code>// Declarative, automatic code-splitting!
&#64;defer (on viewport) {{ '{' }}
  &lt;heavy-component /&gt;
{{ '}' }} &#64;placeholder {{ '{' }}
  &lt;p&gt;Loading...&lt;/p&gt;
{{ '}' }} &#64;loading (minimum 500ms) {{ '{' }}
  &lt;spinner /&gt;
{{ '}' }} &#64;error {{ '{' }}
  &lt;p&gt;Oops!&lt;/p&gt;
{{ '}' }}</code></pre>
        </div>
      </div>

      <div class="triggers-section">
        <h3>Defer Triggers</h3>
        <div class="trigger-grid">
          @for (trigger of triggers; track trigger.name) {
            <div class="trigger-card" [class.active]="selectedTrigger() === trigger.name" (click)="selectedTrigger.set(trigger.name)">
              <div class="trigger-icon">{{ trigger.icon }}</div>
              <strong>{{ trigger.name }}</strong>
              <small>{{ trigger.desc }}</small>
            </div>
          }
        </div>
        @if (selectedTrigger()) {
          <div class="trigger-detail">
            @for (trigger of triggers; track trigger.name) {
              @if (trigger.name === selectedTrigger()) {
                <pre><code>{{ trigger.code }}</code></pre>
              }
            }
          </div>
        }
      </div>

      <div class="demo-section">
        <h3>Live Demo: &#64;defer (on interaction)</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Interactive Demo</span>
            <span class="demo-hint">Content below is NOT loaded yet!</span>
          </div>
          
          <div class="defer-demo">
            @defer (on interaction(loadBtn)) {
              <div class="heavy-content">
                <div class="success-icon">✅</div>
                <h4>Heavy Component Loaded!</h4>
                <p>This part was downloaded and rendered only after you clicked the button.</p>
                <p>Check the <strong>Network tab</strong> in DevTools to see the separate JS chunk!</p>
                <div class="chunk-visual">
                  <div class="chunk-box main">main.js</div>
                  <div class="chunk-arrow">+</div>
                  <div class="chunk-box lazy">chunk-DEFER.js</div>
                  <div class="chunk-arrow">=</div>
                  <div class="chunk-box total">Loaded on demand!</div>
                </div>
              </div>
            } @placeholder {
              <button #loadBtn class="btn-action btn-load">🚀 Click to Lazy-Load Content</button>
            } @loading (minimum 1s) {
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Simulating network delay (1s)...</p>
              </div>
            } @error {
              <p class="error-state">❌ Something went wrong while loading.</p>
            }
          </div>
        </div>
      </div>

      <div class="blocks-overview">
        <h3>The 4 Blocks</h3>
        <div class="blocks-grid">
          <div class="block-card">
            <div class="block-name">&#64;defer</div>
            <p>The actual lazy content</p>
          </div>
          <div class="block-card">
            <div class="block-name">&#64;placeholder</div>
            <p>Shown before the trigger fires</p>
          </div>
          <div class="block-card">
            <div class="block-name">&#64;loading</div>
            <p>Shown while downloading the chunk</p>
          </div>
          <div class="block-card">
            <div class="block-name">&#64;error</div>
            <p>Shown if chunk download fails</p>
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>How it works:</strong> The Angular compiler automatically splits the content inside <code>&#64;defer</code> into a separate JS file (chunk). No manual config needed.</li>
          <li><strong>Prefetch:</strong> Combine trigger + prefetch: <code>&#64;defer (on viewport; prefetch on idle)</code>. This prefetches the chunk during idle time, then renders on viewport.</li>
          <li><strong>SSR:</strong> <code>&#64;defer</code> blocks are server-rendered as their <code>&#64;placeholder</code> content. The actual content loads only on the client.</li>
          <li><strong>Minimum time:</strong> Use <code>&#64;loading (minimum 500ms)</code> to prevent flickering for fast loads.</li>
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
    .trigger-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin: 15px 0; }
    .trigger-card { text-align: center; padding: 12px 8px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .trigger-card:hover { border-color: #1a73e8; }
    .trigger-card.active { background: #1a73e8; color: white; border-color: #174ea6; }
    .trigger-icon { font-size: 1.5rem; margin-bottom: 4px; }
    .trigger-card strong { display: block; font-size: 0.8rem; }
    .trigger-card small { font-size: 0.65rem; opacity: 0.7; }
    .trigger-detail { animation: fadeIn 0.3s ease; margin-bottom: 20px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .demo-hint { font-size: 0.75rem; color: #999; font-style: italic; }
    .defer-demo { border: 2px dashed #ccc; padding: 30px; text-align: center; background: white; border-radius: 8px; }
    .btn-action { padding: 12px 28px; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1rem; transition: all 0.2s; }
    .btn-load { background: linear-gradient(135deg, #1a73e8, #448aff); color: white; }
    .btn-load:hover { transform: scale(1.03); box-shadow: 0 4px 12px rgba(26,115,232,0.3); }
    .heavy-content { animation: fadeIn 0.4s ease; }
    .success-icon { font-size: 3rem; margin-bottom: 8px; }
    .heavy-content h4 { color: #188038; font-size: 1.3rem; }
    .chunk-visual { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
    .chunk-box { padding: 8px 16px; border-radius: 6px; font-family: monospace; font-weight: 600; font-size: 0.85rem; }
    .chunk-box.main { background: #e3f2fd; color: #1565c0; }
    .chunk-box.lazy { background: #e8f5e9; color: #2e7d32; }
    .chunk-box.total { background: #f3e5f5; color: #7b1fa2; }
    .chunk-arrow { font-weight: 700; color: #999; }
    .loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; color: #1a73e8; }
    .spinner { width: 30px; height: 30px; border: 3px solid #eee; border-top-color: #1a73e8; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .error-state { color: #d93025; font-weight: 600; }
    .blocks-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; }
    .block-card { text-align: center; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background: white; }
    .block-name { font-family: monospace; font-weight: 700; color: #1a73e8; margin-bottom: 6px; font-size: 1rem; }
    .block-card p { font-size: 0.8rem; color: #666; margin: 0; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } .trigger-grid { grid-template-columns: 1fr 1fr; } .blocks-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class DeferComponent {
  selectedTrigger = signal('on viewport');

  triggers = [
    { name: 'on idle', icon: '😴', desc: 'Browser idle', code: '@defer (on idle) {\n  <heavy-chart />\n}' },
    { name: 'on viewport', icon: '👁', desc: 'Scrolls into view', code: '@defer (on viewport) {\n  <image-gallery />\n}' },
    { name: 'on interaction', icon: '👆', desc: 'Click / focus', code: '@defer (on interaction(btn)) {\n  <details-panel />\n} @placeholder {\n  <button #btn>Show Details</button>\n}' },
    { name: 'on hover', icon: '🖱', desc: 'Mouse hover', code: '@defer (on hover(card)) {\n  <tooltip />\n} @placeholder {\n  <div #card>Hover me</div>\n}' },
    { name: 'on timer', icon: '⏱', desc: 'After delay', code: '@defer (on timer(3s)) {\n  <promo-banner />\n} @placeholder {\n  <p>Promo loads in 3s...</p>\n}' }
  ];
}
