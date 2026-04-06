import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-module-federation',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Webpack Module Federation</h2>
      <p class="subtitle">The Industry Standard for Angular Micro Frontends</p>

      <div class="explanation">
        <p><strong>Module Federation</strong> is a Webpack 5 plugin that allows multiple independent builds to form a single application at <strong>runtime</strong>. One app (the <em>Host</em>) dynamically loads code from another app (the <em>Remote</em>) — without rebuilding.</p>
        <p>This is currently the most widely used approach for Angular micro frontends in enterprise projects.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Traditional Monolith Build</h3>
          <pre><code>
// Everything compiled together
ng build --configuration production

// Output: ONE dist/ folder
// Deploy: ONE pipeline
// Result: 15 MB bundle 😱
          </code></pre>
          <p class="card-note">All teams must coordinate releases. A bug in "Payments" blocks "Dashboard" deploy.</p>
        </div>
        <div class="card new">
          <h3>Module Federation Build</h3>
          <pre><code>
// Host builds separately
ng build shell-app

// Remote builds separately
ng build payments-mfe

// Each outputs its own dist/
// Each deploys independently ✅
          </code></pre>
          <p class="card-note">Teams deploy on their own schedule. Host fetches remotes at runtime.</p>
        </div>
      </div>

      <div class="demo-section">
        <h3>Live Demo: Host ↔ Remote Loading Simulation</h3>
        <p>Click "Load Remote" to simulate how a Host app dynamically loads a Remote micro frontend:</p>

        <div class="simulation-container">
          <div class="host-panel">
            <div class="panel-header host-header">
              <span>🏠 Host App (Shell)</span>
              <span class="port">:4200</span>
            </div>
            <div class="panel-body">
              <p>Navigation: Dashboard | <strong class="remote-link" (click)="loadRemote()">Payments ↗</strong></p>
              <div class="mount-point">
                @if (loadingState() === 'idle') {
                  <div class="placeholder-block">
                    <p>⬆ Click "Payments" to load the remote MFE</p>
                  </div>
                }
                @if (loadingState() === 'fetching') {
                  <div class="loading-block">
                    <div class="spinner"></div>
                    <p>Fetching remoteEntry.js from :4201...</p>
                    <div class="progress-bar"><div class="progress-fill" [style.width]="progress() + '%'"></div></div>
                  </div>
                }
                @if (loadingState() === 'loaded') {
                  <div class="loaded-block">
                    <h4>✅ PaymentsModule Loaded!</h4>
                    <p>Remote component rendered inside Host's &lt;router-outlet&gt;</p>
                    <div class="fake-payments">
                      <div class="fake-row">
                        <span>TXN-001</span><span>$4,500</span><span class="badge-green">Approved</span>
                      </div>
                      <div class="fake-row">
                        <span>TXN-002</span><span>$1,200</span><span class="badge-orange">Pending</span>
                      </div>
                    </div>
                    <button class="btn-reset" (click)="resetDemo()">🔄 Reset Demo</button>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="arrow-connector">
            @if (loadingState() === 'fetching') {
              <div class="arrow-animated">← remoteEntry.js</div>
            } @else {
              <div class="arrow-static">⟵ runtime load ⟶</div>
            }
          </div>

          <div class="remote-panel">
            <div class="panel-header remote-header">
              <span>📦 Remote App (Payments)</span>
              <span class="port">:4201</span>
            </div>
            <div class="panel-body">
              <pre><code>// webpack.config.js (Remote)
new ModuleFederationPlugin(&#123;
  name: 'payments',
  filename: 'remoteEntry.js',
  exposes: &#123;
    './PaymentsModule':
      './src/app/payments/payments.module.ts'
  &#125;,
  shared: share(&#123;
    '&#64;angular/core': &#123; singleton: true &#125;,
    '&#64;angular/router': &#123; singleton: true &#125;
  &#125;)
&#125;)</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Key Configuration Files</h3>
        <div class="config-tabs">
          <button [class.active]="activeTab() === 'host'" (click)="activeTab.set('host')">Host webpack.config.js</button>
          <button [class.active]="activeTab() === 'remote'" (click)="activeTab.set('remote')">Remote webpack.config.js</button>
          <button [class.active]="activeTab() === 'route'" (click)="activeTab.set('route')">Host Routing</button>
        </div>
        <div class="config-content">
          @if (activeTab() === 'host') {
            <pre><code>// Host: webpack.config.js
const &#123; share, withModuleFederationPlugin &#125;
  = require('&#64;angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin(&#123;
  remotes: &#123;
    // Maps "payments" to remote's URL
    payments: 'http://localhost:4201/remoteEntry.js',
  &#125;,
  shared: share(&#123;
    '&#64;angular/core': &#123; singleton: true, strictVersion: true &#125;,
    '&#64;angular/common': &#123; singleton: true, strictVersion: true &#125;,
    '&#64;angular/router': &#123; singleton: true, strictVersion: true &#125;,
  &#125;)
&#125;);</code></pre>
          }
          @if (activeTab() === 'remote') {
            <pre><code>// Remote: webpack.config.js
const &#123; share, withModuleFederationPlugin &#125;
  = require('&#64;angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin(&#123;
  name: 'payments',
  filename: 'remoteEntry.js',
  exposes: &#123;
    // What this remote "publishes"
    './PaymentsModule': './src/app/payments/payments.module.ts',
    './PaymentsComponent': './src/app/payments/payments.component.ts',
  &#125;,
  shared: share(&#123;
    '&#64;angular/core': &#123; singleton: true, strictVersion: true &#125;,
    '&#64;angular/common': &#123; singleton: true, strictVersion: true &#125;,
    '&#64;angular/router': &#123; singleton: true, strictVersion: true &#125;,
  &#125;)
&#125;);</code></pre>
          }
          @if (activeTab() === 'route') {
            <pre><code>// Host: app.routes.ts
export const routes: Routes = [
  &#123;
    path: 'payments',
    loadChildren: () =>
      loadRemoteModule(&#123;
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './PaymentsModule'
      &#125;).then(m => m.PaymentsModule)
  &#125;
];

// Don't forget the type declaration!
// decl.d.ts
declare module 'payments/PaymentsModule';</code></pre>
          }
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Shared Singletons:</strong> Always set <code>singleton: true</code> for Angular core packages. Two instances of <code>&#64;angular/core</code> will crash the app.</li>
          <li><strong>Version Mismatch:</strong> Use <code>strictVersion: true</code> + <code>requiredVersion</code> to fail fast if Host and Remote have incompatible Angular versions.</li>
          <li><strong>&#64;angular-architects/module-federation:</strong> This is the de-facto library by Manfred Steyer. Know this name for interviews.</li>
          <li><strong>Webpack Limitation:</strong> Module Federation requires Webpack. Angular 17+ defaults to esbuild, so you must switch back to Webpack or use Native Federation.</li>
        </ul>
      </div>
    </div>
  `,
    styles: [`
    .feature-page { padding: 20px; }
    .subtitle { color: #5f6368; font-style: italic; margin-top: -5px; margin-bottom: 20px; }
    .explanation { background: linear-gradient(135deg, #e8f5e9, #f1f8e9); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #43a047; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .card { padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
    .card-note { font-size: 0.85rem; color: #5f6368; margin-top: 10px; font-style: italic; }
    .old { border-left: 5px solid #d93025; background: #fff8f8; }
    .new { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; }

    .simulation-container { display: grid; grid-template-columns: 1fr auto 1fr; gap: 15px; align-items: stretch; margin: 20px 0; }
    .host-panel, .remote-panel { border: 2px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
    .panel-header { padding: 10px 15px; font-weight: 700; display: flex; justify-content: space-between; color: white; font-size: 0.9rem; }
    .host-header { background: #1a73e8; }
    .remote-header { background: #e37400; }
    .port { font-family: monospace; opacity: 0.8; }
    .panel-body { padding: 15px; background: #fafafa; min-height: 200px; }
    .remote-link { color: #1a73e8; cursor: pointer; text-decoration: underline; }
    .mount-point { margin-top: 15px; border: 2px dashed #ccc; border-radius: 8px; padding: 20px; min-height: 120px; }
    .placeholder-block { text-align: center; color: #999; }
    .loading-block { text-align: center; }
    .spinner { width: 30px; height: 30px; border: 3px solid #eee; border-top-color: #1a73e8; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
    .progress-bar { height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 10px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #43a047, #66bb6a); border-radius: 3px; transition: width 0.3s; }
    .loaded-block { animation: fadeIn 0.4s ease; }
    .loaded-block h4 { color: #188038; }
    .fake-payments { margin-top: 10px; }
    .fake-row { display: flex; justify-content: space-between; padding: 8px 12px; background: white; border: 1px solid #eee; border-radius: 4px; margin-bottom: 4px; font-size: 0.85rem; font-family: monospace; }
    .badge-green { color: #188038; font-weight: 600; }
    .badge-orange { color: #e37400; font-weight: 600; }
    .btn-reset { margin-top: 12px; padding: 6px 16px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; }

    .arrow-connector { display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #888; }
    .arrow-animated { color: #1a73e8; font-weight: 700; animation: pulse 1s ease infinite; }
    .arrow-static { color: #ccc; }

    .config-section { margin-top: 30px; }
    .config-tabs { display: flex; gap: 8px; margin-bottom: 0; }
    .config-tabs button { padding: 8px 16px; border: 1px solid #ddd; border-bottom: none; border-radius: 6px 6px 0 0; background: #f5f5f5; cursor: pointer; font-weight: 500; }
    .config-tabs button.active { background: #1e1e2e; color: #cdd6f4; border-color: #1e1e2e; }
    .config-content pre { margin-top: 0; border-radius: 0 6px 6px 6px; }

    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    @media (max-width: 900px) { .simulation-container { grid-template-columns: 1fr; } .arrow-connector { transform: rotate(90deg); padding: 10px 0; } .comparison-grid { grid-template-columns: 1fr; } }
  `]
})
export class ModuleFederationComponent {
  loadingState = signal<'idle' | 'fetching' | 'loaded'>('idle');
  progress = signal(0);
  activeTab = signal('host');

  private intervalId: ReturnType<typeof setInterval> | null = null;

  loadRemote() {
    if (this.loadingState() !== 'idle') return;
    this.loadingState.set('fetching');
    this.progress.set(0);

    this.intervalId = setInterval(() => {
      this.progress.update(p => {
        if (p >= 100) {
          if (this.intervalId) clearInterval(this.intervalId);
          this.loadingState.set('loaded');
          return 100;
        }
        return p + 5;
      });
    }, 80);
  }

  resetDemo() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.loadingState.set('idle');
    this.progress.set(0);
  }
}
