const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');
const playerOnlineRoutes = require('./routes/playerOnlineRoutes');
const chatRoutes = require('./routes/chatRoutes');
const ipWhitelist = require('./middleware/ipWhitelist');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.set('trust proxy', true);

app.use('/api/*', ipWhitelist);

app.get('/', (req, res) => {
  const apiDocs = {
    name: "Player API Documentation",
    version: "1.0.0",
    base_url: `http://localhost:${process.env.PORT}`,
    access_control: {
      type: "Domain & IP Whitelist",
      allowed: [
        "All *.vercel.app domains",
        "kizuserver.xyz",
        "gda.luckystore.id",
        "localhost",
        "127.0.0.1",
        "::1",
        "76.76.21.9",
        "76.76.21.22",
        "185.128.227.192"
      ]
    },
    endpoints: [
      {
        group: "Players",
        routes: [
          {
            path: "/api/players",
            method: "GET",
            description: "Get all players",
            body: null
          },
          {
            path: "/api/players/:id",
            method: "GET",
            description: "Get player by ID",
            params: {
              id: "Player ID (number)"
            },
            body: null
          },
          {
            path: "/api/players",
            method: "POST",
            description: "Create new player",
            body: {
              player_name: "string (required)"
            }
          },
          {
            path: "/api/players/:id",
            method: "PUT",
            description: "Update player",
            params: {
              id: "Player ID (number)"
            },
            body: {
              player_name: "string (required)"
            }
          },
          {
            path: "/api/players/:id",
            method: "DELETE",
            description: "Delete player",
            params: {
              id: "Player ID (number)"
            },
            body: null
          }
        ]
      },
      {
        group: "Player Online",
        routes: [
          {
            path: "/api/player-online",
            method: "GET",
            description: "Get online players list",
            body: null
          },
          {
            path: "/api/player-online/join",
            method: "POST",
            description: "Player joins server",
            body: {
              player_name: "string (required)"
            }
          },
          {
            path: "/api/player-online/leave",
            method: "POST",
            description: "Player leaves server",
            body: {
              player_name: "string (required)"
            }
          }
        ]
      },
      {
        group: "Chat",
        routes: [
          {
            path: "/api/chat",
            method: "GET",
            description: "Get chat messages with pagination",
            query: {
              page: "number (optional, default: 1)",
              limit: "number (optional, default: 50)"
            },
            body: null
          },
          {
            path: "/api/chat",
            method: "POST",
            description: "Send a message",
            body: {
              player_name: "string (required)",
              message: "string (required)"
            }
          },
          {
            path: "/api/chat/latest",
            method: "GET",
            description: "Get latest messages",
            query: {
              timestamp: "ISO date string (optional)"
            },
            body: null
          },
          {
            path: "/api/chat/:id",
            method: "DELETE",
            description: "Delete a message",
            params: {
              id: "Message ID (number)"
            },
            body: null
          }
        ]
      }
    ],
    examples: [
      {
        name: "Create Player",
        request: {
          method: "POST",
          path: "/api/players",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            player_name: "Steve"
          }
        }
      },
      {
        name: "Player Join",
        request: {
          method: "POST",
          path: "/api/player-online/join",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            player_name: "Steve"
          }
        }
      },
      {
        name: "Send Message",
        request: {
          method: "POST",
          path: "/api/chat",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            player_name: "Steve",
            message: "Hello everyone!"
          }
        }
      }
    ]
  };

  res.json(apiDocs);
});

app.use('/api/players', playerRoutes);
app.use('/api/player-online', playerOnlineRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 