/**
 * FLORA TUTRAKAN - Interactive Delivery Area Map (Leaflet.js)
 * 60 km radius delivery zone with 126 cities and villages.
 */

(function () {
    'use strict';

    let map = null;
    let circle60 = null;
    let circle15 = null;
    let markersLayer = null;
    let markersMap = new Map(); // name.toLowerCase() -> { marker, data }
    let currentFilter = 'all';
    let isInitialized = false;

    function isMobileView() {
        return window.innerWidth < 768;
    }

    function getDeliveryTimeText(distance, isCenter) {
        if (isCenter) return 'Експресна доставка до 30-60 мин. в гр. Тутракан';
        if (distance <= 15) return 'Експресна доставка: 1 – 2 часа от заявката';
        if (distance <= 35) return 'Доставка в същия ден: 2 – 4 часа';
        return 'Ежедневна доставка с предварителен час в същия ден';
    }

    function initMap(containerId = 'delivery-map') {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.warn('Leaflet is not yet defined. Retrying in 250ms...');
            setTimeout(() => initMap(containerId), 250);
            return;
        }

        // If container is currently hidden (e.g. display: none inside an inactive tab),
        // DO NOT call L.map yet! Wait until it becomes visible with valid dimensions.
        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
            setupVisibilityObserver(container, containerId);
            return;
        }

        // If already initialized and has map instance, just invalidate size
        if (map && isInitialized) {
            map.invalidateSize();
            return;
        }

        // Check center data
        if (typeof FLORA_DELIVERY_CENTER === 'undefined' || typeof FLORA_DELIVERY_SETTLEMENTS === 'undefined') {
            console.warn('Delivery data not loaded yet. Retrying...');
            setTimeout(() => initMap(containerId), 250);
            return;
        }

        const centerLat = FLORA_DELIVERY_CENTER.lat;
        const centerLng = FLORA_DELIVERY_CENTER.lng;
        const initialZoom = isMobileView() ? 8.5 : 9.5;

        try {
            // Clean container in case of re-init
            if (map) {
                try { map.remove(); } catch (e) {}
                map = null;
            }

            // Initialize Leaflet Map
            map = L.map(containerId, {
                center: [centerLat, centerLng],
                zoom: initialZoom,
                minZoom: 7,
                maxZoom: 16,
                scrollWheelZoom: false,
                touchZoom: true,
                zoomControl: true
            });

            // Fast, reliable, high-detail OpenStreetMap tile layer (supports Bulgarian Cyrillic natively)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Layer group for all markers
            markersLayer = L.layerGroup().addTo(map);

            // 60 km outer radius circle (Electric Coral border with soft Apricot fill)
            circle60 = L.circle([centerLat, centerLng], {
                radius: 60000,
                color: '#FF4834',
                weight: 2.5,
                dashArray: '6, 6',
                fillColor: '#FFA451',
                fillOpacity: 0.08,
                interactive: false
            }).addTo(map);

            // 15 km inner express zone circle (Deep Juniper)
            circle15 = L.circle([centerLat, centerLng], {
                radius: 15000,
                color: '#0D3B2E',
                weight: 1.5,
                dashArray: '4, 4',
                fillColor: '#0D3B2E',
                fillOpacity: 0.04,
                interactive: false
            }).addTo(map);

            // Render all markers
            renderMarkers();

            // Render settlements directory browser
            renderDirectory();

            // Bind search, filter and product preview events
            bindControls();

            isInitialized = true;

            // Invalidate size once tiles start loading
            setTimeout(() => {
                if (map) map.invalidateSize();
            }, 250);

        } catch (err) {
            console.error('Error initializing Flora delivery map:', err);
        }
    }

    function setupVisibilityObserver(container, containerId) {
        if (container._visibilityObserverSetup) return;
        container._visibilityObserverSetup = true;

        if (window.ResizeObserver) {
            const ro = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                        ro.disconnect();
                        container._visibilityObserverSetup = false;
                        initMap(containerId);
                    }
                }
            });
            ro.observe(container);
        }
    }

    function createCenterIcon() {
        return L.divIcon({
            className: 'flora-center-marker-icon',
            html: `
                <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
                    <span style="position:absolute;width:36px;height:36px;border-radius:50%;background:rgba(255,72,52,0.35);animation:floraPing 1.6s cubic-bezier(0,0,0.2,1) infinite;"></span>
                    <span style="position:relative;width:32px;height:32px;border-radius:50%;background:#FF4834;color:#FFFDF5;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(255,72,52,0.5);border:2.5px solid #FFFFFF;font-size:14px;">
                        <i class="fa-solid fa-leaf"></i>
                    </span>
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
        });
    }

    function createCityIcon(name) {
        return L.divIcon({
            className: 'flora-city-marker-icon',
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
                    <div style="background:#0D3B2E;color:#FFFDF5;border:1px solid #FFA451;padding:2px 8px;border-radius:9999px;font-size:11px;font-family:sans-serif;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;gap:4px;">
                        <i class="fa-solid fa-city" style="color:#FFA451;font-size:9px;"></i>
                        <span>${name}</span>
                    </div>
                    <div style="width:10px;height:10px;background:#FF4834;border-radius:50%;border:2px solid #FFFFFF;box-shadow:0 2px 4px rgba(0,0,0,0.3);margin-top:-2px;"></div>
                </div>
            `,
            iconSize: [80, 28],
            iconAnchor: [40, 26],
            popupAnchor: [0, -26]
        });
    }

    function createVillageIcon() {
        return L.divIcon({
            className: 'flora-village-marker-icon',
            html: `
                <div style="width:12px;height:12px;background:#0D3B2E;border:2px solid #FFFFFF;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.15s, background-color 0.15s;"></div>
            `,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            popupAnchor: [0, -6]
        });
    }

    function createPopupContent(s) {
        const timeText = getDeliveryTimeText(s.distance, s.isCenter);
        const typeLabel = s.isCenter 
            ? 'Централен Магазин' 
            : (s.type === 'city' ? 'Град' : 'Село');
        const badgeClass = s.isCenter 
            ? 'bg-flora-coral text-white' 
            : (s.type === 'city' ? 'bg-flora-juniper text-flora-apricot' : 'bg-flora-juniper/10 text-flora-juniper');

        return `
            <div class="flora-popup-card font-sans p-2 min-w-[220px] max-w-[280px]">
                <div class="flex items-center justify-between border-b border-[#0D3B2E]/15 pb-2 mb-2">
                    <span class="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${badgeClass}">
                        ${typeLabel} &bull; Общ. ${s.obshtina}
                    </span>
                    <span class="font-mono text-xs font-bold text-[#FF4834]">
                        ${s.isCenter ? '0 км' : s.distance + ' км'}
                    </span>
                </div>
                
                <h4 class="font-serif italic font-bold text-lg text-[#0D3B2E] mb-1 leading-tight">
                    ${s.name}
                </h4>
                
                <p class="text-[11px] text-[#111A16]/80 mb-3 flex items-start gap-1.5 leading-snug">
                    <i class="fa-solid fa-truck text-[#FF4834] text-xs mt-0.5 shrink-0"></i>
                    <span>${timeText}</span>
                </p>
                
                <div class="flex items-center justify-between text-[10px] text-[#111A16]/60 border-t border-[#0D3B2E]/10 pt-2 mb-3">
                    <span>Зона на покритие:</span>
                    <strong class="text-[#0D3B2E]">Радиус 60 км</strong>
                </div>

                <button 
                    type="button" 
                    onclick="window.FloraDeliveryMap.selectSettlement('${s.name}', ${s.distance})" 
                    class="w-full bg-[#FF4834] hover:bg-[#FFA451] text-white text-[11px] font-sans uppercase tracking-wider font-bold py-2.5 px-3 rounded-xl shadow-md shadow-[#FF4834]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                >
                    <i class="fa-solid fa-check text-[10px]"></i>
                    <span>Избери за доставка</span>
                </button>
            </div>
        `;
    }

    function renderMarkers() {
        if (!markersLayer) return;
        markersLayer.clearLayers();
        markersMap.clear();

        FLORA_DELIVERY_SETTLEMENTS.forEach(s => {
            // Apply current filter
            if (currentFilter === 'city' && s.type !== 'city') return;
            if (currentFilter === 'express' && s.distance > 15) return;
            if (currentFilter === 'near' && (s.distance <= 15 || s.distance > 35)) return;
            if (currentFilter === 'regional' && s.distance <= 35) return;

            let icon;
            if (s.isCenter) {
                icon = createCenterIcon();
            } else if (s.type === 'city') {
                icon = createCityIcon(s.name);
            } else {
                icon = createVillageIcon();
            }

            const marker = L.marker([s.lat, s.lng], { icon, title: s.name });

            // Popup
            marker.bindPopup(createPopupContent(s), {
                maxWidth: 300,
                className: 'flora-custom-leaflet-popup'
            });

            // Tooltip on hover
            marker.bindTooltip(`<strong>${s.name}</strong> (${s.distance} км)`, {
                direction: 'top',
                offset: [0, -10],
                className: 'flora-leaflet-tooltip'
            });

            marker.addTo(markersLayer);
            markersMap.set(s.name.toLowerCase(), { marker, data: s });
        });

        updateStatsCounter();
    }

    function updateStatsCounter() {
        const countBadges = document.querySelectorAll('#delivery-active-count');
        countBadges.forEach(b => {
            b.textContent = markersMap.size;
        });
    }

    function setFilter(filterType) {
        currentFilter = filterType;
        renderMarkers();

        // Update UI pill buttons
        document.querySelectorAll('[data-delivery-filter]').forEach(btn => {
            if (btn.getAttribute('data-delivery-filter') === filterType) {
                btn.classList.add('bg-[#FF4834]', 'text-white', 'border-[#FF4834]');
                btn.classList.remove('bg-white', 'text-[#0D3B2E]', 'border-[#0D3B2E]/20');
            } else {
                btn.classList.remove('bg-[#FF4834]', 'text-white', 'border-[#FF4834]');
                btn.classList.add('bg-white', 'text-[#0D3B2E]', 'border-[#0D3B2E]/20');
            }
        });
    }

    function focusSettlementByName(rawName) {
        if (!map) {
            initMap();
        }
        if (!map) return;

        const clean = rawName.trim().toLowerCase();
        
        let found = null;
        for (const [name, item] of markersMap.entries()) {
            if (name === clean || name.includes(clean) || clean.includes(name.replace(/^(гр\.|с\.)\s*/, ''))) {
                found = item;
                break;
            }
        }

        if (!found) {
            const rawMatch = FLORA_DELIVERY_SETTLEMENTS.find(s => 
                s.name.toLowerCase().includes(clean) || clean.includes(s.name.toLowerCase().replace(/^(гр\.|с\.)\s*/, ''))
            );
            if (rawMatch) {
                setFilter('all');
                found = markersMap.get(rawMatch.name.toLowerCase());
            }
        }

        if (found) {
            map.flyTo([found.data.lat, found.data.lng], 13, {
                duration: 1.2
            });
            setTimeout(() => {
                found.marker.openPopup();
            }, 1250);
        } else {
            alert(`Населеното място "${rawName}" не е намерено в списъка или е извън 60 км радиус.`);
        }
    }

    function resetMapView() {
        if (!map || !circle60) return;
        setFilter('all');
        const searchInputs = document.querySelectorAll('#delivery-search-input');
        searchInputs.forEach(i => i.value = '');
        map.fitBounds(circle60.getBounds(), { padding: [20, 20], maxZoom: 10 });
    }

    function selectSettlement(name, distance) {
        const destInput = document.getElementById('order-destination') || document.getElementById('destination');
        const deliverySelect = document.getElementById('order-delivery') || document.getElementById('delivery');
        
        if (destInput) {
            destInput.value = name;
            destInput.classList.add('ring-2', 'ring-[#FF4834]');
            setTimeout(() => {
                destInput.classList.remove('ring-2', 'ring-[#FF4834]');
            }, 2500);
        }

        // Update live selection confirmation pill
        const selectionPill = document.getElementById('map-selection-pill');
        const selectionText = document.getElementById('map-selection-text');
        if (selectionPill && selectionText) {
            selectionText.textContent = `Избрано населено място: ${name} (~${distance} км)`;
            selectionPill.classList.remove('hidden');
        }

        // Set delivery select
        if (deliverySelect) {
            if (name.includes('Тутракан')) {
                deliverySelect.value = 'Доставка до адрес в гр. Тутракан';
            } else {
                let foundOption = false;
                for (let i = 0; i < deliverySelect.options.length; i++) {
                    if (deliverySelect.options[i].value.includes('регион') || deliverySelect.options[i].value.includes('60 км')) {
                        deliverySelect.selectedIndex = i;
                        foundOption = true;
                        break;
                    }
                }
                if (!foundOption) {
                    deliverySelect.value = 'Доставка за населените места в региона (до 60 км)';
                }
            }
        }

        if (window.FloraApp && typeof window.FloraApp.showToast === 'function') {
            window.FloraApp.showToast(`Избрахте ${name} за доставка (${distance} км от Тутракан)`);
        }

        // On mobile, scroll smoothly to the destination input
        if (isMobileView() && destInput) {
            destInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            destInput.focus();
        }
    }

    function renderDirectory() {
        const containers = document.querySelectorAll('#delivery-directory-list');
        if (!containers.length) return;

        const byObshtina = {};
        FLORA_DELIVERY_SETTLEMENTS.forEach(s => {
            if (!byObshtina[s.obshtina]) byObshtina[s.obshtina] = [];
            byObshtina[s.obshtina].push(s);
        });

        let html = '';
        const obshtiniNames = Object.keys(byObshtina).sort();

        obshtiniNames.forEach(obshtina => {
            const list = byObshtina[obshtina];
            html += `
                <div class="border border-[#0D3B2E]/10 rounded-xl overflow-hidden bg-white mb-2 shadow-xs">
                    <button 
                        type="button" 
                        onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.arrow-icon').classList.toggle('rotate-180');" 
                        class="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0D3B2E]/5 transition-colors cursor-pointer"
                    >
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-map-pin text-[#FF4834] text-xs"></i>
                            <span class="font-bold text-xs text-[#0D3B2E]">Община ${obshtina}</span>
                            <span class="text-[10px] bg-[#0D3B2E]/10 text-[#0D3B2E] font-bold px-1.5 py-0.2 rounded-full">${list.length}</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-xs text-[#0D3B2E]/50 transition-transform arrow-icon"></i>
                    </button>
                    <div class="hidden px-3.5 py-2 bg-[#FFFDF5] border-t border-[#0D3B2E]/10 max-h-48 overflow-y-auto space-y-1 text-xs">
                        ${list.map(s => `
                            <div 
                                onclick="window.FloraDeliveryMap.focusSettlement('${s.name}')" 
                                class="flex items-center justify-between p-1.5 rounded hover:bg-[#FF4834]/10 cursor-pointer transition-colors group"
                            >
                                <span class="font-medium text-[#111A16] group-hover:text-[#FF4834] transition-colors flex items-center gap-1.5">
                                    <i class="fa-solid ${s.type === 'city' ? 'fa-city text-[#FF4834]' : 'fa-circle text-[6px] text-[#0D3B2E]/40'}"></i>
                                    <span>${s.name}</span>
                                </span>
                                <span class="font-mono text-[11px] text-[#0D3B2E]/60">${s.distance} км</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        containers.forEach(c => {
            c.innerHTML = html;
        });
    }

    function updateProductPreview(productName) {
        const previewWrap = document.getElementById('selected-product-preview');
        const previewImg = document.getElementById('selected-product-img');
        const previewName = document.getElementById('selected-product-name');
        const previewCat = document.getElementById('selected-product-cat');
        const previewPrice = document.getElementById('selected-product-price');

        if (!previewWrap || !previewName) return;

        if (!productName || typeof FLORA_PRODUCTS === 'undefined') {
            previewWrap.classList.add('hidden');
            return;
        }

        const product = FLORA_PRODUCTS.find(p => p.name === productName);
        if (product) {
            previewName.textContent = product.name;
            if (previewCat) previewCat.textContent = `${product.categoryLabel} • ${product.subtitle || ''}`;
            if (previewPrice) previewPrice.textContent = `${product.price.toFixed(2)} лв.`;
            if (previewImg) {
                previewImg.src = product.image;
                previewImg.alt = product.name;
            }
            previewWrap.classList.remove('hidden');
        } else {
            previewWrap.classList.add('hidden');
        }
    }

    function bindControls() {
        const searchInput = document.getElementById('delivery-search-input');
        const searchResults = document.getElementById('delivery-search-results');

        if (searchInput && searchResults && !searchInput._bound) {
            searchInput._bound = true;
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value.trim().toLowerCase();
                if (val.length < 1) {
                    searchResults.classList.add('hidden');
                    searchResults.innerHTML = '';
                    return;
                }

                const matches = FLORA_DELIVERY_SETTLEMENTS.filter(s => 
                    s.name.toLowerCase().includes(val) || s.obshtina.toLowerCase().includes(val)
                ).slice(0, 8);

                if (matches.length === 0) {
                    searchResults.innerHTML = `
                        <div class="p-3 text-xs text-[#111A16]/60 text-center">
                            Няма открито населено място в радиус 60 км.
                        </div>
                    `;
                } else {
                    searchResults.innerHTML = matches.map(s => `
                        <div 
                            onclick="window.FloraDeliveryMap.focusSettlement('${s.name}'); document.getElementById('delivery-search-results').classList.add('hidden'); document.getElementById('delivery-search-input').value = '${s.name}';" 
                            class="px-3.5 py-2 hover:bg-[#FF4834]/10 cursor-pointer flex items-center justify-between text-xs border-b border-[#0D3B2E]/10 last:border-b-0"
                        >
                            <span class="font-bold text-[#0D3B2E] flex items-center gap-1.5">
                                <i class="fa-solid ${s.type === 'city' ? 'fa-city text-[#FF4834]' : 'fa-location-dot text-[#0D3B2E]/50'} text-xs"></i>
                                <span>${s.name}</span>
                                <span class="text-[10px] text-[#111A16]/50 font-normal">(общ. ${s.obshtina})</span>
                            </span>
                            <span class="font-mono text-[#FF4834] font-bold">${s.distance} км</span>
                        </div>
                    `).join('');
                }

                searchResults.classList.remove('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    searchResults.classList.add('hidden');
                }
            });
        }

        const resetBtn = document.getElementById('btn-reset-map-view');
        if (resetBtn && !resetBtn._bound) {
            resetBtn._bound = true;
            resetBtn.addEventListener('click', resetMapView);
        }

        document.querySelectorAll('[data-delivery-filter]').forEach(btn => {
            if (!btn._bound) {
                btn._bound = true;
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-delivery-filter');
                    setFilter(filter);
                });
            }
        });

        // Product selection live preview
        const productSelect = document.getElementById('product-select');
        if (productSelect && !productSelect._previewBound) {
            productSelect._previewBound = true;
            productSelect.addEventListener('change', (e) => {
                updateProductPreview(e.target.value);
            });
            if (productSelect.value) {
                updateProductPreview(productSelect.value);
            }
        }
    }

    // Public API
    window.FloraDeliveryMap = {
        init: initMap,
        invalidateSize: () => {
            if (map) {
                map.invalidateSize();
            } else {
                initMap();
            }
        },
        focusSettlement: focusSettlementByName,
        selectSettlement: selectSettlement,
        resetView: resetMapView,
        setFilter: setFilter,
        updateProductPreview: updateProductPreview
    };

    // Auto-init on load if container is visible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initMap());
    } else {
        initMap();
    }

})();
