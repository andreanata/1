# Setup Firebase untuk Realtime Sync - Integrity Post

## Panduan Setup Firebase (Wajib untuk Realtime Sync)

Untuk mengaktifkan sinkronisasi realtime antara dashboard admin dan website publik, ikuti langkah berikut:

### 1. Buat Project Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add Project"
3. Masukkan nama project (contoh: `integritypost`)
4. Ikuti wizard setup sampai selesai

### 2. Aktifkan Firestore Database
1. Di Firebase Console, pilih menu "Firestore Database"
2. Klik "Create Database"
3. Pilih mode "Start in test mode" (untuk development)
4. Pilih lokasi server (pilih `asia-southeast1` untuk Indonesia)
5. Klik "Enable"

### 3. Dapatkan Konfigurasi Firebase
1. Di Firebase Console, klik ikon "⚙️" (Settings) → "Project settings"
2. Scroll ke bagian "Your apps"
3. Klik ikon "</>" (Web) untuk menambahkan app web
4. Masukkan nama app (contoh: "Integrity Post Web")
5. Copy konfigurasi yang muncul

### 4. Update Konfigurasi di Project
Buka file `src/firebase.ts` dan ganti konfigurasi placeholder dengan konfigurasi Anda:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "integritypost.firebaseapp.com",
  projectId: "integritypost",
  storageBucket: "integritypost.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 5. Setup Security Rules (Production)
Di Firestore Database → Rules, tambahkan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Articles - public read, admin write
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Deploy
Setelah konfigurasi Firebase selesai, build dan deploy ulang website Anda.

## Fitur yang Tersedia

✅ **Realtime Sync**: Perubahan di admin langsung muncul di publik
✅ **Cross-Device**: Semua user melihat data yang sama
✅ **Offline Support**: Firebase otomatis handle offline mode
✅ **Scalable**: Mendukung ribuan concurrent users

## Fallback

Jika Firebase tidak terkonfigurasi, sistem akan otomatis fallback ke localStorage (sinkronisasi hanya di browser yang sama).
