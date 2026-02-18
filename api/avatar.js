import { createAvatar } from '@dicebear/core';
import { 
  avataaars, 
  personas, 
  funEmoji, 
  lorelei, 
  notionists,
  bottts 
} from '@dicebear/collection';

export default function handler(req, res) {
  try {
    const { seed, style, ...options } = req.query;

    // 根據 style 選擇頭像風格
    let avatarStyle;
    switch (style) {
      case 'personas':
        avatarStyle = personas; // 🥇 推薦！圓潤臉型
        break;
      case 'fun-emoji':
        avatarStyle = funEmoji; // 🥈 可愛 emoji
        break;
      case 'lorelei':
        avatarStyle = lorelei; // 🥉 優雅女性角色
        break;
      case 'notionists':
        avatarStyle = notionists; // 簡約風格
        break;
      case 'bottts':
        avatarStyle = bottts; // 機器人風格
        break;
      case 'avataaars':
      default:
        avatarStyle = personas; // ⚠️ 預設改用 personas
        break;
    }

    // 建立頭像
    const avatar = createAvatar(avatarStyle, {
      seed: seed || 'default',
      ...options
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
