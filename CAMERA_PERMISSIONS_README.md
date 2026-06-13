# Sistem Perizinan Kamera & Watermark Kasir - KasirAndroid

## 📋 Ringkasan Perubahan

Rombakan lengkap sistem perizinan kamera untuk permintaan izin native Android dan penambahan watermark kasir dengan tema orange dan hijau muda.

---

## 🎥 Sistem Perizinan Kamera

### Fitur Utama
✅ **Android Runtime Permissions** - Permintaan izin kamera secara native di Android 6.0+  
✅ **Multi-Layer Permission Handling** - Fallback dari native → Capacitor → Web API  
✅ **Error Handling Komprehensif** - Pesan error spesifik untuk setiap situasi  
✅ **User-Friendly Feedback** - Toast notifications dengan pesan yang jelas  

### Arsitektur Perizinan

```
┌─────────────────────────────────────────────────┐
│          Tombol "Scan Camera"                   │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│   requestCameraPermission()                     │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌─────────┐
   │Native  │ │Capacitor
   │Plugin  │ │Permissions API
   │Android │ │(iOS/Android)
   └────────┘ └────────┘ └─────────┘
        │          │          │
        └──────────┼──────────┘
                   ▼
         ┌─────────────────────┐
         │  Web API getUserMedia()
         │  (Browser Fallback)
         └─────────────────────┘
```

### File-file Implementasi

#### 1. **AndroidManifest.xml** (Android)
Ditambahkan izin yang diperlukan:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

#### 2. **CameraPermissionHandler.java** (Native Android Plugin)
Plugin Capacitor kustom untuk penanganan izin kamera native:
- `requestCameraPermission()` - Meminta izin kamera
- `checkCameraPermission()` - Cek status izin saat ini
- `handleRequestPermissionsResult()` - Handle hasil permintaan izin

Lokasi: `android/app/src/main/java/com/tokosaya/kasir/CameraPermissionHandler.java`

#### 3. **MainActivity.java** (Android Activity)
Diperbarui dengan:
- Inisialisasi permission request saat app startup
- Support untuk Android 6.0+ (API Level 23+)

Lokasi: `android/app/src/main/java/com/tokosaya/kasir/MainActivity.java`

#### 4. **app.js** (Permission Request Logic)
Enhanced `requestCameraPermission()` method dengan:
- Triple-layer permission handling
- Specific error messages
- Toast notifications
- Fallback mechanisms

Fitur baru: `initializeCameraPermissions()` - Initialize permission checks pada startup

#### 5. **index.html** (UI & Watermark)
Ditambahkan:
- Capacitor libraries untuk Android support
- Camera watermark overlay HTML
- Print section watermark

#### 6. **style.css** (Styling)
Ditambahkan:
- `.camera-container` & `.camera-watermark` styles
- `.print-watermark` & `.print-watermark-content` styles
- Orange (#ff9900) & Light Green (#66cc33) gradient
- Pulse animation untuk watermark

---

## 🎨 Watermark Desain

### Camera Scanner Watermark
**Tema:** Kasir POS dengan warna orange dan hijau muda  
**Lokasi:** Overlay di atas live camera stream  
**Animasi:** Pulse effect (fade in/out setiap 3 detik)  
**Elemen:**
- Icon receipt (ikon struk kasir)
- Text "KASIR POS" dengan gradient orange-hijau
- Subtext "Scan & Sell" dalam hijau muda
- Background gradient radial dengan opacity 0.08

### Print Receipt Watermark
**Tema:** Tanda air cetak dengan warna orange & hijau  
**Lokasi:** Background dokumen cetak (rotated -45 degrees)  
**Elemen:**
- Icon receipt dalam hijau (#66cc33)
- Text "KASIR POS" dalam orange (#ff9900)
- Opacity: 0.08 agar tidak menggangu readability
- Rotasi -45 derajat untuk efek professional

---

## 🔧 Alur Penggunaan

### Permintaan Izin Kamera

1. **User Klik Tombol Scan**
   ```
   Button "Scan Barcode/QR" diklik
   ```

2. **System Cek Permission**
   ```
   toggleCameraModal(true) → startScanner() → requestCameraPermission()
   ```

3. **Permission Check Sequence**
   
   a) **Native Android Plugin Check** (Prioritas 1)
   ```javascript
   CapacitorPlugins.CameraPermissionHandler.requestCameraPermission()
   // Shows: "Izin kamera diberikan" or "Izin kamera ditolak"
   ```
   
   b) **Capacitor Permissions API** (Prioritas 2)
   ```javascript
   CapacitorPlugins.Permissions.query({ name: 'Camera' })
   // Jika state = 'prompt', request permission
   ```
   
   c) **Web API Fallback** (Prioritas 3)
   ```javascript
   navigator.mediaDevices.getUserMedia({ video: true })
   // Browser-based permission request
   ```

