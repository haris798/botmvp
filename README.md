# Dashboard Trading Bot

Dashboard terpusat untuk memantau, mengelola, dan mengonfigurasi bot trading Anda secara real-time.

## Fitur Utama
- **Overview**: Monitoring saldo, ekuitas, P/L, dan akses cepat ke fitur manual trading.
- **Manual Trade Entry**: Eksekusi order BUY/SELL dengan validasi risiko langsung dari dashboard.
- **System Health**: Monitoring real-time penggunaan CPU, Memori, Disk, dan status proses bot.
- **Alerts**: Visualisasi anomali pasar seperti slippage atau spread spike yang diambil dari database.
- **Settings**: Konfigurasi strategi (Aggressive/Balanced/Conservative), integrasi Telegram untuk notifikasi, dan pengaturan notifikasi kustom berdasarkan kondisi risiko.

## Teknologi
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend/Data**: Supabase

## Panduan Implementasi di VPS

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di VPS (contoh: Ubuntu/Debian):

### 1. Persiapan
Pastikan VPS Anda memiliki Node.js (v18+) dan npm terinstall.

- Install Git:
  ```bash
  sudo apt update && sudo apt install git -y
  ```
- Install PM2 untuk manajemen proses (agar aplikasi tetap berjalan di background):
  ```bash
  sudo npm install -g pm2
  ```

### 2. Clone dan Install
```bash
git clone <URL_REPO_ANDA>
cd <NAMA_FOLDER>
npm install
```

### 3. Konfigurasi Lingkungan
- Salin `.env.example` ke `.env` dan sesuaikan dengan konfigurasi Anda:
  ```bash
  cp .env.example .env
  nano .env
  ```
- Isi variabel lingkungan yang diperlukan (Supabase URL, Key, dll).

### 4. Build dan Jalankan
- Build aplikasi untuk produksi:
  ```bash
  npm run build
  ```
- Jalankan aplikasi menggunakan PM2:
  ```bash
  pm2 start npm --name "trading-bot-dashboard" -- run start
  ```
- Pastikan PM2 berjalan saat server restart:
  ```bash
  pm2 save
  pm2 startup
  ```

### 5. Deployment Selesai
Aplikasi Anda kini berjalan di port 3000. Anda mungkin perlu mengonfigurasi Nginx sebagai reverse proxy untuk mengarahkan domain/IP ke port 3000.
