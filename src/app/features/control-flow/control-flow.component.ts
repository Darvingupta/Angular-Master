import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-control-flow',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Angular Built-in Control Flow</h2>
      <p class="subtitle">&#64;if, &#64;for, &#64;switch, &#64;empty — Template Syntax Revolution (v17+)</p>

      <div class="explanation">
        <p>Angular 17 introduced a <strong>new declarative control flow syntax</strong> built directly into the template engine. It's faster, doesn't require imports, and provides features like <code>&#64;empty</code> that weren't possible before.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Old Way: Structural Directives</h3>
          <pre><code>&lt;div *ngIf="loggedIn; else guest"&gt;
  Hello User!
&lt;/div&gt;
&lt;ng-template #guest&gt;
  Please login.
&lt;/ng-template&gt;

&lt;ul&gt;
  &lt;li *ngFor="let item of items; trackBy: trackById"&gt;
    {{ '{{' }} item.name {{ '}}' }}
  &lt;/li&gt;
&lt;/ul&gt;

&lt;!-- Requires importing CommonModule --&gt;
&lt;!-- trackBy is optional (bad!) --&gt;</code></pre>
        </div>
        <div class="card new">
          <h3>New Way: &#64; Syntax</h3>
          <pre><code>&#64;if (loggedIn) {{ '{' }}
  Hello User!
{{ '}' }} &#64;else {{ '{' }}
  Please login.
{{ '}' }}

&lt;ul&gt;
  &#64;for (item of items; track item.id) {{ '{' }}
    &lt;li&gt;{{ '{{' }} item.name {{ '}}' }}&lt;/li&gt;
  {{ '}' }} &#64;empty {{ '{' }}
    &lt;li&gt;No items!&lt;/li&gt;
  {{ '}' }}
&lt;/ul&gt;

&lt;!-- No imports needed! --&gt;
&lt;!-- track is REQUIRED (good!) --&gt;</code></pre>
        </div>
      </div>

      <div class="syntax-cards">
        <div class="syntax-card" [class.active]="activeSyntax() === 'if'" (click)="activeSyntax.set('if')">
          <span class="syntax-name">&#64;if</span>
          <span class="syntax-desc">Conditionals</span>
        </div>
        <div class="syntax-card" [class.active]="activeSyntax() === 'for'" (click)="activeSyntax.set('for')">
          <span class="syntax-name">&#64;for</span>
          <span class="syntax-desc">Loops</span>
        </div>
        <div class="syntax-card" [class.active]="activeSyntax() === 'switch'" (click)="activeSyntax.set('switch')">
          <span class="syntax-name">&#64;switch</span>
          <span class="syntax-desc">Multi-branch</span>
        </div>
        <div class="syntax-card" [class.active]="activeSyntax() === 'empty'" (click)="activeSyntax.set('empty')">
          <span class="syntax-name">&#64;empty</span>
          <span class="syntax-desc">Fallback UI</span>
        </div>
      </div>

      @if (activeSyntax() === 'if') {
        <div class="syntax-detail">
          <pre><code>&#64;if (user.isAdmin) {{ '{' }}
  &lt;admin-panel /&gt;
{{ '}' }} &#64;else if (user.isMod) {{ '{' }}
  &lt;mod-panel /&gt;
{{ '}' }} &#64;else {{ '{' }}
  &lt;guest-panel /&gt;
{{ '}' }}</code></pre>
          <p class="detail-note">Supports <code>&#64;else if</code> chains — no more nested <code>ng-template</code> refs!</p>
        </div>
      }
      @if (activeSyntax() === 'switch') {
        <div class="syntax-detail">
          <pre><code>&#64;switch (status) {{ '{' }}
  &#64;case ('active') {{ '{' }}
    &lt;span class="green"&gt;Active&lt;/span&gt;
  {{ '}' }}
  &#64;case ('inactive') {{ '{' }}
    &lt;span class="red"&gt;Inactive&lt;/span&gt;
  {{ '}' }}
  &#64;default {{ '{' }}
    &lt;span&gt;Unknown&lt;/span&gt;
  {{ '}' }}
{{ '}' }}</code></pre>
          <p class="detail-note">Clean multi-branch logic. Replaces verbose <code>ngSwitch</code> directives.</p>
        </div>
      }

      <div class="demo-section">
        <h3>Live Demo: &#64;for with &#64;empty</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Interactive List</span>
          </div>
          <div class="demo-controls">
            <button class="btn-action btn-add" (click)="addItem()">➕ Add Feature</button>
            <button class="btn-action btn-clear" (click)="clearItems()">🗑️ Clear All</button>
          </div>

          <ul class="feature-list">
            @for (f of features(); track f) {
              <li class="feature-item">
                <span class="feature-icon">✅</span>
                <span>{{ f }}</span>
              </li>
            } @empty {
              <li class="empty-state">
                <div class="empty-icon">📭</div>
                <p>No features to show. Click "Add Feature"!</p>
                <p class="empty-note">This is the &#64;empty block — new in Angular 17!</p>
              </li>
            }
          </ul>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Performance:</strong> The new syntax is <strong>significantly faster</strong> because it's compiled into the runtime — no directive overhead.</li>
          <li><strong>Mandatory track:</strong> In <code>&#64;for</code>, the <code>track</code> expression is <strong>required</strong>. This forces developers to optimize list rendering. Say: "This eliminates a common performance mistake."</li>
          <li><strong>No imports:</strong> Unlike <code>*ngIf</code> and <code>*ngFor</code>, you don't need to import <code>CommonModule</code> for the new control flow.</li>
          <li><strong>Migration:</strong> Use <code>ng generate &#64;angular/core:control-flow-migration</code> to auto-migrate existing templates.</li>
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
    .syntax-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; }
    .syntax-card { text-align: center; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .syntax-card:hover { border-color: #1a73e8; transform: translateY(-2px); }
    .syntax-card.active { background: #1a73e8; color: white; border-color: #174ea6; }
    .syntax-name { display: block; font-family: monospace; font-weight: 700; font-size: 1.1rem; }
    .syntax-desc { font-size: 0.75rem; opacity: 0.7; }
    .syntax-detail { animation: fadeIn 0.3s ease; margin-bottom: 20px; }
    .detail-note { font-size: 0.85rem; color: #5f6368; font-style: italic; margin-top: 8px; }
    .demo-section { margin-top: 20px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .demo-controls { display: flex; gap: 10px; margin-bottom: 15px; }
    .btn-action { padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-add { background: linear-gradient(135deg, #43a047, #66bb6a); color: white; }
    .btn-add:hover { transform: translateY(-1px); }
    .btn-clear { background: #f5f5f5; color: #333; border: 1px solid #ddd; }
    .feature-list { list-style: none; padding: 0; margin: 0; }
    .feature-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #eee; background: white; border-radius: 4px; margin-bottom: 4px; animation: slideIn 0.3s ease; }
    .feature-icon { font-size: 1.1rem; }
    .empty-state { text-align: center; padding: 30px; color: #999; }
    .empty-icon { font-size: 2.5rem; margin-bottom: 8px; }
    .empty-note { font-size: 0.8rem; color: #1a73e8; font-weight: 500; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } .syntax-cards { grid-template-columns: 1fr 1fr; } }
  `]
})
export class ControlFlowComponent {
  features = signal<string[]>(['Signals', 'Control Flow', 'Standalone']);
  activeSyntax = signal('for');

  addItem() {
    const nextId = this.features().length + 1;
    this.features.update(f => [...f, `Modern Feature #${nextId}`]);
  }

  clearItems() {
    this.features.set([]);
  }
}
