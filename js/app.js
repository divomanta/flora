/**
 * FLORA | Botanical Artistry - Core Application Engine
 * Vibrant Botanical Studio Edition
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

        if (triggerHash) {
            window.location.hash = viewId;
        }

        closeMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });

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
            elements.header.style.color = '#FAF9F6';
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
            }, 250);
        }
    }

    // Get Vibrant Badge Styling
    function getBadgeClass(category) {
        switch (category) {
            case 'букети':
                return 'bg-rose-600 text-white shadow-sm shadow-rose-600/30';
            case 'авангард':
                return 'bg-purple-700 text-white shadow-sm shadow-purple-700/30';
            case 'сватбени':
                return 'bg-amber-600 text-white shadow-sm shadow-amber-600/30';
            case 'саксийни':
                return 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30';
            case 'аранжировки':
                return 'bg-teal-700 text-white shadow-sm shadow-teal-700/30';
            default:
                return 'bg-emerald-700 text-white';
        }
    }

    // Catalog Rendering & Filtering
    function renderCatalog() {
        if (!elements.editorialGrid) return;

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

        if (filtered.length === 0) {
            elements.editorialGrid.innerHTML = `
                <div class="col-span-12 py-20 text-center">
                    <div class="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                        <i class="fa-solid fa-seedling"></i>
                    </div>
                    <p class="font-serif italic text-2xl text-flora-dark mb-2">Няма открити цветя по тези критерии.</p>
                    <p class="text-xs text-stone-500 mb-6">Опитайте с друго търсене или нулирайте избраната категория.</p>
                    <button class="btn-reset-filter bg-emerald-700 text-white hover:bg-emerald-800 text-xs tracking-mega uppercase py-3 px-6 font-medium transition-colors">
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

        let html = '';
        filtered.forEach((product, index) => {
            const isFav = state.favorites.includes(product.id);
            const badgeClass = getBadgeClass(product.category);

            // Stagger classes
            const mod = index % 3;
            let staggerClass = 'col-span-12 md:col-span-6 lg:editorial-col-stagger-1';
            if (mod === 1) staggerClass = 'col-span-12 md:col-span-6 lg:editorial-col-stagger-2';
            if (mod === 2) staggerClass = 'col-span-12 md:col-span-8 lg:editorial-col-stagger-3';

            html += `
                <article class="edgy-card group flex flex-col gap-3.5 ${staggerClass} transition-transform duration-300 hover:-translate-y-1.5" data-id="${product.id}">
                    <div class="relative edgy-img-wrapper aspect-[3/4] cursor-pointer rounded-sm shadow-md group-hover:shadow-xl group-hover:shadow-emerald-950/15" onclick="window.FloraApp.openProductModalById(${product.id})">
                        <img 
                            src="${product.image}" 
                            alt="${product.name}" 
                            loading="lazy" 
                            class="w-full h-full object-cover filter saturate-110 contrast-105 group-hover:saturate-125 group-hover:scale-105 transition-all duration-500"
                            onerror="this.onerror=null; this.src='img/banner-flowers.jpg';"
                        />
                        ${product.badge ? `
                            <span class="absolute top-4 left-4 ${badgeClass} text-[10px] uppercase tracking-mega px-3 py-1 font-sans font-semibold rounded-sm">
                                ${product.badge}
                            </span>
                        ` : ''}

                        <button 
                            type="button" 
                            onclick="event.stopPropagation(); window.FloraApp.toggleFavorite(${product.id});" 
                            class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-800 hover:text-rose-600 hover:scale-110 transition-all shadow-md"
                            title="${isFav ? 'Премахни от любими' : 'Добави в любими'}"
                        >
                            <i class="${isFav ? 'fa-solid text-rose-600' : 'fa-regular'} fa-heart text-xs"></i>
                        </button>

                        <div class="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <span class="text-white text-xs font-sans uppercase tracking-widest border-b border-white/70 pb-1 flex items-center gap-2">
                                <span>Разгледай детайли</span> &rarr;
                            </span>
                        </div>
                    </div>

                    <div class="meta pt-3 border-t border-emerald-900/15 flex flex-col gap-1.5">
                        <div class="flex justify-between items-baseline gap-4">
                            <h3 class="font-serif italic text-xl md:text-2xl text-flora-dark group-hover:text-emerald-800 transition-colors cursor-pointer" onclick="window.FloraApp.openProductModalById(${product.id})">
                                ${product.name}
                            </h3>
                            <span class="font-sans text-sm tracking-wide font-bold text-emerald-800 whitespace-nowrap bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                                ${product.price.toFixed(2)} ${product.currency}
                            </span>
                        </div>
                        <p class="text-xs text-stone-600 line-clamp-1 font-sans">
                            ${product.subtitle}
                        </p>
                        <div class="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-stone-200">
                            <span class="text-[10px] uppercase tracking-mega font-semibold text-emerald-700">
                                &bull; ${product.categoryLabel}
                            </span>
                            <button 
                                type="button" 
                                onclick="window.FloraApp.orderProductDirectly(${product.id})" 
                                class="text-[11px] uppercase tracking-widest font-sans font-semibold text-rose-600 hover:text-rose-700 hover-draw pb-0.5 flex items-center gap-1"
                            >
                                <span>Поръчай</span> &rarr;
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
                btn.className = 'filter-btn active text-xs uppercase tracking-mega font-sans py-2 px-4 rounded-full bg-emerald-800 text-white font-medium shadow-sm transition-all';
            } else {
                btn.className = 'filter-btn text-xs uppercase tracking-mega font-sans py-2 px-4 rounded-full bg-white/70 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 transition-all';
            }
        });
    }

    // Product Quick-View Modal
    function openProductModal(product) {
        if (!elements.productModal || !elements.modalContent || !product) return;
        state.selectedProduct = product;

        const isFav = state.favorites.includes(product.id);
        const botanicalList = (product.botanicalNotes || [])
            .map(note => `<li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-600"></span><span class="italic font-serif text-stone-800">${note}</span></li>`)
            .join('');

        const badgeClass = getBadgeClass(product.category);

        elements.modalContent.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div class="lg:col-span-6 relative aspect-[3/4] bg-stone-100 overflow-hidden rounded shadow-lg">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}" 
                        class="w-full h-full object-cover filter saturate-110 contrast-105"
                        onerror="this.onerror=null; this.src='img/banner-flowers.jpg';"
                    />
                    ${product.badge ? `
                        <span class="absolute top-4 left-4 ${badgeClass} text-[10px] uppercase tracking-mega px-3 py-1 font-sans font-semibold rounded-sm">
                            ${product.badge}
                        </span>
                    ` : ''}
                </div>

                <div class="lg:col-span-6 flex flex-col gap-6">
                    <div>
                        <span class="text-[11px] uppercase tracking-mega font-semibold text-emerald-800 block mb-1">
                            ${product.categoryLabel} &bull; Каталог № ${product.id}
                        </span>
                        <h2 class="font-serif italic text-3xl md:text-4xl text-flora-dark mb-2">
                            ${product.name}
                        </h2>
                        <p class="text-sm font-sans text-stone-600 italic">
                            ${product.subtitle}
                        </p>
                    </div>

                    <div class="flex items-baseline gap-4 py-3.5 border-y border-stone-200">
                        <span class="font-serif text-3xl font-bold text-emerald-900">
                            ${product.price.toFixed(2)} <span class="text-sm font-sans uppercase font-medium text-stone-600">${product.currency}</span>
                        </span>
                        <span class="text-xs text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                            <span>Свежо в ателието &bull; Готово за доставка</span>
                        </span>
                    </div>

                    <div>
                        <h4 class="text-xs uppercase tracking-mega font-sans font-bold text-stone-900 mb-2">
                            Описание на произведението
                        </h4>
                        <p class="text-sm text-stone-700 leading-relaxed font-sans">
                            ${product.description}
                        </p>
                    </div>

                    ${product.botanicalNotes && product.botanicalNotes.length ? `
                        <div class="bg-emerald-50/60 p-4 rounded border border-emerald-100">
                            <h4 class="text-xs uppercase tracking-mega font-sans font-bold text-emerald-950 mb-2.5">
                                Ботанически сортове & съставки
                            </h4>
                            <ul class="text-xs grid grid-cols-2 gap-y-2 gap-x-4">
                                ${botanicalList}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="grid grid-cols-2 gap-4 text-xs bg-amber-50/50 p-4 border border-amber-200/60 rounded">
                        <div>
                            <span class="block text-stone-500 uppercase tracking-wider text-[10px] font-semibold">Размери</span>
                            <span class="font-medium text-stone-900">${product.dimensions || 'Индивидуален размер'}</span>
                        </div>
                        <div>
                            <span class="block text-stone-500 uppercase tracking-wider text-[10px] font-semibold">Грижа за свежест</span>
                            <span class="font-medium text-stone-900">${product.careTip || 'Сменяйте водата на 48 часа'}</span>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button 
                            type="button" 
                            onclick="window.FloraApp.orderProductDirectly(${product.id}); window.FloraApp.closeProductModal();" 
                            class="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white text-xs uppercase tracking-mega py-4 px-6 text-center font-sans font-bold transition-all shadow-md shadow-emerald-900/20 rounded"
                        >
                            Заяви това цвете &rarr;
                        </button>
                        <button 
                            type="button" 
                            onclick="window.FloraApp.toggleFavorite(${product.id});" 
                            class="border border-stone-300 text-stone-800 hover:border-rose-500 hover:text-rose-600 text-xs uppercase tracking-widest py-4 px-5 text-center font-sans transition-colors flex items-center justify-center gap-2 rounded bg-white"
                        >
                            <i class="${isFav ? 'fa-solid text-rose-600' : 'fa-regular'} fa-heart"></i>
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
            elements.productSelect.classList.add('ring-2', 'ring-emerald-600', 'bg-emerald-50/50');
            setTimeout(() => {
                elements.productSelect.classList.remove('ring-2', 'ring-emerald-600', 'bg-emerald-50/50');
            }, 2000);
        }

        showToast(`Избрахте „${product.name}“. Попълнете формата за завършване на поръчката.`);
    }

    // Populate Product Dropdown in Order View
    function populateProductDropdown() {
        if (!elements.productSelect) return;
        let options = '<option value="">-- Изберете флорално произведение --</option>';

        const categories = [...new Set(FLORA_PRODUCTS.map(p => p.categoryLabel))];
        categories.forEach(cat => {
            options += `<optgroup label="${cat}">`;
            FLORA_PRODUCTS.filter(p => p.categoryLabel === cat).forEach(p => {
                options += `<option value="${p.name}">${p.name} — ${p.price.toFixed(2)} ${p.currency}</option>`;
            });
            options += `</optgroup>`;
        });
        options += `<option value="Индивидуална авторска аранжировка">Индивидуална авторска аранжировка (опишете в желания)</option>`;

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
                <div class="py-16 text-center text-stone-400">
                    <i class="fa-regular fa-heart text-5xl mb-3 text-rose-300"></i>
                    <p class="font-serif italic text-xl text-stone-700 mb-1">Вашият списък е празен.</p>
                    <p class="text-xs text-stone-500">Натиснете сърцето върху всяка аранжировка, за да я запазите.</p>
                </div>
            `;
            return;
        }

        let html = '';
        let total = 0;
        favProducts.forEach(item => {
            total += item.price;
            html += `
                <div class="flex items-center gap-4 py-4 border-b border-stone-200">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded shadow-sm">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-serif italic text-base text-flora-dark truncate">${item.name}</h4>
                        <span class="text-xs font-bold text-emerald-800">${item.price.toFixed(2)} ${item.currency}</span>
                        <div class="mt-2 flex items-center gap-3">
                            <button onclick="window.FloraApp.orderProductDirectly(${item.id}); window.FloraApp.closeFavoritesDrawer();" class="text-[10px] uppercase tracking-widest text-emerald-700 hover:text-emerald-900 font-bold">
                                Поръчай &rarr;
                            </button>
                            <button onclick="window.FloraApp.toggleFavorite(${item.id})" class="text-[10px] uppercase tracking-widest text-rose-600 hover:text-rose-800">
                                Премахни
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="pt-6">
                <div class="flex justify-between items-baseline mb-4 text-sm font-sans bg-emerald-50 p-3 rounded border border-emerald-100">
                    <span class="uppercase tracking-widest text-stone-600 text-xs font-medium">Обща стойност:</span>
                    <span class="font-serif text-2xl font-bold text-emerald-900">${total.toFixed(2)} BGN</span>
                </div>
                <button onclick="window.FloraApp.switchView('contact'); window.FloraApp.closeFavoritesDrawer();" class="w-full bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-3.5 text-xs uppercase tracking-mega font-bold hover:from-emerald-600 hover:to-emerald-800 transition-all rounded shadow-md">
                    Премини към форма за поръчка &rarr;
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

        if (!name || !phone || !email || !product || !date) {
            alert('Моля, попълнете всички задължителни полета отбелязани със звездичка (*).');
            return;
        }

        const phoneRegex = /^[0-9\+\-\s]{7,16}$/;
        if (!phoneRegex.test(phone)) {
            alert('Моля, въведете валиден телефон за връзка.');
            return;
        }

        const refId = 'FLORA-' + Math.floor(100000 + Math.random() * 900000);

        if (elements.confirmationDetails && elements.confirmationModal) {
            elements.confirmationDetails.innerHTML = `
                <div class="bg-emerald-50/70 p-5 rounded-lg border border-emerald-200 text-left text-xs space-y-2 mb-6">
                    <div class="flex justify-between border-b border-emerald-200 pb-2">
                        <span class="text-stone-500 uppercase tracking-wider font-semibold">Номер на запитване:</span>
                        <strong class="font-mono text-emerald-900 text-sm">${refId}</strong>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-stone-600">Клиент:</span>
                        <span class="font-bold text-stone-900">${name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-stone-600">Телефон:</span>
                        <span class="font-bold text-stone-900">${phone}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-stone-600">Имейл:</span>
                        <span class="font-medium text-stone-900">${email}</span>
                    </div>
                    <div class="flex justify-between border-t border-emerald-200 pt-2">
                        <span class="text-stone-600">Аранжировка:</span>
                        <span class="font-bold text-emerald-900 text-sm">${product}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-stone-600">Дата на изпълнение:</span>
                        <span class="font-bold text-stone-900">${date}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-stone-600">Начин на получаване:</span>
                        <span class="font-medium text-stone-900">${delivery}</span>
                    </div>
                    ${occasion ? `
                    <div class="flex justify-between">
                        <span class="text-stone-600">Повод:</span>
                        <span class="font-medium text-stone-900">${occasion}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="text-center text-xs text-stone-600 mb-4">
                    Благодарим Ви! Наш флорист от ателие „Флора“ (гр. Тутракан) ще се свърже с Вас за финално потвърждение на доставката.
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
        if (elements.menuToggleBtn) {
            elements.menuToggleBtn.addEventListener('click', toggleMenu);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
                closeProductModal();
                closeFavoritesDrawer();
                closeConfirmationModal();
            }
        });

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && ['home', 'catalog', 'about', 'contact'].includes(hash)) {
                switchView(hash, false);
            }
        });

        elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const filter = target.getAttribute('data-filter') || target.textContent.trim().toLowerCase();
                state.activeFilter = filter;
                updateFilterButtonUI();
                renderCatalog();
            });
        });

        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                renderCatalog();
            });
        }

        if (elements.sortSelect) {
            elements.sortSelect.addEventListener('change', (e) => {
                state.sortBy = e.target.value;
                renderCatalog();
            });
        }

        if (elements.orderForm) {
            elements.orderForm.addEventListener('submit', handleOrderSubmit);
        }
    }

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
