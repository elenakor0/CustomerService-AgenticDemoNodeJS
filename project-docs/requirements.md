#Project Requirements

## Project summary
In this folder create a project in typescript using NodeJS that would take the user input from the console, pass it on to openai api. 
OpenAI api would process the user input and either return the tool that needs to be used (the tool is a typescript function in this project) or an indication that it
can't handle the request if no tool is matching. 
This is a sample "customer service app" designed to be an example that shows the flow but no real life implementation (this won't be deployed or used anywhere), 
just a flow I can run on my local computer for demonstration purposes.
The purpose of this demo app is to show how you can implement "agentic" workflows in typescript from scratch without using any AI packages by passing tools (that are 
my own custom typescript implementations) to client.chat.completions.create( ... ) and let the app use the right tool if the AI API call returns any tools in 
choice.message.tool_calls.  
Do not let AI use any external information to answer the user question if no tool is matching! 

## Project Requirements
This project would be a basic example of a customer service app, where the user can:
-- ask for a refund on their recent order
-- ask for product information (like, "what are dimensions of product XYZ?")
-- ask general questions (like, "what is your returns policy?")
-- chat history should be stored (you can write it to a local file or whatever is the easiest solution)

Create a json file in the /data/ folder that stores sample customer data for 2 customers with the following fields: name, pin (4 digits), and array of orders.
each order object has a date, order number, product name, product quantity. Keep it very simple. 

Create 3 javascript files with functions for handling the 3 scenarios above:
-- for refund requests - the user needs to be authenticated. Make sure the user provides their name and pin. Check that a customer with that name and pin exists
in the customer data file in the /data/ folder. The user needs to provide the order number. Check that the order with that number exists for that customer. If the 
order date is 30 days or less before today, tell the user that the refund has been approved. Otherwise, tell the user they are not eligible for the refund. 
Today is September 25, 2025. Ask all questions via the terminal window.

-- for product information - create a dummy function that calls a fake API (like an internal company API) to get the product information. 
Before then try to understand if the user is asking about product price or dimentions and if they are asking about a product at all. Pass the price, dimensions or general question to the API. (The API endpoint would then query the product by the product name, and either return the price or dimentions for that product, or 
query the embedded description column for general stuff). Don't implement the endpoint, I just want to show how AI can sort out if the user is asking about a specific 
product price or dimentions or general information.

-- for general questions - create a dummy function that calls a fake API endpoint (that would query the company RAG store - don't implement this).

-- keep everything very simple - minimum comments, simple code.. This is just for demo purposes!

-- use OpenAI API for all LLM requests
-- Put sensitive info (like openai api key) into the .env file.
-- Don't add any databases or anything like that. Write any needed info into temporary files in /data/folder. 
-- some of the code examples - below

const availableTools = [
    {
        type: "function",
        function: {
            name: "getProductInformation",
            description: "Gets the information about a product.....",
            parameters: {
               // include the right parameters here
            }
        }
    },


     const response =  client.chat.completions.create({
                model: model || this.defaultModel,
                messages: messages,
                tools: tools,
                tool_choice: toolChoice || 'auto',
                temperature: temperature || 0.7,
                max_tokens: maxTokens,
                top_p: topP,
                frequency_penalty: frequencyPenalty,
                presence_penalty: presencePenalty,
                ...restOptions
            });


             if (choice.message.tool_calls) {
                standardResponse.toolCalls = choice.message.tool_calls.map(toolCall => ({
                    id: toolCall.id,
                    type: toolCall.type,
                    function: {
                        name: toolCall.function.name,
                        arguments: toolCall.function.arguments
                    }
                }));
            }


