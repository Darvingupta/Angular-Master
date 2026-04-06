import { Component, signal, linkedSignal, untracked, resource } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-reactivity',
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <h2>2. Advanced Reactivity Features</h2>
      <p class="subtitle">linkedSignal, untracked & resource — Power Tools for Complex State</p>

      <div class="explanation">
        <p>Angular 19 introduces advanced Signal APIs for sophisticated state management patterns. These are the tools that separate <strong>junior</strong> from <strong>senior</strong> Angular developers in interviews.</p>
      </div>

      <section class="concept-block">
        <h3>linkedSignal() <span class="version-badge">v19+</span></h3>
        <p>A <strong>writable signal</strong> that automatically resets when a source signal changes. Perfect for "default value" patterns where a derived value should reset but remain editable.</p>
        
        <div class="comparison-grid">
          <div class="card old">
            <h3>Old Way: Manual Reset</h3>
            <pre><code>// Manually reset via effect or ngOnChanges
account = signal('Savings');
amount = signal(100);

// Must remember to reset everywhere!
selectAccount(type: string) {{ '{' }}
  this.account.set(type);
  this.amount.set(type === 'Savings' ? 100 : 50);
{{ '}' }}</code></pre>
          </div>
          <div class="card new">
            <h3>New Way: linkedSignal</h3>
            <pre><code>// Automatically resets when source changes
account = signal('Savings');
amount = linkedSignal({{ '{' }}
  source: this.account,
  computation: (acc) =>
    acc === 'Savings' ? 100 : 50
{{ '}' }});

