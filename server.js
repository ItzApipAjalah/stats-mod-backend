const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');
const playerOnlineRoutes = require('./routes/playerOnlineRoutes');
const chatRoutes = require('./routes/chatRoutes');
const ipWhitelist = require('./middleware/ipWhitelist');
const tokenAuth = require('./middleware/tokenAuth');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.set('trust proxy', true);

app.get('/', (req, res) => {
  const apiDocs = {
    name: "Player API Documentation",
    version: "1.0.0",
    base_url: `http://localhost:${process.env.PORT}`,
    access_control: {
      type: "Domain & IP Whitelist + Token Auth",
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
      ],
      token_auth: {
        required_for: "All non-GET methods",
        header: "x-api-token",
        query_param: "token",
        example: process.env.API_TOKEN
      }
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
        name: "Create Player (with token)",
        request: {
          method: "POST",
          path: "/api/players",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": "Your-API-Token-Here"
          },
          body: {
            player_name: "Steve"
          }
        }
      },
      {
        name: "Player Join (with token)",
        request: {
          method: "POST",
          path: "/api/player-online/join",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": "Your-API-Token-Here"
          },
          body: {
            player_name: "Steve"
          }
        }
      },
      {
        name: "Send Message (with token)",
        request: {
          method: "POST",
          path: "/api/chat",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": "Your-API-Token-Here"
          },
          body: {
            player_name: "Steve",
            message: "Hello everyone!"
          }
        }
      },
      {
        name: "Get Players (no token required)",
        request: {
          method: "GET",
          path: "/api/players",
          headers: {
            "Content-Type": "application/json"
          }
        }
      }
    ]
  };

  res.json(apiDocs);
});

const protectedMiddleware = (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }
  ipWhitelist(req, res, (err) => {
    if (err) return next(err);
    tokenAuth(req, res, next);
  });
};

app.use('/api/players', protectedMiddleware, playerRoutes);
app.use('/api/player-online', protectedMiddleware, playerOnlineRoutes);
app.use('/api/chat', protectedMiddleware, chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 