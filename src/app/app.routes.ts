import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signals-core',
    pathMatch: 'full'
  },
  {
    path: 'signals-core',
    loadComponent: () => import('./features/signals/signals-masterclass.component').then(m => m.SignalsMasterclassComponent)
  },
  {
    path: 'signals-advanced',
    loadComponent: () => import('./features/signals/advanced-reactivity.component').then(m => m.AdvancedReactivityComponent)
  },
  {
    path: 'signals-api',
    loadComponent: () => import('./features/signals/component-api.component').then(m => m.ComponentApiComponent)
  },
  {
    path: 'signals-async',
    loadComponent: () => import('./features/signals/async-forms.component').then(m => m.AsyncFormsComponent)
  },
  {
    path: 'signals-rxjs',
    loadComponent: () => import('./features/signals/rxjs-interop.component').then(m => m.RxjsInteropComponent)
  },
  {
    path: 'control-flow',
    loadComponent: () => import('./features/control-flow/control-flow.component').then(m => m.ControlFlowComponent)
  },
  {
    path: 'defer',
    loadComponent: () => import('./features/defer/defer.component').then(m => m.DeferComponent)
  },
  {
    path: 'standalone',
    loadComponent: () => import('./features/standalone/standalone.component').then(m => m.StandaloneComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'lifecycle',
    loadComponent: () => import('./features/lifecycle/lifecycle.component').then(m => m.LifecycleComponent)
  },
  {
    path: 'lazy-loading',
    loadComponent: () => import('./features/lazy-loading/lazy-loading.component').then(m => m.LazyLoadingComponent)
  },
  {
    path: 'error-log',
    loadComponent: () => import('./features/error-log/error-log.component').then(m => m.ErrorLogComponent)
  },
  // Micro Frontends
  {
    path: 'mfe-overview',
    loadComponent: () => import('./features/micro-frontends/micro-frontends-overview.component').then(m => m.MicroFrontendsOverviewComponent)
  },
  {
    path: 'mfe-module-federation',
    loadComponent: () => import('./features/micro-frontends/module-federation.component').then(m => m.ModuleFederationComponent)
  },
  {
    path: 'mfe-native-federation',
    loadComponent: () => import('./features/micro-frontends/native-federation.component').then(m => m.NativeFederationComponent)
  },
  {
    path: 'mfe-web-components',
    loadComponent: () => import('./features/micro-frontends/web-components-mfe.component').then(m => m.WebComponentsMfeComponent)
  },
  {
    path: 'mfe-communication',
    loadComponent: () => import('./features/micro-frontends/mfe-communication.component').then(m => m.MfeCommunicationComponent)
  }
];
