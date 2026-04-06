import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cli-commands',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <h2>Angular CLI Cheat Sheet</h2>
      <p class="subtitle">The definitive guide to generating and serving Angular 16+ apps.</p>

      <div class="explanation">
        <p>The <code>&#64;angular/cli</code> is the fastest way to build Angular applications. It automatically configures Webpack/ESBuild, generates components with optimal boilerplate, and wires up testing environments out-of-the-box.</p>
      </div>

      <div class="filter-controls">
        <button [class.active]="activeCategory() === 'all'" (click)="activeCategory.set('all')">All</button>
        <button [class.active]="activeCategory() === 'setup'" (click)="activeCategory.set('setup')">Project Setup</button>
        <button [class.active]="activeCategory() === 'generate'" (click)="activeCategory.set('generate')">Generate</button>
        <button [class.active]="activeCategory() === 'run'" (click)="activeCategory.set('run')">Run & Build</button>
      </div>

      <div class="command-grid">
        <!-- PROJECT SETUP -->
        @if (activeCategory() === 'all' || activeCategory() === 'setup') {
          <div class="cmd-card">
            <div class="cmd-header setup">🚀 Project Setup</div>
            <div class="cmd-body">
              <div class="cmd-row">
                <code>ng new my-app</code>
                <p>Creates a brand new workspace and starter app.</p>
              </div>
              <div class="cmd-row">
                <code>ng update</code>
                <p>Updates your application to the latest Angular version.</p>
              </div>
              <div class="cmd-row">
                <code>ng add &#64;angular/material</code>
                <p>Installs and automatically configures a library.</p>
              </div>
            </div>
          </div>
        }

        <!-- GENERATION (SCAFFOLDING) -->
        @if (activeCategory() === 'all' || activeCategory() === 'generate') {
          <div class="cmd-card">
            <div class="cmd-header generate">🏗️ Generate (Scaffold)</div>
            <div class="cmd-body">
              <div class="cmd-row">
                <code>ng generate component Name</code>
                <p>Creates a new <strong>Component</strong>. (Alias: <code>ng g c Name</code>)</p>
              </div>
              <div class="cmd-row">
                <code>ng generate directive Name</code>
                <p>Creates a new <strong>Directive</strong>. (Alias: <code>ng g d Name</code>)</p>
              </div>
              <div class="cmd-row">
                <code>ng generate pipe Name</code>
                <p>Creates a new <strong>Pipe</strong>. (Alias: <code>ng g p Name</code>)</p>
              </div>
              <div class="cmd-row">
                <code>ng generate service Name</code>
                <p>Creates a new <strong>Singleton Service</strong>. (Alias: <code>ng g s Name</code>)</p>
              </div>
              <div class="cmd-row">
                <code>ng generate module Name</code>
                <p>Creates a new <strong>NgModule</strong>. (Alias: <code>ng g m Name</code>)</p>
              </div>
              <div class="cmd-row">
                <code>ng generate guard Name</code>
                <p>Creates a functional <strong>Route Guard</strong>. (Alias: <code>ng g g Name</code>)</p>
              </div>
            </div>
          </div>
        }

        <!-- RUNNING & BUILDING -->
        @if (activeCategory() === 'all' || activeCategory() === 'run') {
          <div class="cmd-card">
            <div class="cmd-header run">⚙️ Run & Build</div>
            <div class="cmd-body">
              <div class="cmd-row">
                <code>ng serve</code>
                <p>Starts the development server with HMR. (Port 4200)</p>
              </div>
              <div class="cmd-row">
                <code>ng build</code>
                <p>Compiles the app into an output directory for production.</p>
              </div>
              <div class="cmd-row">
                <code>ng test</code>
                <p>Runs unit tests using Karma/Jasmine.</p>
              </div>
              <div class="cmd-row">
                <code>ng e2e</code>
                <p>Runs end-to-end tests for the application.</p>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="interview-tips">
        <h4>Pro-Tips:</h4>
        <ul>
          <li><strong>Dry Run:</strong> Add <code>--dry-run</code> (or <code>-d</code>) to any generate command to see what files WOULD be created without actually making them! Extremely useful for exploring structures.</li>
          <li><strong>Standalone:</strong> In Angular 15+, generating components is <code>standalone: true</code> depending on your root configuration. Force it via <code>--standalone</code>.</li>
          <li><strong>Skip Tests:</strong> Don't need tests for a quick component? Append <code>--skip-tests</code>!</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .feature-page { padding: 20px; }
    .subtitle { color: #5f6368; font-style: italic; margin-top: -5px; margin-bottom: 20px; }
    .explanation { background: linear-gradient(135deg, #e3f2fd, #e8eaf6); padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1a73e8; }
    
    .filter-controls { display: flex; gap: 10px; margin-bottom: 20px; }
    .filter-controls button { padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 20px; cursor: pointer; transition: all 0.2s; font-weight: 600; color: #555; }
    .filter-controls button:hover { background: #f0f0f0; }
    .filter-controls button.active { background: #1a73e8; color: white; border-color: #1a73e8; }
    
    .command-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 30px; }
    
    .cmd-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #eaeaea; }
    .cmd-header { padding: 15px; font-weight: bold; color: white; display: flex; align-items: center; font-size: 1.1rem; }
    .cmd-header.setup { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .cmd-header.generate { background: linear-gradient(135deg, #10b981, #059669); }
    .cmd-header.run { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    
    .cmd-body { padding: 0 15px; }
    .cmd-row { padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
    .cmd-row:last-child { border-bottom: none; }
    .cmd-row code { display: inline-block; background: #1e1e2e; color: #a6e3a1; padding: 6px 10px; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600; }
    .cmd-row p { margin: 0; font-size: 0.9rem; color: #555; }

    .interview-tips { background: #e8f0fe; padding: 20px; border-radius: 8px; margin-top: 20px; }
  `]
})
export class CliCommandsComponent {
  activeCategory = signal<'all' | 'setup' | 'generate' | 'run'>('all');
}
