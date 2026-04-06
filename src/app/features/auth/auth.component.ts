import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-auth',
    imports: [CommonModule],
    template: `
    <div class="feature-page">
      <h2>Auth Guards & Functional Guards</h2>
      <p class="subtitle">Route Protection in Modern Angular (v16+)</p>

      <div class="explanation">
        <p>Guards protect routes from unauthorized access. Modern Angular replaces <strong>class-based guards</strong> with <strong>functional guards</strong> — simpler, tree-shakeable functions that use <code>inject()</code> for dependencies.</p>
      </div>

      <div class="comparison-grid">
        <div class="card old">
          <h3>Old Way: Class-based Guard</h3>
          <pre><code>&#64;Injectable()
export class AuthGuard implements CanActivate {{ '{' }}
  constructor(
    private authService: AuthService,
    private router: Router
  ) {{ '{' }} {{ '}' }}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {{ '{' }}
    if (this.authService.isLoggedIn()) {{ '{' }}
      return true;
    {{ '}' }}
    return this.router.parseUrl('/login');
  {{ '}' }}
{{ '}' }}

// 15+ lines of boilerplate! 😩</code></pre>
        </div>
        <div class="card new">
          <h3>New Way: Functional Guard</h3>
          <pre><code>export const authGuard: CanActivateFn = () => {{ '{' }}
  const auth = inject(AuthService);
  const router = inject(Router);
  
  return auth.isLoggedIn()
    ? true
    : router.parseUrl('/login');
{{ '}' }};

// In routes:
{{ '{' }}
  path: 'admin',
  canActivate: [authGuard],
  loadComponent: () => import('./admin')
{{ '}' }}
// 6 lines! Same power! ✅</code></pre>
        </div>
      </div>

      <div class="guard-types">
        <h3>Guard Types</h3>
        <div class="guard-grid">
          <div class="guard-card" [class.active]="selectedGuard() === 'activate'" (click)="selectedGuard.set('activate')">
            <div class="guard-icon">🔐</div>
            <strong>canActivate</strong>
            <small>Can the user visit this route?</small>
          </div>
          <div class="guard-card" [class.active]="selectedGuard() === 'deactivate'" (click)="selectedGuard.set('deactivate')">
            <div class="guard-icon">🚪</div>
            <strong>canDeactivate</strong>
            <small>Can the user leave this route?</small>
          </div>
          <div class="guard-card" [class.active]="selectedGuard() === 'match'" (click)="selectedGuard.set('match')">
            <div class="guard-icon">🎯</div>
            <strong>canMatch</strong>
            <small>Should this route even load?</small>
          </div>
          <div class="guard-card" [class.active]="selectedGuard() === 'resolve'" (click)="selectedGuard.set('resolve')">
            <div class="guard-icon">📦</div>
            <strong>resolve</strong>
            <small>Pre-fetch data before render</small>
          </div>
        </div>

        @if (selectedGuard() === 'deactivate') {
          <div class="guard-detail">
            <pre><code>// "Are you sure?" guard — prevents leaving with unsaved changes
export const unsavedChangesGuard: CanDeactivateFn&lt;FormComponent&gt; = 
  (component) => {{ '{' }}
    if (component.hasUnsavedChanges()) {{ '{' }}
      return confirm('Discard unsaved changes?');
    {{ '}' }}
    return true;
  {{ '}' }};</code></pre>
          </div>
        }
        @if (selectedGuard() === 'match') {
          <div class="guard-detail">
            <pre><code>// Prevents route from even being MATCHED (and downloaded!)
export const adminMatchGuard: CanMatchFn = () => {{ '{' }}
  return inject(AuthService).hasRole('admin');
{{ '}' }};

// Route won't even appear in the router if user isn't admin
{{ '{' }} path: 'admin', canMatch: [adminMatchGuard], ... {{ '}' }}</code></pre>
          </div>
        }
        @if (selectedGuard() === 'resolve') {
          <div class="guard-detail">
            <pre><code>// Pre-fetch data before the component renders
export const userResolver: ResolveFn&lt;User&gt; = (route) => {{ '{' }}
  const http = inject(HttpClient);
  return http.get&lt;User&gt;('/api/user/' + route.params['id']);
{{ '}' }};

// Data available via ActivatedRoute.data
{{ '{' }} path: 'user/:id', resolve: {{ '{' }} user: userResolver {{ '}' }} {{ '}' }}</code></pre>
          </div>
        }
      </div>

      <div class="demo-section">
        <h3>Live Demo: Guard Simulation</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Interactive</span>
          </div>
          <div class="auth-demo">
            <div class="auth-panel">
              <div class="auth-status" [class.logged-in]="isLoggedIn()" [class.logged-out]="!isLoggedIn()">
                <div class="status-icon">{{ isLoggedIn() ? '🔓' : '🔒' }}</div>
                <div>
                  <strong>{{ isLoggedIn() ? 'Authenticated' : 'Not Authenticated' }}</strong>
                  <p>{{ isLoggedIn() ? 'User: darvin&#64;angular.dev' : 'Please log in' }}</p>
                </div>
              </div>
              <button class="btn-action" [class.btn-login]="!isLoggedIn()" [class.btn-logout]="isLoggedIn()" (click)="toggleAuth()">
                {{ isLoggedIn() ? '🚪 Logout' : '🔑 Login' }}
              </button>
            </div>

            <div class="route-sim">
              <p>Try to access <strong>"Admin Settings"</strong>:</p>
              <button class="btn-action btn-navigate" (click)="checkAccess()">🚀 Navigate to /admin</button>
              @if (accessMessage()) {
                <div class="access-result" [class.granted]="isLoggedIn()" [class.denied]="!isLoggedIn()">
                  {{ accessMessage() }}
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Why functional?</strong> "They reduce boilerplate, are tree-shakeable, and use <code>inject()</code> which works with standalone components."</li>
          <li><strong>canMatch vs canLoad:</strong> <code>canMatch</code> replaces deprecated <code>canLoad</code>. It prevents the route from even being matched — the JS chunk won't download!</li>
          <li><strong>Return types:</strong> Guards can return <code>boolean</code>, <code>UrlTree</code> (redirect), or <code>Observable/Promise</code> of either.</li>
          <li><strong>Composability:</strong> Functional guards are just functions — you can compose them: <code>canActivate: [authGuard, roleGuard('admin')]</code>.</li>
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
    .guard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; }
    .guard-card { text-align: center; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .guard-card:hover { border-color: #1a73e8; transform: translateY(-2px); }
    .guard-card.active { background: #1a73e8; color: white; border-color: #174ea6; }
    .guard-icon { font-size: 1.8rem; margin-bottom: 4px; }
    .guard-card strong { display: block; font-size: 0.85rem; }
    .guard-card small { font-size: 0.7rem; opacity: 0.7; }
    .guard-detail { animation: fadeIn 0.3s ease; margin-bottom: 20px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { margin-bottom: 12px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .auth-demo { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .auth-panel { }
    .auth-status { display: flex; align-items: center; gap: 12px; padding: 15px; border-radius: 8px; margin-bottom: 12px; }
    .auth-status.logged-in { background: #e8f5e9; border: 1px solid #a5d6a7; }
    .auth-status.logged-out { background: #fce4ec; border: 1px solid #ef9a9a; }
    .status-icon { font-size: 2rem; }
    .auth-status p { font-size: 0.8rem; color: #666; margin: 2px 0 0; }
    .btn-action { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-login { background: linear-gradient(135deg, #43a047, #66bb6a); color: white; }
    .btn-logout { background: #f5f5f5; color: #333; border: 1px solid #ddd; }
    .btn-navigate { background: linear-gradient(135deg, #1a73e8, #448aff); color: white; margin-top: 10px; }
    .btn-action:hover { transform: translateY(-1px); }
    .route-sim { padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0; }
    .access-result { padding: 12px; border-radius: 6px; margin-top: 12px; font-weight: 600; animation: fadeIn 0.3s ease; }
    .access-result.granted { background: #e8f5e9; color: #2e7d32; }
    .access-result.denied { background: #fce4ec; color: #c62828; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @media (max-width: 768px) { .comparison-grid, .auth-demo { grid-template-columns: 1fr; } .guard-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class AuthComponent {
  isLoggedIn = signal(false);
  accessMessage = signal('');
  selectedGuard = signal('activate');

  toggleAuth() {
    this.isLoggedIn.update(v => !v);
    this.accessMessage.set('');
  }

  checkAccess() {
    if (this.isLoggedIn()) {
      this.accessMessage.set('✅ Access Granted! Guard returned true → navigating to /admin...');
    } else {
      this.accessMessage.set('❌ Access Denied! Guard returned UrlTree → redirecting to /login...');
    }
  }
}
