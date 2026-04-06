import { Component, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-web-components-mfe',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Angular Elements & Web Components</h2>
      <p class="subtitle">Framework-Agnostic Micro Frontends</p>

      <div class="explanation">
        <p><strong>Angular Elements</strong> lets you package an Angular component as a <strong>Custom Element (Web Component)</strong>. This means your Angular micro frontend can run inside a React, Vue, or plain HTML host — no Angular knowledge needed by the consuming team.</p>
        <p>This is the <strong>most interoperable</strong> approach to micro frontends.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Module Federation (Same Framework)</h3>
          <pre><code>
// Both Host and Remote MUST be Angular
// Shared &#64;angular/core singleton
// Tight coupling to Angular version

Host: Angular 19
Remote: Angular 19 ✅
Remote: React 18 ❌ Not possible!
          </code></pre>
          <ul>
            <li>Fast, lightweight (shared deps)</li>
            <li>Same framework requirement</li>
            <li>Best for Angular-only orgs</li>
          </ul>
        </div>
        <div class="card new">
          <h3>Web Components (Any Framework)</h3>
          <pre><code>
// Each MFE is a Custom Element
// Uses Shadow DOM for isolation
// Host can be ANYTHING

Host: React 18 ✅
Host: Vue 3 ✅
Host: Plain HTML ✅
Remote: Angular Element ✅
          </code></pre>
          <ul>
            <li>True framework independence</li>
            <li>Each MFE bundles its own deps</li>
            <li>Best for polyglot orgs</li>
          </ul>
        </div>
      </div>

      <div class="demo-section">
        <h3>Live Demo: Angular Element in Action</h3>
        <p>Below is a <strong>simulated Angular Element</strong> rendered as a custom element. Interact with it — it maintains its own state independently:</p>

        <div class="element-demo-container">
          <div class="host-context">
            <div class="host-label">Host App (could be React, Vue, or plain HTML)</div>
            <div class="host-code">
              <code>&lt;user-profile-card name="{{ userName() }}" role="{{ userRole() }}"&gt;&lt;/user-profile-card&gt;</code>
            </div>

            <div class="host-controls">
              <label>
                <span>name attr:</span>
                <input type="text" [value]="userName()" (input)="onNameChange($event)" class="attr-input" />
              </label>
              <label>
                <span>role attr:</span>
                <select [value]="userRole()" (change)="onRoleChange($event)" class="attr-input">
                  <option value="Developer">Developer</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </label>
            </div>

            <!-- Simulated Custom Element -->
            <div class="custom-element-boundary">
              <div class="shadow-badge">shadow-root (open)</div>
              <div class="element-inner">
                <div class="profile-avatar">{{ initials() }}</div>
                <div class="profile-info">
                  <h4>{{ userName() }}</h4>
                  <span class="role-badge" [class]="'role-' + userRole().toLowerCase()">{{ userRole() }}</span>
                </div>
                <div class="profile-stats">
                  <div class="stat">
                    <span class="stat-value">{{ clickCount() }}</span>
                    <span class="stat-label">Interactions</span>
                  </div>
                  <button class="element-btn" (click)="incrementClicks()">&#128077; Like</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-walkthrough">
        <h3>How to Create an Angular Element</h3>
        <div class="code-steps">
          <div class="code-step">
            <div class="step-badge">Step 1</div>
            <h4>Create the Component</h4>
            <pre><code>// user-profile.component.ts
&#64;Component({{ '{' }}
  selector: 'app-user-profile',
  template: '&lt;div&gt;{{ '{{' }} name {{ '}}' }} - {{ '{{' }} role {{ '}}' }}&lt;/div&gt;',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom
{{ '}' }})
export class UserProfileComponent {{ '{' }}
  &#64;Input() name = '';
  &#64;Input() role = '';
{{ '}' }}</code></pre>
          </div>

          <div class="code-step">
            <div class="step-badge">Step 2</div>
            <h4>Register as Custom Element</h4>
            <pre><code>// main.ts
import {{ '{' }} createApplication {{ '}' }} from '&#64;angular/platform-browser';
import {{ '{' }} createCustomElement {{ '}' }} from '&#64;angular/elements';

(async () => {{ '{' }}
  const app = await createApplication({{ '{' }}
    providers: [/* ... */]
  {{ '}' }});

  const element = createCustomElement(
    UserProfileComponent,
    {{ '{' }} injector: app.injector {{ '}' }}
  );

  customElements.define('user-profile-card', element);
{{ '}' }})();</code></pre>
          </div>

          <div class="code-step">
            <div class="step-badge">Step 3</div>
            <h4>Use in Any HTML Page</h4>
            <pre><code>&lt;!-- In a React app, Vue app, or plain HTML --&gt;
