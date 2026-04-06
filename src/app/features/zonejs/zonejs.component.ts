import { Component, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zonejs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <h2>Zone.js & Zoneless Angular</h2>
      <p class="subtitle">Understanding the heartbeat of Angular's Change Detection</p>

      <div class="explanation">
        <p><strong>Zone.js</strong> is a library that monkey-patches browser APIs (like <code>setTimeout</code>, DOM events, HTTP requests) to create an Execution Context in JavaScript. For years, Angular relied entirely on Zone.js to automatically know when to run Change Detection.</p>
        <p>With <strong>Angular 18+ and Signals</strong>, we can finally build apps without Zone.js, resulting in massive performance gains and smaller bundle sizes!</p>
      </div>

      <div class="comparison-grid">
        <div class="card structural">
          <h3>Legacy: With Zone.js</h3>
          <p>The "Magic" Approach.</p>
          <ul>
            <li>Hooks into <em>all</em> async operations.</li>
            <li>Triggers top-down change detection checks constantly.</li>
            <li>Easy to learn, but hard to optimize (memory leaks, <code>ExpressionChangedAfterItHasBeenCheckedError</code>).</li>
            <li>Payload tax: ~100KB added to the initial bundle.</li>
          </ul>
        </div>
        <div class="card attribute">
          <h3>Modern: Zoneless (Experimental/Stable)</h3>
          <p>The "Explicit" Approach.</p>
          <ul>
            <li>Opt-in via <code>provideExperimentalZonelessChangeDetection()</code>.</li>
            <li>Framework only updates the DOM when a <strong>Signal</strong> notifies it.</li>
            <li>Lightning-fast, highly optimized localized updates.</li>
            <li>Removes the Zone.js payload, improving Core Web Vitals.</li>
          </ul>
        </div>
      </div>

      <div class="demo-section">
        <h3>Live Demo: Running Outside Angular</h3>
        <div class="demo-box">
          <div class="demo-header">
            <span class="demo-label">NgZone</span>
          </div>
          
          <div class="zone-demo">
            <div class="demo-col">
              <h4>Standard Zone Execution</h4>
              <p>Triggers change detection fully.</p>
              <div class="counter-display">Count: {{ countInZone }}</div>
              <button class="btn primary" (click)="startZoneInterval()">Mock Heavy Async Work</button>
            </div>

            <div class="demo-col">
              <h4>runOutsideAngular</h4>
              <p>Updates without triggering Angular checks.</p>
              <div class="counter-display">Hidden Count: {{ countOutsideZone }}</div>
              <button class="btn warning" (click)="startOutsideInterval()">Mock Background Work</button>
              <button class="btn success" style="margin-top: 10px; width: 100%;" (click)="forceCheck()">Force UI Sync</button>
            </div>
          </div>
        </div>
      </div>

      <div class="interview-tips">
        <h4>Pro-Tips:</h4>
        <pre><code>// How to enable Zoneless in your app config:
export const appConfig: ApplicationConfig = {{ '{' }}
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes)
  ]
{{ '}' }};</code></pre>
        <ul>
          <li><strong>NgZone.runOutsideAngular():</strong> Even if you use Zone.js, wrap high-frequency events (like <code>scroll</code>, <code>mousemove</code>, or <code>requestAnimationFrame</code>) inside <code>runOutsideAngular</code> to prevent Angular from crashing the framerate!</li>
          <li><strong>Zoneless Dependency:</strong> Going fully zoneless forces your team to adopt Angular Signals as the sole source of reactivity!</li>
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
    .card ul { padding-left: 20px; font-size: 0.95rem; line-height: 1.6; }
    .card li { margin-bottom: 8px; }

    .demo-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .demo-header { margin-bottom: 15px; }
    .demo-label { background: #1a73e8; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    
    .zone-demo { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; }
    .demo-col { display: flex; flex-direction: column; background: #f1f3f4; padding: 15px; border-radius: 8px; }
    .demo-col p { font-size: 0.85rem; color: #555; }
    
    .counter-display { font-size: 1.5rem; font-family: monospace; font-weight: bold; background: white; padding: 10px; text-align: center; border-radius: 6px; margin: 15px 0; border: 2px solid #ccc; }
    
    .btn { padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.2s ease; }
    .btn:hover { transform: translateY(-1px); }
    .btn:active { transform: translateY(1px); }
    .primary { background: #1a73e8; color: white; }
    .warning { background: #f59e0b; color: white; }
    .success { background: #10b981; color: white; }
    
    pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; line-height: 1.5; margin-bottom: 15px; font-weight: 600; }
    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 30px; }
  `]
})
export class ZoneJsComponent {
  private ngZone = inject(NgZone);

  countInZone = 0;
  countOutsideZone = 0;

  startZoneInterval() {
    this.countInZone = 0;
    const interval = setInterval(() => {
      this.countInZone++;
      if (this.countInZone >= 10) clearInterval(interval);
    }, 100);
  }

  startOutsideInterval() {
    this.countOutsideZone = 0;
    this.ngZone.runOutsideAngular(() => {
      const interval = setInterval(() => {
        // This updates the property but heavily skips change detection!
        this.countOutsideZone++;
        if (this.countOutsideZone >= 10) clearInterval(interval);
      }, 100);
    });
  }

  forceCheck() {
    // A dummy function to trigger Angular's native UI synced events
  }
}
