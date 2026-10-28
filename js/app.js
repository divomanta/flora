/**
 * FLORA | Botanical Artistry - Core Application Engine
 * Electric Sunset & Evergreen Edition - Mobile Responsive Architecture
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
        mobileMenu: document.getElementById('mobileMenu'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        header: document.querySelector('header'),
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

        closeMobileMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (viewId === 'catalog') {
            renderCatalog();
        }

        if (viewId === 'contact') {
            setTimeout(() => {
                if (window.FloraDeliveryMap) {
                    window.FloraDeliveryMap.invalidateSize();
                }
            }, 250);
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

    // Mobile Navigation Controls
    function openMobileMenu() {
        const menu = elements.mobileMenu || document.getElementById('mobileMenu');
        if (!menu) return;
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        const menu = elements.mobileMenu || document.getElementById('mobileMenu');
        if (!menu) return;
        menu.classList.remove('open');
        document.body.style.overflow = '';
    }

    function toggleMobileMenu() {
        const menu = elements.mobileMenu || document.getElementById('mobileMenu');
        if (!menu) return;
        if (menu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // High-Fashion Category Badges (Electric Sunset & Evergreen)
    function getBadgeClass(category) {
        switch (category) {
            case 'букети':
                return 'bg-[#FF4834] text-white shadow-sm shadow-[#FF4834]/30';
            case 'авангард':
                return 'bg-[#0D3B2E] text-white shadow-sm shadow-[#0D3B2E]/30';
            case 'сватбени':
                return 'bg-[#FFA451] text-[#0D3B2E] font-bold shadow-sm shadow-[#FFA451]/30';
            case 'саксийни':
                return 'bg-[#0D3B2E] text-[#FFFDF5] shadow-sm shadow-[#0D3B2E]/30';
            case 'аранжировки':
                return 'bg-[#FF4834] text-white shadow-sm shadow-[#FF4834]/30';
            default:
                return 'bg-[#0D3B2E] text-white';
        }
    }

    // Catalog Rendering & Filtering
    function renderCatalog() {
        const grid = elements.editorialGrid || document.getElementById('editorial-grid');
        if (!grid) return;

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
        const productCountElem = elements.productCount || document.getElementById('product-count');
        if (productCountElem) {
            productCountElem.textContent = `(${filtered.length} ${filtered.length === 1 ? 'експонат' : 'произведения'})`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-12 py-16 sm:py-20 text-center px-4">
                    <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF4834]/10 text-[#FF4834] flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl">
                        <i class="fa-solid fa-seedling"></i>
                    </div>
                    <p class="font-serif italic text-xl sm:text-2xl text-[#0D3B2E] mb-2">Няма открити цветя по тези критерии.</p>
                    <p class="text-xs text-[#111A16]/70 mb-6">Опитайте с друго търсене или нулирайте избраната категория.</p>
                    <button class="btn-reset-filter bg-[#0D3B2E] hover:bg-[#FF4834] text-[#FFFDF5] text-xs tracking-mega uppercase py-3 px-6 font-medium transition-colors rounded-full shadow-sm">
                        Изчисти филтрите
                    </button>
                </div>
            `;
            const resetBtn = grid.querySelector('.btn-reset-filter');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    state.activeFilter = 'всички';
                    state.searchQuery = '';
                    const searchInput = elements.searchInput || document.getElementById('catalog-search');
                    if (searchInput) searchInput.value = '';
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
                    <div class="relative edgy-img-wrapper aspect-[3/4] cursor-pointer rounded-lg shadow-sm group-hover:shadow-xl group-hover:shadow-[#0D3B2E]/15 border border-[#0D3B2E]/10" onclick="window.FloraApp.openProductModalById(${product.id})">
                        <img 
                            src="${product.image}" 
                            alt="${product.name}" 
                            loading="lazy" 
                            class="w-full h-full object-cover filter saturate-110 contrast-105 group-hover:saturate-125 group-hover:scale-105 transition-all duration-500"
                            onerror="this.onerror=null; this.src='img/banner-flowers.jpg';"
                        />
                        ${product.badge ? `
                            <span class="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 ${badgeClass} text-[10px] uppercase tracking-mega px-2.5 sm:px-3 py-1 font-sans font-semibold rounded-sm">
                                ${product.badge}
                            </span>
                        ` : ''}

                        <button 
                            type="button" 
                            onclick="event.stopPropagation(); window.FloraApp.toggleFavorite(${product.id});" 
                            class="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-[#FFFDF5]/90 backdrop-blur-md flex items-center justify-center text-[#0D3B2E] hover:text-[#FF4834] hover:scale-110 transition-all shadow-md"
                            title="${isFav ? 'Премахни от любими' : 'Добави в любими'}"
                        >
                            <i class="${isFav ? 'fa-solid text-[#FF4834]' : 'fa-regular'} fa-heart text-xs"></i>
                        </button>

                        <div class="absolute inset-0 bg-gradient-to-t from-[#0D3B2E]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 sm:p-6">
                            <span class="text-[#FFFDF5] text-xs font-sans uppercase tracking-widest border-b border-[#FFA451] pb-1 flex items-center gap-2">
                                <span>Разгледай детайли</span> &rarr;
                            </span>
                        </div>
                    </div>

                    <div class="meta pt-3 border-t border-[#0D3B2E]/15 flex flex-col gap-1.5">
                        <div class="flex justify-between items-baseline gap-3">
                            <h3 class="font-serif italic text-lg sm:text-xl md:text-2xl text-[#0D3B2E] group-hover:text-[#FF4834] transition-colors cursor-pointer truncate" onclick="window.FloraApp.openProductModalById(${product.id})">
                                ${product.name}
                            </h3>
                            <span class="font-sans text-xs sm:text-sm tracking-wide font-bold text-[#FF4834] whitespace-nowrap bg-[#FF4834]/10 px-2 sm:px-2.5 py-0.5 rounded border border-[#FF4834]/30">
                                ${product.price.toFixed(2)} ${product.currency}
                            </span>
                        </div>
                        <p class="text-xs text-[#111A16]/80 line-clamp-1 font-sans">
                            ${product.subtitle}
                        </p>
                        <div class="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-[#0D3B2E]/15">
                            <span class="text-[10px] uppercase tracking-mega font-semibold text-[#0D3B2E]">
                                &bull; ${product.categoryLabel}
                            </span>
                            <button 
                                type="button" 
                                onclick="window.FloraApp.orderProductDirectly(${product.id})" 
                                class="text-[11px] uppercase tracking-widest font-sans font-bold text-[#FF4834] hover:text-[#FFA451] hover-draw pb-0.5 flex items-center gap-1 transition-colors"
                            >
                                <span>Поръчай</span> &rarr;
                            </button>
                        </div>
                    </div>
                </article>
            `;
        });

        grid.innerHTML = html;
    }

    function updateFilterButtonUI() {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            const filter = btn.getAttribute('data-filter') || btn.textContent.trim().toLowerCase();
            if (filter === state.activeFilter) {
                btn.className = 'filter-btn active shrink-0 text-xs uppercase tracking-wider sm:tracking-mega font-sans py-2 px-3.5 sm:px-4 rounded-full bg-[#0D3B2E] text-[#FFFDF5] font-semibold shadow-sm transition-all';
            } else {
                btn.className = 'filter-btn shrink-0 text-xs uppercase tracking-wider sm:tracking-mega font-sans py-2 px-3.5 sm:px-4 rounded-full bg-white/80 text-[#111A16] hover:bg-[#FFA451]/15 hover:text-[#0D3B2E] border border-[#0D3B2E]/15 transition-all';
            }
        });
    }

    // Product Quick-View Modal
    function openProductModal(product) {
        const modal = elements.productModal || document.getElementById('product-modal');
        const content = elements.modalContent || document.getElementById('modal-product-content');
        if (!modal || !content || !product) return;
        state.selectedProduct = product;

        const isFav = state.favorites.includes(product.id);
        const botanicalList = (product.botanicalNotes || [])
            .map(note => `<li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#FFA451] shrink-0"></span><span class="italic font-serif text-[#111A16] text-xs">${note}</span></li>`)
            .join('');

        const badgeClass = getBadgeClass(product.category);

        content.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                <div class="lg:col-span-6 relative aspect-[4/3] sm:aspect-[3/4] max-h-[35vh] sm:max-h-none bg-[#FFFDF5] overflow-hidden rounded-lg shadow-md border border-[#0D3B2E]/10">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}" 
                        class="w-full h-full object-cover filter saturate-110 contrast-105"
                        onerror="this.onerror=null; this.src='img/banner-flowers.jpg';"
                    />
                    ${product.badge ? `
                        <span class="absolute top-3 left-3 sm:top-4 sm:left-4 ${badgeClass} text-[10px] uppercase tracking-mega px-2.5 sm:px-3 py-1 font-sans font-semibold rounded-sm">
                            ${product.badge}
                        </span>
                    ` : ''}
                </div>

                <div class="lg:col-span-6 flex flex-col gap-4 sm:gap-6">
                    <div>
                        <span class="text-[10px] sm:text-[11px] uppercase tracking-mega font-bold text-[#0D3B2E] block mb-1">
                            ${product.categoryLabel} &bull; Каталог № ${product.id}
                        </span>
                        <h2 class="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#0D3B2E] mb-1 sm:mb-2 leading-snug">
                            ${product.name}
                        </h2>
                        <p class="text-xs sm:text-sm font-sans text-[#111A16]/75 italic">
                            ${product.subtitle}
                        </p>
                    </div>

                    <div class="flex items-baseline gap-3 sm:gap-4 py-2.5 sm:py-3.5 border-y border-[#0D3B2E]/15">
                        <span class="font-serif text-2xl sm:text-3xl font-bold text-[#FF4834]">
                            ${product.price.toFixed(2)} <span class="text-xs sm:text-sm font-sans uppercase font-medium text-[#111A16]/70">${product.currency}</span>
                        </span>
                        <span class="text-[11px] sm:text-xs text-[#0D3B2E] bg-[#FFA451]/15 border border-[#FFA451]/40 px-2.5 sm:px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-[#FFA451] animate-pulse shrink-0"></span>
                            <span class="truncate">Свежо &bull; Готово за доставка</span>
                        </span>
                    </div>

                    <div>
                        <h4 class="text-xs uppercase tracking-mega font-sans font-bold text-[#0D3B2E] mb-1.5 sm:mb-2">
                            Описание на произведението
                        </h4>
                        <p class="text-xs sm:text-sm text-[#111A16] leading-relaxed font-sans">
                            ${product.description}
                        </p>
                    </div>

                    ${product.botanicalNotes && product.botanicalNotes.length ? `
                        <div class="bg-[#0D3B2E]/5 p-3 sm:p-4 rounded-lg border border-[#0D3B2E]/15">
                            <h4 class="text-xs uppercase tracking-mega font-sans font-bold text-[#0D3B2E] mb-2">
                                Ботанически сортове & съставки
                            </h4>
                            <ul class="text-xs grid grid-cols-2 gap-y-1.5 sm:gap-y-2 gap-x-3 sm:gap-x-4">
                                ${botanicalList}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="grid grid-cols-2 gap-3 sm:gap-4 text-xs bg-[#FFA451]/10 p-3 sm:p-4 border border-[#FFA451]/30 rounded-lg">
                        <div>
                            <span class="block text-[#0D3B2E] uppercase tracking-wider text-[10px] font-bold">Размери</span>
                            <span class="font-medium text-[#111A16] text-xs sm:text-sm">${product.dimensions || 'Индивидуален'}</span>
                        </div>
                        <div>
                            <span class="block text-[#0D3B2E] uppercase tracking-wider text-[10px] font-bold">Грижа за свежест</span>
                            <span class="font-medium text-[#111A16] text-xs sm:text-sm">${product.careTip || 'Сменяйте водата на 48 ч.'}</span>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
                        <button 
                            type="button" 
                            onclick="window.FloraApp.orderProductDirectly(${product.id}); window.FloraApp.closeProductModal();" 
                            class="flex-1 bg-[#FF4834] hover:bg-[#FFA451] text-white text-xs uppercase tracking-mega py-3.5 sm:py-4 px-6 text-center font-sans font-bold transition-all shadow-md shadow-[#FF4834]/30 rounded-full"
                        >
                            Заяви това цвете &rarr;
                        </button>
                        <button 
                            type="button" 
                            onclick="window.FloraApp.toggleFavorite(${product.id});" 
                            class="border border-[#0D3B2E]/25 text-[#0D3B2E] hover:border-[#FF4834] hover:text-[#FF4834] text-xs uppercase tracking-widest py-3.5 sm:py-4 px-5 text-center font-sans transition-colors flex items-center justify-center gap-2 rounded-full bg-white"
                        >
                            <i class="${isFav ? 'fa-solid text-[#FF4834]' : 'fa-regular'} fa-heart"></i>
                            <span>${isFav ? 'В любими' : 'Запази'}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        const modal = elements.productModal || document.getElementById('product-modal');
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
        state.selectedProduct = null;
    }

    // Direct Order Shortcut
    function orderProductDirectly(productId) {
        const product = FLORA_PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        switchView('contact');

        const productSelect = elements.productSelect || document.getElementById('product-select');
        if (productSelect) {
            productSelect.value = product.name;
            productSelect.classList.add('ring-2', 'ring-[#FF4834]', 'bg-[#FF4834]/10');
            setTimeout(() => {
                productSelect.classList.remove('ring-2', 'ring-[#FF4834]', 'bg-[#FF4834]/10');
            }, 2000);
            if (window.FloraDeliveryMap && window.FloraDeliveryMap.updateProductPreview) {
                window.FloraDeliveryMap.updateProductPreview(product.name);
            }
        }

        showToast(`Избрахте „${product.name}“. Попълнете формата за поръчка.`);
    }

    // Populate Product Dropdown in Order View
    function populateProductDropdown() {
        const select = elements.productSelect || document.getElementById('product-select');
        if (!select) return;
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

        select.innerHTML = options;
    }

    // Date Picker Restriction
    function setupDatePicker() {
        const dateInput = elements.dateInput || document.getElementById('order-date');
        if (!dateInput) return;
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
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
        const count = state.favorites.length;
        const favCountElem = elements.favoritesCount || document.getElementById('favorites-count');
        if (favCountElem) {
            favCountElem.textContent = count;
            favCountElem.style.display = count > 0 ? 'inline-flex' : 'none';
        }

        const bottomFavCount = document.getElementById('bottom-fav-count');
        if (bottomFavCount) {
            bottomFavCount.textContent = count;
            bottomFavCount.style.display = count > 0 ? 'inline-flex' : 'none';
        }

        const mobileMenuFavCount = document.getElementById('mobile-menu-fav-count');
        if (mobileMenuFavCount) {
            mobileMenuFavCount.textContent = count;
        }
    }

    function openFavoritesDrawer() {
        renderFavoritesDrawer();
        const drawer = elements.favoritesDrawer || document.getElementById('favorites-drawer');
        if (drawer) {
            drawer.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeFavoritesDrawer() {
        const drawer = elements.favoritesDrawer || document.getElementById('favorites-drawer');
        if (drawer) {
            drawer.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    function renderFavoritesDrawer() {
        const list = elements.favoritesList || document.getElementById('favorites-list');
        if (!list) return;
        const favProducts = FLORA_PRODUCTS.filter(p => state.favorites.includes(p.id));

        if (favProducts.length === 0) {
            list.innerHTML = `
                <div class="py-14 sm:py-16 text-center text-[#111A16]/50 px-4">
                    <i class="fa-regular fa-heart text-4xl sm:text-5xl mb-3 text-[#FF4834]/40"></i>
                    <p class="font-serif italic text-lg sm:text-xl text-[#0D3B2E] mb-1">Вашият списък е празен.</p>
                    <p class="text-xs text-[#111A16]/70">Натиснете сърцето върху всяка аранжировка, за да я запазите.</p>
                </div>
            `;
            return;
        }

        let html = '';
        let total = 0;
        favProducts.forEach(item => {
            total += item.price;
            html += `
                <div class="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-[#0D3B2E]/10">
                    <img src="${item.image}" alt="${item.name}" class="w-14 h-18 sm:w-16 sm:h-20 object-cover rounded-lg shadow-sm border border-[#0D3B2E]/10 shrink-0">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-serif italic text-sm sm:text-base text-[#0D3B2E] truncate">${item.name}</h4>
                        <span class="text-xs font-bold text-[#FF4834]">${item.price.toFixed(2)} ${item.currency}</span>
                        <div class="mt-1.5 flex items-center gap-3">
                            <button onclick="window.FloraApp.orderProductDirectly(${item.id}); window.FloraApp.closeFavoritesDrawer();" class="text-[10px] uppercase tracking-widest text-[#FF4834] hover:text-[#FFA451] font-bold">
                                Поръчай &rarr;
                            </button>
                            <button onclick="window.FloraApp.toggleFavorite(${item.id})" class="text-[10px] uppercase tracking-widest text-[#111A16]/60 hover:text-[#FF4834]">
                                Премахни
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="pt-5 sm:pt-6">
                <div class="flex justify-between items-baseline mb-4 text-sm font-sans bg-[#0D3B2E]/5 p-3 sm:p-3.5 rounded-lg border border-[#0D3B2E]/15">
                    <span class="uppercase tracking-widest text-[#0D3B2E] text-xs font-bold">Обща стойност:</span>
                    <span class="font-serif text-xl sm:text-2xl font-bold text-[#FF4834]">${total.toFixed(2)} BGN</span>
                </div>
                <button onclick="window.FloraApp.switchView('contact'); window.FloraApp.closeFavoritesDrawer();" class="w-full bg-[#FF4834] hover:bg-[#FFA451] text-white py-3.5 text-xs uppercase tracking-mega font-bold transition-all rounded-full shadow-md shadow-[#FF4834]/30">
                    Премини към поръчка &rarr;
                </button>
            </div>
        `;

        list.innerHTML = html;
    }

    // Order Form Submission Handling
    function handleOrderSubmit(e) {
        e.preventDefault();
        const form = elements.orderForm || document.getElementById('order-form');
        if (!form) return;

        const name = form.querySelector('[name="name"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const product = form.querySelector('[name="product"]').value;
        const date = form.querySelector('[name="date"]').value;
        const timeSlot = form.querySelector('[name="timeSlot"]')?.value || 'В рамките на деня (08:30 – 19:30 ч.)';
        const delivery = form.querySelector('[name="delivery"]').value;
        const destination = form.querySelector('[name="destination"]')?.value.trim();
        const occasion = form.querySelector('[name="occasion"]').value.trim() || 'Специален повод';
        const message = form.querySelector('[name="message"]')?.value.trim();

        if (!name || !phone || !email || !product || !date) {
            alert('Моля, попълнете всички задължителни полета отбелязани със звездичка (*).');
            return;
        }

        const phoneRegex = /^[0-9+\-\s]{7,16}$/;
        if (!phoneRegex.test(phone)) {
            alert('Моля, въведете валиден телефон за връзка.');
            return;
        }

        const refId = 'FLORA-' + Math.floor(100000 + Math.random() * 900000);

        const details = elements.confirmationDetails || document.getElementById('confirmation-details');
        const confirmationModal = elements.confirmationModal || document.getElementById('confirmation-modal');

        if (details && confirmationModal) {
            details.innerHTML = `
                <div class="bg-[#FFFDF5] p-4 sm:p-5 rounded-2xl border border-[#0D3B2E]/20 text-left text-xs space-y-2.5 mb-5 font-sans">
                    <div class="flex justify-between items-center border-b border-[#0D3B2E]/15 pb-2.5">
                        <span class="text-[#0D3B2E] uppercase tracking-wider font-bold">Номер на запитване:</span>
                        <strong class="font-mono text-[#FF4834] font-bold text-sm sm:text-base">${refId}</strong>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#111A16]/70">Клиент:</span>
                        <span class="font-bold text-[#111A16]">${name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#111A16]/70">Телефон:</span>
                        <span class="font-bold text-[#111A16] font-mono">${phone}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#111A16]/70">Имейл:</span>
                        <span class="font-medium text-[#111A16] truncate max-w-[180px]">${email}</span>
                    </div>
                    <div class="flex justify-between border-t border-[#0D3B2E]/15 pt-2">
                        <span class="text-[#111A16]/70">Аранжировка:</span>
                        <span class="font-bold text-[#FF4834] text-sm truncate max-w-[200px]">${product}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#111A16]/70">Дата на изпълнение:</span>
                        <span class="font-bold text-[#111A16]">${date}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#111A16]/70">Часови интервал:</span>
                        <span class="font-medium text-[#111A16]">${timeSlot}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[#111A16]/70">Начин на получаване:</span>
                        <span class="font-medium text-[#111A16] truncate max-w-[200px]">${delivery}</span>
                    </div>
                    ${destination ? `
                    <div class="flex justify-between border-t border-[#0D3B2E]/15 pt-2">
                        <span class="text-[#111A16]/70">Населено място / Адрес:</span>
                        <span class="font-bold text-[#FF4834] truncate max-w-[200px]">${destination}</span>
                    </div>
                    ` : ''}
                    ${occasion ? `
                    <div class="flex justify-between">
                        <span class="text-[#111A16]/70">Повод:</span>
                        <span class="font-medium text-[#111A16]">${occasion}</span>
                    </div>
                    ` : ''}
                    ${message ? `
                    <div class="border-t border-[#0D3B2E]/15 pt-2 text-[11px]">
                        <span class="block text-[#111A16]/70 mb-0.5">Послание за картичка:</span>
                        <p class="italic text-[#0D3B2E] bg-white/70 p-2 rounded-lg border border-[#0D3B2E]/10">„${message}“</p>
                    </div>
                    ` : ''}
                </div>
                <div class="text-center text-xs text-[#111A16]/80 mb-2">
                    Благодарим Ви! Наш флорист от ателие „Флора“ (гр. Тутракан) ще се свърже с Вас на посочения телефон за потвърждение на доставката.
                </div>
            `;

            confirmationModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        form.reset();
        setupDatePicker();
        if (window.FloraDeliveryMap && window.FloraDeliveryMap.updateProductPreview) {
            window.FloraDeliveryMap.updateProductPreview('');
        }
        const selectionPill = document.getElementById('map-selection-pill');
        if (selectionPill) selectionPill.classList.add('hidden');
    }

    function closeConfirmationModal() {
        const confirmationModal = elements.confirmationModal || document.getElementById('confirmation-modal');
        if (!confirmationModal) return;
        confirmationModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Toast Alert
    function showToast(msg) {
        const toast = elements.toast || document.getElementById('flora-toast');
        const toastMessage = elements.toastMessage || document.getElementById('toast-message');
        if (!toast || !toastMessage) return;
        toastMessage.textContent = msg;
        toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        toast.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');

        setTimeout(() => {
            toast.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }, 3200);
    }

    // Event Listeners
    function bindEvents() {
        const mobileMenuBtn = elements.mobileMenuBtn || document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
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

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const filter = target.getAttribute('data-filter') || target.textContent.trim().toLowerCase();
                state.activeFilter = filter;
                updateFilterButtonUI();
                renderCatalog();
            });
        });

        const searchInput = elements.searchInput || document.getElementById('catalog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                renderCatalog();
            });
        }

        const sortSelect = elements.sortSelect || document.getElementById('catalog-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                state.sortBy = e.target.value;
                renderCatalog();
            });
        }

        const orderForm = elements.orderForm || document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', handleOrderSubmit);
        }
    }

    window.FloraApp = {
        switchView,
        openMobileMenu,
        closeMobileMenu,
        toggleMobileMenu,
        openProductModalById: (id) => {
            const p = FLORA_PRODUCTS.find(item => item.id === id);
            if (p) openProductModal(p);
        },
        closeProductModal,
        orderProductDirectly,
        toggleFavorite,
        openFavoritesDrawer,
        closeFavoritesDrawer,
        closeConfirmationModal,
        showToast,
        scrollToDeliveryMap: () => {
            if (state.currentView !== 'contact') {
                switchView('contact');
            }
            const sec = document.getElementById('delivery-map-section');
            if (sec) {
                sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
