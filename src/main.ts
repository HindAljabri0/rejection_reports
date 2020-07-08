import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LOCALE_ID } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LocaleId } from './app/models/LocaleId';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [{provide: LOCALE_ID, useValue: LocaleId.getCurrentLocale}]})
  .catch(err => console.error(err));
