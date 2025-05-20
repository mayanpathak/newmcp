import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createPost } from "./mcp.tool.js";
import { z } from "zod";

const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

// ... set up server resources, tools, and prompts ...

const app = express();


server.tool(
    "addTwoNumbers",
    "Add two numbers",
    {
        a: z.number(),
        b: z.number()
    },
    async (arg) => {
        const { a, b } = arg;
        return {
            content: [
                {
                    type: "text",
                    text: `The sum of ${a} and ${b} is ${a + b}`
                }
            ]
        }
    }
)

server.tool(
    "createPost",
    "Create a post on X formally known as Twitter ", {
    status: z.string()
}, async (arg) => {
    const { status } = arg;
    return createPost(status);
})


// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports = {};

app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[ transport.sessionId ] = transport;
    res.on("close", () => {
        delete transports[ transport.sessionId ];
    });
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports[ sessionId ];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});


// import express from 'express';
// import { randomUUID } from 'crypto';
// import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
// import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
// import { createPost } from './mcp.tool.js';
// import { z } from 'zod';

// const app = express();
// app.use(express.json());

// // MCP Server setup
// const server = new McpServer({
//   name: 'example-server',
//   version: '1.0.0',
// });

// // Register tools
// server.tool(
//   'addTwoNumbers',
//   'Add two numbers',
//   {
//     a: z.number(),
//     b: z.number(),
//   },
//   async (arg) => {
//     const { a, b } = arg;
//     return {
//       content: [
//         {
//           type: 'text',
//           text: `The sum of ${a} and ${b} is ${a + b}`,
//         },
//       ],
//     };
//   }
// );

// server.tool(
//   'createPost',
//   'Create a post on X formally known as Twitter',
//   {
//     status: z.string(),
//   },
//   async (arg) => {
//     return createPost(arg.status);
//   }
// );

// // Session tracking
// const transports = {};

// // POST: client → server messages
// app.post('/mcp', async (req, res) => {
//   const sessionId = req.headers['mcp-session-id'];

//   let transport;

//   if (sessionId && transports[sessionId]) {
//     // Reuse existing session transport
//     transport = transports[sessionId];
//   } else if (!sessionId && isInitializeRequest(req.body)) {
//     // Create a new session and transport
//     transport = new StreamableHTTPServerTransport({
//       sessionIdGenerator: () => randomUUID(),
//       onsessioninitialized: (newSessionId) => {
//         transports[newSessionId] = transport;
//         console.log(`✅ New session initialized: ${newSessionId}`);
//       },
//     });

//     // Clean up on close
//     transport.onclose = () => {
//       if (transport.sessionId) {
//         console.log(`❌ Session closed: ${transport.sessionId}`);
//         delete transports[transport.sessionId];
//       }
//     };

//     await server.connect(transport);
//   } else {
//     // Invalid session
//     res.status(400).json({
//       jsonrpc: '2.0',
//       error: {
//         code: -32000,
//         message: 'Bad Request: No valid session ID provided',
//       },
//       id: null,
//     });
//     return;
//   }

//   // Handle incoming message
//   await transport.handleRequest(req, res, req.body);
// });

// // GET/DELETE for server → client communication
// const handleSessionRequest = async (req, res) => {
//   const sessionId = req.headers['mcp-session-id'];

//   if (!sessionId || !transports[sessionId]) {
//     res.status(400).send('Invalid or missing session ID');
//     return;
//   }

//   const transport = transports[sessionId];
//   await transport.handleRequest(req, res);
// };

// app.get('/mcp', handleSessionRequest);
// app.delete('/mcp', handleSessionRequest);

// app.listen(3001, () => {
//   console.log('🚀 MCP Server running on http://localhost:3001');
// });




