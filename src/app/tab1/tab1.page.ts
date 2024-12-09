import { Component, OnInit } from "@angular/core";
import { Trading212Service } from "src/app/api/trading212.service";
import { AppStorageService } from "../app-storage.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  tradingInfo: any;

  constructor(
    private tradingService: Trading212Service,
    private appStorageService: AppStorageService
  ) {}

  ngOnInit(): void {
    this.tradingService.getTradingInfo().subscribe((data) => {
      console.log(data);
      this.tradingInfo = data;
      this.appStorageService.set("tradingInfo", data);
    });
  }
}
