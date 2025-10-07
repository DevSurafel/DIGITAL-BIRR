# Digital Birr 💎

A Telegram-based tap-to-earn gaming application where users can earn rewards, complete tasks, invite friends, and level up through an engaging gamified experience.

## 🎮 Overview

Digital Birr is a comprehensive tap-to-earn application built for Telegram users. Players tap to earn coins, complete various tasks, boost their earning capabilities, and compete on leaderboards while climbing through different rank levels.

## ✨ Key Features

### 🎯 Core Gameplay
- **Tap-to-Earn Mechanism**: Users earn coins by tapping
- **Energy System**: Battery-based energy management for sustainable gameplay
- **Progressive Leveling**: Multiple rank tiers from Iron to Grandmaster
- **Milestone Rewards**: Achievement-based reward system

### 🚀 Boost System
- **Multi-tap**: Increase coins earned per tap
- **Energy Boost**: Expand maximum energy capacity
- **Recharge Speed**: Faster energy regeneration

### 📋 Task System
Multiple task categories:
- Telegram-based tasks
- WhatsApp engagement tasks
- Community tasks (Cat, Corn, Geek categories)
- Social media tasks

### 👥 Referral Program
- Invite friends to earn bonus rewards
- Track referral statistics
- Build your network and multiply earnings

### 🏆 Ranking System
Progressive rank tiers:
1. Iron
2. Bronze
3. Silver
4. Gold
5. Platinum
6. Diamond
7. Master
8. Grandmaster
9. Challenger

### 📊 Statistics & Leaderboards
- Personal performance tracking
- Global leaderboards
- Competition with other players

## 🛠️ Technology Stack

### Frontend
- **React.js**: UI framework
- **Redux Toolkit**: State management
- **Tailwind CSS**: Styling framework
- **React Router**: Navigation

### Backend & Services
- **Firebase Firestore**: Database
- **Netlify Functions**: Serverless backend
- **Telegram Bot API**: Bot integration via Telegraf

### Build & Deployment
- **Netlify**: Hosting and serverless functions
- **Create React App**: Build tooling

## 📁 Project Structure

```
digital-birr/
├── public/                  # Static assets (images, icons)
├── src/
│   ├── Components/          # React components
│   │   ├── Task/           # Task-specific components
│   │   ├── Footer.js       # Navigation footer
│   │   ├── Levels.js       # Rank level display
│   │   ├── Rewards.js      # Reward components
│   │   └── ...
│   ├── pages/              # Main page components
│   │   ├── Boost.js        # Boost management
│   │   ├── Tasks.js        # Task list
│   │   ├── Ref.js          # Referral system
│   │   ├── Stats.js        # Statistics
│   │   └── ...
│   ├── context/            # React context providers
│   ├── features/           # Redux slices
│   ├── assets/             # Images and SVG assets
│   ├── firebase.js         # Firebase configuration
│   ├── store.js            # Redux store setup
│   └── App.js              # Main app component
├── netlify/
│   └── functions/          # Serverless functions
│       └── telegram-bot.js # Telegram bot handler
└── netlify.toml            # Netlify configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Telegram Bot Token
- Netlify account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-birr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Netlify function dependencies**
   ```bash
   cd netlify/functions
   npm install
   cd ../..
   ```

4. **Configure environment variables**
   
   The Telegram bot token needs to be set as an environment variable in your Netlify dashboard:
   - `REACT_APP_TELEGRAM_BOT_TOKEN`: Your Telegram bot token

5. **Configure Firebase**
   
   The Firebase configuration is in `src/firebase.js`. The current configuration includes:
   - Project: digital-e-birr
   - Database: Firestore
   
   Note: Firebase web API keys are public and safe to include in client-side code.

### Development

```bash
npm start
```

The app will run at `http://localhost:3000`

### Build

```bash
npm run build
```

### Deployment

The project is configured for Netlify deployment with serverless functions.

1. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

2. **Set up Telegram webhook**
   After deployment, configure your Telegram bot webhook to point to:
   ```
   https://your-domain.netlify.app/.netlify/functions/telegram-bot
   ```

## 🤖 Telegram Bot Integration

The Telegram bot (`telegram-bot.js`) handles:
- `/start` command processing
- Welcome messages with user mentions
- Referral link generation
- Community link sharing
- Web app integration

### Bot Commands
- `/start` - Initialize bot and open web app
- Messages are automatically responded to with the welcome message

## 🎨 Features in Detail

### Energy System
- Maximum energy capacity varies by level
- Energy depletes with each tap
- Automatic recharge over time
- Boost options to increase capacity and recharge rate

### Task Completion
Tasks are organized into categories:
- **Telegram Tasks**: Join channels, groups
- **WhatsApp Tasks**: Share and engage
- **Community Tasks**: Platform-specific challenges
- **Social Tasks**: Follow, share, engage on social media

### Boost Marketplace
Three types of boosts available:
1. **Multi-tap**: Increase coins per tap (stackable)
2. **Energy Limit**: Increase maximum energy capacity
3. **Recharge Speed**: Faster energy regeneration

### Referral System
- Unique referral links for each user
- Track invited friends
- Earn rewards for successful referrals
- View referral statistics

## 🔒 Security Notes

- Firebase API keys are public keys meant for client-side use
- Telegram bot token is stored securely in environment variables
- All sensitive operations should go through Netlify functions

## 📱 Supported Platforms

- Telegram Web App (primary platform)
- Mobile browsers (via Telegram)
- Desktop browsers

## 🐛 Known Issues & Maintenance

- Maintenance mode available via `Maintenance.jsx` component
- Device compatibility checks via `DeviceCheck.js`
- Error handling via `ErrorCom.js`

## 📄 License

All rights reserved.

## 🤝 Contributing

This is a private project. For inquiries, please contact the project owner.

## 📞 Support

For support and updates, join our community:
- Telegram Community: https://t.me/+p9ThUnIaaV0wYzZk


---

Built with ❤️ for the Digital Birr community
