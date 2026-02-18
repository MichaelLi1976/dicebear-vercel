// ✅ 傳遞所有參數
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export default function handler(req, res) {
  try {
    // ✅ 解構 seed，其他參數用 ...options 收集
    const { seed, style, ...options } = req.query;
    
    // ✅ 選擇頭像風格（預設 avataaars）
    const avatarStyle = style === 'bottts' ? bottts : avataaars;
    
    // ✅ 傳遞所有參數給 DiceBear
    const avatar = createAvatar(avatarStyle, {
      seed: seed || 'default',
      ...options  // 包含 mouth、eyes、clothing 等所有參數
    });
    
    const svg = avatar.toString();
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.status(200).send(svg);
    
  } catch (error) {
    console.error('Avatar generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate avatar',
      message: error.message 
    });
  }
}