4. **Hasil Permintaan**
   - ✅ **Granted:** Camera stream dimulai dengan watermark
   - ❌ **Denied:** Toast error dengan pesan spesifik

### Error Handling Spesifik

```javascript
NotAllowedError      → "Izin kamera ditolak. Cek pengaturan privasi."
NotFoundError        → "Kamera tidak ditemukan di perangkat"
NotReadableError     → "Kamera sedang digunakan aplikasi lain"
SecurityError        → "Kamera tidak dapat diakses"
Other Error          → "Gagal mengakses kamera: [detail error]"
```

---

## 📱 Testing Guide

### Android Device Testing

1. **First Time Permission Request**
   - App muncul untuk pertama kali
   - User tap "Scan Camera"
   - Android permission dialog muncul
   - User pilih "Allow" atau "Deny"

2. **Permission Already Granted**
   - User buka app setelah permission diberikan
   - User tap "Scan Camera"
   - Camera langsung dibuka tanpa dialog

3. **Permission Denied Previously**
   - User buka app
   - User tap "Scan Camera"
   - Toast: "Izin kamera ditolak. Aktifkan di pengaturan aplikasi."
   - User harus ke Settings → KasirAndroid → Permissions → Camera

4. **No Camera Hardware**
   - Device tanpa kamera
   - User tap "Scan Camera"
   - Toast: "Kamera tidak ditemukan di perangkat"

### Browser Testing

- Chrome/Safari di desktop
- getUserMedia permission dialog muncul (jika https atau localhost)
- Watermark visible di camera preview

---

## 🔐 Permission Status Monitoring

Untuk mengecek status permission secara programatik:

```javascript
// Via Native Plugin
const result = await CapacitorPlugins.CameraPermissionHandler.checkCameraPermission();
console.log(result.granted); // true/false

// Via Capacitor API
const status = await CapacitorPlugins.Permissions.query({ name: 'Camera' });
console.log(status.state); // 'granted', 'denied', 'prompt'
```

---

## 🚀 Deployment Checklist

- [x] AndroidManifest.xml updated dengan CAMERA permission
- [x] Native Android plugin (CameraPermissionHandler.java) created
- [x] MainActivity enhanced dengan permission initialization
- [x] JavaScript permission handler implemented
- [x] HTML watermark elements added
- [x] CSS watermark styling completed
- [x] Capacitor libraries linked
- [x] Error messages localized to Indonesian

---

## 📝 Dependencies

### Android Level
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 31+
- Required: androidx.core & androidx.appcompat

### JavaScript
- `html5-qrcode` - QR code scanning library
- `@capacitor/core` - Capacitor framework
- `@capacitor/permissions` - Capacitor Permissions API
- Font Awesome 6.4.0 - Icons

---

## 🎯 Fitur Tambahan

### Watermark Features
- ✅ Gradient color orange → light green
- ✅ Pulse animation untuk camera watermark
- ✅ Rotated watermark untuk print receipt
- ✅ Low opacity untuk tidak mengganggu scanning
- ✅ Professional kasir branding

### Permission Features
- ✅ Early initialization pada app startup
- ✅ Graceful fallback mechanisms
- ✅ Specific error messaging
- ✅ User-friendly toast notifications
- ✅ Support Android 6.0+

---

## 🔗 Resources

- [Android Permissions Documentation](https://developer.android.com/guide/topics/permissions)
- [Capacitor Permissions Plugin](https://capacitorjs.com/docs/apis/permissions)
- [HTML5-QRCode Library](https://github.com/mebjas/html5-qrcode)
- [getUserMedia Web API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

---

**Status:** ✅ Complete Implementation  
**Version:** 2.0 - Camera Permissions & Watermark  
**Last Updated:** 2024
