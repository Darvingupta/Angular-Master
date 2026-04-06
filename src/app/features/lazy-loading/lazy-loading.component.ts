import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-lazy-loading',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Lazy Loading & Code Splitting</h2>
      <p class="subtitle">loadComponent, loadChildren & &#64;defer — Load Only What You Need</p>

      <div class="explanation">
        <p>Lazy loading defers the download of JavaScript until it's needed. Angular provides <strong>route-level</strong> (<code>loadComponent</code>), <strong>module-level</strong> (<code>loadChildren</code>), and <strong>template-level</strong> (<code>&#64;defer</code>) lazy loading strategies.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Old Way: loadChildren + Modules</h3>
          <pre><code>// app-routing.module.ts
{{ '{' }}
  path: 'admin',
  // Required a dedicated NgModule!
  loadChildren: () => 
    import('./admin/admin.module')
      .then(m => m.AdminModule)
{{ '}' }}

// admin/admin.module.ts (wrapper!)
&#64;NgModule({{ '{' }}
  declarations: [AdminComponent],
  imports: [RouterModule.forChild(routes)]
{{ '}' }})
export class AdminModule {{ '{' }} {{ '}' }}
// Extra file just to lazy-load! 😩</code></pre>
        </div>
        <div class="card new">
          <h3>New Way: loadComponent</h3>
          <pre><code>// app.routes.ts
{{ '{' }}
  path: 'admin',
  loadComponent: () => 
    import('./admin/admin.component')
      .then(m => m.AdminComponent)
{{ '}' }}

