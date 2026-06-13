# Kasir POS - Modern Point of Sale System

Aplikasi Kasir (POS) berbasis web yang modern, interaktif, dan kaya fitur. Dibuat dengan HTML5, CSS3, dan Vanilla JavaScript (ES6+) tanpa menggunakan framework eksternal.

---

## 📋 Fitur Utama

### 1. **Desain & Interface (UI/UX Modern)**
- ✨ **Glassmorphism Design** - Desain kaca modern dengan efek blur
- 🌓 **Dark & Light Mode** - Toggle tema dengan transisi smooth
- 📱 **Responsive** - Sempurna di desktop, tablet, dan mobile
- 🎨 **Animasi Interaktif** - Hover effects, fade-in, slide-in animations
- 🎯 **Clean Dashboard** - Interface profesional dan mudah digunakan

### 2. **Katalog Produk & Pencarian**
- 📦 **12 Produk Dummy** - Makanan, Minuman, Snack, Elektronik
- 🔍 **Pencarian Real-time** - Filter produk saat mengetik
- 📂 **Filter Kategori** - Kategori dengan ikon yang menarik
- 📊 **Status Stok** - Tampilkan stok normal, rendah, atau habis
- ⚠️ **Low Stock Alert** - Peringatan otomatis jika stok < 5 item

### 3. **Smart Cart (Keranjang Belanja Pintar)**
- ➕➖ **Qty Control** - Tambah/kurangi jumlah barang
- 🗑️ **Hapus Item** - Hapus produk dari keranjang
- 🧮 **Auto Calculation** - Hitung otomatis setiap ada perubahan
- 🎯 **Smooth Animation** - Animasi slide-in saat menambah item

### 4. **Perhitungan Otomatis**
- 💰 **Subtotal** - Total sebelum diskon dan pajak
- 🎁 **Diskon Fleksibel** - Pilih diskon persen (%) atau nominal (Rp)
- 🏛️ **Pajak 11%** - Otomatis dihitung dari subtotal - diskon
- 💵 **Total Akhir** - Total final = (Subtotal - Diskon) + Pajak

### 5. **Kalkulator Kembalian**
- 🤑 **Input Uang Dibayarkan** - Masukkan nominal uang pelanggan
- 📍 **Hitung Otomatis** - Kembalian dihitung secara real-time
- ⚠️ **Peringatan Uang Kurang** - Notifikasi merah jika uang kurang
- ✅ **Konfirmasi Pembayaran** - Modal konfirmasi sebelum checkout

### 6. **Notifikasi Toast**
- ✅ **Success** - Produk ditambahkan, transaksi berhasil
- ❌ **Error** - Stok habis, uang kurang
- ⚠️ **Warning** - Stok tidak cukup, keranjang kosong
- ℹ️ **Info** - Pesan informatif lainnya

### 7. **Penyimpanan Data (LocalStorage)**
- 💾 **Produk** - Simpan data produk dan stok
- 📝 **Transaksi** - Riwayat transaksi semua waktu
- ⚙️ **Settings** - Tema dan preferensi pengguna
- 🔄 **Persist Data** - Data tidak hilang saat refresh

### 8. **Auto-Deduct Stock**
- 📉 **Kurangi Stok** - Stok berkurang otomatis saat checkout
- 🚫 **Cegah Oversell** - Tidak bisa jual lebih dari stok tersedia
- ⏱️ **Real-time Update** - Tampilkan stok terbaru setiap saat

### 9. **Print Struk**
- 🖨️ **Siap Cetak** - Struk terformat rapi seperti thermal printer
- 📄 **Detail Lengkap** - Item, qty, harga, diskon, pajak, kembalian
- 🎨 **Print Stylesheet** - @media print tersedia
- ⏰ **Timestamp** - Tanggal & waktu transaksi

---

## 🚀 Cara Menggunakan

### 1. **Buka Aplikasi**
```bash
# Buka file index.html di browser
- Desktop: Double-click index.html
- Atau buka via server: http://localhost:3000/
```

### 2. **Menambah Produk ke Keranjang**
- Klik tombol "Tambah" pada produk yang diinginkan
- Atau gunakan fitur Pencarian untuk cari produk
- Produk akan muncul di keranjang dengan qty 1

### 3. **Mengatur Jumlah Barang**
- Gunakan tombol `−` dan `+` di keranjang
- Atau hapus dengan ikon 🗑️ untuk menghapus seluruhnya

