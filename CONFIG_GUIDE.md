# 🔧 Configuration Guide

## Mengubah Settings Bot

Edit bagian ini di `bot.js`:

```javascript
const CONFIG = {
  headless: false,        // Visibility
  mineInterval: 5000,     // Click frequency
  maxRetries: 3,          // Retry attempts
  timeout: 30000,         // Page load timeout
  logFile: 'mining-log.txt'
};
```

## Parameter Penjelasan

### `headless`
- `false` = Browser terlihat (recommended untuk monitor)
- `true` = Background (tidak terlihat)

**Rekomendasi:** Gunakan `false` pertama kali untuk testing

### `mineInterval`
Waktu tunggu antara setiap click dalam milliseconds:

| Value | Speed | Risk | Use Case |
|-------|-------|------|----------|
| 3000 | Sangat Cepat | Tinggi | Testing |
| 5000 | Normal | Medium | Default (OK) |
| 8000 | Sedang | Rendah | Balanced |
| 10000 | Lambat | Rendah | Safe |
| 15000 | Sangat Lambat | Sangat Rendah | Overnight |

**Tips:** 
- Mulai dari 5000, naik ke 10000 jika terdeteksi
- Turun ke 3000 hanya untuk testing

### `maxRetries`
Berapa kali bot mencoba click jika gagal:
- `1` = Coba sekali, jika gagal lanjut
- `3` = Coba 3x sebelum skip (recommended)
- `5` = Lebih persistent

### `timeout`
Berapa lama tunggu page load dalam ms:
- Jangan ubah kecuali koneksi lambat
- Naikkan ke 60000 jika timeout error

### `logFile`
Nama file untuk log:
- Default: `mining-log.txt`
- Bisa di-custom sesuai kebutuhan

## 📊 Contoh Konfigurasi

### Setup 1: Testing
```javascript
const CONFIG = {
  headless: false,
  mineInterval: 3000,
  maxRetries: 1,
  timeout: 30000,
  logFile: 'mining-log.txt'
};
```

### Setup 2: Balanced (Recommended)
```javascript
const CONFIG = {
  headless: false,
  mineInterval: 5000,
  maxRetries: 3,
  timeout: 30000,
  logFile: 'mining-log.txt'
};
```

### Setup 3: Safe Mode
```javascript
const CONFIG = {
  headless: true,
  mineInterval: 10000,
  maxRetries: 5,
  timeout: 60000,
  logFile: 'mining-log.txt'
};
```

### Setup 4: Overnight (Background)
```javascript
const CONFIG = {
  headless: true,
  mineInterval: 15000,
  maxRetries: 3,
  timeout: 60000,
  logFile: 'mining-log-night.txt'
};
```

## 🎯 Optimasi Untuk Kecepatan

```javascript
const CONFIG = {
  headless: true,         // Background = lebih cepat
  mineInterval: 3000,     // Cepat
  maxRetries: 1,          // Jangan retry
  timeout: 15000,         // Singkat
  logFile: 'mining-log.txt'
};
```

## 🛡️ Optimasi Untuk Safety

```javascript
const CONFIG = {
  headless: true,         // Stealth
  mineInterval: 12000,    // Lambat
  maxRetries: 5,          // Retry banyak
  timeout: 60000,         // Lama
  logFile: 'mining-log.txt'
};
```

## 🔄 Setup Multiple Instances

Jika mau jalankan 2 bot sekaligus:

**File: bot-2.js**
```javascript
// Copy dari bot.js, ubah CONFIG:
const CONFIG = {
  headless: true,
  mineInterval: 7000,    // Berbeda dari yang pertama
  maxRetries: 3,
  timeout: 30000,
  logFile: 'mining-log-2.txt'  // Berbeda log file
};
```

**Jalankan:**
```bash
node bot.js &      # Bot 1 (background)
node bot-2.js      # Bot 2 (foreground)
```

## 📈 Monitoring Performance

Cek log file:
```bash
tail -f mining-log.txt      # Linux/Mac
Get-Content mining-log.txt -Wait  # Windows PowerShell
```

## 🆘 Jika Ada Masalah

### Terdeteksi sebagai bot
- Naikkan `mineInterval` ke 10000+
- Ubah `headless: true`
- Restart bot setiap jam

### Click tidak berhasil
- Periksa selector button di browser (F12)
- Naikkan `maxRetries` ke 5
- Naikkan `mineInterval`

### Memory/CPU tinggi
- Ubah `headless: true`
- Naikkan `mineInterval`
- Restart bot setiap beberapa jam
