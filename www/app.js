/* ============================================
   KASIR POS - JAVASCRIPT APP
   Complete POS System with Advanced Features
   ============================================ */

// ============ DATA MANAGEMENT ============
class PosApp {
    constructor() {
        // Initialize data structures
        this.products = [];
        this.cart = [];
        this.transactions = [];
        this.settings = {
            theme: 'light',
            taxRate: 11,
            discountType: 'percent',
            paymentMethod: 'cash'
        };
        this.html5QrCode = null;
        this._scannerRunning = false;
        this._scannerMode = 'product';
        this.cameraFacingMode = 'environment';
        this.pinInput = '';
        this.currentEditingProductId = null;
        this.productFormImageData = null;

        // Initialize app
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.initializeDefaultProducts();
        this.setupEventListeners();
        this.renderProducts();
        this.applyTheme();
        
        // Initialize Android camera permissions on app startup
        this.initializeCameraPermissions();
    }

    // ============ CAMERA PERMISSIONS INITIALIZATION ============
    async initializeCameraPermissions() {
        // Check and prepare camera permissions on Android during app initialization
        if (typeof CapacitorPlugins !== 'undefined' && CapacitorPlugins.Permissions) {
            try {
                // Just query the permission status without requesting (less intrusive)
                const status = await CapacitorPlugins.Permissions.query({ name: 'Camera' });
                console.log('Camera permission status on app start:', status.state);
            } catch (err) {
                console.log('Camera permission initialization: Capacitor not fully ready', err);
            }
        }
    }

