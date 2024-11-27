import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { trading212_response_all_open_positions } from "../model/trading_212_response";

@Injectable({
  providedIn: "root",
})
export class Trading212Service {
  private apiUrl = environment.trading_api_url;

  constructor(private http: HttpClient) {}
  getTradingInfo(): Observable<trading212_response_all_open_positions> {
    const url = `${this.apiUrl}`;
    console.log(url);
    const header = new HttpHeaders({
      Authorization: `${environment.trading_api_key}`,
    });
    console.log(header);
    return this.http.get<trading212_response_all_open_positions>(url, {
      headers: header,
    });
  }
}
