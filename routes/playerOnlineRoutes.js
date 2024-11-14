const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get online players list
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('player_online')
      .select('*')
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Player joins server
router.post('/join', async (req, res) => {
  try {
    // Get current player list
    const { data: currentData, error: fetchError } = await supabase
      .from('player_online')
      .select('player_list')
      .single();
    
    if (fetchError) throw fetchError;

    const currentPlayerList = currentData.player_list || [];
    
    // Check if player is already in the list
    const playerExists = currentPlayerList.some(
      player => player.player_name === req.body.player_name
    );

    if (playerExists) {
      return res.status(400).json({ error: 'Player already online' });
    }

    // Add new player
    const newPlayer = {
      player_name: req.body.player_name,
      joined_at: new Date().toISOString()
    };

    const updatedPlayerList = [...currentPlayerList, newPlayer];

    // Update database
    const { data, error } = await supabase
      .from('player_online')
      .update({ 
        player_list: updatedPlayerList,
        total_online: updatedPlayerList.length
      })
      .eq('id', 1)
      .select();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Player leaves server
router.post('/leave', async (req, res) => {
  try {
    // Get current player list
    const { data: currentData, error: fetchError } = await supabase
      .from('player_online')
      .select('player_list')
      .single();
    
    if (fetchError) throw fetchError;

    const currentPlayerList = currentData.player_list || [];
    
    // Remove player from list
    const updatedPlayerList = currentPlayerList.filter(
      player => player.player_name !== req.body.player_name
    );

    // Update database
    const { data, error } = await supabase
      .from('player_online')
      .update({ 
        player_list: updatedPlayerList,
        total_online: updatedPlayerList.length
      })
      .eq('id', 1)
      .select();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 