# Customer Service Assistant

A demo TypeScript Node.js application that demonstrates agentic workflows using OpenAI's tool calling functionality. This customer service app can handle order operations, product inquiries, and general questions without using any external AI packages.

## Features

- **Order Operations**: Cancel orders, process returns, and check shipment status with customer authentication
- **Product Information**: Get price, dimensions, or general information about products
- **General Questions**: Answer questions about company policies and procedures
- **Session Management**: Maintain customer authentication across interactions
- **Console Interface**: Interactive command-line interface

## Prerequisites

- Node.js (v16 or higher)
- OpenAI API key

## Setup

1. **Clone/Download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   MODEL=gpt-4o-mini
   ```

## Usage

### Running the Application

```bash
# Build and run
npm start

# Or run in development mode with auto-reload
npm run dev
```

### Sample Interactions

**Order Cancellation:**
```
You: I want to cancel my order
Assistant: Please provide the order number you would like to cancel.

You: ORD001
Assistant: Please provide your full name and 4-digit PIN.

You: John Doe 1234
Assistant: Just confirming that we need to cancel order ORD001 (Wireless Headphones). Please respond with yes/no.

You: yes
Assistant: Order ORD001 has been successfully cancelled.
```

**Order Return:**
```
You: I need to return an order
Assistant: Please provide the order number for the order you would like to return.

You: ORD002
Assistant: Just confirming that we need to process a return for order ORD002 (Bluetooth Speaker). Please respond with yes/no.

You: yes
Assistant: Return initiated for order ORD002. Please download your return label at: https://returns.example.com/label/ORD002
```

**Shipment Status:**
```
You: When will my order arrive?
Assistant: Please provide the order number you would like to check the status for.

You: ORD005
Assistant: Order ORD005 is in_transit. Estimated delivery: 2025-09-27. Shipped on: 2025-09-20.
```

**Product Information:**
```
You: What are the dimensions of the wireless headphones?
Assistant: The Wireless Headphones dimensions are 7.5 x 6.8 x 1.8 inches.
```

**General Questions:**
```
You: What's your returns policy?
Assistant: Our returns policy allows you to return items within 30 days of purchase for a full refund. Items must be in original condition with all packaging and accessories.
```

### Commands

- `quit` or `exit` - Exit the application

## Sample Customer Data

The application includes sample customer data in `data/customers.json`:

- **John Doe** (PIN: 1234)
  - ORD001: Wireless Headphones (2025-09-20, processing) - cancellable
  - ORD002: Bluetooth Speaker (2025-08-15, delivered) - returnable
  - ORD005: USB Cable (2025-09-15, in_transit)
  - ORD006: Phone Case (2025-09-22, processing) - cancellable

- **Jane Smith** (PIN: 5678)
  - ORD003: Smart Watch (2025-09-10, in_transit)
  - ORD004: Laptop Stand (2025-07-01, delivered) - returnable
  - ORD007: Wireless Mouse (2025-09-18, processing) - cancellable
  - ORD008: Keyboard (2025-08-25, delivered) - returnable

**Order Statuses:**
- `processing`: Orders that can be cancelled
- `in_transit`: Orders that have been shipped but not delivered
- `delivered`: Orders that can be returned

## Architecture

- **Tools**: Custom TypeScript functions that handle business logic and call API endpoints
- **APIs**: Fake API layer simulating external service calls for orders, products, and general questions
- **OpenAI Integration**: Uses tool calling to determine which function to execute
- **Session Management**: Maintains customer authentication state across interactions
- **Console Interface**: Handles user input/output and chat history
- **Data Storage**: JSON files for customer data, chat history, and session information

## Project Structure

```
src/
├── index.ts                     # Main application entry point
├── types.ts                     # TypeScript interfaces and types
├── services/
│   └── openaiService.ts         # OpenAI API integration
├── tools/
│   ├── index.ts                 # Tool definitions and registry
│   ├── orderOperations.ts       # Order cancellation, returns, and status logic
│   ├── productInfo.ts           # Product information logic
│   └── generalQuestions.ts      # General questions logic
├── APIs/
│   ├── fake-orders-api.ts       # Fake API for order operations
│   ├── fake-product-api.ts      # Fake API for product information
│   └── fake-general-api.ts      # Fake API for general questions
└── utils/
    ├── consoleInterface.ts      # Console input/output handling
    └── sessionManager.ts        # Customer session management

data/
├── customers.json               # Sample customer data
├── chat_history.json            # Chat history storage
└── customer_session.json        # Customer authentication session (created at runtime)
```

## Key Technologies

- **TypeScript**: Type-safe development
- **OpenAI API**: GPT models with tool calling
- **Node.js**: Runtime environment
- **Readline**: Console interface handling

## Notes

- This is a demo application for educational purposes
- Customer data is stored locally in JSON format with order statuses and shipping information
- Session management maintains authentication state during application runtime
- Chat history persists between sessions
- All "API calls" are simulated for demonstration
- Order operations require customer authentication and confirmation steps
