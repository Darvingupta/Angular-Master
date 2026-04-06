import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AiAgentComponent } from './features/ai-agent/ai-agent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AiAgentComponent],
  template: `
    <div class="dashboard-layout">
      <!-- Premium Glassmorphic Sidebar -->
      <aside class="sidebar">
        <div class="brand">
          <div class="logo-wrapper">
            <span class="logo-icon">✨</span>
          </div>
          <div class="brand-text">
            <h1>Angular</h1>
            <span>Master Class</span>
          </div>
        </div>

        <div class="menu-scroll">
          <nav class="nav-section">
            <h3 class="section-title">Core Reactivity</h3>
            <a routerLink="/signals-core" routerLinkActive="active" class="nav-item">
              <span class="icon">⚡</span>
              <span class="label">1. Core Signals</span>
            </a>
            <a routerLink="/signals-advanced" routerLinkActive="active" class="nav-item">
              <span class="icon">🚀</span>
              <span class="label">2. Advanced</span>
            </a>
            <a routerLink="/signals-api" routerLinkActive="active" class="nav-item">
              <span class="icon">📦</span>
              <span class="label">3. Component API</span>
            </a>
            <a routerLink="/signals-async" routerLinkActive="active" class="nav-item">
              <span class="icon">⏳</span>
              <span class="label">4. Async & Forms</span>
            </a>
            <a routerLink="/signals-rxjs" routerLinkActive="active" class="nav-item">
              <span class="icon">🔄</span>
              <span class="label">5. Signals & RxJS</span>
            </a>
          </nav>

          <nav class="nav-section">
            <h3 class="section-title">Modern Framework</h3>
            <a routerLink="/control-flow" routerLinkActive="active" class="nav-item">
              <span class="icon">🚦</span>
              <span class="label">Control Flow</span>
            </a>
            <a routerLink="/defer" routerLinkActive="active" class="nav-item">
              <span class="icon">💤</span>
              <span class="label">Defer Blocks</span>
            </a>
            <a routerLink="/standalone" routerLinkActive="active" class="nav-item">
              <span class="icon">🧱</span>
              <span class="label">Standalone Apps</span>
            </a>
            <a routerLink="/auth" routerLinkActive="active" class="nav-item">
              <span class="icon">🔒</span>
              <span class="label">Auth Guards</span>
            </a>
            <a routerLink="/lifecycle" routerLinkActive="active" class="nav-item">
              <span class="icon">🌱</span>
              <span class="label">Lifecycle & Effect</span>
            </a>
            <a routerLink="/lazy-loading" routerLinkActive="active" class="nav-item">
              <span class="icon">🚀</span>
              <span class="label">Lazy Loading</span>
            </a>
            <a routerLink="/error-log" routerLinkActive="active" class="nav-item error-link">
              <span class="icon">🐛</span>
              <span class="label">Error Log</span>
            </a>
          </nav>

          <nav class="nav-section">
            <h3 class="section-title">Micro Frontends</h3>
            <a routerLink="/mfe-overview" routerLinkActive="active" class="nav-item mfe-link">
              <span class="icon">🗺️</span>
              <span class="label">Overview</span>
            </a>
            <a routerLink="/mfe-module-federation" routerLinkActive="active" class="nav-item mfe-link">
              <span class="icon">🔌</span>
              <span class="label">Module Federation</span>
            </a>
            <a routerLink="/mfe-native-federation" routerLinkActive="active" class="nav-item mfe-link">
              <span class="icon">🌐</span>
              <span class="label">Native Federation</span>
            </a>
            <a routerLink="/mfe-web-components" routerLinkActive="active" class="nav-item mfe-link">
              <span class="icon">🧩</span>
              <span class="label">Web Components</span>
            </a>
            <a routerLink="/mfe-communication" routerLinkActive="active" class="nav-item mfe-link">
              <span class="icon">📡</span>
              <span class="label">Communication</span>
            </a>
          </nav>
        </div>
        
        <div class="sidebar-footer">
          <p>Angular v19.2.20</p>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <header class="top-header">
          <div class="header-content">
            <h2>Welcome to the Master Class</h2>
            <p>Elevate your Angular skills with modern reactivity and architecture patterns.</p>
          </div>
          <div class="header-actions">
            <div class="user-avatar">AD</div>
          </div>
        </header>

        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Floating UI/UX Agent Component -->
      <app-ai-agent />
    </div>
  `,
  styles: [`
    :host {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --secondary: #ec4899;
      --bg-dark: #0f172a;
      --bg-panel: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent-green: #10b981;
      --accent-red: #ef4444;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      display: block;
      height: 100vh;
      overflow: hidden;
      background: linear-gradient(135deg, #fcedf4 0%, #e0e7ff 100%);
      color: #334155;
    }

    * { box-sizing: border-box; }

    .dashboard-layout {
      display: flex;
      height: 100vh;
      width: 100vw;
    }

    /* --- SIDEBAR --- */
    .sidebar {
      width: 280px;
      min-width: 280px;
      height: 100%;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      color: var(--text-main);
      z-index: 100;
      box-shadow: 4px 0 24px rgba(0,0,0,0.1);
    }

    .brand {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .logo-wrapper {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #ec4899, #4f46e5);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-text h1 { margin: 0; font-size: 1.2rem; font-weight: 800; letter-spacing: -0.5px; }
    .brand-text span { font-size: 0.8rem; color: var(--secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

    .menu-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .menu-scroll::-webkit-scrollbar { width: 4px; }
    .menu-scroll::-webkit-scrollbar-track { background: transparent; }
    .menu-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      margin: 0 0 12px 12px;
      font-weight: 700;
    }

    .nav-section { display: flex; flex-direction: column; gap: 4px; }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 10px;
      text-decoration: none;
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      background: transparent;
    }

    .nav-item .icon { font-size: 1.1em; transition: transform 0.2s ease; }
    
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
    
    .nav-item:hover .icon { transform: scale(1.2); }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(79, 70, 229, 0.2), transparent);
      color: white;
      border-left: 3px solid var(--primary);
      font-weight: 600;
    }

    .nav-item.active .icon { color: #818cf8; }

    .mfe-link.active {
      background: linear-gradient(90deg, rgba(16, 185, 129, 0.15), transparent);
      border-left-color: var(--accent-green);
    }
    
    .error-link.active {
      background: linear-gradient(90deg, rgba(239, 68, 68, 0.15), transparent);
      border-left-color: var(--accent-red);
    }

    .sidebar-footer {
      padding: 16px;
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* --- MAIN CONTENT --- */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .top-header {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 24px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.8);
      z-index: 10;
    }

    .header-content h2 { margin: 0; font-size: 1.5rem; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
    .header-content p { margin: 4px 0 0; color: #64748b; font-size: 0.95rem; }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .user-avatar:hover { transform: scale(1.05); }

    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 30px 40px;
      scroll-behavior: smooth;
    }
    
    .content-wrapper::-webkit-scrollbar { width: 8px; }
    .content-wrapper::-webkit-scrollbar-track { background: transparent; }
    .content-wrapper::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .content-wrapper::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* Responsive */
    @media (max-width: 900px) {
      .dashboard-layout { flex-direction: column; }
      .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .menu-scroll { flex-direction: row; overflow-x: auto; padding: 12px; gap: 12px; }
      .nav-section { flex-direction: row; flex-shrink: 0; align-items: center; }
      .section-title { display: none; }
      .nav-item { padding: 8px 12px; }
      .top-header { padding: 16px 20px; }
      .content-wrapper { padding: 20px; }
    }
  `]
})
export class AppComponent {}
