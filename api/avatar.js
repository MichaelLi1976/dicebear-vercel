import { createAvatar } from '@dicebear/core';
import * as collection from '@dicebear/collection';

export default function handler(req, res) {
  const { seed = 'default', style = 'avataaars' } = req.query;
  
  // 取得風格
  const avatarStyle = collection[style] || collection.avataaars;
  
  // 建立頭像
  const avatar = createAvatar(avatarStyle, {
    seed: seed,
  });
  
  // 回傳 SVG
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(avatar.toString());
}
