import { Component, OnInit } from "@angular/core";
import { AppStorageService } from "../app-storage.service";

@Component({
  selector: "app-tab3",
  templateUrl: "./tab3.page.html",
  styleUrls: ["./tab3.page.scss"],
})
export class Tab3Page implements OnInit {
  apiKey: string = "";
  xtb_credentials: { xtb_userId: string; xtb_password: string } = {xtb_userId: "", xtb_password: ""} ;
  paletteToggle = false;


  constructor(private appStorageService: AppStorageService) {}

  async ngOnInit() {
    this.apiKey = (await this.appStorageService.getApiKey()) || "";
    this.xtb_credentials.xtb_userId = (await this.appStorageService.getXtbUserId()) || "";

    const prefersDark = window.matchMedia("(prefers-color-scheme: light)");
    
    this.initializeDarkPalette(prefersDark.matches);

    prefersDark.addEventListener("change", (mediaQuery) =>
      this.initializeDarkPalette(mediaQuery.matches)
    );
  }
  // Check/uncheck the toggle and update the palette based on isDark
  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }
  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(ev: any) {
    this.toggleDarkPalette(ev.detail.checked);
  }
  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
  }

  async saveApiKey() {
    await this.appStorageService.setApiKey(this.apiKey);
    console.log("API Key saved: ", this.apiKey);
  }

  async saveXtbCredentials() {
    await this.appStorageService.setXtbCredentials(
      this.xtb_credentials.xtb_userId,
      this.xtb_credentials.xtb_password
    );
    console.log("Credentials saved: ", this.xtb_credentials);
  }
}
