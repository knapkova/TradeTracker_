export interface trading212_response_all_open_positions {
  ticker: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  ppl: number;
  fxPpl: number;
  initialFillDate: string;
  frontend: string;
  maxBuy: number;
  maxSell: number;
  pieQuantity: number;
}