// amount is STILL writable!
this.amount.set(200); // ✅ works</code></pre>
          </div>
        </div>

        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Live Demo</span>
            <span class="demo-hint">Switch accounts — amount resets. But you can still edit it!</span>
          </div>
          <div class="linked-demo">
            <div class="demo-field">
              <label>Account Type:</label>
              <div class="toggle-group">
                <button [class.active]="account() === 'Savings'" (click)="selectAccount('Savings')">🏦 Savings</button>
                <button [class.active]="account() === 'Checking'" (click)="selectAccount('Checking')">💳 Checking</button>
              </div>
            </div>
            <div class="demo-field">
              <label>Transfer Amount:</label>
              <input type="number" [value]="amount()" (input)="updateAmount($any($event.target).value)" class="amount-input" />
            </div>
            <div class="demo-result">
              <span class="result-label">Current:</span>
              <span class="result-value">{{ account() }} → {{ amount() | currency }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="concept-block">
        <h3>untracked() <span class="version-badge">v16+</span></h3>
        <p>Read a signal value <strong>without creating a dependency</strong>. Critical inside effects and computed signals when you don't want certain signals to trigger re-evaluation.</p>
        
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Visualized</span>
          </div>
          <div class="untracked-visual">
            <div class="tracked-box">
              <div class="box-label tracked-label">TRACKED ✅</div>
              <code>this.data()</code>
              <p>Changes trigger the effect</p>
            </div>
            <div class="arrow-between">effect(() => {{ '{' }}</div>
            <div class="tracked-box">
              <div class="box-label untracked-label">UNTRACKED 🚫</div>
              <code>untracked(this.logCount)</code>
              <p>Changes are IGNORED</p>
            </div>
            <div class="arrow-between">{{ '}' }})</div>
          </div>
        </div>

        <pre><code>effect(() => {{ '{' }}
  const val = this.data();           // ← Tracked: triggers re-run
  const count = untracked(this.logCount); // ← NOT tracked: reads silently
  console.log(val, count);
{{ '}' }});</code></pre>
      </section>

      <section class="concept-block">
        <h3>resource() <span class="version-badge exp">v19 Experimental</span></h3>
        <p>Declarative async data loading integrated into the Signal ecosystem. Automatically re-fetches when dependencies change. Replaces manual subscribe + loading state patterns.</p>

        <div class="comparison-grid">
          <div class="card old">
            <h3>Old Way: Manual Async</h3>
            <pre><code>// So much boilerplate...
loading = false;
user: User | null = null;

ngOnInit() {{ '{' }}
  this.loading = true;
  this.http.get('/api/user/1')
    .subscribe({{ '{' }}
      next: u => this.user = u,
      error: e => console.error(e),
      complete: () => this.loading = false
    {{ '}' }});
{{ '}' }}</code></pre>
          </div>
          <div class="card new">
            <h3>New Way: resource()</h3>
            <pre><code>// Declarative! Auto-refetches!
userId = signal(1);
user = resource({{ '{' }}
  request: () => ({{ '{' }} id: this.userId() {{ '}' }}),
  loader: async ({{ '{' }} request {{ '}' }}) => {{ '{' }}
    const r = await fetch('/api/user/' + request.id);
    return r.json();
  {{ '}' }}
{{ '}' }});
// user.value(), user.isLoading(), user.error()</code></pre>
          </div>
        </div>

        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Live API Demo</span>
          </div>
          <button class="btn-action btn-fetch" (click)="refreshUser()">🔄 Fetch Next User</button>
          <div class="resource-display">
            @if (userResource.isLoading()) {
              <div class="loading-state">
                <div class="spinner"></div>
                <span>Fetching user #{{ userId() }}...</span>
              </div>
            } @else {
              <div class="user-card">
                <div class="user-avatar">{{ userResource.value()?.name?.charAt(0) || '?' }}</div>
                <div class="user-details">
                  <strong>{{ userResource.value()?.name }}</strong>
                  <span>{{ userResource.value()?.email }}</span>
                  <span class="user-company">{{ userResource.value()?.company?.name }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Immutability:</strong> Never use <code>.push()</code> on a signal array. Always use <code>update(arr => [...arr, item])</code>.</li>
          <li><strong>Reactive Data Services:</strong> Encapsulate writable signals in services and expose <code>asReadonly()</code> to consumers.</li>
          <li><strong>Custom Equality:</strong> You can provide <code>signal(val, {{ '{' }} equal: myFunc {{ '}' }})</code> to control when subscribers are notified.</li>
          <li><strong>linkedSignal vs computed:</strong> "Computed is read-only. linkedSignal is writable but also auto-resets. Use linkedSignal for editable defaults."</li>
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
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0; }
    .demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .demo-hint { font-size: 0.75rem; color: #999; font-style: italic; }
    .linked-demo { display: flex; flex-direction: column; gap: 15px; }
    .demo-field { display: flex; align-items: center; gap: 12px; }
    .demo-field label { font-weight: 600; min-width: 120px; }
    .toggle-group { display: flex; gap: 4px; }
    .toggle-group button { padding: 8px 18px; border: 2px solid #ddd; border-radius: 6px; background: white; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .toggle-group button.active { background: #1a73e8; color: white; border-color: #174ea6; }
    .amount-input { padding: 8px 14px; border: 2px solid #ddd; border-radius: 6px; font-family: monospace; font-size: 1.1rem; width: 140px; }
    .demo-result { padding: 10px 16px; background: #e8f5e9; border-radius: 6px; }
    .result-label { color: #999; font-size: 0.8rem; margin-right: 8px; }
    .result-value { font-weight: 700; color: #188038; font-size: 1.1rem; }
    .untracked-visual { display: flex; align-items: center; gap: 10px; justify-content: center; flex-wrap: wrap; }
    .tracked-box { text-align: center; padding: 15px 20px; border-radius: 8px; border: 2px solid #e0e0e0; background: white; min-width: 180px; }
    .box-label { font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; display: inline-block; }
    .tracked-label { background: #e8f5e9; color: #2e7d32; }
    .untracked-label { background: #fce4ec; color: #c62828; }
    .tracked-box code { display: block; font-size: 0.85rem; margin: 8px 0; color: #1a73e8; }
    .tracked-box p { font-size: 0.75rem; color: #666; margin: 0; }
    .arrow-between { font-family: monospace; font-size: 0.8rem; color: #999; }
    .btn-action { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-fetch { background: linear-gradient(135deg, #1a73e8, #448aff); color: white; margin-bottom: 15px; }
    .btn-fetch:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(26,115,232,0.3); }
    .resource-display { margin-top: 10px; }
    .loading-state { display: flex; align-items: center; gap: 12px; color: #1a73e8; }
    .spinner { width: 24px; height: 24px; border: 3px solid #e0e0e0; border-top-color: #1a73e8; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .user-card { display: flex; align-items: center; gap: 15px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0; animation: fadeIn 0.3s ease; }
    .user-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #7c4dff, #448aff); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; flex-shrink: 0; }
    .user-details { display: flex; flex-direction: column; gap: 2px; }
    .user-details strong { font-size: 1.1rem; }
    .user-details span { font-size: 0.85rem; color: #666; }
    .user-company { color: #1a73e8 !important; font-weight: 500; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } .demo-field { flex-direction: column; align-items: flex-start; } }
  `]
})
export class AdvancedReactivityComponent {
  account = signal('Savings');
  
  amount = linkedSignal<string, number>({
    source: this.account,
    computation: (account) => account === 'Savings' ? 100 : 50
  });

  userId = signal(1);
  userResource = resource({
    request: () => ({ id: this.userId() }),
    loader: async ({ request }) => {
      const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${request.id}`);
      return await resp.json();
    }
  });

  selectAccount(val: string) {
    this.account.set(val);
  }

  updateAmount(val: string) {
    this.amount.set(Number(val));
  }

  refreshUser() {
    this.userId.update(id => (id % 10) + 1);
  }
}