### 4. **Menerapkan Diskon**
- Pilih tipe diskon: `%` (persen) atau `Rp` (nominal)
- Masukkan nominal/persen di field "Diskon"
- Nilai diskon otomatis dihitung dan ditampilkan

### 5. **Memasukkan Uang Pembayaran**
- Masukkan uang yang dibayarkan pelanggan
- Kembalian otomatis dihitung
- Jika kurang, akan muncul peringatan merah

### 6. **Melakukan Checkout**
- Klik tombol "Bayar"
- Verifikasi total, uang, dan kembalian
- Klik "Konfirmasi" untuk menyelesaikan transaksi
- Struk otomatis dicetak

### 7. **Mengubah Tema**
- Klik tombol moon/sun di header
- Tema akan berubah dengan transisi smooth
- Tema disimpan, akan tetap saat refresh

---

## 📊 Data Produk Default

| # | Nama | Kategori | Harga | Stok |
|----|------|----------|-------|------|
| 1 | Nasi Goreng | Makanan | Rp 15.000 | 20 |
| 2 | Mie Ayam | Makanan | Rp 12.000 | 15 |
| 3 | Soto Ayam | Makanan | Rp 10.000 | 25 |
| 4 | Es Teh | Minuman | Rp 5.000 | 50 |
| 5 | Kopi Hitam | Minuman | Rp 8.000 | 30 |
| 6 | Jus Mangga | Minuman | Rp 12.000 | 20 |
| 7 | Keripik Singkong | Snack | Rp 8.000 | 40 |
| 8 | Donat | Snack | Rp 6.000 | 35 |
| 9 | Pisang Goreng | Snack | Rp 7.000 | 2 |
| 10 | Charger HP | Elektronik | Rp 50.000 | 8 |
| 11 | Kabel USB | Elektronik | Rp 25.000 | 15 |
| 12 | Powerbank | Elektronik | Rp 120.000 | 5 |

---

## 🛠️ Struktur File

```
KasirAndroid/www/
├── index.html          # Struktur HTML5 (180+ baris)
├── style.css           # Styling CSS3 (1000+ baris)
├── app.js              # JavaScript (650+ baris)
└── README.md          # Dokumentasi ini
```

### **index.html**
- Header dengan logo, judul, dan tombol tema
- Section katalog produk dengan grid responsive
- Section keranjang dengan summary dan pembayaran
- Modal untuk konfirmasi transaksi
- Container untuk toast notifications
- Print section untuk struk

### **style.css**
- CSS Variables untuk theme management
- Dark & Light mode support
- Glassmorphism effects dengan backdrop-filter
- Responsive grid untuk mobile, tablet, desktop
- Smooth animations (slide, fade, transform)
- Print stylesheet untuk struk
- 100% custom, tanpa framework CSS

### **app.js**
- Class `PosApp` untuk managemen aplikasi
- LocalStorage integration
- Product filtering & rendering
- Cart management (add, remove, update qty)
- Auto calculations (subtotal, discount, tax, total)
- Change calculator dengan validation
- Toast notifications system
- Modal confirm system
- Print functionality
- Theme toggle dengan persistence

---

## 🎨 Fitur Desain

### **Glassmorphism**
```css
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.7);
border: 1px solid rgba(0, 0, 0, 0.1);
```

### **Dark & Light Mode**
```css
/* Default: Light mode */
--bg-primary: #ffffff;
--text-primary: #1a1a2e;

/* Dark mode */
.dark-mode {
    --bg-primary: #0f172a;
    --text-primary: #f1f5f9;
}
```

### **Animasi**
- **slideIn**: Produk masuk keranjang dengan slide X
- **slideToast**: Notifikasi masuk dari kanan
- **fadeIn**: Modal muncul dengan fade
- **slideUp**: Modal content masuk dari bawah
- **Smooth Transition**: Semua transisi warna & ukuran smooth

---

## 💾 LocalStorage Structure

```javascript
// Produk
localStorage.getItem('pos_products')
// [{ id, name, category, price, stock, icon }, ...]

// Transaksi
localStorage.getItem('pos_transactions')
// [{ id, timestamp, items, subtotal, discount, tax, total, payment, change }, ...]

// Settings
localStorage.getItem('pos_settings')
// { theme: 'light'|'dark', taxRate: 11, discountType: 'percent'|'nominal' }
```

---

## 📱 Responsive Breakpoints

