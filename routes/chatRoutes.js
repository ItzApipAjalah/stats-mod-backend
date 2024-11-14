const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get chat messages (with pagination)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('chat')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;

    res.json({
      messages: data,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message
router.post('/', async (req, res) => {
  try {
    const { player_name, message } = req.body;

    if (!player_name || !message) {
      return res.status(400).json({ error: 'Player name and message are required' });
    }

    // Check if message is not empty or just whitespace
    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const { data, error } = await supabase
      .from('chat')
      .insert([{ 
        player_name,
        message: message.trim()
      }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest messages (for real-time updates)
router.get('/latest', async (req, res) => {
  try {
    const { timestamp } = req.query;

    const query = supabase
      .from('chat')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    // If timestamp provided, get only newer messages
    if (timestamp) {
      query.gt('created_at', timestamp);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete message (optional - for moderation)
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('chat')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 