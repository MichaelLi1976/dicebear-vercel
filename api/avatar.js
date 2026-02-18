import { createAvatar } from '@dicebear/core';
import { avataaars, bottts } from '@dicebear/collection';

export default function handler(req, res) {
  try {
    // 解構參數
    const { seed, style, ...options } = req.query;
    
    // 選擇頭像風格
    let avatarStyle;
    switch (style) {
      case 'bottts':
        avatarStyle = bottts;
        break;
      case 'avataaars':
      default:
        avatarStyle = avataaars;
        break;
    }
    
    // 生成頭像
    const avatar = createAvatar(avatarStyle, {
      seed: seed || 'default',
      ...options  // 傳遞所有其他參數
    });
    
    const svg = avatar.toString();
    
    // 設定回應標頭
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


