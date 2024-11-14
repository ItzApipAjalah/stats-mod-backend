const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');
const playerOnlineRoutes = require('./routes/playerOnlineRoutes');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/player-online', playerOnlineRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 