// That's it! No wrapper module needed!
// The component is fully standalone.
// Angular CLI auto-creates a separate chunk.
// ✅ Cleaner, fewer files, same result!</code></pre>
        </div>
      </div>

      <div class="strategy-section">
        <h3>Lazy Loading Strategies</h3>
        <div class="strategy-grid">
          <div class="strategy-card" [class.active]="activeStrategy() === 'route'" (click)="activeStrategy.set('route')">
            <div class="strategy-icon">🛣️</div>
            <strong>Route-Level</strong>
            <small>loadComponent</small>
          </div>
          <div class="strategy-card" [class.active]="activeStrategy() === 'children'" (click)="activeStrategy.set('children')">
            <div class="strategy-icon">📦</div>
            <strong>Feature Areas</strong>
            <small>loadChildren</small>
          </div>
          <div class="strategy-card" [class.active]="activeStrategy() === 'defer'" (click)="activeStrategy.set('defer')">
            <div class="strategy-icon">⏳</div>
            <strong>Template-Level</strong>
            <small>&#64;defer</small>
          </div>
          <div class="strategy-card" [class.active]="activeStrategy() === 'preload'" (click)="activeStrategy.set('preload')">
            <div class="strategy-icon">🚀</div>
            <strong>Preloading</strong>
            <small>PreloadAllModules</small>
          </div>
        </div>

        @if (activeStrategy() === 'route') {
          <div class="strategy-detail">
            <pre><code>// Each route loads its OWN bundle chunk
export const routes: Routes = [
  {{ '{' }}
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component')
      .then(m => m.DashboardComponent)
  {{ '}' }},
  {{ '{' }}
    path: 'settings',
    loadComponent: () => import('./settings.component')
      .then(m => m.SettingsComponent)
  {{ '}' }}
];
// Result: chunk-DASHBOARD.js, chunk-SETTINGS.js</code></pre>
          </div>
        }
        @if (activeStrategy() === 'children') {
          <div class="strategy-detail">
            <pre><code>// Group related routes under a single lazy chunk
{{ '{' }}
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes')
    .then(m => m.ADMIN_ROUTES)
{{ '}' }}

// admin/admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  {{ '{' }} path: '', component: AdminDashboard {{ '}' }},
  {{ '{' }} path: 'users', component: AdminUsers {{ '}' }},
  {{ '{' }} path: 'settings', component: AdminSettings {{ '}' }}
];</code></pre>
          </div>
        }
        @if (activeStrategy() === 'defer') {
          <div class="strategy-detail">
            <pre><code>// Lazy-load WITHIN a page, not just routes!
&#64;defer (on viewport) {{ '{' }}
  &lt;heavy-chart-component /&gt;
{{ '}' }} &#64;placeholder {{ '{' }}
  &lt;p&gt;Chart loads when you scroll here...&lt;/p&gt;
{{ '}' }}

// The compiler auto-splits this into a chunk.
// No routing needed — works in any template!</code></pre>
          </div>
        }
        @if (activeStrategy() === 'preload') {
          <div class="strategy-detail">
            <pre><code>// Preload all lazy routes after initial load
bootstrapApplication(AppComponent, {{ '{' }}
  providers: [
    provideRouter(routes, 
      withPreloading(PreloadAllModules)
    )
  ]
{{ '}' }});

// Custom preloading strategy:
export const customPreload: PreloadingStrategy = {{ '{' }}
  preload: (route, load) =>
    route.data?.['preload'] ? load() : of(null)
{{ '}' }};</code></pre>
          </div>
        }
      </div>

      <div class="demo-section">
        <h3>Live Demo: Chunk Visualization</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">This App's Chunks</span>
          </div>
          <p>This application uses <code>loadComponent</code> for every feature page. Here's what the bundle looks like:</p>
          <div class="chunk-list">
            @for (chunk of chunks; track chunk.name) {
              <div class="chunk-row" (click)="chunk.loaded = true">
                <div class="chunk-icon" [class.loaded]="chunk.loaded">{{ chunk.loaded ? '✅' : '📦' }}</div>
                <div class="chunk-info">
                  <strong>{{ chunk.name }}</strong>
                  <span>{{ chunk.route }}</span>
                </div>
                <div class="chunk-size">{{ chunk.size }}</div>
              </div>
            }
          </div>
          <p class="chunk-note">Click a chunk to simulate lazy-loading it. In a real app, this happens on navigation!</p>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Why lazy load?</strong> "To reduce the initial bundle size. Users only download the code for the pages they visit."</li>
          <li><strong>loadComponent vs loadChildren:</strong> Use <code>loadComponent</code> for single components. Use <code>loadChildren</code> to lazy-load a group of related routes.</li>
          <li><strong>Preloading:</strong> <code>PreloadAllModules</code> loads lazy chunks in the background after the initial page load — best of both worlds.</li>
          <li><strong>&#64;defer:</strong> "Template-level lazy loading. The compiler auto-splits the content. Use <code>on viewport</code> for below-the-fold content."</li>
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
    .strategy-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; }
    .strategy-card { text-align: center; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .strategy-card:hover { border-color: #1a73e8; transform: translateY(-2px); }
    .strategy-card.active { background: #1a73e8; color: white; border-color: #174ea6; }
    .strategy-icon { font-size: 1.8rem; margin-bottom: 4px; }
    .strategy-card strong { display: block; font-size: 0.85rem; }
    .strategy-card small { font-size: 0.7rem; opacity: 0.7; }
    .strategy-detail { animation: fadeIn 0.3s ease; margin-bottom: 20px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .chunk-list { display: flex; flex-direction: column; gap: 6px; margin: 15px 0; }
    .chunk-row { display: flex; align-items: center; gap: 12px; padding: 10px 15px; background: white; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .chunk-row:hover { border-color: #1a73e8; transform: translateX(3px); }
    .chunk-icon { font-size: 1.2rem; transition: all 0.3s; }
    .chunk-icon.loaded { animation: pop 0.3s ease; }
    .chunk-info { flex: 1; }
    .chunk-info strong { display: block; font-family: monospace; font-size: 0.85rem; }
    .chunk-info span { font-size: 0.75rem; color: #999; }
    .chunk-size { font-family: monospace; font-size: 0.8rem; color: #1a73e8; font-weight: 600; }
    .chunk-note { font-size: 0.8rem; color: #999; font-style: italic; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pop { 0% { transform: scale(0.5); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } .strategy-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class LazyLoadingComponent {
  activeStrategy = signal('route');

  chunks = [
    { name: 'chunk-SIGNALS.js', route: '/signals', size: '4.0KB', loaded: false },
    { name: 'chunk-ADVANCED.js', route: '/advanced-signals', size: '4.1KB', loaded: false },
    { name: 'chunk-COMPONENT-API.js', route: '/component-api', size: '4.5KB', loaded: false },
    { name: 'chunk-CONTROL-FLOW.js', route: '/control-flow', size: '4.0KB', loaded: false },
    { name: 'chunk-LAZY-LOADING.js', route: '/lazy-loading', size: '3.8KB', loaded: false },
    { name: 'chunk-MFE-OVERVIEW.js', route: '/mfe-overview', size: '9.1KB', loaded: false },
  ];
}
