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
    this.xtb_credentials.xtb_password = (await this.appStorageService.getXtbPassword()) || "";


    const prefersDark = window.matchMedia("(prefers-color-scheme: light)");
    
    this.initializeDarkPalette(prefersDark.matches);

    prefersDark.addEventListener("change", (mediaQuery) =>
      this.initializeDarkPalette(mediaQuery.matches)
    );
  }
  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }
  toggleChange(ev: any) {
    this.toggleDarkPalette(ev.detail.checked);
  }
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
    // console.log("Credentials saved: ", this.xtb_credentials);
  }
}
