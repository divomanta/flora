/**
 * FLORA | Botanical Artistry - Core Application Engine
 * High-Fashion Editorial Experience with Interactive Flora Studio
 */

(function () {
    'use strict';

    // Application State
    const state = {
        currentView: 'home',
        activeFilter: 'всички',
        searchQuery: '',
        sortBy: 'featured',
        favorites: JSON.parse(localStorage.getItem('flora_favorites') || '[]'),
        selectedProduct: null
    };

    // DOM Elements Cache
    const elements = {
        overlayMenu: document.getElementById('overlayMenu'),
        header: document.querySelector('header'),
        menuToggleBtn: document.getElementById('menuToggleBtn'),
        editorialGrid: document.getElementById('editorial-grid'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        searchInput: document.getElementById('catalog-search'),
        sortSelect: document.getElementById('catalog-sort'),
        productCount: document.getElementById('product-count'),
        orderForm: document.getElementById('order-form'),
        productSelect: document.getElementById('product-select'),
        dateInput: document.getElementById('order-date'),
        productModal: document.getElementById('product-modal'),
        modalContent: document.getElementById('modal-product-content'),
        favoritesDrawer: document.getElementById('favorites-drawer'),
        favoritesList: document.getElementById('favorites-list'),
        favoritesCount: document.getElementById('favorites-count'),
        toast: document.getElementById('flora-toast'),
        toastMessage: document.getElementById('toast-message'),
        confirmationModal: document.getElementById('confirmation-modal'),
        confirmationDetails: document.getElementById('confirmation-details')
    };

    // Initialize Application
    function init() {
        populateProductDropdown();
        setupDatePicker();
        renderCatalog();
        updateFavoritesBadge();
        bindEvents();
        handleInitialRouting();
    }

    // Routing & Views
    function switchView(viewId, triggerHash = true) {
        const targetView = document.getElementById(`view-${viewId}`);
        if (!targetView) return;

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Activate target view
        targetView.classList.add('active');
        state.currentView = viewId;

        // Update browser URL hash if requested
        if (triggerHash) {
            window.location.hash = viewId;
        }

        // Close menu if open
        closeMenu();

        // Smooth scroll to top of view
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Extra logic based on view
        if (viewId === 'catalog') {
            renderCatalog();
        }
    }

    function handleInitialRouting() {
        const hash = window.location.hash.replace('#', '');
        if (hash && ['home', 'catalog', 'about', 'contact'].includes(hash)) {
            switchView(hash, false);
        } else {
            switchView('home', false);
        }

        // Check if direct product query is in URL: ?id=X
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (productId) {
            const product = FLORA_PRODUCTS.find(p => p.id === parseInt(productId, 10));
            if (product) {
                openProductModal(product);
            }
        }
    }

    // Overlay Menu Control
    function toggleMenu() {
        if (!elements.overlayMenu) return;
        const isOpen = elements.overlayMenu.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        if (!elements.overlayMenu) return;
        elements.overlayMenu.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (elements.header) {
            elements.header.style.mixBlendMode = 'normal';
            elements.header.style.color = '#F4F0EB';
        }
    }

    function closeMenu() {
        if (!elements.overlayMenu) return;
        elements.overlayMenu.classList.remove('active');
        document.body.style.overflow = '';

        if (elements.header) {
            setTimeout(() => {
                elements.header.style.mixBlendMode = 'difference';
                elements.header.style.color = '#FFFFFF';
            }, 300);
        }
    }

    // Catalog Rendering & Filtering
    function renderCatalog() {
        if (!elements.editorialGrid) return;

        // Filter products
        let filtered = FLORA_PRODUCTS.filter(product => {
            const matchesCategory = state.activeFilter === 'всички' || product.category === state.activeFilter;
            const query = state.searchQuery.toLowerCase().trim();
            const matchesSearch = !query ||
                product.name.toLowerCase().includes(query) ||
                product.subtitle.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                (product.botanicalNotes && product.botanicalNotes.some(note => note.toLowerCase().includes(query)));

            return matchesCategory && matchesSearch;
        });

        // Sort products
        if (state.sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (state.sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (state.sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name, 'bg'));
        }

        // Update count
        if (elements.productCount) {
            elements.productCount.textContent = `(${filtered.length} ${filtered.length === 1 ? 'експонат' : 'произведения'})`;
        }

        // Empty state
        if (filtered.length === 0) {
            elements.editorialGrid.innerHTML = `
                <div class="col-span-12 py-20 text-center">
                    <p class="font-serif italic text-2xl text-flora-taupe mb-4">Няма открити цветя по тези критерии.</p>
                    <button class="btn-reset-filter text-xs tracking-widest uppercase border-b border-flora-dark pb-1 hover:text-flora-sage transition-colors">
                        Изчисти филтрите
                    </button>
                </div>
            `;
            const resetBtn = elements.editorialGrid.querySelector('.btn-reset-filter');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    state.activeFilter = 'всички';
                    state.searchQuery = '';
                    if (elements.searchInput) elements.searchInput.value = '';
                    updateFilterButtonUI();
                    renderCatalog();
                });
            }
            return;
        }

        // Render Asymmetric Editorial Grid
        let html = '';
        filtered.forEach((product, index) => {
            const isFav = state.favorites.includes(product.id);
            // Asymmetric grid column staggering classes
            const mod = index % 3;
            let staggerClass = 'col-span-12 md:col-span-6 lg:editorial-col-stagger-1';
            if (mod === 1) staggerClass = 'col-span-12 md:col-span-6 lg:editorial-col-stagger-2';
            if (mod === 2) staggerClass = 'col-span-12 md:col-span-8 lg:editorial-col-stagger-3';

            html += `
                <article class="edgy-card group flex flex-col gap-3 ${staggerClass}" data-id="${product.id}">
                    <div class="relative edgy-img-wrapper aspect-[3/4] cursor-pointer" onclick="window.FloraApp.openProductModalById(${product.id})">
                        <img 
                            src="${product.image}" 
                            alt="${product.name}" 
                            loading="lazy" 
                            class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0"
                            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1508759073847-927b7c2cc0ba?q=80&w=1000&auto=format&fit=crop';"
                        />
                        ${product.badge ? `
                            <span class="absolute top-4 left-4 bg-flora-dark/80 backdrop-blur-sm text-flora-base text-[10px] uppercase tracking-mega px-3 py-1 font-sans">
                                ${product.badge}
                            </span>
                        ` : ''}

                        <button 
                            type="button" 
                            onclick="event.stopPropagation(); window.FloraApp.toggleFavorite(${product.id});" 
                            class="absolute top-4 right-4 w-9 h-9 rounded-full bg-flora-base/90 backdrop-blur-md flex items-center justify-center text-flora-dark hover:scale-110 transition-transform shadow-sm"
                            title="${isFav ? 'Премахни от любими' : 'Добави в любими'}"
                        >
                            <i class="${isFav ? 'fa-solid text-red-600' : 'fa-regular'} fa-heart text-xs"></i>
                        </button>

                        <div class="absolute inset-0 bg-gradient-to-t from-flora-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <span class="text-flora-base text-xs font-sans uppercase tracking-widest border-b border-flora-base/60 pb-1">
                                Разгледай детайли &rarr;
                            </span>
                        </div>
                    </div>

                    <div class="meta pt-3 border-t border-flora-dark/20 flex flex-col gap-1">
                        <div class="flex justify-between items-baseline gap-4">
                            <h3 class="font-serif italic text-xl md:text-2xl text-flora-dark group-hover:text-flora-sage transition-colors cursor-pointer" onclick="window.FloraApp.openProductModalById(${product.id})">
                                ${product.name}
                            </h3>
                            <span class="font-sans text-xs tracking-widest uppercase font-medium text-flora-dark whitespace-nowrap">
                                ${product.price.toFixed(2)} ${product.currency}
                            </span>
                        </div>
                        <p class="text-xs text-flora-taupe line-clamp-1 font-sans">
                            ${product.subtitle}
                        </p>
                        <div class="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-flora-dark/10">
                            <span class="text-[10px] uppercase tracking-ultra text-flora-taupe">
                                ${product.categoryLabel}
                            </span>
                            <button 
                                type="button" 
                                onclick="window.FloraApp.orderProductDirectly(${product.id})" 
                                class="text-[11px] uppercase tracking-widest font-sans font-medium text-flora-dark hover:text-flora-sage hover-draw pb-0.5"
                            >
                                Поръчай &rarr;
                            </button>
                        </div>
                    </div>
                </article>
            `;
        });

        elements.editorialGrid.innerHTML = html;
    }

    function updateFilterButtonUI() {
        elements.filterButtons.forEach(btn => {
            const filter = btn.getAttribute('data-filter') || btn.textContent.trim().toLowerCase();
            if (filter === state.activeFilter) {
                btn.classList.add('active', 'text-flora-dark');
                btn.classList.remove('text-flora-taupe');
            } else {
                btn.classList.remove('active', 'text-flora-dark');
                btn.classList.add('text-flora-taupe');
            }
        });
    }

    // Product Quick-View Modal
    function openProductModal(product) {
        if (!elements.productModal || !elements.modalContent || !product) return;
        state.selectedProduct = product;

        const isFav = state.favorites.includes(product.id);
        const botanicalList = (product.botanicalNotes || [])
            .map(note => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-flora-sage"></span><span class="italic font-serif">${note}</span></li>`)
            .join('');

        elements.modalContent.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div class="lg:col-span-6 relative aspect-[3/4] bg-flora-card overflow-hidden">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}" 
                        class="w-full h-full object-cover"
                        onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1508759073847-927b7c2cc0ba?q=80&w=1000&auto=format&fit=crop';"
                    />
                    ${product.badge ? `
                        <span class="absolute top-4 left-4 bg-flora-dark text-flora-base text-[10px] uppercase tracking-widest px-3 py-1">
                            ${product.badge}
                        </span>
                    ` : ''}
                </div>

                <div class="lg:col-span-6 flex flex-col gap-6">
                    <div>
                        <span class="text-[11px] uppercase tracking-mega text-flora-taupe block mb-1">
                            ${product.categoryLabel} &bull; Каталог № ${product.id}
                        </span>
                        <h2 class="font-serif italic text-3xl md:text-4xl text-flora-dark mb-2">
                            ${product.name}
                        </h2>
                        <p class="text-sm font-sans text-flora-taupe italic">
                            ${product.subtitle}
                        </p>
                    </div>

                    <div class="flex items-baseline gap-4 py-3 border-y border-flora-dark/10">
                        <span class="font-serif text-3xl text-flora-dark">
                            ${product.price.toFixed(2)} <span class="text-sm font-sans uppercase">${product.currency}</span>
                        </span>
                        <span class="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                            Налично за изработка / поръчка
                        </span>
                    </div>

                    <div>
                        <h4 class="text-xs uppercase tracking-widest font-sans font-semibold text-flora-dark mb-2">
                            Описание на произведението
                        </h4>
                        <p class="text-sm text-flora-dark/80 leading-relaxed">
                            ${product.description}
                        </p>
                    </div>

                    ${product.botanicalNotes && product.botanicalNotes.length ? `
                        <div>
                            <h4 class="text-xs uppercase tracking-widest font-sans font-semibold text-flora-dark mb-2">
                                Ботанически състав & сортове
                            </h4>
                            <ul class="text-xs text-flora-dark/80 grid grid-cols-2 gap-y-1.5 gap-x-4">
                                ${botanicalList}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="grid grid-cols-2 gap-4 text-xs bg-flora-cream/50 p-4 border border-flora-dark/10">
                        <div>
                            <span class="block text-flora-taupe uppercase tracking-wider text-[10px]">Размери</span>
                            <span class="font-medium text-flora-dark">${product.dimensions || 'Индивидуални'}</span>
                        </div>
                        <div>
                            <span class="block text-flora-taupe uppercase tracking-wider text-[10px]">Грижа</span>
                            <span class="font-medium text-flora-dark">${product.careTip || 'Сменяйте водата редовно'}</span>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button 
                            type="button" 
                            onclick="window.FloraApp.orderProductDirectly(${product.id}); window.FloraApp.closeProductModal();" 
                            class="flex-1 bg-flora-dark hover:bg-flora-sage text-flora-base text-xs uppercase tracking-widest py-4 px-6 text-center font-sans font-medium transition-colors"
                        >
                            Заяви това произведение &rarr;
                        </button>
                        <button 
                            type="button" 
                            onclick="window.FloraApp.toggleFavorite(${product.id});" 
                            class="border border-flora-dark text-flora-dark hover:bg-flora-dark hover:text-flora-base text-xs uppercase tracking-widest py-4 px-5 text-center font-sans transition-colors flex items-center justify-center gap-2"
                        >
                            <i class="${isFav ? 'fa-solid text-red-600' : 'fa-regular'} fa-heart"></i>
                            <span>${isFav ? 'В любими' : 'Запази'}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        elements.productModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        if (!elements.productModal) return;
        elements.productModal.classList.remove('open');
        document.body.style.overflow = '';
        state.selectedProduct = null;
    }

    // Direct Order Shortcut
    function orderProductDirectly(productId) {
        const product = FLORA_PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        switchView('contact');

        if (elements.productSelect) {
            elements.productSelect.value = product.name;
            // Highlight field briefly
            elements.productSelect.classList.add('ring-2', 'ring-flora-sage');
            setTimeout(() => {
                elements.productSelect.classList.remove('ring-2', 'ring-flora-sage');
            }, 1800);
        }

        showToast(`Избрахте „${product.name}“. Попълнете формата за завършване на поръчката.`);
    }

    // Populate Product Dropdown in Order View
    function populateProductDropdown() {
        if (!elements.productSelect) return;
        let options = '<option value="">-- Изберете флорално произведение --</option>';

        // Group by category
        const categories = [...new Set(FLORA_PRODUCTS.map(p => p.categoryLabel))];
        categories.forEach(cat => {
            options += `<optgroup label="${cat}">`;
            FLORA_PRODUCTS.filter(p => p.categoryLabel === cat).forEach(p => {
                options += `<option value="${p.name}">${p.name} — ${p.price.toFixed(2)} ${p.currency}</option>`;
            });
            options += `</optgroup>`;
        });
        options += `<option value="Индивидуална авторска поръчка">Индивидуална авторска поръчка (опишете в желания)</option>`;

        elements.productSelect.innerHTML = options;
    }

    // Date Picker Restriction
    function setupDatePicker() {
        if (!elements.dateInput) return;
        const today = new Date().toISOString().split('T')[0];
        elements.dateInput.setAttribute('min', today);
    }

    // Favorites System
    function toggleFavorite(productId) {
        const index = state.favorites.indexOf(productId);
        const product = FLORA_PRODUCTS.find(p => p.id === productId);
        if (index > -1) {
            state.favorites.splice(index, 1);
            showToast(`Премахнато от запазени.`);
        } else {
            state.favorites.push(productId);
            showToast(product ? `„${product.name}“ е добавено в любими.` : 'Добавено в любими.');
        }

        localStorage.setItem('flora_favorites', JSON.stringify(state.favorites));
        updateFavoritesBadge();
        renderCatalog();
        renderFavoritesDrawer();

        // Refresh modal favorite button if modal is open
        if (state.selectedProduct && state.selectedProduct.id === productId) {
            openProductModal(state.selectedProduct);
        }
    }

    function updateFavoritesBadge() {
        if (!elements.favoritesCount) return;
        const count = state.favorites.length;
        elements.favoritesCount.textContent = count;
        elements.favoritesCount.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    function openFavoritesDrawer() {
        renderFavoritesDrawer();
        if (elements.favoritesDrawer) {
            elements.favoritesDrawer.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeFavoritesDrawer() {
        if (elements.favoritesDrawer) {
            elements.favoritesDrawer.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    function renderFavoritesDrawer() {
        if (!elements.favoritesList) return;
        const favProducts = FLORA_PRODUCTS.filter(p => state.favorites.includes(p.id));

        if (favProducts.length === 0) {
            elements.favoritesList.innerHTML = `
                <div class="py-16 text-center text-flora-taupe">
                    <i class="fa-regular fa-heart text-4xl mb-3 opacity-40"></i>
                    <p class="font-serif italic text-lg mb-1">Вашият списък е празен.</p>
                    <p class="text-xs">Натиснете сърцето върху всяка аранжировка, за да я запазите.</p>
                </div>
            `;
            return;
        }

        let html = '';
        let total = 0;
        favProducts.forEach(item => {
            total += item.price;
            html += `
                <div class="flex items-center gap-4 py-4 border-b border-flora-dark/10">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover bg-flora-card">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-serif italic text-base text-flora-dark truncate">${item.name}</h4>
                        <span class="text-xs text-flora-taupe">${item.price.toFixed(2)} ${item.currency}</span>
                        <div class="mt-2 flex items-center gap-3">
                            <button onclick="window.FloraApp.orderProductDirectly(${item.id}); window.FloraApp.closeFavoritesDrawer();" class="text-[10px] uppercase tracking-widest text-flora-dark hover:text-flora-sage font-medium">
                                Поръчай &rarr;
                            </button>
                            <button onclick="window.FloraApp.toggleFavorite(${item.id})" class="text-[10px] uppercase tracking-widest text-red-700/80 hover:text-red-900">
                                Изтрий
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="pt-6">
                <div class="flex justify-between items-baseline mb-4 text-sm font-sans">
                    <span class="uppercase tracking-widest text-flora-taupe text-xs">Обща стойност:</span>
                    <span class="font-serif text-xl font-medium text-flora-dark">${total.toFixed(2)} BGN</span>
                </div>
                <button onclick="window.FloraApp.switchView('contact'); window.FloraApp.closeFavoritesDrawer();" class="w-full bg-flora-dark text-flora-base py-3 text-xs uppercase tracking-widest hover:bg-flora-sage transition-colors">
                    Премини към форма за поръчка
                </button>
            </div>
        `;

        elements.favoritesList.innerHTML = html;
    }

    // Order Form Submission Handling
    function handleOrderSubmit(e) {
        e.preventDefault();
        const form = elements.orderForm;
        if (!form) return;

        const name = form.querySelector('[name="name"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const product = form.querySelector('[name="product"]').value;
        const date = form.querySelector('[name="date"]').value;
        const delivery = form.querySelector('[name="delivery"]').value;
        const occasion = form.querySelector('[name="occasion"]').value.trim() || 'Специален повод';
        const message = form.querySelector('[name="message"]').value.trim() || 'Без допълнителни изисквания';

        // Validation
        if (!name || !phone || !email || !product || !date) {
            alert('Моля, попълнете всички задължителни полета отбелязани със звездичка (*).');
            return;
        }

        const phoneRegex = /^[0-9\+\-\s]{7,16}$/;
        if (!phoneRegex.test(phone)) {
            alert('Моля, въведете валиден телефон за връзка.');
            return;
        }

        // Generate Reference Number
        const refId = 'FLORA-' + Math.floor(100000 + Math.random() * 900000);

        // Show Confirmation
        if (elements.confirmationDetails && elements.confirmationModal) {
            elements.confirmationDetails.innerHTML = `
                <div class="bg-flora-cream/70 p-5 rounded border border-flora-dark/10 text-left text-xs space-y-2 mb-6">
                    <div class="flex justify-between border-b border-flora-dark/10 pb-2">
                        <span class="text-flora-taupe uppercase tracking-wider">Номер на запитване:</span>
                        <strong class="font-mono text-flora-dark">${refId}</strong>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-flora-taupe">Клиент:</span>
                        <span class="font-medium text-flora-dark">${name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-flora-taupe">Телефон:</span>
                        <span class="font-medium text-flora-dark">${phone}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-flora-taupe">Имейл:</span>
                        <span class="font-medium text-flora-dark">${email}</span>
                    </div>
                    <div class="flex justify-between border-t border-flora-dark/10 pt-2">
                        <span class="text-flora-taupe">Аранжировка:</span>
                        <span class="font-semibold text-flora-dark">${product}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-flora-taupe">Дата на изпълнение:</span>
                        <span class="font-medium text-flora-dark">${date}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-flora-taupe">Начин на получаване:</span>
                        <span class="font-medium text-flora-dark">${delivery}</span>
                    </div>
                    ${occasion ? `
                    <div class="flex justify-between">
                        <span class="text-flora-taupe">Повод:</span>
                        <span class="font-medium text-flora-dark">${occasion}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="text-center text-xs text-flora-dark/70 mb-4">
                    Благодарим Ви! Наш флорист от ателие „Флора“ (гр. Тутракан) ще се свърже с Вас за финално потвърждение.
                </div>
            `;

            elements.confirmationModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        form.reset();
        setupDatePicker();
    }

    function closeConfirmationModal() {
        if (!elements.confirmationModal) return;
        elements.confirmationModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Toast Alert
    function showToast(msg) {
        if (!elements.toast || !elements.toastMessage) return;
        elements.toastMessage.textContent = msg;
        elements.toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        elements.toast.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');

        setTimeout(() => {
            elements.toast.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            elements.toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }, 3200);
    }

    // Event Listeners
    function bindEvents() {
        // Menu Toggle
        if (elements.menuToggleBtn) {
            elements.menuToggleBtn.addEventListener('click', toggleMenu);
        }

        // Close Menu on Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
                closeProductModal();
                closeFavoritesDrawer();
                closeConfirmationModal();
            }
        });

        // Hash change navigation
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && ['home', 'catalog', 'about', 'contact'].includes(hash)) {
                switchView(hash, false);
            }
        });

        // Filter Buttons
        elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const filter = target.getAttribute('data-filter') || target.textContent.trim().toLowerCase();
                state.activeFilter = filter;
                updateFilterButtonUI();
                renderCatalog();
            });
        });

        // Live Search Input
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                renderCatalog();
            });
        }

        // Sort Select
        if (elements.sortSelect) {
            elements.sortSelect.addEventListener('change', (e) => {
                state.sortBy = e.target.value;
                renderCatalog();
            });
        }

        // Order Form
        if (elements.orderForm) {
            elements.orderForm.addEventListener('submit', handleOrderSubmit);
        }
    }

    // Global Exposure for inline HTML hooks
    window.FloraApp = {
        switchView,
        toggleMenu,
        closeMenu,
        openProductModalById: (id) => {
            const p = FLORA_PRODUCTS.find(item => item.id === id);
            if (p) openProductModal(p);
        },
        closeProductModal,
        orderProductDirectly,
        toggleFavorite,
        openFavoritesDrawer,
        closeFavoritesDrawer,
        closeConfirmationModal
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
