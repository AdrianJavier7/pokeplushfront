import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'flowbite';
import {provideHttpClient} from '@angular/common/http';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {routes} from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
}).catch(err => console.error(err));
