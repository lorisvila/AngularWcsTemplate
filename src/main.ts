import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from 'wcs-core/loader';
import { AppModule } from './app/app.module';
import * as neutralino from '@neutralinojs/lib';

defineCustomElements();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

async function initNeutralino() {
  if (typeof neutralino !== 'undefined' && neutralino !== null) {
    return new Promise<void>(async resolve => {
      console.log('Initializing NeutralinoJS');
      await neutralino.events.on('ready', () => {
        console.log('NeutralinoJS is ready to go!');
        resolve();
      });

      try {
        neutralino.init();
      } catch (e) {

      }
    });
  } else {
    return Promise.resolve();
  }
}

if (document.readyState === 'complete') {
  // HMR update: only initialize angular
  platformBrowserDynamic().bootstrapModule(AppModule).then();
} else {
  document.addEventListener('DOMContentLoaded', async () => {
    // Initialize neutralino before initializing angular
    await initNeutralino();
  });
}
