import { Component, OnInit } from "@angular/core";
import { Trading212Service } from "src/app/api/trading212.service";
import { AppStorageService } from "../app-storage.service";
import { Chart } from "chart.js";

import { trading212_response_all_open_positions } from "../../app/model/trading_212_response";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  tradingInfo: trading212_response_all_open_positions[] = [];
  totalValue = 0;
  overallHolding = 0;
  warningMessage: string = "";

  constructor(
    private tradingService: Trading212Service,
    private appStorageService: AppStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    const apiKey = await this.tradingService.getApiKey();
    if (!apiKey) {
      this.warningMessage =
        "API key is not set. Please go to Tab 3 to set your API key.";
      return;
    }

    (await this.tradingService.getTradingInfo()).subscribe((data) => {
      console.log("Trading Info:", data);
      this.tradingInfo = Array.isArray(data) ? data : [];
      this.appStorageService.set("tradingInfo", data);
      this.calculateTotalValue();
      this.calculateOverallHolding();
    });
  }

  calculateTotalValue(): void {
    if (Array.isArray(this.tradingInfo)) {
      console.log("Stocks:", this.tradingInfo);
      this.totalValue = this.tradingInfo.reduce(
        (acc: number, stock: trading212_response_all_open_positions) => {
          const stockValue = stock.quantity * stock.currentPrice;
          console.log(
            `Stock: ${stock.ticker}, Quantity: ${stock.quantity}, Current Price: ${stock.currentPrice}, Stock Value: ${stockValue}`
          );
          return acc + stockValue;
        },
        0
      );
      console.log("Total Value:", this.totalValue);
    } else {
      console.error("Invalid tradingInfo structure:", this.tradingInfo);
    }
  }

  calculateOverallHolding(): void {
    if (Array.isArray(this.tradingInfo)) {
      console.log("Stocks:", this.tradingInfo);
      this.overallHolding = this.tradingInfo.reduce(
        (acc: number, stock: trading212_response_all_open_positions) => {
          const holdingValue = stock.quantity * stock.averagePrice;
          console.log(
            `Stock: ${stock.ticker}, Quantity: ${stock.quantity}, Average Price: ${stock.averagePrice}, Holding Value: ${holdingValue}`
          );
          return acc + holdingValue;
        },
        0
      );
      console.log("Overall Holding:", this.overallHolding);
    } else {
      console.error("Invalid tradingInfo structure:", this.tradingInfo);
    }
  }

  enderChart(): void {
    const ctx = document.getElementById("doughnutChart") as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: this.tradingInfo.map((stock) => stock.ticker),
          datasets: [
            {
              label: "Stock Distribution",
              data: this.tradingInfo.map(
                (stock) => stock.quantity * stock.currentPrice
              ),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }
}
