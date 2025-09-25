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
  status: 'processing' | 'in_transit' | 'delivered';
  estimatedShippingDate: string;
  shippedDate?: string;
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


export interface ProductInfoParams {
  productName: string;
  queryType: 'price' | 'dimensions' | 'general';
  question?: string;
}

export interface GeneralQuestionParams {
  question: string;
}

export interface OrderCancellationParams {
  customerName: string;
  pin: string;
  orderNumber: string;
  confirmation: boolean;
}

export interface OrderReturnParams {
  customerName: string;
  pin: string;
  orderNumber: string;
  confirmation: boolean;
}

export interface ShipmentStatusParams {
  customerName: string;
  pin: string;
  orderNumber: string;
}

export interface CustomerSession {
  customerName: string;
  pin: string;
  authenticatedAt: Date;
}
