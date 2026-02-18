import { createAvatar } from '@dicebear/core';
import * as collection from '@dicebear/collection';

export default function handler(req, res) {
  try {
    const { seed = 'default', style = 'avataaars' } = req.query;
    
    // 檢查風格是否存在
    const avatarStyle = collection[style] || collection.avataaars;
    
    // 生成頭像
    const avatar = createAvatar(avatarStyle, { seed });
    
    // 設定回應標頭
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    // 回傳 SVG
    res.status(200).send(avatar.toString());
  } catch (error) {
    // 錯誤處理
    res.status(500).json({ 
      error: 'Failed to generate avatar',
      message: error.message 
    });
  }
}

