import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: "root",
})
export class AppStorageService {
  private _storage: Storage | null = null;
  constructor(private storage: Storage) {
    this.init();
  }
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }
  // retrieve data from storage
  async get(key: string) {
    return this._storage?.get(key);
  }
  // store data in storage
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  // Method to store API key
  public async setApiKey(apiKey: string) {
    await this.set("trading_api_key", apiKey);
  }

  // Method to retrieve API key
  public async getApiKey() {
    return await this.get("trading_api_key");
  }
}
