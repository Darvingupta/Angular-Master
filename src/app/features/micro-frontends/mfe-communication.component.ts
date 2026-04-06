import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MfeMessage {
  from: string;
  type: string;
  payload: string;
  timestamp: number;
}

@Component({
    selector: 'app-mfe-communication',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="feature-page">
      <h2>Cross-MFE Communication & Deployment</h2>
      <p class="subtitle">How Micro Frontends Talk to Each Other</p>

      <div class="explanation">
        <p>The biggest challenge in micro frontends isn't splitting the app — it's <strong>how the pieces communicate</strong>. Unlike a monolith where components share services directly, MFEs must communicate across boundaries while staying <strong>loosely coupled</strong>.</p>
      </div>

      <div class="patterns-overview">
        <h3>Communication Patterns</h3>
        <div class="pattern-grid">
          @for (p of commPatterns; track p.id) {
            <div class="comm-card" [class.active]="selectedComm() === p.id" (click)="selectedComm.set(p.id)">
              <div class="comm-icon">{{ p.icon }}</div>
              <h4>{{ p.name }}</h4>
              <p>{{ p.summary }}</p>
              <span class="coupling-badge" [class]="p.coupling">{{ p.coupling }} coupling</span>
            </div>
          }
        </div>

        @if (selectedComm()) {
          <div class="comm-detail">
            @if (selectedComm() === 'events') {
              <h4>Custom Events (Browser Native)</h4>
              <div class="code-split">
                <div>
                  <span class="code-label">Sender (MFE-A)</span>
                  <pre><code>// Dispatch a custom event on window
window.dispatchEvent(
  new CustomEvent('cart:item-added', &#123;
    detail: &#123; productId: 42, qty: 1 &#125;
  &#125;)
);</code></pre>
                </div>
                <div>
                  <span class="code-label">Receiver (MFE-B)</span>
                  <pre><code>// Listen for cross-MFE events
window.addEventListener(
  'cart:item-added',
  (e: CustomEvent) =&gt; &#123;
    console.log('Item added:', e.detail);
    this.cartCount.update(c =&gt; c + e.detail.qty);
  &#125;
);</code></pre>
                </div>
              </div>
            }
            @if (selectedComm() === 'shared') {
              <h4>Shared Singleton Service</h4>
              <div class="code-split">
                <div>
                  <span class="code-label">Shared Library</span>
                  <pre><code>// shared-state.service.ts (published as npm pkg)
&#64;Injectable(&#123; providedIn: 'root' &#125;)
export class SharedStateService &#123;
  private user = signal&lt;User | null&gt;(null);
  readonly currentUser = this.user.asReadonly();

  login(user: User) &#123;
    this.user.set(user);
  &#125;
&#125;</code></pre>
                </div>
                <div>
                  <span class="code-label">MFE consuming the shared state</span>
                  <pre><code>// In any MFE component
export class HeaderComponent &#123;
  private state = inject(SharedStateService);
  user = this.state.currentUser;
  // Reactively updates when any MFE
  // calls state.login()
&#125;

// ⚠️ Requires singleton: true in
// Module Federation shared config!</code></pre>
                </div>
              </div>
            }
            @if (selectedComm() === 'storage') {
              <h4>localStorage / sessionStorage</h4>
              <pre><code>// MFE-A sets data
localStorage.setItem('user-preferences',
  JSON.stringify(&#123; theme: 'dark', lang: 'en' &#125;)
);

// MFE-B reads it
const prefs = JSON.parse(
  localStorage.getItem('user-preferences') || '&#123;&#125;'
);

// Listen for changes from other tabs/MFEs:
window.addEventListener('storage', (e) =&gt; &#123;
  if (e.key === 'user-preferences') &#123;
    console.log('Prefs updated by another MFE!', e.newValue);
  &#125;
&#125;);</code></pre>
              <p class="warning-note">&#9888;&#65039; Only use for simple, non-sensitive data. Not reactive within the same tab.</p>
            }
            @if (selectedComm() === 'rxjs') {
              <h4>RxJS Subject (via Shared Lib)</h4>
              <pre><code>// event-bus.service.ts — shared npm library
import &#123; Subject &#125; from 'rxjs';

export interface MfeEvent &#123;
  type: string;
  payload: any;
&#125;

class EventBusService &#123;
  private bus$ = new Subject&lt;MfeEvent&gt;();

  emit(event: MfeEvent) &#123; this.bus$.next(event); &#125;
  on(type: string) &#123;
    return this.bus$.pipe(filter(e =&gt; e.type === type));
  &#125;
&#125;

// MFE-A: eventBus.emit(&#123; type: 'LOGOUT', payload: null &#125;);
// MFE-B: eventBus.on('LOGOUT').subscribe(() =&gt; this.clearSession());</code></pre>
            }
          </div>
        }
      </div>

      <div class="demo-section">
        <h3>Live Demo: Cross-MFE Messaging Simulation</h3>
        <p>Two simulated micro frontends communicating via CustomEvents:</p>

        <div class="mfe-sim-grid">
          <div class="mfe-panel">
            <div class="mfe-header mfe-a-header">
              <span>&#128230; MFE-A: Product Catalog</span>
            </div>
            <div class="mfe-body">
              <p>Select a product to add to cart:</p>
              <div class="product-list">
                @for (product of products; track product.id) {
                  <div class="product-item">
                    <span>{{ product.name }}</span>
                    <span class="price">{{ product.price | currency }}</span>
                    <button class="add-btn" (click)="addToCart(product)">+ Add</button>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="event-stream">
            <div class="event-label">CustomEvent Bus</div>
            <div class="event-arrows">
              @for (msg of messageLog(); track msg.timestamp) {
                <div class="event-bubble" [class]="'from-' + msg.from">
                  {{ msg.type }}: {{ msg.payload }}
                </div>
              }
              @if (messageLog().length === 0) {
                <div class="no-events">No events yet</div>
              }
            </div>
          </div>

          <div class="mfe-panel">
            <div class="mfe-header mfe-b-header">
              <span>&#128722; MFE-B: Shopping Cart</span>
            </div>
            <div class="mfe-body">
              <div class="cart-summary">
                <div class="cart-count">
                  <span class="count-number">{{ cartItems().length }}</span>
                  <span>items in cart</span>
                </div>
                <div class="cart-total">
                  Total: <strong>{{ cartTotal() | currency }}</strong>
                </div>
              </div>
              <div class="cart-items">
                @for (item of cartItems(); track item.id + item.timestamp) {
                  <div class="cart-item">
                    <span>{{ item.name }}</span>
                    <span>{{ item.price | currency }}</span>
                    <button class="remove-btn" (click)="removeFromCart(item)">&#10005;</button>
                  </div>
                } @empty {
                  <p class="empty-cart">Cart is empty. Add products from MFE-A!</p>
                }
              </div>
              @if (cartItems().length > 0) {
                <button class="checkout-btn" (click)="checkout()">Checkout &#10148;</button>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="deployment-section">
        <h3>Deployment Strategy</h3>
        <div class="deploy-grid">
          <div class="deploy-card">
            <div class="deploy-icon">&#127959;&#65039;</div>
            <h4>Independent CI/CD</h4>
            <p>Each MFE has its own pipeline. Team A deploys Auth without waiting for Team B's Shopping Cart.</p>
          </div>
          <div class="deploy-card">
            <div class="deploy-icon">&#128230;</div>
            <h4>Versioned Remotes</h4>
            <p>Use semver for remoteEntry URLs: <code>/v2.1/remoteEntry.js</code>. Host can pin or float versions.</p>
          </div>
          <div class="deploy-card">
            <div class="deploy-icon">&#127793;</div>
            <h4>Canary / Blue-Green</h4>
            <p>Route 5% of traffic to new MFE version. If metrics are good, roll to 100%.</p>
          </div>
          <div class="deploy-card">
            <div class="deploy-icon">&#128737;&#65039;</div>
            <h4>Shared Design System</h4>
            <p>Publish a shared UI library (Component Library) so all MFEs look consistent despite independent development.</p>
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Interview Pro-Tips:</h4>
        <ul>
          <li><strong>Loose coupling rule:</strong> "MFEs should communicate through events or contracts, never by importing each other's internal modules."</li>
          <li><strong>Shared state anti-pattern:</strong> "If two MFEs share too much state, they should probably be one MFE." The whole point is independence.</li>
          <li><strong>Testing:</strong> "We integration-test the Host + Remotes together in staging. Each MFE has its own unit/e2e tests in isolation."</li>
          <li><strong>Performance:</strong> "We use shared dependencies (singleton Angular core) to avoid downloading the same library twice. Plus, remotes are lazy-loaded."</li>
          <li><strong>Rollback:</strong> "Since each MFE deploys independently, we can roll back just the broken MFE without affecting others."</li>
        </ul>
      </div>
    </div>
  `,
    styles: [`
    .feature-page { padding: 20px; }
    .subtitle { color: #5f6368; font-style: italic; margin-top: -5px; margin-bottom: 20px; }
    .explanation { background: linear-gradient(135deg, #e8f5e9, #f1f8e9); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #43a047; }
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; }

    .pattern-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 15px 0; }
    .comm-card { padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s; text-align: center; }
    .comm-card:hover { border-color: #43a047; transform: translateY(-2px); }
    .comm-card.active { border-color: #43a047; background: #f1f8e9; box-shadow: 0 4px 12px rgba(67, 160, 71, 0.2); }
    .comm-icon { font-size: 2rem; margin-bottom: 8px; }
    .comm-card h4 { margin: 4px 0; font-size: 0.9rem; }
    .comm-card p { font-size: 0.78rem; color: #666; margin: 4px 0 8px; }
    .coupling-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600; }
    .low { background: #e8f5e9; color: #2e7d32; }
    .medium { background: #fff3e0; color: #e65100; }
    .high { background: #fce4ec; color: #c62828; }

    .comm-detail { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-top: 10px; animation: fadeIn 0.3s ease; }
    .code-split { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .code-label { display: inline-block; background: #43a047; color: white; padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; margin-bottom: 6px; }
    .warning-note { color: #e65100; font-size: 0.85rem; margin-top: 10px; font-weight: 500; }

    .mfe-sim-grid { display: grid; grid-template-columns: 1fr 140px 1fr; gap: 12px; align-items: stretch; margin: 20px 0; }
    .mfe-panel { border: 2px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
    .mfe-header { padding: 10px 15px; color: white; font-weight: 700; font-size: 0.85rem; }
    .mfe-a-header { background: linear-gradient(135deg, #1565c0, #1976d2); }
    .mfe-b-header { background: linear-gradient(135deg, #e65100, #f57c00); }
    .mfe-body { padding: 15px; background: #fafafa; min-height: 200px; }

    .product-list { display: flex; flex-direction: column; gap: 8px; }
    .product-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: white; border: 1px solid #eee; border-radius: 6px; }
    .price { font-weight: 600; color: #1a73e8; font-family: monospace; }
    .add-btn { padding: 4px 14px; background: #1565c0; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
    .add-btn:hover { background: #0d47a1; }

    .event-stream { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 10px 0; }
    .event-label { font-size: 0.7rem; font-weight: 700; color: #999; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .event-arrows { display: flex; flex-direction: column; gap: 6px; width: 100%; max-height: 280px; overflow-y: auto; }
    .event-bubble { padding: 6px 10px; border-radius: 6px; font-size: 0.72rem; font-family: monospace; animation: slideIn 0.3s ease; word-break: break-all; }
    .from-A { background: #e3f2fd; color: #1565c0; border: 1px solid #bbdefb; }
    .from-B { background: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; }
    .no-events { color: #ccc; font-size: 0.8rem; text-align: center; }

    .cart-summary { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px; border: 1px solid #eee; }
    .cart-count { display: flex; flex-direction: column; align-items: center; }
    .count-number { font-size: 1.8rem; font-weight: 700; color: #e65100; }
    .cart-total { display: flex; align-items: center; font-size: 1.1rem; }
    .cart-items { display: flex; flex-direction: column; gap: 6px; }
    .cart-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: white; border: 1px solid #eee; border-radius: 4px; font-size: 0.85rem; }
    .remove-btn { background: none; border: none; color: #d93025; cursor: pointer; font-weight: 700; font-size: 1rem; }
    .empty-cart { color: #999; font-style: italic; text-align: center; padding: 20px; }
    .checkout-btn { margin-top: 12px; width: 100%; padding: 10px; background: linear-gradient(135deg, #e65100, #f57c00); color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }
    .checkout-btn:hover { opacity: 0.9; }

    .deployment-section { margin-top: 30px; }
    .deploy-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 15px 0; }
    .deploy-card { text-align: center; padding: 20px 15px; border: 1px solid #e0e0e0; border-radius: 10px; background: white; transition: transform 0.2s; }
    .deploy-card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .deploy-icon { font-size: 2rem; margin-bottom: 8px; }
    .deploy-card h4 { margin: 4px 0; }
    .deploy-card p { font-size: 0.82rem; color: #5f6368; }

    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    @media (max-width: 900px) {
      .mfe-sim-grid { grid-template-columns: 1fr; }
      .event-stream { flex-direction: row; overflow-x: auto; }
      .pattern-grid { grid-template-columns: 1fr 1fr; }
      .deploy-grid { grid-template-columns: 1fr 1fr; }
      .code-split { grid-template-columns: 1fr; }
    }
  `]
})
export class MfeCommunicationComponent {
  selectedComm = signal('events');
  messageLog = signal<MfeMessage[]>([]);
  cartItems = signal<Array<{id: number; name: string; price: number; timestamp: number}>>([]);

  cartTotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price, 0)
  );

  products = [
    { id: 1, name: 'Angular Masterclass', price: 49.99 },
    { id: 2, name: 'RxJS Deep Dive', price: 39.99 },
    { id: 3, name: 'NgRx Workshop', price: 59.99 },
    { id: 4, name: 'Testing Toolkit', price: 29.99 }
  ];

  commPatterns = [
    { id: 'events', name: 'Custom Events', icon: '📡', summary: 'Browser-native, fire-and-forget messaging', coupling: 'low' },
    { id: 'shared', name: 'Shared Service', icon: '🔗', summary: 'Singleton Angular service via DI', coupling: 'medium' },
    { id: 'storage', name: 'localStorage', icon: '💾', summary: 'Persistent key-value storage', coupling: 'low' },
    { id: 'rxjs', name: 'RxJS Bus', icon: '🔄', summary: 'Reactive event bus via Subject', coupling: 'medium' }
  ];

  addToCart(product: {id: number; name: string; price: number}) {
    const ts = Date.now();
    this.cartItems.update(items => [
      ...items,
      { ...product, timestamp: ts }
    ]);
    this.messageLog.update(logs => [
      {
        from: 'A',
        type: 'cart:item-added',
        payload: product.name,
        timestamp: ts
      },
      ...logs.slice(0, 9)
    ]);
  }

  removeFromCart(item: {id: number; name: string; price: number; timestamp: number}) {
    const ts = Date.now();
    this.cartItems.update(items =>
      items.filter(i => i.timestamp !== item.timestamp)
    );
    this.messageLog.update(logs => [
      {
        from: 'B',
        type: 'cart:item-removed',
        payload: item.name,
        timestamp: ts
      },
      ...logs.slice(0, 9)
    ]);
  }

  checkout() {
    const ts = Date.now();
    const count = this.cartItems().length;
    this.cartItems.set([]);
    this.messageLog.update(logs => [
      {
        from: 'B',
        type: 'checkout:complete',
        payload: `${count} items purchased!`,
        timestamp: ts
      },
      ...logs.slice(0, 9)
    ]);
  }
}
