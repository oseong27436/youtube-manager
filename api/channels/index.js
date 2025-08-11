const express = require('express');
const router = express.Router();
const Channel = require('../../models/Channel');

// 현재 사용자의 채널만 가져오기
router.get('/', async (req, res) => {
  try {
    // req.user는 authenticate 미들웨어에서 설정됨
    const channels = await Channel.find({ 
      _id: { $in: req.user.channels } 
    });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 채널 추가
router.post('/', async (req, res) => {
  try {
    const channel = new Channel(req.body);
    await channel.save();
    
    // 사용자의 channels 배열에 추가
    req.user.channels.push(channel._id);
    await req.user.save();
    
    res.status(201).json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 채널 업데이트
router.put('/:id', async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 채널 삭제
router.delete('/:id', async (req, res) => {
  try {
    const channel = await Channel.findByIdAndDelete(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;