import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mfe-overview',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Micro Frontends — Overview & Architecture</h2>

      <div class="explanation">
        <p><strong>Micro Frontends</strong> extend the microservices concept to the frontend. Instead of one monolithic SPA, the UI is composed of <strong>independently developed, tested, and deployed</strong> pieces — each owned by a different team.</p>
        <p>Think of it as: <em>"Each page section or feature is its own mini Angular app."</em></p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Monolith SPA</h3>
          <pre><code>
┌──────────────────────────┐
│     Single Angular App    │
│  ┌──────┐ ┌──────┐       │
│  │ Auth │ │ Shop │  ...  │
│  └──────┘ └──────┘       │
│  One repo, one build,    │
│  one deploy pipeline     │
└──────────────────────────┘
          </code></pre>
          <ul>
            <li>Single codebase for entire UI</li>
            <li>All teams deploy together</li>
            <li>One broken feature blocks all</li>
          </ul>
        </div>
        <div class="card new">
          <h3>Micro Frontend Architecture</h3>
          <pre><code>
┌────────────────────────────┐
│  App Shell (Host / Router) │
│  ┌──────┐ ┌──────┐        │
│  │Team A│ │Team B│  ...   │
│  │ Auth │ │ Shop │        │
│  └──────┘ └──────┘        │
│  Independent repos/builds  │
└────────────────────────────┘
          </code></pre>
          <ul>
            <li>Each feature = separate app</li>
            <li>Teams deploy independently</li>
            <li>Fault isolation per feature</li>
          </ul>
        </div>
      </div>

      <div class="demo-section">
        <h3>Live Demo: Integration Patterns</h3>
        <p>Click each pattern to learn how micro frontends can be composed:</p>

        <div class="pattern-selector">
          @for (p of patterns; track p.id) {
            <button
              [class.active]="selectedPattern() === p.id"
              (click)="selectPattern(p.id)"
              class="pattern-btn">
              {{ p.icon }} {{ p.name }}
            </button>
          }
        </div>

        <div class="pattern-detail">
          @if (selectedPattern() === 'build') {
            <div class="pattern-card">
              <h4>&#128296; Build-Time Integration</h4>
              <p>Each MFE is published as an <strong>npm package</strong>. The host app installs them as dependencies and builds everything together.</p>
              <pre><code>// package.json of host
&#123;
  "dependencies": &#123;
    "&#64;team-a/auth-mfe": "^2.1.0",
    "&#64;team-b/shop-mfe": "^3.0.0"
  &#125;
&#125;</code></pre>
              <div class="pros-cons">
                <span class="pro">&#10003; Type safety at compile time</span>
                <span class="con">&#10007; Must redeploy host for any MFE update</span>
              </div>
            </div>
          }
          @if (selectedPattern() === 'runtime') {
            <div class="pattern-card">
              <h4>&#9889; Run-Time Integration (Module Federation)</h4>
              <p>Each MFE is deployed independently. The host <strong>fetches remote bundles at runtime</strong> — no rebuild needed.</p>
              <pre><code>// Dynamic import at runtime
const m = await loadRemoteModule(&#123;
  remoteEntry: 'https://team-b.cdn.com/remoteEntry.js',
  exposedModule: './ShopModule'
&#125;);
router.navigate(['/shop']);</code></pre>
              <div class="pros-cons">
                <span class="pro">&#10003; Independent deploys — zero coordination</span>
                <span class="con">&#10007; Runtime errors if contract changes</span>
              </div>
            </div>
          }
          @if (selectedPattern() === 'iframe') {
            <div class="pattern-card">
              <h4>&#128467; iFrame-Based</h4>
              <p>Each MFE runs in a separate <code>&lt;iframe&gt;</code>. Maximum isolation but poor UX integration.</p>
              <pre><code>&lt;iframe
  src="https://team-b.example.com/shop"
  style="width:100%; height:600px; border:none;"
&gt;&lt;/iframe&gt;</code></pre>
              <div class="pros-cons">
                <span class="pro">&#10003; Complete isolation (CSS, JS, DOM)</span>
                <span class="con">&#10007; No shared routing, poor accessibility</span>
              </div>
            </div>
          }
          @if (selectedPattern() === 'webcomp') {
            <div class="pattern-card">
              <h4>&#129513; Web Components</h4>
              <p>Each MFE is packaged as a <strong>Custom Element</strong>. The host loads the script and uses the custom tag.</p>
              <pre><code>&lt;script src="https://team-b.cdn.com/shop-element.js"&gt;&lt;/script&gt;

&lt;!-- Just use it like HTML --&gt;
&lt;shop-element user-id="42"&gt;&lt;/shop-element&gt;</code></pre>
              <div class="pros-cons">
                <span class="pro">&#10003; Framework-agnostic (React + Angular + Vue)</span>
                <span class="con">&#10007; Larger bundle per element, no tree-shaking</span>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>When to use MFE:</strong> Large teams (5+ squads), independent release cycles, polyglot tech stacks. NOT for small teams or simple apps.</li>
          <li><strong>Key trade-off:</strong> "Team autonomy vs. UX consistency." Mention shared design systems as the solution.</li>
          <li><strong>Buzzword:</strong> "Vertical slicing" — each team owns a full feature slice from DB to UI.</li>
          <li><strong>Anti-pattern:</strong> Nano frontends — splitting too small leads to excessive network requests and shared-state nightmares.</li>
        </ul>
      </div>
    </div>
  `,
    styles: [`
    .feature-page { padding: 20px; }
    .explanation { background: linear-gradient(135deg, #e8f5e9, #f1f8e9); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #43a047; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .card { padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
    .old { border-left: 5px solid #d93025; background: #fff8f8; }
    .new { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.85rem; }
    .pattern-selector { display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap; }
    .pattern-btn { padding: 10px 18px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .pattern-btn:hover { border-color: #43a047; background: #f1f8e9; }
    .pattern-btn.active { background: #43a047; color: white; border-color: #2e7d32; }
    .pattern-card { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-top: 10px; animation: fadeIn 0.3s ease; }
    .pros-cons { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
    .pro { color: #188038; font-weight: 500; }
    .con { color: #d93025; font-weight: 500; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } }
  `]
})
export class MicroFrontendsOverviewComponent {
  selectedPattern = signal('runtime');

  patterns = [
    { id: 'build', name: 'Build-Time', icon: '🔨' },
    { id: 'runtime', name: 'Run-Time', icon: '⚡' },
    { id: 'iframe', name: 'iFrame', icon: '🪟' },
    { id: 'webcomp', name: 'Web Components', icon: '🧩' }
  ];

  selectPattern(id: string) {
    this.selectedPattern.set(id);
  }
}
