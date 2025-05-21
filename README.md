Gemini Tool-Aware CLI Chatbot with Model Context Protocol (MCP)
This project is a Node.js-based Command Line Interface (CLI) chatbot that integrates Google’s Gemini AI with tool calling capability via the Model Context Protocol (MCP). It enables AI-assisted function calling, dynamic tool execution, and a conversational interface. This is ideal for developers looking to build AI agents that interact with APIs, tools, or services in real-time.

🧠 Project Overview
This CLI chatbot uses:

Google Gemini (Generative AI) to process and generate conversational responses.

MCP (Model Context Protocol) to register and call external tools.

SSE (Server-Sent Events) for real-time tool interactions.

A simple interactive CLI interface powered by Node.js and readline.

The AI receives context, invokes tools as needed, and returns enhanced responses — all in a chat loop.

📁 Project Structure
bash
Copy
Edit
client/
│
├── index.js            # Main entry point
├── package.json        # Project metadata and dependencies
├── .env                # Environment variables (Gemini API key)
└── README.md           # Documentation (this file)
🚀 Features
✅ Text-based CLI interface

✅ Gemini 2.0 Flash model integration

✅ Supports function/tool calling using Gemini's functionDeclarations

✅ Dynamic tool listing via MCP

✅ Tool result injection into chat history

✅ Auto-reinvocation of Gemini after tool execution

✅ Clean error handling (including Gemini 503 responses)

✅ Fully async flow

🔧 Technologies Used
Tool / Library	Purpose
@google/genai	Connects to Google Gemini API
@modelcontextprotocol/sdk	Interacts with tool server via SSE
dotenv	Manages API keys securely
readline/promises	Asynchronous CLI input handling
Node.js (ESM)	Runtime & ecosystem

⚙️ Prerequisites
Before running the project, ensure you have the following installed:

Node.js v18+

A valid Google Gemini API Key

An MCP-compatible tool server running at http://localhost:3001/sse

📦 Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/gemini-mcp-chatbot.git
cd gemini-mcp-chatbot
Install dependencies:

bash
Copy
Edit
npm install
Create .env file:

env
Copy
Edit
GEMINI_API_KEY=your_google_gemini_api_key_here
🧠 How It Works — Step-by-Step
1. Start and Connect
When the app starts, it connects to the MCP server using Server-Sent Events (SSEClientTransport).

It then dynamically retrieves all registered tools via listTools() and registers their schemas with Gemini.

2. Read User Input
It uses readline.promises to prompt the user in the terminal.

Input is added to the chatHistory.

3. Call Gemini Model
The generateContent method from Google Gemini is called.

It receives the chat history and list of tools (functionDeclarations) as context.

4. Function Call Handling
If Gemini chooses to invoke a tool, it returns a functionCall object.

The tool name and arguments are extracted and sent to the MCP server via mcpClient.callTool.

5. Insert Tool Result into Chat
The result returned from the tool is inserted back into the conversation as if the user provided it.

The updated history is passed to Gemini again for a follow-up response.

6. Show Response
If there was no tool invocation, the response is simply printed to the terminal.

The loop continues, waiting for the next user input.

🔍 Example Tool Call
Let’s say the tool server has a tool named getWeather:

Tool Schema:
json
Copy
Edit
{
  "name": "getWeather",
  "description": "Returns weather based on city",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string"
      }
    },
    "required": ["city"]
  }
}
Conversation:
vbnet
Copy
Edit
You: What's the weather in Delhi?

AI: calling tool getWeather

AI: Tool result: It's 32°C and sunny in Delhi.

You: Thanks!
🧪 Example Use Cases
🤖 Build AI agents that auto-call APIs/tools.

🔧 AI DevOps assistants that run shell commands.

🛠️ Product chatbot that uses backend tools to retrieve answers.

📊 AI dashboards with real-time tool access.

🔌 AI wrappers over microservices.

📄 File: index.js — Explained
Section	What it does
dotenv/config	Loads your .env variables (Gemini key)
readline/promises	Creates async CLI interface
GoogleGenAI	Initializes Gemini API client
Client/SSEClientTransport	Connects to MCP server
listTools()	Gets tool list + schemas
generateContent()	Sends prompt & tools to Gemini
functionCall check	If Gemini wants to call a tool
mcpClient.callTool()	Executes that tool via MCP
chatHistory.push()	Maintains back-and-forth memory
chatLoop()	Main loop that manages the entire process

🛠️ Troubleshooting
Issue	Fix
401 Unauthorized	Check your Gemini API key
Tool returns undefined	Ensure the tool is properly defined in MCP
503 from Gemini	Too many requests — retry later
CLI freezes	Use CTRL+C and restart
SSE connection error	Ensure MCP server is running at http://localhost:3001/sse

📈 Future Improvements
🧠 Multi-turn memory storage

💾 Save conversations locally

🌐 WebSocket support for real-time updates

🛡️ Authentication with OAuth for tools

📦 NPM package version of the agent

👨‍💻 Contributing
Feel free to open issues or pull requests if you’d like to improve this project.

📝 License
This project is open-source under the MIT License.

🙌 Acknowledgments
Google Gemini

Model Context Protocol

OpenAI Function Calling inspiration

Community contributors

