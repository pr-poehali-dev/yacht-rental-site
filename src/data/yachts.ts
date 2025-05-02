
export interface Yacht {
  id: string;
  name: string;
  type: string;
  length: number;
  capacity: number;
  cabins: number;
  bathrooms: number;
  year: number;
  description: string;
  pricePerDay: number;
  images: string[];
  features: string[];
  available: boolean;
  location: string;
}

export const yachts: Yacht[] = [
  {
    id: '1',
    name: 'Синяя птица',
    type: 'Парусная яхта',
    length: 12,
    capacity: 6,
    cabins: 2,
    bathrooms: 1,
    year: 2018,
    description: 'Элегантная парусная яхта идеально подходит для морских прогулок и путешествий вдоль побережья. Оснащена всем необходимым для комфортного отдыха до 6 человек. Просторная палуба для загара, современное навигационное оборудование, удобная кухня и обеденная зона.',
    pricePerDay: 25000,
    images: [
      'https://images.unsplash.com/photo-1566288623394-377af472d81b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1566288619102-02708f511cd2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1566288271540-6fcab0030600?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Кондиционер',
      'Холодильник',
      'Душ',
      'Аудиосистема',
      'Навигационное оборудование',
      'Тент от солнца'
    ],
    available: true,
    location: 'Севастополь'
  },
  {
    id: '2',
    name: 'Морской бриз',
    type: 'Моторная яхта',
    length: 15,
    capacity: 8,
    cabins: 3,
    bathrooms: 2,
    year: 2020,
    description: 'Современная моторная яхта с просторным салоном и открытой палубой. Идеальный вариант для активного отдыха на море, рыбалки или дневных прогулок вдоль живописного побережья. Высокая скорость и маневренность позволяют быстро достигать самых красивых бухт.',
    pricePerDay: 40000,
    images: [
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552463966-d4e9e636e44d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552463942-2f91445d98f8?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Кондиционер',
      'Холодильник',
      'Душ',
      'Телевизор',
      'Аудиосистема',
      'Водные игрушки',
      'Встроенный гриль',
      'Подводное освещение'
    ],
    available: true,
    location: 'Ялта'
  },
  {
    id: '3',
    name: 'Ласточка',
    type: 'Катамаран',
    length: 14,
    capacity: 10,
    cabins: 4,
    bathrooms: 2,
    year: 2019,
    description: 'Просторный и устойчивый катамаран, обеспечивающий максимальный комфорт даже при высоких волнах. Идеален для больших компаний и семейного отдыха. Большая площадь палубы позволяет комфортно разместиться всем пассажирам, а две кормовые платформы идеальны для купания.',
    pricePerDay: 35000,
    images: [
      'https://images.unsplash.com/photo-1588401273872-959d2076283d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542856391-717156985b3d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1666853836013-90daa9bdcc93?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Кондиционер',
      'Холодильник',
      'Душ',
      'Кухня',
      'Батут',
      'Плавательная платформа',
      'Солнечная панель',
      'Сеть для отдыха'
    ],
    available: true,
    location: 'Сочи'
  },
  {
    id: '4',
    name: 'Морская звезда',
    type: 'Парусная яхта',
    length: 13,
    capacity: 7,
    cabins: 3,
    bathrooms: 1,
    year: 2017,
    description: 'Классическая парусная яхта с впечатляющими ходовыми качествами и уютным интерьером. Подходит как для новичков, так и для опытных яхтсменов. Оснащена всем необходимым для длительных морских путешествий и коротких прогулок вдоль берега.',
    pricePerDay: 28000,
    images: [
      'https://images.unsplash.com/photo-1559742798-34f6c9effceb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584188237525-99a71a4bdf92?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1543134218-6b1f59e19024?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Кондиционер',
      'Холодильник',
      'Автопилот',
      'Радар',
      'Навигационное оборудование',
      'Солнечная палуба'
    ],
    available: true,
    location: 'Севастополь'
  },
  {
    id: '5',
    name: 'Адмирал',
    type: 'Моторная яхта',
    length: 18,
    capacity: 12,
    cabins: 4,
    bathrooms: 3,
    year: 2021,
    description: 'Престижная моторная яхта премиум-класса с роскошным интерьером и передовым техническим оснащением. Просторный флайбридж идеален для отдыха и проведения вечеринок. Мощные двигатели обеспечивают высокую скорость, а стабилизаторы — комфорт даже при неспокойном море.',
    pricePerDay: 65000,
    images: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552306062-29a5d9c1b8b7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551801841-ecad875a5142?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Джакузи',
      'Бар',
      'Кондиционер',
      'Спутниковое ТВ',
      'Wi-Fi',
      'Тендер',
      'Гидроцикл',
      'Стабилизаторы качки',
      'Система "умный дом"'
    ],
    available: true,
    location: 'Сочи'
  },
  {
    id: '6',
    name: 'Бриз',
    type: 'Катер',
    length: 8,
    capacity: 6,
    cabins: 1,
    bathrooms: 1,
    year: 2022,
    description: 'Компактный и быстрый катер для дневных морских прогулок, водных видов спорта и рыбалки. Идеален для активного отдыха в компании друзей. Оборудован современной аудиосистемой и платформой для купания.',
    pricePerDay: 15000,
    images: [
      'https://images.unsplash.com/photo-1618931443679-09ed80914134?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595583176635-e71b662d07df?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585420657707-7bfde76cc534?auto=format&fit=crop&q=80&w=800'
    ],
    features: [
      'Аудиосистема',
      'Холодильник',
      'Платформа для купания',
      'Складной тент',
      'Душ на корме',
      'Эхолот'
    ],
    available: true,
    location: 'Феодосия'
  }
];

// Функция для получения яхты по ID
export const getYachtById = (id: string): Yacht | undefined => {
  return yachts.find(yacht => yacht.id === id);
};

// Функция для фильтрации яхт
export const filterYachts = (
  type?: string,
  minCapacity?: number,
  maxPrice?: number,
  location?: string
): Yacht[] => {
  return yachts.filter(yacht => {
    if (type && yacht.type !== type) return false;
    if (minCapacity && yacht.capacity < minCapacity) return false;
    if (maxPrice && yacht.pricePerDay > maxPrice) return false;
    if (location && yacht.location !== location) return false;
    return true;
  });
};
