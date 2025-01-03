import { Injectable } from '@angular/core';
import { AppStorageService } from '../app-storage.service';
import { xtb_response_all_open_positions } from '../model/xtb_response';

@Injectable({
  providedIn: 'root',
})
export class XtbService {
  private webSocket: WebSocket | null = null;
  private readonly demoWebSocketUrl = 'wss://ws.xtb.com/demo';
  private readonly realWebSocketUrl = 'wss://ws.xtb.com/real';
  private webSocketUrl: string = this.demoWebSocketUrl;
  userId: string = '';
  password: string = '';
  private isConnected: boolean = false;
  private pendingMessages: any[] = [];

  constructor(private appStorageService: AppStorageService) {
    this.init();
  }

  async init() {
    this.userId = await this.getUserId();
    this.password = await this.getPassword();
  }

  async saveCredentials(userId: string, password: string) {
    this.userId = userId;
    this.password = password;
    await this.appStorageService.setXtbCredentials(this.userId, this.password);
  }

  async getUserId(): Promise<string> {
    this.userId = (await this.appStorageService.getXtbUserId()) || '';
    return this.userId;
  }

  async getPassword(): Promise<string> {
    this.password = (await this.appStorageService.getXtbPassword()) || '';
    return this.password;
  }

  setDemoMode() {
    this.webSocketUrl = this.demoWebSocketUrl;
  }

  setRealMode() {
    this.webSocketUrl = this.realWebSocketUrl;
  }

  async connectWebSocket(
    onMessage: (data: any) => void,
    onError: (error: any) => void
  ): Promise<void> {
    this.userId = await this.getUserId();
    this.password = await this.getPassword();

    this.webSocket = new WebSocket(this.webSocketUrl);

    this.webSocket.onopen = () => {
      this.isConnected = true;
      this.webSocket?.send(
        JSON.stringify({
          command: 'login',
          arguments: {
            userId: this.userId,
            password: this.password,
          },
        })
      );

      // Send any pending messages
      this.pendingMessages.forEach((message) => {
        this.webSocket?.send(message);
      });
      this.pendingMessages = [];
    };

    this.webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status && data.returnData) {
        this.saveOpenPositions(data.returnData);
      }
      onMessage(data);
    };

    this.webSocket.onerror = (event) => {
      onError(event);
    };

    this.webSocket.onclose = () => {
      this.isConnected = false;
    };
  }

  disconnectWebSocket(): void {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
      this.isConnected = false;
    }
  }

  getOpenPositions(): void {
    const message = JSON.stringify({
      command: 'getTrades',
      arguments: {
        openedOnly: true,
      },
    });

    if (this.isConnected && this.webSocket) {
      this.webSocket.send(message);
    } else {
      this.pendingMessages.push(message);
    }
  }

  private async saveOpenPositions(positions: xtb_response_all_open_positions[]) {
    await this.appStorageService.set('xtbOpenPositions', positions);
  }

  async getSavedOpenPositions(): Promise<xtb_response_all_open_positions[]> {
    const positions = await this.appStorageService.get('xtbOpenPositions');
    return positions || [];
  }
}