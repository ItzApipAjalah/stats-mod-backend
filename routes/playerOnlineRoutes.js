const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get total online and player list
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

// Update total online and player list
router.put('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('player_online')
      .update({ 
        total_online: req.body.total_online,
        player_list: req.body.player_list
      })
      .eq('id', 1)
      .select();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add player to player list
router.post('/add-player', async (req, res) => {
  try {
    // First get current player_list
    const { data: currentData, error: fetchError } = await supabase
      .from('player_online')
      .select('player_list')
      .single();
    
    if (fetchError) throw fetchError;

    const currentPlayerList = currentData.player_list || [];
    const newPlayer = {
      id: req.body.id,
      player_name: req.body.player_name,
      status: req.body.status || 'online',
      last_active: new Date().toISOString()
    };

    // Add new player to list
    const updatedPlayerList = [...currentPlayerList, newPlayer];

    // Update the database
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

// Remove player from player list
router.post('/remove-player', async (req, res) => {
  try {
    // First get current player_list
    const { data: currentData, error: fetchError } = await supabase
      .from('player_online')
      .select('player_list')
      .single();
    
    if (fetchError) throw fetchError;

    const currentPlayerList = currentData.player_list || [];
    const updatedPlayerList = currentPlayerList.filter(
      player => player.id !== req.body.id
    );

    // Update the database
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