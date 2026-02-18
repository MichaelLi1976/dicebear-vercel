import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export default function handler(req, res) {
  try {
    const { seed, ...options } = req.query;

    // 處理陣列類型的參數（mouth, eyes, accessories 等）
    const processedOptions = {};
    
    for (const [key, value] of Object.entries(options)) {
      // 如果參數值存在，將其轉換為陣列格式
      if (value) {
        // 檢查是否為逗號分隔的多個值
        if (typeof value === 'string' && value.includes(',')) {
          processedOptions[key] = value.split(',');
        } else {
          processedOptions[key] = [value];
        }
      }
    }

    // 建立頭像
    const avatar = createAvatar(avataaars, {
      seed: seed || 'default',
      ...processedOptions
    });

    const svg = avatar.toString();

    // 設定回應標頭
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.status(200).send(svg);

  } catch (error) {
    console.error('Error generating avatar:', error);
    res.status(500).json({ error: 'Failed to generate avatar' });
  }
}
