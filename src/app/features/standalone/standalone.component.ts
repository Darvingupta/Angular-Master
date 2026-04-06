import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-standalone',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Standalone Components</h2>
      <p class="subtitle">Module-less Angular — The Default Since v19 (Introduced v14+)</p>

      <div class="explanation">
        <p><strong>Standalone components</strong> remove the need for <code>NgModules</code>. A component manages its own dependencies directly via the <code>imports</code> array. As of Angular 19, standalone is the <strong>default</strong> — you no longer even need to write <code>standalone: true</code>.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Old Way: NgModules</h3>
          <pre><code>// app.module.ts — the "glue" file
&#64;NgModule({{ '{' }}
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    // Must declare EVERY component here
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
{{ '}' }})
export class AppModule {{ '{' }} {{ '}' }}

// main.ts
platformBrowserDynamic()
  .bootstrapModule(AppModule);</code></pre>
        </div>
        <div class="card new">
          <h3>New Way: Standalone</h3>
          <pre><code>// No app.module.ts needed! 🎉

// Each component manages its own deps
&#64;Component({{ '{' }}
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  template: '...'
{{ '}' }})
export class HeaderComponent {{ '{' }} {{ '}' }}

// main.ts — bootstraps directly
bootstrapApplication(AppComponent, {{ '{' }}
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
{{ '}' }});</code></pre>
        </div>
      </div>

      <div class="benefits-section">
        <h3>Why Standalone Matters</h3>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">🌳</div>
            <h4>Tree-Shakeable</h4>
            <p>Unused components are automatically removed from the bundle. No more importing an entire module for one pipe.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🧠</div>
            <h4>Easier to Understand</h4>
            <p>No more hunting through modules to find where a component is declared. Each component is self-contained.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">⚡</div>
            <h4>Faster Compilation</h4>
            <p>The compiler can analyze individual components without processing entire module trees.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🚀</div>
            <h4>Lazy Loading</h4>
            <p><code>loadComponent</code> lets you lazy-load individual components — no wrapper module needed.</p>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>This App Is Proof!</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Architecture</span>
          </div>
          <div class="proof-grid">
            <div class="proof-item">
              <div class="proof-check">✅</div>
              <div>
                <strong>No app.module.ts</strong>
                <p>This entire app has zero NgModules</p>
              </div>
            </div>
            <div class="proof-item">
              <div class="proof-check">✅</div>
              <div>
                <strong>bootstrapApplication()</strong>
                <p>App bootstraps with the standalone API in main.ts</p>
              </div>
            </div>
            <div class="proof-item">
              <div class="proof-check">✅</div>
              <div>
                <strong>loadComponent() routing</strong>
                <p>Every page is lazy-loaded as a standalone component</p>
              </div>
            </div>
            <div class="proof-item">
              <div class="proof-check">✅</div>
              <div>
                <strong>Self-contained imports</strong>
                <p>Each component imports only what it needs (CommonModule, FormsModule, etc.)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="migration-section">
        <h3>Migration from NgModules</h3>
        <pre><code># Automatic CLI migration tool
ng generate &#64;angular/core:standalone

# Steps:
# 1. Converts components to standalone: true
# 2. Moves imports from module to component
# 3. Updates bootstrapping to bootstrapApplication()
# 4. Removes empty NgModules</code></pre>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>SCAM pattern:</strong> Single Component Angular Module. Standalone components are essentially the SCAM pattern built into the framework.</li>
          <li><strong>Bootstrapping:</strong> Use <code>bootstrapApplication(AppComponent)</code> instead of <code>platformBrowserDynamic().bootstrapModule(AppModule)</code>.</li>
          <li><strong>provideX functions:</strong> In standalone apps, services are configured via <code>provide</code> functions: <code>provideRouter()</code>, <code>provideHttpClient()</code>, <code>provideAnimations()</code>.</li>
          <li><strong>Default in v19:</strong> As of Angular 19, <code>standalone: true</code> is the default. You don't even need to write it explicitly anymore.</li>
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
    .benefits-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 15px 0; }
    .benefit-card { text-align: center; padding: 20px 15px; border: 1px solid #e0e0e0; border-radius: 10px; background: white; transition: transform 0.2s; }
    .benefit-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .benefit-icon { font-size: 2rem; margin-bottom: 8px; }
    .benefit-card h4 { margin: 4px 0; font-size: 0.95rem; }
    .benefit-card p { font-size: 0.8rem; color: #666; margin: 4px 0 0; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .proof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .proof-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: white; border-radius: 8px; border: 1px solid #e0e0e0; }
    .proof-check { font-size: 1.4rem; }
    .proof-item strong { display: block; margin-bottom: 2px; }
    .proof-item p { font-size: 0.82rem; color: #666; margin: 0; }
    .migration-section { margin-top: 30px; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } .benefits-grid { grid-template-columns: 1fr 1fr; } .proof-grid { grid-template-columns: 1fr; } }
  `]
})
export class StandaloneComponent {}
