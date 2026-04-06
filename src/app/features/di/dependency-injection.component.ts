import { Component, Injectable, InjectionToken, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. A classical service providing data
@Injectable({ providedIn: 'root' })
export class LoggerService {
  logs = signal<string[]>([]);

  log(message: string) {
    this.logs.update(logs => [...logs, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }
  
  clear() {
    this.logs.set([]);
  }
}

// 2. An InjectionToken (super useful for configuration strings/objects!)
export const APP_CONFIG = new InjectionToken<{ theme: string }>('App Configuration', {
  providedIn: 'root',
  factory: () => ({ theme: 'ultra-dark-mode' })
});

@Component({
  selector: 'app-dependency-injection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <h2>Dependency Injection (DI)</h2>
      <p class="subtitle">Modern injection patterns with the <code>inject()</code> function</p>

      <div class="explanation">
        <p>Angular DI has radically evolved. The ancient way of writing massive <code>constructor()</code> injections is out. Modern Angular relies heavily on the <code>inject()</code> function, which enables extreme flexibility, cleaner code, and function-based DI outside of classes.</p>
      </div>

      <div class="comparison-grid">
        <div class="card structural">
          <h3>Old Way: Constructor Injection</h3>
          <p>Bloated and painful when inheriting classes.</p>
          <pre><code>&#64;Component({{ '{' }} ... {{ '}' }})
export class UserComponent {{ '{' }}
  // Bulky! What if we extend a base class? 😩
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    protected router: Router
  ) {{ '{' }} {{ '}' }}
{{ '}' }}</code></pre>
        </div>
        <div class="card attribute">
          <h3>New Way: inject() Function</h3>
          <p>Tree-shakeable, type-safe, and usable in pure functions!</p>
          <pre><code>&#64;Component({{ '{' }} ... {{ '}' }})
export class UserComponent {{ '{' }}
  // Extremely clean! ✅
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  protected router = inject(Router);
{{ '}' }}</code></pre>
        </div>
      </div>

      <div class="demo-section">
        <h3>Live Demo: DI in Action</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">Interactive</span>
          </div>
          
          <div class="di-demo">
            <div class="tokens-section">
              <h4>Injection Tokens</h4>
              <p>We injected a configuration token <code>APP_CONFIG</code>. The injected value is:</p>
              <div class="code-badge">
                {{ '{' }}{{ '{' }} config.theme {{ '}' }}{{ '}' }}
              </div>
            </div>

            <div class="service-section">
              <h4>LoggerService Injection</h4>
              <div class="controls">
                <button class="btn primary" (click)="triggerLog()">Add Log 📝</button>
                <button class="btn danger" (click)="logger.clear()">Clear Logs 🗑️</button>
              </div>

              <div class="terminal">
                <div class="terminal-header">Service Logs (Shared Singleton)</div>
                <div class="terminal-body">
                  @for (log of logger.logs(); track log) {
                    <div class="log-entry">> {{ log }}</div>
                  } @empty {
                    <div class="log-entry empty">No logs in the LoggerService yet.</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Pro-Tips:</h4>
        <ul>
          <li><strong>Injection Context:</strong> The <code>inject()</code> function MUST be called in an injection context (like a constructor, property initialization, or factory function). It cannot be called inside a standard operational method like <code>ngOnInit</code>.</li>
          <li><strong>Tokens:</strong> <code>InjectionToken</code> is perfect for injecting primitives (strings, numbers, objects) like environment configs or API URLs without needing a wrapper service class.</li>
          <li><strong>Hierarchical DI:</strong> Remember components can have their own <code>providers: []</code>. If you provide a service at the component level, that component and its children get a fresh unique instance, destroying the "singleton" nature!</li>
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
    .structural { border-left: 5px solid #d93025; background: #fff8f8; }
    .attribute { border-left: 5px solid #188038; background: #f8fff8; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; margin-bottom: 10px; }
    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { margin-bottom: 15px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    
    .di-demo { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; }
    .code-badge { display: inline-block; background: #fce4ec; color: #c2185b; padding: 5px 10px; border-radius: 6px; font-family: monospace; font-weight: bold;}
    
    .controls { display: flex; gap: 10px; margin-bottom: 15px; }
    .btn { padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.2s ease; }
    .btn:hover { transform: translateY(-1px); }
    .primary { background: #1a73e8; color: white; }
    .danger { background: #fee2e2; color: #dc2626; }
    
    .terminal { background: #111827; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .terminal-header { background: #374151; color: #9ca3af; padding: 8px 12px; font-size: 0.8rem; font-family: monospace; }
    .terminal-body { padding: 15px; height: 150px; overflow-y: auto; color: #10b981; font-family: 'Fira Code', monospace; font-size: 0.85rem; }
    .log-entry { margin-bottom: 5px; }
    .log-entry.empty { color: #6b7280; font-style: italic; }
    
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
    @media (max-width: 768px) { .di-demo { grid-template-columns: 1fr; } }
  `]
})
export class DependencyInjectionComponent {
  // Brand new inject() capability:
  config = inject(APP_CONFIG);
  logger = inject(LoggerService);

  triggerLog() {
    this.logger.log(`Button clicked! Component utilized injected LoggerService.`);
  }
}
