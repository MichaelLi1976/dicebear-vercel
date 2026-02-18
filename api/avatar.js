import { createAvatar } from "@dicebear/core";
import * as collection from '@dicebear/collection';

// 預設表情模板
const EMOTION_PRESETS = {
  'happy': { mouth: 'smile', eyes: 'happy', eyebrows: 'raisedExcited' },
  'sad': { mouth: 'sad', eyes: 'cry', eyebrows: 'sadConcerned' },
  'angry': { mouth: 'grimace', eyes: 'squint', eyebrows: 'angry' },
  'surprised': { mouth: 'screamOpen', eyes: 'surprised', eyebrows: 'raisedExcited' },
  'neutral': { mouth: 'serious', eyes: 'default', eyebrows: 'default' },
  'wink': { mouth: 'smile', eyes: 'wink', eyebrows: 'default' },
  'love': { mouth: 'smile', eyes: 'hearts', eyebrows: 'default' },
  'cool': { mouth: 'smile', eyes: 'default', accessories: 'sunglasses' },
  'smile': { mouth: 'smile' },
  'scream': { mouth: 'screamOpen' },
  'tongue': { mouth: 'tongue' },
  'serious': { mouth: 'serious' },
  'grimace': { mouth: 'grimace' },
};

export default function handler(req, res) {
  try {
    // 🔥 關鍵修改：接收所有參數
    let { seed = 'default', style = 'avataaars', emotion, ...options } = req.query;
    
    // === 支援 seed 中的表情編碼 ===
    if (seed.includes('_')) {
      const parts = seed.split('_');
      const baseSeed = parts[0];
      const emotionOrParams = parts.slice(1);
      
      if (emotionOrParams.length === 1 && EMOTION_PRESETS[emotionOrParams[0]]) {
        const presetOptions = EMOTION_PRESETS[emotionOrParams[0]];
        options = { ...presetOptions, ...options };
        seed = baseSeed;
      } else {
        emotionOrParams.forEach(part => {
          if (part.includes('-')) {
            const [key, value] = part.split('-');
            if (!options[key]) {
              options[key] = value;
            }
          }
        });
        seed = baseSeed;
      }
    }
    
    // === 支援 emotion 參數 ===
    if (emotion && EMOTION_PRESETS[emotion]) {
      const presetOptions = EMOTION_PRESETS[emotion];
      options = { ...presetOptions, ...options };
    }
    
    // 檢查風格是否存在
    const avatarStyle = collection[style] || collection.avataaars;
    
    // 🔥 關鍵修改：傳入所有參數
    const avatar = createAvatar(avatarStyle, { 
      seed,
      ...options  // 包含 mouth, eyes, eyebrows 等所有參數
    });
    
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

