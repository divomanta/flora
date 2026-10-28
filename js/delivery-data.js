/**
 * FLORA TUTRAKAN - Delivery Area Dataset
 * Comprehensive list of all 126 cities and villages within a 60 km radius of Tutrakan.
 * Center: гр. Тутракан (44.0494 N, 26.6119 E), ул. Родина 18
 */
const FLORA_DELIVERY_CENTER = {
    name: 'гр. Тутракан',
    address: 'ул. Родина 18, гр. Тутракан',
    lat: 44.0494,
    lng: 26.6119,
    maxRadiusKm: 60
};

const FLORA_DELIVERY_SETTLEMENTS = [
    // Община Тутракан (15)
    { name: 'гр. Тутракан', type: 'city', lat: 44.0494, lng: 26.6119, obshtina: 'Тутракан', distance: 0.0, isCenter: true, tier: 'express' },
    { name: 'с. Шуменци', type: 'village', lat: 44.0133, lng: 26.6383, obshtina: 'Тутракан', distance: 4.5, tier: 'express' },
    { name: 'с. Царев дол', type: 'village', lat: 44.0000, lng: 26.5917, obshtina: 'Тутракан', distance: 5.7, tier: 'express' },
    { name: 'с. Антимово', type: 'village', lat: 43.9967, lng: 26.6083, obshtina: 'Тутракан', distance: 5.9, tier: 'express' },
    { name: 'с. Старо село', type: 'village', lat: 44.0150, lng: 26.5400, obshtina: 'Тутракан', distance: 6.9, tier: 'express' },
    { name: 'с. Пожарево', type: 'village', lat: 44.0533, lng: 26.6983, obshtina: 'Тутракан', distance: 6.9, tier: 'express' },
    { name: 'с. Варненци', type: 'village', lat: 43.9967, lng: 26.6917, obshtina: 'Тутракан', distance: 8.7, tier: 'express' },
    { name: 'с. Бреница', type: 'village', lat: 43.9633, lng: 26.6217, obshtina: 'Тутракан', distance: 9.6, tier: 'express' },
    { name: 'с. Сяново', type: 'village', lat: 44.0083, lng: 26.4950, obshtina: 'Тутракан', distance: 10.4, tier: 'express' },
    { name: 'с. Белица', type: 'village', lat: 43.9533, lng: 26.6667, obshtina: 'Тутракан', distance: 11.5, tier: 'express' },
    { name: 'с. Дунавец', type: 'village', lat: 44.0683, lng: 26.7567, obshtina: 'Тутракан', distance: 11.8, tier: 'express' },
    { name: 'с. Търновци', type: 'village', lat: 43.9800, lng: 26.5500, obshtina: 'Тутракан', distance: 12.1, tier: 'express' },
    { name: 'с. Нова Черна', type: 'village', lat: 43.9983, lng: 26.4717, obshtina: 'Тутракан', distance: 12.6, tier: 'express' },
    { name: 'с. Преславци', type: 'village', lat: 43.9333, lng: 26.7050, obshtina: 'Тутракан', distance: 14.9, tier: 'express' },
    { name: 'с. Цар Самуил', type: 'village', lat: 43.9717, lng: 26.4417, obshtina: 'Тутракан', distance: 16.1, tier: 'near' },

    // Община Главиница (22)
    { name: 'с. Долно Ряхово', type: 'village', lat: 44.0700, lng: 26.7900, obshtina: 'Главиница', distance: 14.4, tier: 'express' },
    { name: 'с. Зафирово', type: 'village', lat: 44.0150, lng: 26.8333, obshtina: 'Главиница', distance: 18.1, tier: 'near' },
    { name: 'с. Малък Преславец', type: 'village', lat: 44.0950, lng: 26.8333, obshtina: 'Главиница', distance: 18.4, tier: 'near' },
    { name: 'с. Косара', type: 'village', lat: 43.9850, lng: 26.8400, obshtina: 'Главиница', distance: 19.6, tier: 'near' },
    { name: 'гр. Главиница', type: 'city', lat: 43.9567, lng: 26.8367, obshtina: 'Главиница', distance: 20.7, tier: 'near' },
    { name: 'с. Черногор', type: 'village', lat: 43.9750, lng: 26.8750, obshtina: 'Главиница', distance: 21.5, tier: 'near' },
    { name: 'с. Калугерене', type: 'village', lat: 43.9683, lng: 26.8850, obshtina: 'Главиница', distance: 22.0, tier: 'near' },
    { name: 'с. Сокол', type: 'village', lat: 43.9400, lng: 26.8600, obshtina: 'Главиница', distance: 23.3, tier: 'near' },
    { name: 'с. Коларово', type: 'village', lat: 43.9217, lng: 26.8500, obshtina: 'Главиница', distance: 23.4, tier: 'near' },
    { name: 'с. Бащино', type: 'village', lat: 43.9283, lng: 26.8833, obshtina: 'Главиница', distance: 23.5, tier: 'near' },
    { name: 'с. Ножарево', type: 'village', lat: 43.9050, lng: 26.8200, obshtina: 'Главиница', distance: 24.0, tier: 'near' },
    { name: 'с. Вълкан', type: 'village', lat: 43.8967, lng: 26.8667, obshtina: 'Главиница', distance: 24.8, tier: 'near' },
    { name: 'с. Стефан Караджа', type: 'village', lat: 43.9100, lng: 26.8833, obshtina: 'Главиница', distance: 25.0, tier: 'near' },
    { name: 'с. Богданци', type: 'village', lat: 43.8833, lng: 26.8167, obshtina: 'Главиница', distance: 25.1, tier: 'near' },
    { name: 'с. Падина', type: 'village', lat: 43.8800, lng: 26.8500, obshtina: 'Главиница', distance: 25.5, tier: 'near' },
    { name: 'с. Листец', type: 'village', lat: 43.8750, lng: 26.8833, obshtina: 'Главиница', distance: 26.2, tier: 'near' },
    { name: 'с. Звенимир', type: 'village', lat: 43.8617, lng: 26.8500, obshtina: 'Главиница', distance: 26.5, tier: 'near' },
    { name: 'с. Осен', type: 'village', lat: 43.9167, lng: 26.9333, obshtina: 'Главиница', distance: 26.8, tier: 'near' },
    { name: 'с. Подлес', type: 'village', lat: 43.8833, lng: 26.9167, obshtina: 'Главиница', distance: 27.0, tier: 'near' },
    { name: 'с. Дичево', type: 'village', lat: 43.8667, lng: 26.9000, obshtina: 'Главиница', distance: 27.2, tier: 'near' },
    { name: 'с. Зебил', type: 'village', lat: 43.8500, lng: 26.8833, obshtina: 'Главиница', distance: 28.0, tier: 'near' },
    { name: 'с. Суходол', type: 'village', lat: 43.9050, lng: 26.9033, obshtina: 'Главиница', distance: 28.3, tier: 'near' },

    // Община Сливо поле (11)
    { name: 'с. Бръшлен', type: 'village', lat: 43.9950, lng: 26.3700, obshtina: 'Сливо поле', distance: 20.3, tier: 'near' },
    { name: 'с. Бабово', type: 'village', lat: 43.9817, lng: 26.2950, obshtina: 'Сливо поле', distance: 26.4, tier: 'near' },
    { name: 'с. Борисово', type: 'village', lat: 43.9600, lng: 26.2750, obshtina: 'Сливо поле', distance: 28.7, tier: 'near' },
    { name: 'с. Голямо Враново', type: 'village', lat: 43.9167, lng: 26.2983, obshtina: 'Сливо поле', distance: 29.1, tier: 'near' },
    { name: 'с. Ряхово', type: 'village', lat: 43.9917, lng: 26.2417, obshtina: 'Сливо поле', distance: 30.3, tier: 'near' },
    { name: 'с. Малко Враново', type: 'village', lat: 43.9217, lng: 26.2617, obshtina: 'Сливо поле', distance: 31.4, tier: 'near' },
    { name: 'с. Черешово', type: 'village', lat: 43.8800, lng: 26.3100, obshtina: 'Сливо поле', distance: 31.8, tier: 'near' },
    { name: 'с. Стамболово', type: 'village', lat: 43.9000, lng: 26.2700, obshtina: 'Сливо поле', distance: 33.2, tier: 'near' },
    { name: 'гр. Сливо поле', type: 'city', lat: 43.9417, lng: 26.2200, obshtina: 'Сливо поле', distance: 33.6, tier: 'near' },
    { name: 'с. Кошарна', type: 'village', lat: 43.8850, lng: 26.2600, obshtina: 'Сливо поле', distance: 34.0, tier: 'near' },
    { name: 'с. Юделник', type: 'village', lat: 43.8700, lng: 26.3400, obshtina: 'Сливо поле', distance: 35.5, tier: 'regional' },

    // Община Кубрат (15)
    { name: 'с. Юпер', type: 'village', lat: 43.9117, lng: 26.3983, obshtina: 'Кубрат', distance: 22.9, tier: 'near' },
    { name: 'с. Бисерци', type: 'village', lat: 43.8650, lng: 26.4400, obshtina: 'Кубрат', distance: 24.7, tier: 'near' },
    { name: 'с. Беловец', type: 'village', lat: 43.8650, lng: 26.3650, obshtina: 'Кубрат', distance: 27.5, tier: 'near' },
    { name: 'с. Божурово', type: 'village', lat: 43.8500, lng: 26.4900, obshtina: 'Кубрат', distance: 27.8, tier: 'near' },
    { name: 'с. Задруга', type: 'village', lat: 43.8333, lng: 26.4250, obshtina: 'Кубрат', distance: 28.3, tier: 'near' },
    { name: 'гр. Кубрат', type: 'city', lat: 43.7967, lng: 26.4967, obshtina: 'Кубрат', distance: 29.6, tier: 'near' },
    { name: 'с. Севар', type: 'village', lat: 43.8050, lng: 26.4350, obshtina: 'Кубрат', distance: 30.6, tier: 'near' },
    { name: 'с. Медовене', type: 'village', lat: 43.7900, lng: 26.4600, obshtina: 'Кубрат', distance: 31.0, tier: 'near' },
    { name: 'с. Точилари', type: 'village', lat: 43.7850, lng: 26.5300, obshtina: 'Кубрат', distance: 31.5, tier: 'near' },
    { name: 'с. Тертер', type: 'village', lat: 43.8500, lng: 26.5400, obshtina: 'Кубрат', distance: 32.0, tier: 'near' },
    { name: 'с. Горичево', type: 'village', lat: 43.7800, lng: 26.5600, obshtina: 'Кубрат', distance: 32.1, tier: 'near' },
    { name: 'с. Звънарци', type: 'village', lat: 43.7650, lng: 26.4500, obshtina: 'Кубрат', distance: 32.5, tier: 'near' },
    { name: 'с. Сеслав', type: 'village', lat: 43.7700, lng: 26.3900, obshtina: 'Кубрат', distance: 33.0, tier: 'near' },
    { name: 'с. Савин', type: 'village', lat: 43.7800, lng: 26.4300, obshtina: 'Кубрат', distance: 33.5, tier: 'near' },
    { name: 'с. Мъдрево', type: 'village', lat: 43.8200, lng: 26.6300, obshtina: 'Кубрат', distance: 34.2, tier: 'near' },

    // Община Завет (7)
    { name: 'с. Брестовене', type: 'village', lat: 43.8217, lng: 26.7217, obshtina: 'Завет', distance: 26.8, tier: 'near' },
    { name: 'гр. Завет', type: 'city', lat: 43.7617, lng: 26.6717, obshtina: 'Завет', distance: 32.3, tier: 'near' },
    { name: 'с. Сушево', type: 'village', lat: 43.7800, lng: 26.6100, obshtina: 'Завет', distance: 34.0, tier: 'near' },
    { name: 'с. Веселец', type: 'village', lat: 43.7300, lng: 26.6900, obshtina: 'Завет', distance: 35.1, tier: 'regional' },
    { name: 'с. Прелез', type: 'village', lat: 43.7400, lng: 26.7300, obshtina: 'Завет', distance: 36.5, tier: 'regional' },
    { name: 'с. Иван Шишманово', type: 'village', lat: 43.7000, lng: 26.7200, obshtina: 'Завет', distance: 38.0, tier: 'regional' },
    { name: 'с. Острово', type: 'village', lat: 43.6933, lng: 26.6117, obshtina: 'Завет', distance: 39.6, tier: 'regional' },

    // Община Ситово (12)
    { name: 'с. Попина', type: 'village', lat: 44.1167, lng: 26.9500, obshtina: 'Ситово', distance: 27.5, tier: 'near' },
    { name: 'с. Нова Попина', type: 'village', lat: 44.0833, lng: 26.9667, obshtina: 'Ситово', distance: 28.0, tier: 'near' },
    { name: 'с. Гарван', type: 'village', lat: 44.1000, lng: 26.9000, obshtina: 'Ситово', distance: 28.5, tier: 'near' },
    { name: 'с. Искра', type: 'village', lat: 44.0050, lng: 26.9733, obshtina: 'Ситово', distance: 29.3, tier: 'near' },
    { name: 'с. Слатина', type: 'village', lat: 43.9900, lng: 27.0300, obshtina: 'Ситово', distance: 31.2, tier: 'near' },
    { name: 'с. Любен', type: 'village', lat: 43.9700, lng: 27.0200, obshtina: 'Ситово', distance: 32.0, tier: 'near' },
    { name: 'с. Ситово', type: 'village', lat: 44.0200, lng: 27.0200, obshtina: 'Ситово', distance: 32.8, tier: 'near' },
    { name: 'с. Босна', type: 'village', lat: 43.9500, lng: 27.0000, obshtina: 'Ситово', distance: 34.5, tier: 'near' },
    { name: 'с. Поляна', type: 'village', lat: 43.9400, lng: 27.0300, obshtina: 'Ситово', distance: 34.8, tier: 'near' },
    { name: 'с. Ирник', type: 'village', lat: 43.9300, lng: 27.0000, obshtina: 'Ситово', distance: 35.0, tier: 'near' },
    { name: 'с. Ястребна', type: 'village', lat: 43.9100, lng: 27.0200, obshtina: 'Ситово', distance: 36.0, tier: 'regional' },
    { name: 'с. Добротица', type: 'village', lat: 43.9600, lng: 27.0700, obshtina: 'Ситово', distance: 36.2, tier: 'regional' },

    // Община Силистра (12)
    { name: 'с. Ветрен', type: 'village', lat: 44.1300, lng: 27.0317, obshtina: 'Силистра', distance: 34.7, tier: 'near' },
    { name: 'с. Сребърна', type: 'village', lat: 44.1050, lng: 27.0617, obshtina: 'Силистра', distance: 36.5, tier: 'regional' },
    { name: 'с. Смилец', type: 'village', lat: 44.0200, lng: 27.1000, obshtina: 'Силистра', distance: 39.0, tier: 'regional' },
    { name: 'с. Професор Иширково', type: 'village', lat: 44.0100, lng: 27.1600, obshtina: 'Силистра', distance: 41.5, tier: 'regional' },
    { name: 'с. Ценович', type: 'village', lat: 44.0600, lng: 27.1300, obshtina: 'Силистра', distance: 42.0, tier: 'regional' },
    { name: 'с. Срацимир', type: 'village', lat: 43.9900, lng: 27.2100, obshtina: 'Силистра', distance: 43.5, tier: 'regional' },
    { name: 'с. Айдемир', type: 'village', lat: 44.1000, lng: 27.1667, obshtina: 'Силистра', distance: 44.7, tier: 'regional' },
    { name: 'с. Богорово', type: 'village', lat: 44.0300, lng: 27.2300, obshtina: 'Силистра', distance: 46.0, tier: 'regional' },
    { name: 'с. Бабушка', type: 'village', lat: 44.0500, lng: 27.2000, obshtina: 'Силистра', distance: 47.0, tier: 'regional' },
    { name: 'с. Калипетрово', type: 'village', lat: 44.0800, lng: 27.2400, obshtina: 'Силистра', distance: 48.5, tier: 'regional' },
    { name: 'с. Българка', type: 'village', lat: 44.0000, lng: 27.2600, obshtina: 'Силистра', distance: 49.5, tier: 'regional' },
    { name: 'гр. Силистра', type: 'city', lat: 44.1167, lng: 27.2600, obshtina: 'Силистра', distance: 52.3, tier: 'regional' },

    // Община Дулово (11)
    { name: 'с. Черковна', type: 'village', lat: 43.8800, lng: 27.0100, obshtina: 'Дулово', distance: 38.5, tier: 'regional' },
    { name: 'с. Окорш', type: 'village', lat: 43.8900, lng: 27.0600, obshtina: 'Дулово', distance: 39.5, tier: 'regional' },
    { name: 'с. Паисиево', type: 'village', lat: 43.8600, lng: 27.0300, obshtina: 'Дулово', distance: 41.0, tier: 'regional' },
    { name: 'с. Водно', type: 'village', lat: 43.8400, lng: 27.0500, obshtina: 'Дулово', distance: 42.5, tier: 'regional' },
    { name: 'с. Межден', type: 'village', lat: 43.8700, lng: 27.1200, obshtina: 'Дулово', distance: 43.5, tier: 'regional' },
    { name: 'с. Руйно', type: 'village', lat: 43.8300, lng: 27.0900, obshtina: 'Дулово', distance: 44.0, tier: 'regional' },
    { name: 'с. Правда', type: 'village', lat: 43.8100, lng: 27.0800, obshtina: 'Дулово', distance: 45.0, tier: 'regional' },
    { name: 'с. Златоклас', type: 'village', lat: 43.8100, lng: 27.1600, obshtina: 'Дулово', distance: 46.0, tier: 'regional' },
    { name: 'с. Яребица', type: 'village', lat: 43.8000, lng: 27.1000, obshtina: 'Дулово', distance: 46.5, tier: 'regional' },
    { name: 'с. Черник', type: 'village', lat: 43.8400, lng: 27.1700, obshtina: 'Дулово', distance: 47.0, tier: 'regional' },
    { name: 'гр. Дулово', type: 'city', lat: 43.8233, lng: 27.1400, obshtina: 'Дулово', distance: 49.2, tier: 'regional' },

    // Община Исперих (10)
    { name: 'с. Вазово', type: 'village', lat: 43.7600, lng: 26.8300, obshtina: 'Исперих', distance: 35.0, tier: 'near' },
    { name: 'с. Свещари', type: 'village', lat: 43.7400, lng: 26.7800, obshtina: 'Исперих', distance: 36.5, tier: 'regional' },
    { name: 'с. Малък Поровец', type: 'village', lat: 43.7500, lng: 26.8700, obshtina: 'Исперих', distance: 37.0, tier: 'regional' },
    { name: 'с. Голям Поровец', type: 'village', lat: 43.7300, lng: 26.8800, obshtina: 'Исперих', distance: 38.5, tier: 'regional' },
    { name: 'с. Драгомъж', type: 'village', lat: 43.7350, lng: 26.8300, obshtina: 'Исперих', distance: 39.0, tier: 'regional' },
    { name: 'гр. Исперих', type: 'city', lat: 43.7167, lng: 26.8333, obshtina: 'Исперих', distance: 41.0, tier: 'regional' },
    { name: 'с. Лъвино', type: 'village', lat: 43.7000, lng: 26.8900, obshtina: 'Исперих', distance: 43.0, tier: 'regional' },
    { name: 'с. Лудогорци', type: 'village', lat: 43.7100, lng: 26.9200, obshtina: 'Исперих', distance: 44.5, tier: 'regional' },
    { name: 'с. Китанчево', type: 'village', lat: 43.6800, lng: 26.8700, obshtina: 'Исперих', distance: 45.0, tier: 'regional' },
    { name: 'с. Подайва', type: 'village', lat: 43.7300, lng: 26.9600, obshtina: 'Исперих', distance: 46.0, tier: 'regional' },

    // Област Русе & Ветово (11)
    { name: 'с. Тетово', type: 'village', lat: 43.8300, lng: 26.2800, obshtina: 'Русе', distance: 33.5, tier: 'near' },
    { name: 'с. Смирненски', type: 'village', lat: 43.8100, lng: 26.3100, obshtina: 'Ветово', distance: 36.0, tier: 'regional' },
    { name: 'гр. Глоджево', type: 'city', lat: 43.7383, lng: 26.3900, obshtina: 'Ветово', distance: 38.9, tier: 'regional' },
    { name: 'с. Ново село', type: 'village', lat: 43.8100, lng: 26.1900, obshtina: 'Русе', distance: 39.0, tier: 'regional' },
    { name: 'с. Сандрово', type: 'village', lat: 43.9317, lng: 26.1183, obshtina: 'Русе', distance: 41.6, tier: 'regional' },
    { name: 'гр. Мартен', type: 'city', lat: 43.9217, lng: 26.0800, obshtina: 'Русе', distance: 44.9, tier: 'regional' },
    { name: 'с. Червена вода', type: 'village', lat: 43.8200, lng: 26.1400, obshtina: 'Русе', distance: 46.5, tier: 'regional' },
    { name: 'с. Николово', type: 'village', lat: 43.8700, lng: 26.0717, obshtina: 'Русе', distance: 47.6, tier: 'regional' },
    { name: 'гр. Ветово', type: 'city', lat: 43.7000, lng: 26.2667, obshtina: 'Ветово', distance: 47.7, tier: 'regional' },
    { name: 'гр. Сеново', type: 'city', lat: 43.6500, lng: 26.3667, obshtina: 'Ветово', distance: 48.6, tier: 'regional' },
    { name: 'гр. Русе', type: 'city', lat: 43.8486, lng: 25.9544, obshtina: 'Русе', distance: 57.2, tier: 'regional' }
];

// Ensure ascending order by distance
FLORA_DELIVERY_SETTLEMENTS.sort((a, b) => a.distance - b.distance);

