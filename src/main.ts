import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { SplashScreen } from "@capacitor/splash-screen";
import { AppModule } from "./app/app.module";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
SplashScreen.hide();