- **Desktop (> 1200px)**: Full 2-column layout
- **Tablet (768px - 1200px)**: Stacked layout dengan keranjang flexible
- **Mobile (< 768px)**: Single column, optimized touch targets
- **Small Mobile (< 480px)**: Minimal font size, compact buttons

---

## ✨ Advanced Features

### **Real-time Search**
- Cari berdasarkan nama atau kategori produk
- Instant filtering tanpa page reload
- Clear button untuk reset search

### **Category Filtering**
- 5 kategori: Semua, Makanan, Minuman, Snack, Elektronik
- Ikon untuk setiap kategori
- Kombinasi search + category filter

### **Discount System**
- 2 mode: Persen (%) dan Nominal (Rp)
- Toggle buttons untuk switch mode
- Real-time calculation
- Pajak dihitung dari subtotal - diskon

### **Stock Management**
- Status badge: Normal, Low (< 5), Out
- Prevent oversell
- Auto deduct saat checkout
- Visual feedback untuk low stock

### **Transaction History**
- Semua transaksi disimpan dengan timestamp
- Akses via LocalStorage
- Print invoice kapan saja

---

## 🔐 Keamanan

- ✅ Client-side validation
- ✅ LocalStorage encryption (recommended untuk production)
- ✅ Input sanitization
- ✅ Error handling untuk edge cases

---

## 🚨 Testing

### **Test Case 1: Normal Transaction**
1. Tambah 2x Nasi Goreng, 1x Es Teh
2. Subtotal: Rp 35.000
3. Diskon: 10% = Rp 3.500
4. Pajak 11%: Rp 3.465
5. Total: Rp 34.965
6. Bayar: Rp 50.000 → Kembalian: Rp 15.035

### **Test Case 2: Low Stock**
1. Pisang Goreng stok 2, beli 3
2. Aplikasi mencegah (show warning)

### **Test Case 3: Dark Mode**
1. Klik tombol moon
2. Tema berubah ke dark
3. Refresh - tema tetap dark (dari localStorage)

### **Test Case 4: Print**
1. Lakukan transaksi
2. Klik tombol "Cetak"
3. Print preview tampil dengan format struk thermal

---

## 🎯 Specifikasi Teknis

- **HTML5**: Semantic markup
- **CSS3**: Modern features (Grid, Flexbox, Backdrop Filter)
- **JavaScript**: ES6+ (Classes, Arrow Functions, Template Literals)
- **LocalStorage**: Persistent client-side storage
- **No External Framework**: Pure vanilla implementations
- **CDN Icons**: FontAwesome 6.4.0
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest)

---

## 📚 Struktur Kode

### **PosApp Class Methods**
```javascript
// Storage
loadFromStorage()
saveToStorage()

// Products
initializeDefaultProducts()
renderProducts()
filterProducts()
filterByCategory()
getCategoryLabel()

// Cart
addToCart()
removeFromCart()
updateQuantity()
updateCart()
renderCart()
clearCart()

// Calculations
calculateTotals()
getSubtotal()
getDiscount()
calculateChange()

// Checkout
checkout()
processCheckout()
printReceipt()

// UI
toggleTheme()
applyTheme()
showToast()
showConfirmModal()
formatCurrency()

// Events
setupEventListeners()
```

---

## 🎓 Tips & Tricks

1. **Shortcut Print**: Tekan Ctrl+P setelah checkout untuk print langsung
2. **Dark Mode Produktif**: Gunakan dark mode untuk mengurangi eye strain
3. **Fast Quantity**: Double-click kategori untuk reset filter
4. **Keyboard**: Tab untuk navigate, Enter untuk submit
5. **Mobile Friendly**: Optimized untuk cashier dengan touch screen

---

## 🔄 Update & Maintenance

Untuk menambah produk baru, edit array `this.products` di `app.js`:

```javascript
{
    id: 13,
    name: 'Produk Baru',
    category: 'kategori',
    price: 10000,
    stock: 10,
    icon: '🍕'
}
```

---

## 📞 Support & Contact

Jika ada pertanyaan atau masalah, silakan check:
- Browser console (F12) untuk error messages
- LocalStorage (DevTools → Application → Storage)
- Verifikasi format data di JSON

---

## 📄 License

Free to use dan modify. Created for educational & commercial purposes.

---

**Happy Selling! 🎉**

*Aplikasi ini dibuat dengan ❤️ menggunakan HTML5, CSS3, dan Vanilla JavaScript.*
