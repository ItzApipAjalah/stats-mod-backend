const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all players
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('player')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player by id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('player')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create player
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('player')
      .insert([{ player_name: req.body.player_name }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update player
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('player')
      .update({ player_name: req.body.player_name })
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete player
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('player')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 