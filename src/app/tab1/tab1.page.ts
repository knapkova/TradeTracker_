import { Component, OnInit, OnDestroy } from "@angular/core";
import { Trading212Service } from "src/app/api/trading212.service";
import { XtbService } from "src/app/api/xtb.service";
import { AppStorageService } from "../app-storage.service";
import { trading212_response_all_open_positions } from "../../app/model/trading_212_response";
import { xtb_response_all_open_positions } from "../../app/model/xtb_response";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit, OnDestroy {
  tradingInfo: trading212_response_all_open_positions[] = [];
  xtbInfo: xtb_response_all_open_positions[] = [];
  trading_total_value = 0;
  xtb_total_value = 0;
  overallHolding = 0;
  warningMessage: string = "";

  constructor(
    private tradingService: Trading212Service,
    private xtbService: XtbService,
    private appStorageService: AppStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadTradingData();
    await this.loadXtbData();
  }

  async loadTradingData(): Promise<void> {
    const apiKey = await this.tradingService.getApiKey();
    if (!apiKey) {
      this.warningMessage =
        "API key is not set. Please go to Tab 3 to set your API key.";
      return;
    }

    (await this.tradingService.getTradingInfo()).subscribe((data) => {
      //console.log("Trading Info:", data);
      this.tradingInfo = Array.isArray(data) ? data : [];
      this.appStorageService.set("tradingInfo", data);
      this.trading_calculate_total_value();
      this.calculateOverallHolding();
    });
  }

  async loadXtbData(): Promise<void> {
    const userId = await this.xtbService.getUserId();
    const password = await this.xtbService.getPassword();

    if (!userId || !password) {
      this.warningMessage = "XTB credentials are not set. Please go to Tab 3 to set your credentials.";
      return;
    }

    // Load open positions from storage
    const storedPositions = await this.xtbService.getSavedOpenPositions();
    if (storedPositions.length > 0) {
      this.xtbInfo = storedPositions;
    } else {
      // Connect to WebSocket and fetch open positions if not found in storage
      this.xtbService.connectWebSocket(
        (data) => this.handleXtbMessage(data),
        (error) => this.handleXtbError(error)
      );
      this.fetchXtbOpenPositions();
      this.xtb_calculate_total_value();

    }
  }

  handleXtbMessage(data: any) {
    console.log('WebSocket message:', data);

    if (data.command === 'getTrades' && data.returnData) {
      this.xtbInfo = data.returnData;
      this.appStorageService.set('xtbOpenPositions', this.xtbInfo);
    }
  }

  handleXtbError(error: any) {
    this.warningMessage = 'WebSocket connection error';
    console.error('WebSocket error:', error);
  }

  ngOnDestroy() {
    this.xtbService.disconnectWebSocket();
  }

  fetchXtbOpenPositions() {
    this.xtbService.getOpenPositions();
    this.xtb_calculate_total_value();

  }

  doRefresh(event: any) {
    this.loadTradingData().then(() => {
      this.loadXtbData().then(() => {
        this.xtb_calculate_total_value();
        this.calculateOverallHolding();
        event.target.complete();
      });
    });
  }

  trading_calculate_total_value(): void {
    if (Array.isArray(this.tradingInfo)) {
      //console.log("Stocks:", this.tradingInfo);
      this.trading_total_value = this.tradingInfo.reduce(
        (acc: number, stock: trading212_response_all_open_positions) => {
          const stockValue = stock.quantity * stock.currentPrice;
          
          return acc + stockValue;
        },
        0
      );
      //console.log("Total Value:", this.trading_total_value);
    } else {
      console.error("Invalid tradingInfo structure:", this.tradingInfo);
    }
  }

  xtb_calculate_total_value(): void {
    if (Array.isArray(this.xtbInfo)) {
      this.xtb_total_value = this.xtbInfo.reduce(
        (acc: number, stock: xtb_response_all_open_positions) => {
          const stockValue = stock.volume * stock.open_price;
          
          return acc + stockValue;
        },
        0
      );
      console.log("Total Value:", this.xtb_total_value);
    } else {
      console.error("Invalid tradingInfo structure:", this.tradingInfo);
    }
  }

  calculateOverallHolding(): void {
    if (Array.isArray(this.tradingInfo)) {
      this.overallHolding = this.tradingInfo.reduce(
        (acc: number, stock: trading212_response_all_open_positions) => {
          const holdingValue = stock.quantity * stock.averagePrice;
          return acc + holdingValue;
        },
        0
      );
      //console.log("Overall Holding:", this.overallHolding);
    } else {
      console.error("Invalid tradingInfo structure:", this.tradingInfo);
    }
  }
}