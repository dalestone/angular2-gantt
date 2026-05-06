import { platformBrowser } from '@angular/platform-browser';
import { DemoAppModule } from './demo-app.module';

platformBrowser()
    .bootstrapModule(DemoAppModule)
    .catch((err) => console.error(err));
