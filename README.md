# 🤖 RPOW2 Mining Bot

Automated mining bot untuk https://rpow2.com/#/mine

## ✨ Fitur

- ✅ Auto-click mining setiap 5 detik (configurable)
- ✅ Smart button detection - 5+ methods
- ✅ Page health monitoring
- ✅ Retry logic otomatis
- ✅ Stealth mode - hindari detection
- ✅ Logging lengkap ke `mining-log.txt`
- ✅ Graceful shutdown (Ctrl+C)
- ✅ Real-time stats

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/anggasan/anggasan.git
cd anggasan

# Install dependencies
npm install

# Run bot
npm start
```

## ⚙️ Configuration

Edit `bot.js` section CONFIG:

```javascript
const CONFIG = {
  headless: false,        // true = background, false = visible
  mineInterval: 5000,     // milliseconds between clicks
  maxRetries: 3,          // retry attempts
  timeout: 30000,         // page load timeout
  logFile: 'mining-log.txt'
};
```

### Opsi Mining Interval

```
3000ms   = Very fast (risky)
5000ms   = Balanced (recommended)
8000ms   = Medium speed
10000ms  = Slow (safest)
15000ms  = Very slow
```

## 📊 Output

```
[2026-05-10T14:32:30.000Z] 🚀 Initializing Puppeteer...
[2026-05-10T14:32:35.000Z] ✅ Puppeteer initialized
[2026-05-10T14:32:40.000Z] 🌐 Navigating to rpow2.com mining page...
[2026-05-10T14:32:45.000Z] ✅ Mining page loaded
[2026-05-10T14:32:45.000Z] 🎯 Mining bot started successfully!
[2026-05-10T14:32:45.000Z] ⏱️ Mining every 5000ms
[2026-05-10T14:32:50.000Z] ✅ Mine button clicked (Total: 1)
[2026-05-10T14:32:55.000Z] ✅ Mine button clicked (Total: 2)
```

## 🛑 Stop Bot

```bash
Ctrl + C
```

## 📋 Logs

Semua activity disimpan di `mining-log.txt`

## 🔧 Troubleshooting

### Button tidak terdeteksi
1. Buka browser (F12 untuk developer tools)
2. Inspect tombol "Mine"
3. Catat class atau ID
4. Update `bot.js` selector list

### Terdeteksi sebagai bot
1. Ubah `headless: true` (background mode)
2. Increase `mineInterval` ke 10000+
3. Coba ganti user agent

### Memory leak
1. Restart bot setiap jam
2. Monitor RAM usage
3. Update Puppeteer: `npm update puppeteer`

## ⚠️ Disclaimer

- Pastikan sesuai Terms of Service rpow2.com
- Gunakan untuk akun pribadi Anda sendiri
- Resiko ban akun ada kemungkinan
- Gunakan dengan bijak

## 📝 License

MIT

## 👨‍💻 Author

Created with ❤️ for mining automation
