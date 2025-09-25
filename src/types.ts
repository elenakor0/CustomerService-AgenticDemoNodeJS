export interface Customer {
  name: string;
  pin: string;
  orders: Order[];
}

export interface Order {
  date: string;
  orderNumber: string;
  productName: string;
  productQuantity: number;
}

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface RefundParams {
  customerName: string;
  pin: string;
  orderNumber: string;
}

export interface ProductInfoParams {
  productName: string;
  queryType: 'price' | 'dimensions' | 'general';
  question?: string;
}

export interface GeneralQuestionParams {
  question: string;
}
