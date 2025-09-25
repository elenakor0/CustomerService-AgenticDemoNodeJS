# Customer Service Assistant

A demo TypeScript Node.js application that demonstrates agentic workflows using OpenAI's tool calling functionality. This customer service app can handle refunds, product inquiries, and general questions without using any external AI packages.

## Features

- **Refund Processing**: Authenticate customers and process refund requests with order validation
- **Product Information**: Get price, dimensions, or general information about products
- **General Questions**: Answer questions about company policies and procedures
- **Chat History**: Persistent chat history stored locally
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

**Refund Request:**
```
You: I want to request a refund for my order
Assistant: I'd be happy to help you with your refund request. To process this, I'll need some information from you. Could you please provide your full name, your 4-digit PIN, and the order number you'd like to refund?

You: John Doe, 1234, ORD001
Assistant: Refund approved for order ORD001. The refund will be processed within 3-5 business days.
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

- `history` - View chat history
- `clear` - Clear chat history
- `quit` or `exit` - Exit the application

## Sample Customer Data

The application includes sample customer data in `data/customers.json`:

- **John Doe** (PIN: 1234)
  - ORD001: Wireless Headphones (2025-09-20)
  - ORD002: Bluetooth Speaker (2025-08-15)

- **Jane Smith** (PIN: 5678)
  - ORD003: Smart Watch (2025-09-10)
  - ORD004: Laptop Stand (2025-07-01)

## Architecture

- **Tools**: Custom TypeScript functions that simulate API calls
- **OpenAI Integration**: Uses tool calling to determine which function to execute
- **Console Interface**: Handles user input/output and chat history
- **Data Storage**: JSON files for customer data and chat history

## Project Structure

```
src/
├── index.ts                 # Main application entry point
├── types.ts                 # TypeScript interfaces and types
├── services/
│   └── openaiService.ts     # OpenAI API integration
├── tools/
│   ├── index.ts            # Tool definitions and registry
│   ├── refund.ts           # Refund processing logic
│   ├── productInfo.ts      # Product information logic
│   └── generalQuestions.ts # General questions logic
└── utils/
    └── consoleInterface.ts  # Console input/output handling

data/
├── customers.json          # Sample customer data
└── chat_history.json       # Chat history storage
```

## Key Technologies

- **TypeScript**: Type-safe development
- **OpenAI API**: GPT models with tool calling
- **Node.js**: Runtime environment
- **Readline**: Console interface handling

## Notes

- This is a demo application for educational purposes
- Customer data is stored locally in JSON format
- Chat history persists between sessions
- All "API calls" are simulated for demonstration
