import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-native-federation',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="feature-page">
      <h2>Angular Native Federation</h2>
      <p class="subtitle">ESM-based Module Federation — No Webpack Required</p>

      <div class="explanation">
        <p><strong>Native Federation</strong> (by &#64;angular-architects) brings Module Federation to Angular's <strong>esbuild</strong> pipeline. Since Angular 17+ defaults to esbuild (not Webpack), this is the modern, recommended approach for new projects.</p>
        <p>It uses standard <strong>ES Modules (import maps)</strong> instead of Webpack's proprietary chunk format.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Webpack Module Federation</h3>
          <pre><code>
// Requires switching to Webpack builder
"builder": "ngx-build-plus:browser"

// Custom webpack.config.js needed
module.exports = &#123;
  plugins: [
    new ModuleFederationPlugin(&#123;...&#125;)
  ]
&#125;;</code></pre>
          <ul>
            <li>Requires Webpack (not esbuild)</li>
            <li>Complex webpack.config.js file</li>
            <li>Proprietary chunk format</li>
          </ul>
        </div>
        <div class="card new">
          <h3>Native Federation</h3>
          <pre><code>
// Works with default esbuild builder!
"builder": "&#64;angular-devkit/build-angular:application"

// Simple federation.config.js
module.exports = withNativeFederation(&#123;
  name: 'payments',
  exposes: &#123;
    './Component': './src/app/payments.component.ts'
  &#125;
&#125;);</code></pre>
          <ul>
            <li>Works with Angular's default build system</li>
            <li>Standard ES Modules</li>
            <li>Simpler configuration</li>
          </ul>
        </div>
      </div>

      <div class="demo-section">
        <h3>Interactive: Build Your federation.config.js</h3>
        <p>Toggle the options below to see how the configuration changes:</p>

        <div class="config-builder">
          <div class="options-panel">
            <label class="option-row">
              <span>App Name:</span>
              <input type="text" [ngModel]="appName()" (ngModelChange)="appName.set($event)" class="text-input" />
            </label>
            <label class="option-row">
              <span>Role:</span>
              <div class="toggle-group">
                <button [class.active]="role() === 'host'" (click)="role.set('host')">Host</button>
                <button [class.active]="role() === 'remote'" (click)="role.set('remote')">Remote</button>
              </div>
            </label>
            <label class="option-row">
              <span>Expose Component:</span>
              <input type="checkbox" [ngModel]="exposeComponent()" (ngModelChange)="exposeComponent.set($event)" />
            </label>
            <label class="option-row">
              <span>Expose Routes:</span>
              <input type="checkbox" [ngModel]="exposeRoutes()" (ngModelChange)="exposeRoutes.set($event)" />
            </label>
            <label class="option-row">
              <span>Use Manifest:</span>
              <input type="checkbox" [ngModel]="useManifest()" (ngModelChange)="useManifest.set($event)" />
            </label>
          </div>

          <div class="config-output">
            <div class="file-tab">federation.config.js</div>
            <pre><code>{{ generatedConfig() }}</code></pre>
          </div>
        </div>
      </div>

      <div class="setup-steps">
        <h3>Setup Steps (Angular 17+)</h3>
        <div class="step-list">
          @for (step of setupSteps; track step.num) {
            <div class="step-item" [class.expanded]="expandedStep() === step.num" (click)="toggleStep(step.num)">
              <div class="step-header">
                <span class="step-num">{{ step.num }}</span>
                <span class="step-title">{{ step.title }}</span>
                <span class="step-expand">{{ expandedStep() === step.num ? '▼' : '▶' }}</span>
              </div>
              @if (expandedStep() === step.num) {
                <div class="step-body">
                  <pre><code>{{ step.code }}</code></pre>
                  <p class="step-note">{{ step.note }}</p>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Why Native over Webpack MF?</strong> "Angular 17+ uses esbuild by default. Native Federation works with esbuild, so we don't need to downgrade to Webpack."</li>
          <li><strong>Import Maps:</strong> Native Federation uses browser-native import maps. This is a W3C standard, not a Webpack hack.</li>
          <li><strong>Manifest-based discovery:</strong> The Host can load a <code>federation.manifest.json</code> at runtime to discover remotes dynamically. Great for environments where remote URLs change.</li>
          <li><strong>Key library:</strong> <code>&#64;angular-architects/native-federation</code> by Manfred Steyer. Same author as the Webpack version.</li>
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
    .old { border-left: 5px solid #d93025; background: #fff8f8; }
    .new { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; }

    .config-builder { display: grid; grid-template-columns: 280px 1fr; gap: 20px; margin: 20px 0; }
    .options-panel { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .option-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-weight: 500; font-size: 0.9rem; }
    .text-input { padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; width: 120px; font-family: monospace; }
    .toggle-group { display: flex; gap: 4px; }
    .toggle-group button { padding: 4px 12px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; font-size: 0.8rem; }
    .toggle-group button.active { background: #43a047; color: white; border-color: #2e7d32; }
    .config-output { position: relative; }
    .file-tab { display: inline-block; background: #1e1e2e; color: #a6e3a1; padding: 6px 14px; border-radius: 6px 6px 0 0; font-family: monospace; font-size: 0.8rem; font-weight: 600; }
    .config-output pre { margin-top: 0; border-radius: 0 6px 6px 6px; min-height: 200px; }

    .setup-steps { margin-top: 30px; }
    .step-list { display: flex; flex-direction: column; gap: 8px; }
    .step-item { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
    .step-item:hover { border-color: #43a047; }
    .step-item.expanded { border-color: #43a047; box-shadow: 0 2px 8px rgba(67, 160, 71, 0.15); }
    .step-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #fafafa; }
    .step-num { background: #43a047; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; }
    .step-title { flex: 1; font-weight: 600; }
    .step-expand { color: #999; font-size: 0.75rem; }
    .step-body { padding: 16px; background: white; animation: fadeIn 0.2s ease; }
    .step-note { font-size: 0.85rem; color: #5f6368; margin-top: 8px; font-style: italic; }

    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @media (max-width: 768px) { .comparison-grid, .config-builder { grid-template-columns: 1fr; } }
  `]
})
export class NativeFederationComponent {
  appName = signal('payments');
  role = signal<'host' | 'remote'>('remote');
  exposeComponent = signal(true);
  exposeRoutes = signal(false);
  useManifest = signal(false);
  expandedStep = signal(1);

  generatedConfig = computed(() => {
    const name = this.appName();
    const isRemote = this.role() === 'remote';

    if (isRemote) {
      let exposes = '';
      if (this.exposeComponent()) {
        exposes += `\n    './Component': './src/app/${name}/${name}.component.ts',`;
      }
      if (this.exposeRoutes()) {
        exposes += `\n    './Routes': './src/app/${name}/${name}.routes.ts',`;
      }
      return `const { withNativeFederation, shareAll }
  = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: '${name}',
  exposes: {${exposes}
  },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    })
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket']
});`;
    } else {
      // Host config
      if (this.useManifest()) {
        return `const { withNativeFederation, shareAll }
  = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  // Remotes discovered via manifest at runtime!
  // See: assets/federation.manifest.json
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    })
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket']
});

// assets/federation.manifest.json
// {
//   "${name}": "http://localhost:4201/remoteEntry.json"
// }`;
      }
      return `const { withNativeFederation, shareAll }
  = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    })
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket']
});`;
    }
  });

  setupSteps = [
    {
      num: 1,
      title: 'Install the schematic',
      code: `ng add @angular-architects/native-federation`,
      note: 'This creates federation.config.js and updates angular.json automatically.'
    },
    {
      num: 2,
      title: 'Configure the Remote (exposes)',
      code: `// federation.config.js (Remote)
module.exports = withNativeFederation({
  name: 'mfe1',
  exposes: {
    './Component': './src/app/flights/flights.component.ts',
  },
  shared: { ...shareAll({ singleton: true, strictVersion: true }) }
});`,
      note: 'The "exposes" map tells the federation plugin what to publish.'
    },
    {
      num: 3,
      title: 'Configure the Host (manifest)',
      code: `// main.ts (Host)
import { initFederation } from '@angular-architects/native-federation';

initFederation('assets/federation.manifest.json')
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));`,
      note: 'initFederation() reads the manifest and sets up ESM import maps.'
    },
    {
      num: 4,
      title: 'Lazy-load the Remote in Host routes',
      code: `// app.routes.ts (Host)
import { loadRemoteModule } from '@angular-architects/native-federation';

{
  path: 'flights',
  loadComponent: () =>
    loadRemoteModule('mfe1', './Component')
      .then(m => m.FlightsComponent)
}`,
      note: 'loadRemoteModule handles fetching, caching, and instantiating the remote code.'
    }
  ];

  toggleStep(num: number) {
    this.expandedStep.set(this.expandedStep() === num ? 0 : num);
  }
}
