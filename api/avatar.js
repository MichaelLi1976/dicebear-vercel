import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export default function handler(req, res) {
  try {
    const { seed, ...options } = req.query;

    // 參數類型定義
    const paramTypes = {
      // 陣列類型
      array: [
        'mouth', 'eyes', 'eyebrows', 'accessories', 'accessoriesColor',
        'clothing', 'clothesColor', 'facialHair', 'facialHairColor',
        'hairColor', 'hatColor', 'top', 'skinColor'
      ],
      // 數字類型
      number: [
        'size', 'radius', 'scale', 'rotate', 
        'translateX', 'translateY', 'backgroundRotation'
      ],
      // 布林類型
      boolean: ['flip', 'randomizeIds', 'clip'],
      // 字串類型（預設）
      string: ['backgroundColor', 'backgroundType', 'seed']
    };

    // 處理參數
    const processedOptions = {};
    
    for (const [key, value] of Object.entries(options)) {
      if (!value) continue;

      // 陣列類型
      if (paramTypes.array.includes(key)) {
        processedOptions[key] = value.includes(',') 
          ? value.split(',') 
          : [value];
      }
      // 數字類型
      else if (paramTypes.number.includes(key)) {
        processedOptions[key] = Number(value);
      }
      // 布林類型
      else if (paramTypes.boolean.includes(key)) {
        processedOptions[key] = value === 'true' || value === '1';
      }
      // 字串類型（預設）
      else {
        processedOptions[key] = value;
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
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(svg);

  } catch (error) {
    console.error('Error generating avatar:', error);
    res.status(500).json({ 
      error: 'Failed to generate avatar',
      message: error.message 
    });
  }
}
