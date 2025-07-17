import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Force English locale for date inputs
if (typeof window !== 'undefined') {
  // Set document language
  document.documentElement.lang = 'en-US';
  
  // Force browser to use English locale
  Object.defineProperty(navigator, 'language', {
    value: 'en-US',
    writable: false
  });
  
  Object.defineProperty(navigator, 'languages', {
    value: ['en-US', 'en'],
    writable: false
  });
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