&lt;script src="https://cdn.example.com/user-profile-element.js"&gt;&lt;/script&gt;

&lt;user-profile-card
  name="Darvin"
  role="Admin"
&gt;&lt;/user-profile-card&gt;

&lt;!-- It just works! No Angular CLI needed. --&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>When to choose Web Components over Module Federation:</strong> "When our org uses multiple frameworks (React + Angular), Web Components provide framework-agnostic interop."</li>
          <li><strong>Shadow DOM:</strong> Use <code>ViewEncapsulation.ShadowDom</code> for true CSS isolation. The host's styles won't leak into your element.</li>
          <li><strong>Bundle Size Trade-off:</strong> Each Web Component bundles its own Angular runtime (~130KB gzipped). For many elements, this adds up. Solution: share a single Angular bootstrap.</li>
          <li><strong>&#64;angular/elements:</strong> The official Angular package for creating Custom Elements. It bridges Angular's change detection to the Custom Element lifecycle.</li>
          <li><strong>Attribute vs Property binding:</strong> HTML attributes are always strings. For complex objects, use properties via JavaScript: <code>element.data = {{ '{' }} ... {{ '}' }}</code>.</li>
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

    .element-demo-container { margin: 20px 0; }
    .host-context { background: #f0f4f8; border: 2px solid #90a4ae; border-radius: 12px; padding: 20px; }
    .host-label { background: #546e7a; color: white; display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; margin-bottom: 12px; }
    .host-code { background: #263238; color: #80cbc4; padding: 10px 14px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; margin-bottom: 15px; overflow-x: auto; }
    .host-controls { display: flex; gap: 20px; margin-bottom: 20px; }
    .host-controls label { display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 0.9rem; }
    .attr-input { padding: 6px 10px; border: 1px solid #b0bec5; border-radius: 4px; font-family: monospace; background: white; }

    .custom-element-boundary { border: 2px dashed #7c4dff; border-radius: 10px; padding: 20px; position: relative; background: white; }
    .shadow-badge { position: absolute; top: -10px; left: 16px; background: #7c4dff; color: white; font-size: 0.7rem; padding: 2px 10px; border-radius: 10px; font-family: monospace; }
    .element-inner { display: flex; align-items: center; gap: 20px; padding: 10px; }
    .profile-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #7c4dff, #448aff); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; flex-shrink: 0; }
    .profile-info { flex: 1; }
    .profile-info h4 { margin: 0 0 4px; font-size: 1.1rem; }
    .role-badge { padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .role-developer { background: #e3f2fd; color: #1565c0; }
    .role-admin { background: #fce4ec; color: #c62828; }
    .role-manager { background: #fff3e0; color: #e65100; }
    .profile-stats { display: flex; align-items: center; gap: 15px; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-value { font-size: 1.4rem; font-weight: 700; color: #1a73e8; }
    .stat-label { font-size: 0.7rem; color: #999; }
    .element-btn { padding: 8px 18px; background: linear-gradient(135deg, #7c4dff, #448aff); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: 600; transition: transform 0.15s; }
    .element-btn:hover { transform: scale(1.05); }
    .element-btn:active { transform: scale(0.95); }

    .code-walkthrough { margin-top: 30px; }
    .code-steps { display: flex; flex-direction: column; gap: 20px; }
    .code-step { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #fafafa; }
    .step-badge { display: inline-block; background: #43a047; color: white; padding: 3px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; margin-bottom: 8px; }
    .code-step h4 { margin: 0 0 10px; }

    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }

    @media (max-width: 768px) {
      .comparison-grid { grid-template-columns: 1fr; }
      .element-inner { flex-direction: column; text-align: center; }
      .host-controls { flex-direction: column; }
    }
  `]
})
export class WebComponentsMfeComponent {
  userName = signal('Darvin Gupta');
  userRole = signal('Developer');
  clickCount = signal(0);

  initials = () => {
    const parts = this.userName().split(' ');
    return parts.map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2);
  };

  onNameChange(event: Event) {
    this.userName.set((event.target as HTMLInputElement).value);
  }

  onRoleChange(event: Event) {
    this.userRole.set((event.target as HTMLSelectElement).value);
  }

  incrementClicks() {
    this.clickCount.update(c => c + 1);
  }
}