    // ============ STORAGE MANAGEMENT ============
    loadFromStorage() {
        const savedProducts = localStorage.getItem('pos_products');
        const savedTransactions = localStorage.getItem('pos_transactions');
        const savedSettings = localStorage.getItem('pos_settings');

        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        }

        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        }

        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }

    saveToStorage() {
        localStorage.setItem('pos_products', JSON.stringify(this.products));
        localStorage.setItem('pos_transactions', JSON.stringify(this.transactions));
        localStorage.setItem('pos_settings', JSON.stringify(this.settings));
    }

    // ============ DEFAULT PRODUCTS ============
    initializeDefaultProducts() {
        if (this.products.length === 0) {
            this.products = [
                {
                    id: 1,
                    name: 'Nasi Goreng',
                    category: 'makanan',
                    price: 15000,
                    stock: 20,
                    icon: '🍚'
                },
                {
                    id: 2,
                    name: 'Mie Ayam',
                    category: 'makanan',
                    price: 12000,
                    stock: 15,
                    icon: '🍜'
                },
                {
                    id: 3,
                    name: 'Soto Ayam',
                    category: 'makanan',
                    price: 10000,
                    stock: 25,
                    icon: '🍲'
                },
                {
                    id: 4,
                    name: 'Es Teh',
                    category: 'minuman',
                    price: 5000,
                    stock: 50,
                    icon: '🧋'
                },
                {
                    id: 5,
                    name: 'Kopi Hitam',
                    category: 'minuman',
                    price: 8000,
                    stock: 30,
                    icon: '☕'
                },
                {
                    id: 6,
                    name: 'Jus Mangga',
                    category: 'minuman',
                    price: 12000,
                    stock: 20,
                    icon: '🥤'
                },
                {
                    id: 7,
                    name: 'Keripik Singkong',
                    category: 'snack',
                    price: 8000,
                    stock: 40,
                    icon: '🥔'
                },
                {
                    id: 8,
                    name: 'Donat',
                    category: 'snack',
                    price: 6000,
                    stock: 35,
                    icon: '🍩'
                },
                {
                    id: 9,
                    name: 'Pisang Goreng',
                    category: 'snack',
                    price: 7000,
                    stock: 2,
                    icon: '🍌'
                },
                {
                    id: 10,
                    name: 'Charger Hp',
                    category: 'elektronik',
                    price: 50000,
                    stock: 8,
                    icon: '🔌'
                },
                {
                    id: 11,
                    name: 'Kabel USB',
                    category: 'elektronik',
                    price: 25000,
                    stock: 15,
                    icon: '🔗'
                },
                {
                    id: 12,
                    name: 'Powerbank',
                    category: 'elektronik',
                    price: 120000,
                    stock: 5,
                    icon: '🔋'
                }
            ];

            this.saveToStorage();
        }
    }

    // ============ EVENT LISTENERS ============
    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Search
        document.getElementById('searchInput').addEventListener('input', () => this.filterProducts());
        document.getElementById('clearSearch').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            this.filterProducts();
        });

        // Manual lock button -> show PIN screen
        const manualLockBtn = document.getElementById('manualLockBtn');
        if (manualLockBtn) manualLockBtn.addEventListener('click', () => this.lockAppManual());

        // Category filter
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByCategory(e.target.closest('.category-btn')));
        });

        // Open camera scanner modal
        const openCameraBtn = document.getElementById('openCameraScanBtn');
        if (openCameraBtn) openCameraBtn.addEventListener('click', () => this.toggleCameraModal(true, 'product'));

        const cameraSwitchBtn = document.getElementById('cameraSwitchBtn');
        if (cameraSwitchBtn) cameraSwitchBtn.addEventListener('click', () => this.toggleCameraFacingDirection());

        // Product manager modal
        const manageProductsBtn = document.getElementById('manageProductsBtn');
        if (manageProductsBtn) manageProductsBtn.addEventListener('click', () => this.openProductManager());

        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveProductForm();
            });
        }

        const productImageInput = document.getElementById('productImage');
        if (productImageInput) {
            productImageInput.addEventListener('change', (e) => this.handleProductImageUpload(e));
        }

        const productManagerList = document.getElementById('productManagerList');
        if (productManagerList) {
            productManagerList.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.manager-edit-btn');
                const deleteBtn = e.target.closest('.manager-delete-btn');
                if (editBtn) {
                    const id = parseInt(editBtn.dataset.id, 10);
                    if (!Number.isNaN(id)) this.startEditProduct(id);
                }
                if (deleteBtn) {
                    const id = parseInt(deleteBtn.dataset.id, 10);
                    if (!Number.isNaN(id)) this.confirmProductDelete(id);
                }
            });
        }

        // Open set PIN modal
        const setPinBtn = document.getElementById('setPinBtn');
        if (setPinBtn) setPinBtn.addEventListener('click', () => this.openSetPinModal());

        const setPinForm = document.getElementById('setPinForm');
        if (setPinForm) {
            setPinForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                this.handlePinChange();
            });
        }

        // PIN numpad delegation
        const pinPad = document.querySelector('.pin-numpad');
        if (pinPad) {
            pinPad.addEventListener('click', (e) => {
                const numBtn = e.target.closest('[data-num]');
                if (numBtn) return this.pressPinNumber(parseInt(numBtn.dataset.num, 10));

                const actionBtn = e.target.closest('[data-action]');
                if (actionBtn) {
                    const act = actionBtn.dataset.action;
                    if (act === 'pin-clear') return this.clearPinLastDigit();
                    if (act === 'pin-submit') return this.validatePinCode();
                }
            });
        }

        // Cart actions
        document.getElementById('clearCartBtn').addEventListener('click', () => this.clearCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
        document.getElementById('printBtn').addEventListener('click', () => this.printReceipt());

        // Products grid delegation for Add to Cart
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.addEventListener('click', (e) => {
                const btn = e.target.closest('.add-to-cart-btn');
                if (btn) {
                    const id = parseInt(btn.dataset.id, 10);
                    if (!Number.isNaN(id)) this.addToCart(id);
                }
            });
        }

        // Cart item delegation for qty and delete
        const cartItems = document.getElementById('cartItems');
        if (cartItems) {
            cartItems.addEventListener('click', (e) => {
                const dec = e.target.closest('.qty-decrease');
                const inc = e.target.closest('.qty-increase');
                const del = e.target.closest('.cart-item-delete');

                if (dec) {
                    const id = parseInt(dec.dataset.id, 10);
                    if (!Number.isNaN(id)) this.updateQuantity(id, -1);
                }

                if (inc) {
                    const id = parseInt(inc.dataset.id, 10);
                    if (!Number.isNaN(id)) this.updateQuantity(id, 1);
                }

                if (del) {
                    const id = parseInt(del.dataset.id, 10);
                    if (!Number.isNaN(id)) this.removeFromCart(id);
                }
            });
        }

        // Discount input
        document.getElementById('discountInput').addEventListener('input', () => this.updateCart());

        // Discount type buttons
        document.querySelectorAll('.discount-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.discount-type-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.discount-type-btn').classList.add('active');
                this.settings.discountType = e.target.closest('.discount-type-btn').dataset.type;
                this.updateCart();
            });
        });

        // Payment input
        document.getElementById('paymentInput').addEventListener('input', () => this.calculateChange());

        const paymentPresets = document.querySelector('.payment-presets');
        if (paymentPresets) {
            paymentPresets.addEventListener('click', (e) => {
                const preset = e.target.closest('.payment-preset-btn');
                if (preset) {
                    this.setPaymentAmount(parseFloat(preset.dataset.amount));
                }
            });
        }

        const paymentMethods = document.querySelector('.payment-methods');
        if (paymentMethods) {
            paymentMethods.addEventListener('click', (e) => {
                const methodBtn = e.target.closest('.method-btn');
                if (methodBtn) {
                    this.selectPaymentMethod(methodBtn.dataset.method);
                }
            });
        }

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.renderProducts();
            this.showToast('Data diperbarui', 'info');
        });

        // Modal close (safe: close confirmModal or camera modal if present)
        document.querySelectorAll('[data-action="close"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                    if (modal.id === 'productManagerModal') this.resetProductManagerForm();
                    if (modal.id === 'setPinModal') this.resetSetPinForm();
                }
            });
        });

        // Close modal on backdrop click for all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    if (modal.id === 'productManagerModal') this.resetProductManagerForm();
                    if (modal.id === 'setPinModal') this.resetSetPinForm();
                }
            });
        });
    }

    // ============ THEME MANAGEMENT ============
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-mode');
        
        this.settings.theme = isDark ? 'dark' : 'light';
        this.saveToStorage();

        const icon = document.querySelector('#themeToggle i');
        icon.classList.remove('fa-moon', 'fa-sun');
        icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
    }

    applyTheme() {
        const body = document.body;
        const icon = document.querySelector('#themeToggle i');
        if (this.settings.theme === 'dark') {
            body.classList.add('dark-mode');
            if (icon) icon.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-mode');
            if (icon) icon.classList.add('fa-moon');
        }
    }

    // ============ PRODUCT MANAGEMENT ============
    openProductManager() {
        const modal = document.getElementById('productManagerModal');
        if (!modal) return;

        modal.classList.remove('hidden');
        this.resetProductManagerForm();
        this.renderProductManagerList();
    }

    resetProductManagerForm() {
        const form = document.getElementById('productForm');
        if (!form) return;

        form.reset();
        this.currentEditingProductId = null;
        this.productFormImageData = null;

        const header = document.querySelector('#productManagerModal .modal-header h3');
        if (header) header.textContent = 'Kelola Produk';

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Simpan Produk';
    }

    async readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async handleProductImageUpload(event) {
        const input = event.target;
        if (!input || !input.files || input.files.length === 0) {
            this.productFormImageData = null;
            return;
        }

        try {
            this.productFormImageData = await this.readFileAsDataURL(input.files[0]);
        } catch (err) {
            console.error('Gagal membaca gambar produk', err);
            this.showToast('Gagal memuat gambar produk', 'error');
            this.productFormImageData = null;
        }
    }

    renderProductManagerList() {
        const list = document.getElementById('productManagerList');
        if (!list) return;

        if (this.products.length === 0) {
            list.innerHTML = '<p class="empty-manager">Belum ada produk yang ditambahkan.</p>';
            return;
        }

        list.innerHTML = this.products.map(product => {
            const preview = product.imageBase64
                ? `<img src="${product.imageBase64}" alt="${product.name}">`
                : `<span class="manager-icon">${product.icon || this.getCategoryIcon(product.category)}</span>`;

            return `
                <div class="product-manager-item">
                    <div class="manager-image">${preview}</div>
                    <div class="manager-details">
                        <strong>${product.name}</strong>
                        <span>${this.getCategoryLabel(product.category)}</span>
                        <span>${this.formatCurrency(product.price)} | Stok ${product.stock}</span>
                    </div>
                    <div class="manager-actions">
                        <button type="button" class="btn-secondary manager-edit-btn" data-id="${product.id}">
                            <i class="fas fa-edit"></i> Ubah
                        </button>
                        <button type="button" class="btn-danger manager-delete-btn" data-id="${product.id}">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    startEditProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.currentEditingProductId = productId;
        this.productFormImageData = product.imageBase64 || null;

        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productImage').value = '';

        const header = document.querySelector('#productManagerModal .modal-header h3');
        if (header) header.textContent = 'Ubah Produk';

        const submitBtn = document.querySelector('#productForm button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Perbarui Produk';
    }

    confirmProductDelete(productId) {
        this.showConfirmModal(
            'Hapus Produk',
            'Apakah Anda yakin ingin menghapus produk ini dari daftar?',
            () => this.deleteProduct(productId)
        );
    }

    deleteProduct(productId) {
        this.products = this.products.filter(p => p.id !== productId);
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveToStorage();
        this.renderProducts();
        this.updateCart();
        this.renderProductManagerList();
        this.showToast('Produk berhasil dihapus', 'info');
    }

    async saveProductForm() {
        const name = (document.getElementById('productName').value || '').trim();
        const category = document.getElementById('productCategory').value;
        const price = parseInt(document.getElementById('productPrice').value, 10) || 0;
        const stock = parseInt(document.getElementById('productStock').value, 10) || 0;

        if (!name || price < 0 || stock < 0) {
            this.showToast('Lengkapi nama, harga, dan stok produk dengan benar', 'warning');
            return;
        }

        if (this.currentEditingProductId) {
            const existing = this.products.find(p => p.id === this.currentEditingProductId);
            if (!existing) return;

            existing.name = name;
            existing.category = category;
            existing.price = price;
            existing.stock = stock;
            if (this.productFormImageData) {
                existing.imageBase64 = this.productFormImageData;
            }
            existing.icon = existing.icon || this.getCategoryIcon(category);
            this.showToast('Produk diperbarui', 'success');
        } else {
            this.products.push({
                id: Date.now(),
                name,
                category,
                price,
                stock,
                icon: this.getCategoryIcon(category),
                imageBase64: this.productFormImageData || null
            });
            this.showToast('Produk baru ditambahkan', 'success');
        }

        this.saveToStorage();
        this.renderProducts();
        this.renderProductManagerList();
        this.resetProductManagerForm();
    }

    getCategoryIcon(category) {
        const icons = {
            makanan: '🍽️',
            minuman: '🥤',
            snack: '🍪',
            elektronik: '🔌'
        };
        return icons[category] || '📦';
    }

    openSetPinModal() {
        const modal = document.getElementById('setPinModal');
        if (!modal) return;

        modal.classList.remove('hidden');
        this.resetSetPinForm();
    }

    resetSetPinForm() {
        const inputIds = ['oldPinInput', 'newPinInput', 'confirmPinInput'];
        inputIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
        const error = document.getElementById('setPinErrorMessage');
        if (error) {
            error.textContent = '';
            error.classList.add('hidden');
        }
    }

    handlePinChange() {
        const oldPin = document.getElementById('oldPinInput').value.trim();
        const newPin = document.getElementById('newPinInput').value.trim();
        const confirmPin = document.getElementById('confirmPinInput').value.trim();
        const currentPin = this.settings.pinCode || '1234';
        const error = document.getElementById('setPinErrorMessage');

        if (!oldPin || oldPin.length !== 4) {
            if (error) {
                error.textContent = 'Masukkan PIN lama 4 digit.';
                error.classList.remove('hidden');
            }
            return;
        }

        if (oldPin !== currentPin) {
            if (error) {
                error.textContent = 'PIN lama tidak sesuai.';
                error.classList.remove('hidden');
            }
            return;
        }

        if (!newPin || newPin.length !== 4) {
            if (error) {
                error.textContent = 'Masukkan PIN baru 4 digit.';
                error.classList.remove('hidden');
            }
            return;
        }

        if (newPin !== confirmPin) {
            if (error) {
                error.textContent = 'Konfirmasi PIN tidak cocok.';
                error.classList.remove('hidden');
            }
            return;
        }

        this.settings.pinCode = newPin;
        this.saveToStorage();
        this.showToast('PIN berhasil diperbarui', 'success');

        const modal = document.getElementById('setPinModal');
        if (modal) modal.classList.add('hidden');
    }

        // ============ PIN + LOCK SCREEN ============
        lockAppManual() {
            document.getElementById('pinScreen').classList.remove('hidden');
            document.getElementById('mainAppWrapper').classList.add('hidden');
            this.pinInput = '';
            this.updatePinDots();
        }

        pressPinNumber(num) {
            if (!this.pinInput) this.pinInput = '';
            if (String(this.pinInput).length >= 4) return;
            this.pinInput += String(num);
            this.updatePinDots();
        }

        clearPinLastDigit() {
            if (!this.pinInput) return;
            this.pinInput = String(this.pinInput).slice(0, -1);
            this.updatePinDots();
        }

        validatePinCode() {
            const correct = (this.settings.pinCode || '1234');
            if (String(this.pinInput) === String(correct)) {
                document.getElementById('pinScreen').classList.add('hidden');
                document.getElementById('mainAppWrapper').classList.remove('hidden');
                this.pinInput = '';
                this.updatePinDots();
                this.showToast('Akses diterima', 'success');
            } else {
                const err = document.getElementById('pinErrorMessage');
                if (err) {
                    err.classList.remove('hidden');
                    setTimeout(() => err.classList.add('hidden'), 1500);
                }
                this.pinInput = '';
                this.updatePinDots();
            }
        }

        updatePinDots() {
            const dots = document.querySelectorAll('.pin-dot');
            const len = this.pinInput ? this.pinInput.length : 0;
            dots.forEach((d, i) => {
                d.classList.toggle('filled', i < len);
            });
        }

        // ============ CAMERA MODAL ============
        toggleCameraModal(open = false, mode = 'product') {
            const modal = document.getElementById('cameraScannerModal');
            if (!modal) return;
            this._scannerMode = open ? mode : 'product';
            if (open) {
                modal.classList.remove('hidden');
                this.updateCameraModalText();
                this.startScanner();
            } else {
                modal.classList.add('hidden');
                this.stopScanner();
            }
        }

        updateCameraModalText() {
            const title = document.getElementById('cameraModalTitle');
            const hint = document.getElementById('cameraModalHint');

            if (title) {
                title.innerHTML = `<i class="fas fa-qrcode"></i> ${this._scannerMode === 'payment' ? 'Scan Pembayaran QR' : 'Kamera Pemindai'}`;
            }

            if (hint) {
                hint.textContent = this._scannerMode === 'payment'
                    ? 'Arahkan QR pembayaran ke kamera untuk mengisi jumlah uang.'
                    : 'Dekatkan Barcode/QR Code produk ke dalam sorotan kamera.';
            }

            this.updateCameraSwitchButton();
        }

        async requestCameraPermission() {
            // Try native Android plugin first (best for Android)
            if (typeof CapacitorPlugins !== 'undefined' && CapacitorPlugins.CameraPermissionHandler) {
                try {
                    const result = await CapacitorPlugins.CameraPermissionHandler.requestCameraPermission();
                    
                    if (result.granted) {
                        this.showToast(result.message, 'success');
                        return true;
                    } else {
                        this.showToast(result.message, 'error');
                        return false;
                    }
                } catch (err) {
                    console.log('Native camera permission plugin unavailable, using fallback', err);
                }
            }

            // Try Capacitor Permissions API
            if (typeof CapacitorPlugins !== 'undefined' && CapacitorPlugins.Permissions) {
                try {
                    const status = await CapacitorPlugins.Permissions.query({ name: 'Camera' });
                    
                    if (status.state === 'prompt') {
                        const result = await CapacitorPlugins.Permissions.request({ name: 'Camera' });
                        if (result.state === 'granted') {
                            this.showToast('Izin kamera diberikan', 'success');
                            return true;
                        } else {
                            this.showToast('Izin kamera ditolak oleh pengguna', 'error');
                            return false;
                        }
                    } else if (status.state === 'granted') {
                        return true;
                    } else if (status.state === 'denied') {
                        this.showToast('Izin kamera ditolak. Aktifkan di pengaturan aplikasi.', 'error');
                        return false;
                    }
                } catch (err) {
                    console.log('Capacitor permission check failed, fallback to Web API', err);
                }
            }

            // Fallback to Web API (for browser and non-Capacitor environments)
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showToast('Perangkat tidak mendukung akses kamera', 'error');
                return false;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                });
                
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    this.showToast('Akses kamera diperoleh', 'success');
                    return true;
                }
            } catch (err) {
                console.error('Camera permission request failed:', err);
                
                // Provide helpful error message based on error type
                if (err.name === 'NotAllowedError') {
                    this.showToast('Izin kamera ditolak. Cek pengaturan privasi aplikasi.', 'error');
                } else if (err.name === 'NotFoundError' || err.name === 'DeviceNotFoundError') {
                    this.showToast('Kamera tidak ditemukan di perangkat', 'error');
                } else if (err.name === 'NotReadableError' || err.name === 'SecurityError') {
                    this.showToast('Kamera sedang digunakan aplikasi lain atau tidak dapat diakses', 'error');
                } else {
                    this.showToast('Gagal mengakses kamera: ' + err.message, 'error');
                }
                
                return false;
            }
        }

        async startScanner() {
            if (this._scannerRunning) return;

            const permissionGranted = await this.requestCameraPermission();
            if (!permissionGranted) return;

            // create Html5Qrcode instance if needed
            if (!this.html5QrCode) {
                try {
                    this.html5QrCode = new Html5Qrcode("cameraLiveEngine");
                } catch (e) {
                    console.error('html5-qrcode init error', e);
                    this.showToast('Gagal inisialisasi kamera', 'error');
                    return;
                }
            }

            Html5Qrcode.getCameras().then(cameras => {
                if (!cameras || cameras.length === 0) {
                    this.showToast('Kamera tidak ditemukan', 'error');
                    return;
                }

                const camera = this.selectCameraByFacing(cameras, this.cameraFacingMode);
                const cameraId = camera ? camera.id : cameras[0].id;
                const config = { fps: 10, qrbox: 250 };

                this.html5QrCode.start(
                    cameraId,
                    config,
                    (decodedText, decodedResult) => {
                        this.handleScanSuccess(decodedText);
                    },
                    (errorMessage) => {
                        // ignore intermittent scan errors
                    }
                ).then(() => {
                    this._scannerRunning = true;
                }).catch(err => {
                    console.error('start scanner error', err);
                    this.showToast('Gagal memulai kamera', 'error');
                });
            }).catch(err => {
                console.error('getCameras error', err);
                this.showToast('Tidak dapat mengakses kamera', 'error');
            });
        }

        stopScanner() {
            if (!this.html5QrCode) return Promise.resolve();
            return this.html5QrCode.stop().then(() => {
                try { this.html5QrCode.clear(); } catch (e) {}
                this._scannerRunning = false;
            }).catch(err => {
                this._scannerRunning = false;
            });
        }

        async toggleCameraFacingDirection() {
            this.cameraFacingMode = this.cameraFacingMode === 'environment' ? 'user' : 'environment';
            this.updateCameraSwitchButton();
            this.showToast(`Menggunakan kamera ${this.cameraFacingMode === 'user' ? 'depan' : 'belakang'}`, 'info');

            if (this._scannerRunning) {
                await this.stopScanner();
                await this.startScanner();
            }
        }

        updateCameraSwitchButton() {
            const btn = document.getElementById('cameraSwitchBtn');
            if (!btn) return;
            btn.innerHTML = `${this.cameraFacingMode === 'user' ? '<i class="fas fa-camera"></i> Depan' : '<i class="fas fa-camera-retro"></i> Belakang'}`;
        }

        selectCameraByFacing(cameras, facing) {
            if (!cameras || cameras.length === 0) return null;

            const lower = facing.toLowerCase();
            const frontMatch = cameras.find(c => /front|user|selfie/i.test(c.label));
            const rearMatch = cameras.find(c => /back|rear|environment|wide/i.test(c.label));

            if (lower === 'user') {
                return frontMatch || cameras[0];
            }

            return rearMatch || cameras[0];
        }

        handleScanSuccess(decodedText) {
            if (!decodedText) return;

            if (this._scannerMode === 'payment') {
                const amount = this.parsePaymentAmount(decodedText);
                if (amount > 0) {
                    this.setPaymentAmount(amount);
                    this.toggleCameraModal(false);
                    const { total } = this.calculateTotals();
                    const change = amount - total;
                    this.showToast(
                        `Pembayaran QR diterima: ${this.formatCurrency(amount)}${change < 0 ? ' (Uang kurang)' : ''}`,
                        change < 0 ? 'warning' : 'success'
                    );
                    return;
                }
                this.showToast('QR tidak valid untuk pembayaran', 'error');
                return;
            }

            // Try to match numeric id first
            const numeric = parseInt(decodedText, 10);
            if (!Number.isNaN(numeric)) {
                const prod = this.products.find(p => p.id === numeric);
                if (prod) {
                    this.addToCart(prod.id);
                    this.toggleCameraModal(false);
                    return;
                }
            }

            // Otherwise, put into search and filter
            const inp = document.getElementById('searchInput');
            if (inp) inp.value = decodedText;
            this.filterProducts();

            // keep scanner running so user can scan again
            this.showToast(`Ter-scan: ${decodedText}`, 'info');
        }

        // ============ UTIL: RESET / SEARCH HELPERS ============
        resetAppCatalog() {
            this.renderProducts();
            this.showToast('Katalog direset', 'info');
        }

        clearProductSearch() {
            const inp = document.getElementById('searchInput');
            if (inp) inp.value = '';
            this.filterProducts();
    }

    // ============ PRODUCT FILTERING ============
    filterProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;

        const filtered = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.category.toLowerCase().includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
            return matchesSearch && matchesCategory;
        });

        this.renderProducts(filtered);
    }

    filterByCategory(btn) {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterProducts();
    }

    // ============ PRODUCT RENDERING ============
    renderProducts(products = this.products) {
        const grid = document.getElementById('productsGrid');
        
        if (products.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-tertiary); padding: 2rem;">Tidak ada produk</p>';
            return;
        }

        grid.innerHTML = products.map(product => {
            const stockStatus = product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : '';
            const stockLabel = product.stock === 0 ? 'Habis' : product.stock < 5 ? `Sisa ${product.stock}` : `Stok ${product.stock}`;
            const imageMarkup = product.imageBase64
                ? `<img src="${product.imageBase64}" alt="${product.name}">`
                : product.icon;

            return `
                <div class="product-card">
                    <div class="product-image">${imageMarkup}</div>
                    <div class="product-name">${product.name}</div>
                    <span class="product-category">${this.getCategoryLabel(product.category)}</span>
                    <div class="product-info">
                        <span class="product-price">${this.formatCurrency(product.price)}</span>
                        <span class="product-stock ${stockStatus}">${stockLabel}</span>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}" 
                            ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Tambah
                    </button>
                </div>
            `;
        }).join('');
    }

    getCategoryLabel(category) {
        const labels = {
            makanan: '🍽️ Makanan',
            minuman: '🥤 Minuman',
            snack: '🍪 Snack',
            elektronik: '🔌 Elektronik'
        };
        return labels[category] || category;
    }

    // ============ CART MANAGEMENT ============
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);

        if (!product) return;

        if (product.stock === 0) {
            this.showToast('Stok produk habis!', 'error');
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                this.showToast('Stok tidak cukup!', 'warning');
                return;
            }
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                icon: product.icon
            });
        }

        this.showToast(`${product.name} ditambahkan ke keranjang`, 'success');
        this.updateCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCart();
        this.showToast('Produk dihapus dari keranjang', 'info');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(i => i.id === productId);
        if (!item) return;

        const product = this.products.find(p => p.id === productId);
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        if (newQuantity > product.stock) {
            this.showToast('Stok tidak cukup!', 'warning');
            return;
        }

        item.quantity = newQuantity;
        this.updateCart();
    }

    updateCart() {
        this.renderCart();
        this.calculateTotals();
        this.calculateChange();
    }

    renderCart() {
        const cartContainer = document.getElementById('cartItems');

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang kosong</p>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => {
            const subtotal = item.price * item.quantity;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${this.formatCurrency(item.price)}</div>
                        <div class="cart-item-subtotal">Subtotal: ${this.formatCurrency(subtotal)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-decrease" data-id="${item.id}">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-increase" data-id="${item.id}">+</button>
                        <button class="cart-item-delete" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showToast('Keranjang sudah kosong', 'info');
            return;
        }

        this.showConfirmModal(
            'Kosongkan Keranjang?',
            'Apakah Anda yakin ingin menghapus semua item dari keranjang?',
            () => {
                this.cart = [];
                this.updateCart();
                this.showToast('Keranjang dikosongkan', 'success');
            }
        );
    }

    // ============ CALCULATIONS ============
    calculateTotals() {
        const subtotal = this.getSubtotal();
        const discountValue = this.getDiscount();
        const taxBase = subtotal - discountValue;
        const tax = Math.round(taxBase * (this.settings.taxRate / 100));
        const total = taxBase + tax;

        // Update display
        document.getElementById('subtotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('discountAmount').textContent = this.formatCurrency(discountValue);
        document.getElementById('tax').textContent = this.formatCurrency(tax);
        document.getElementById('total').textContent = this.formatCurrency(total);

        return { subtotal, discountValue, tax, total };
    }

    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getDiscount() {
        const input = parseFloat(document.getElementById('discountInput').value) || 0;
        const subtotal = this.getSubtotal();

        if (this.settings.discountType === 'percent') {
            return Math.round(subtotal * (input / 100));
        } else {
            return input;
        }
    }

    calculateChange() {
        const paymentInput = parseFloat(document.getElementById('paymentInput').value) || 0;
        const { total } = this.calculateTotals();
        const change = paymentInput - total;

        const changeDisplay = document.getElementById('changeDisplay');
        const changeSpan = changeDisplay.querySelector('span:first-child');
        const warningSpan = document.getElementById('changeWarning');

        changeSpan.textContent = this.formatCurrency(change);

        if (change < 0) {
            changeSpan.style.color = 'var(--color-danger)';
            warningSpan.textContent = '⚠ Uang kurang';
            warningSpan.style.display = 'block';
        } else {
            changeSpan.style.color = 'var(--color-success)';
            warningSpan.textContent = '';
            warningSpan.style.display = 'none';
        }
    }

    setPaymentAmount(amount) {
        const inputEl = document.getElementById('paymentInput');
        if (!inputEl) return;

        inputEl.value = amount;
        this.calculateChange();
    }

    parsePaymentAmount(value) {
        if (!value) return 0;
        const digits = value.toString().replace(/[^0-9]/g, '');
        const amount = parseInt(digits, 10);
        return Number.isFinite(amount) ? amount : 0;
    }

    selectPaymentMethod(method) {
        const methods = document.querySelectorAll('.method-btn');
        methods.forEach(btn => btn.classList.toggle('active', btn.dataset.method === method));
        this.settings.paymentMethod = method;
        this.saveToStorage();

        if (method === 'scan') {
            this.toggleCameraModal(true, 'payment');
            this.showToast('Pindai QR pembayaran untuk mengisi jumlah bayar', 'info');
        }
    }

    // ============ CHECKOUT & PRINT ============
    checkout() {
        const { total } = this.calculateTotals();
        const paymentInput = parseFloat(document.getElementById('paymentInput').value) || 0;

        if (this.cart.length === 0) {
            this.showToast('Keranjang kosong!', 'warning');
            return;
        }

        if (paymentInput < total) {
            this.showToast('Uang tidak cukup!', 'error');
            return;
        }

        this.showConfirmModal(
            'Konfirmasi Pembayaran',
            `Total: ${this.formatCurrency(total)}\nUang: ${this.formatCurrency(paymentInput)}\nKembalian: ${this.formatCurrency(paymentInput - total)}\n\nLanjutkan pembayaran?`,
            () => {
                this.processCheckout();
            }
        );
    }

    processCheckout() {
        const { total, subtotal, discountValue, tax } = this.calculateTotals();
        const paymentInput = parseFloat(document.getElementById('paymentInput').value) || 0;
        const change = paymentInput - total;

        // Deduct stock
        this.cart.forEach(item => {
            const product = this.products.find(p => p.id === item.id);
            if (product) {
                product.stock -= item.quantity;
            }
        });

        // Record transaction
        const transaction = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            items: [...this.cart],
            subtotal,
            discount: discountValue,
            tax,
            total,
            payment: paymentInput,
            change
        };

        this.transactions.push(transaction);
        this.saveToStorage();

        // Reset cart and inputs
        this.cart = [];
        document.getElementById('paymentInput').value = '';
        document.getElementById('discountInput').value = '';

        this.updateCart();
        this.renderProducts();

        this.showToast('Transaksi berhasil!', 'success');
        
        // Auto print
        setTimeout(() => {
            this.printReceipt(transaction);
        }, 500);
    }

    printReceipt(transaction = null) {
        if (!transaction && this.transactions.length > 0) {
            transaction = this.transactions[this.transactions.length - 1];
        }

        if (!transaction) {
            this.showToast('Tidak ada transaksi untuk dicetak', 'warning');
            return;
        }

        // Populate existing print section elements first
        const receiptBody = document.getElementById('receiptItemsBody');
        if (receiptBody) {
            receiptBody.innerHTML = transaction.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">${this.formatCurrency(item.price)}</td>
                    <td style="text-align: right;">${this.formatCurrency(item.price * item.quantity)}</td>
                </tr>
            `).join('');
        }

        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        setText('receiptSubtotal', this.formatCurrency(transaction.subtotal));
        setText('receiptTax', this.formatCurrency(transaction.tax));
        setText('receiptTotal', this.formatCurrency(transaction.total));
        setText('receiptPayment', this.formatCurrency(transaction.payment));
        setText('receiptChange', this.formatCurrency(transaction.change));

        const createdAt = transaction.timestamp ? new Date(transaction.timestamp) : new Date();
        const dateText = createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
        const timeText = createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const printedAt = new Date().toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setText('receiptNumber', transaction.id);
        setText('receiptDate', dateText);
        setText('receiptTime', timeText);
        setText('receiptPrintedAt', `Dicetak: ${printedAt}`);
        setText('receiptCashier', this.settings.cashierName || 'Admin');

        // Show/hide discount row
        const discountRow = document.getElementById('receiptDiscountRow');
        if (discountRow) {
            if (transaction.discount > 0) {
                discountRow.style.display = 'flex';
                setText('receiptDiscount', this.formatCurrency(transaction.discount));
            } else {
                discountRow.style.display = 'none';
            }
        }

        // Try native print first. If running inside environments where window.print is not available
        // (some WebView/Capacitor contexts), open a new window fallback that contains minimal receipt HTML
        // and call print there.

        const printSection = document.getElementById('printSection');
        if (printSection) printSection.style.display = 'block';

        const minimalStyles = `
            <style>
                body{font-family:Arial, Helvetica, sans-serif;color:#000}
                .receipt{width:80mm;padding:8px}
                .receipt-header{text-align:center;margin-bottom:8px}
                table{width:100%;border-collapse:collapse;font-size:12px}
                td,th{padding:4px 0}
                .receipt-row{display:flex;justify-content:space-between}
                .total{font-weight:700}
            </style>`;

        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Struk</title>${minimalStyles}</head><body>` +
            (printSection ? printSection.innerHTML : '') +
            `</body></html>`;

        // Attempt window.print(), but also use fallback window for environments where print is blocked
        try {
            window.print();
            // restore visibility after print
            if (printSection) printSection.style.display = '';
        } catch (e) {
            // fallback: open new window and print
            try {
                const w = window.open('', '_blank');
                if (w) {
                    w.document.open();
                    w.document.write(html);
                    w.document.close();
                    w.focus();
                    // small timeout to allow rendering
                    setTimeout(() => {
                        try { w.print(); } catch (err) { console.error('print fallback failed', err); }
                        setTimeout(() => { try { w.close(); } catch (e) {} }, 500);
                    }, 400);
                } else {
                    this.showToast('Gagal membuka jendela cetak. Gunakan fitur cetak perangkat.', 'error');
                }
            } catch (err) {
                console.error('fallback print error', err);
                this.showToast('Gagal mencetak struk', 'error');
            } finally {
                if (printSection) printSection.style.display = '';
            }
        }
    }

    // ============ UTILITIES ============
    formatCurrency(value) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showConfirmModal(title, message, onConfirm) {
        const modal = document.getElementById('confirmModal');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;

        const confirmBtn = document.getElementById('modalConfirmBtn');
        const closeBtn = modal.querySelector('[data-action="close"]');

        const handleConfirm = () => {
            onConfirm();
            modal.classList.add('hidden');
            confirmBtn.removeEventListener('click', handleConfirm);
        };

        confirmBtn.onclick = handleConfirm;
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.add('hidden');
        }

        modal.classList.remove('hidden');
    }
}

// ============ INITIALIZE APP ============
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PosApp();
});

