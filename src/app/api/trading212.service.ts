import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AppStorageService } from "../app-storage.service";
import { trading212_response_all_open_positions } from "../model/trading_212_response";

@Injectable({
  providedIn: "root",
})
export class Trading212Service {
  private apiUrl = environment.trading_api_url;
  apiKey: string = "";

  constructor(
    private http: HttpClient,
    private appStorageService: AppStorageService
  ) {
    this.init();
  }

  async init() {
    this.apiKey = await this.getApiKey();
  }

  async saveApiKey(apiKey: string) {
    this.apiKey = apiKey;
    await this.appStorageService.setApiKey(this.apiKey);
    console.log("API Key saved:", this.apiKey);
  }

  async getApiKey(): Promise<string> {
    this.apiKey = (await this.appStorageService.getApiKey()) || "";
    console.log("API Key retrieved:", this.apiKey);
    return this.apiKey;
  }

  async getTradingInfo(): Promise<
    Observable<trading212_response_all_open_positions[]>
  > {
    if (!this.apiKey) {
      this.apiKey = await this.getApiKey();
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
    });
    return this.http.get<trading212_response_all_open_positions[]>(
      this.apiUrl,
      { headers }
    );
  }
}
