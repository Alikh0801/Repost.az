import type { AppLocale } from "../../i18n/types";
import type { CatalogId } from "../types/catalog";
import {
  createExtraCategoryNewsSeeds,
  type NewsSeed,
} from "./category-news-extra";

export type CategoryNewsItem = {
  id: string;
  category: CatalogId;
  title: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  viewCount: number;
};

const BASE_SEEDS: NewsSeed[] = [
  // Siyasət
  {
    id: "pol-1",
    category: "politics",
    titleAz: "Parlamentdə büdcə müzakirələri davam edir",
    titleRu: "В парламенте продолжаются обсуждения бюджета",
    altAz: "Parlament binası",
    altRu: "Здание парламента",
    imageUrl:
      "https://images.unsplash.com/photo-1541873676-a18131494186?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-23T11:20:00",
    viewCount: 18420,
  },
  {
    id: "pol-2",
    category: "politics",
    titleAz: "Xarici işlər naziri regional görüşdə iştirak edəcək",
    titleRu: "Министр иностранных дел примет участие в региональной встрече",
    altAz: "Diplomatik görüş",
    altRu: "Дипломатическая встреча",
    imageUrl:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-23T08:45:00",
    viewCount: 9320,
  },
  {
    id: "pol-3",
    category: "politics",
    titleAz: "Seçki məcəlləsinə yeni düzəlişlər təqdim olundu",
    titleRu: "Представлены новые поправки к избирательному кодексу",
    altAz: "Səsvermə qutusu",
    altRu: "Урна для голосования",
    imageUrl:
      "https://images.unsplash.com/photo-1520523839897-bd9b168c1a2b?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-22T17:30:00",
    viewCount: 22100,
  },
  {
    id: "pol-4",
    category: "politics",
    titleAz: "Prezident Administrasiyası yeni təşəbbüsü açıqladı",
    titleRu: "Администрация президента объявила о новой инициативе",
    altAz: "İnzibati bina",
    altRu: "Административное здание",
    imageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-21T14:10:00",
    viewCount: 31500,
  },
  {
    id: "pol-5",
    category: "politics",
    titleAz: "Müdafiə nazirliyi hərbi təlimlərin planını təsdiqlədi",
    titleRu: "Минобороны утвердило план военных учений",
    altAz: "Hərbi parad",
    altRu: "Военный парад",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-20T09:55:00",
    viewCount: 12840,
  },
  {
    id: "pol-6",
    category: "politics",
    titleAz: "Beynəlxalq müşahidə missiyası seçki hazırlıqlarını qiymətləndirdi",
    titleRu: "Международная миссия оценила подготовку к выборам",
    altAz: "Jurnalistlər",
    altRu: "Журналисты",
    imageUrl:
      "https://images.unsplash.com/photo-1504711434967-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-19T16:40:00",
    viewCount: 9870,
  },
  // İqtisadiyyat
  {
    id: "eco-1",
    category: "economy",
    titleAz: "Neft qiymətləri bazarda yenidən yüksəldi",
    titleRu: "Цены на нефть снова выросли на рынке",
    altAz: "Neft platforması",
    altRu: "Нефтяная платформа",
    imageUrl:
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-23T10:05:00",
    viewCount: 25600,
  },
  {
    id: "eco-2",
    category: "economy",
    titleAz: "Startaplar üçün yeni qrant proqramı elan edildi",
    titleRu: "Объявлена новая грантовая программа для стартапов",
    altAz: "Ofis mühiti",
    altRu: "Офисная среда",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-23T07:50:00",
    viewCount: 7430,
  },
  {
    id: "eco-3",
    category: "economy",
    titleAz: "İxrac göstəriciləri aprel ayında artım göstərib",
    titleRu: "Показатели экспорта выросли в апреле",
    altAz: "Liman konteynerləri",
    altRu: "Контейнеры в порту",
    imageUrl:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-22T13:25:00",
    viewCount: 11200,
  },
  {
    id: "eco-4",
    category: "economy",
    titleAz: "Bank sektorunda ipoteka faizləri yeniləndi",
    titleRu: "В банковском секторе обновили ипотечные ставки",
    altAz: "Maliyyə qrafikləri",
    altRu: "Финансовые графики",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-21T11:00:00",
    viewCount: 19870,
  },
  {
    id: "eco-5",
    category: "economy",
    titleAz: "Kənd təsərrüfatı subsidiyalarının siyahısı dərc olundu",
    titleRu: "Опубликован список субсидий для сельского хозяйства",
    altAz: "Taxıl tarlası",
    altRu: "Зерновое поле",
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c090f93a?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-20T15:35:00",
    viewCount: 6540,
  },
  {
    id: "eco-6",
    category: "economy",
    titleAz: "Turizm sektorunda rezervasiyalarda artım qeydə alınıb",
    titleRu: "В туристическом секторе зафиксирован рост бронирований",
    altAz: "Kurort sahili",
    altRu: "Курортное побережье",
    imageUrl:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-18T18:20:00",
    viewCount: 8920,
  },
  // Sosial
  {
    id: "soc-1",
    category: "society",
    titleAz: "Paytaxtda yeni sosial xidmət mərkəzi açıldı",
    titleRu: "В столице открылся новый центр социального обслуживания",
    altAz: "İctimai bina",
    altRu: "Общественное здание",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-23T12:40:00",
    viewCount: 5680,
  },
  {
    id: "soc-2",
    category: "society",
    titleAz: "Təhsil Nazirliyi imtahan qaydalarını yenilədi",
    titleRu: "Минобразования обновило правила экзаменов",
    altAz: "Tələbələr",
    altRu: "Студенты",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-22T20:15:00",
    viewCount: 14320,
  },
  {
    id: "soc-3",
    category: "society",
    titleAz: "Metroda sərnişin axını artım trendindədir",
    titleRu: "Пассажиропоток в метро растёт",
    altAz: "Metro vaqonu",
    altRu: "Вагон метро",
    imageUrl:
      "https://images.unsplash.com/photo-1515169067868-5387bc6f9fbf?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-22T07:30:00",
    viewCount: 10240,
  },
  {
    id: "soc-4",
    category: "society",
    titleAz: "Şəhərdə pulsuz tibbi müayinə kampaniyası başlayır",
    titleRu: "В городе стартует кампания бесплатных медосмотров",
    altAz: "Həkim və xəstə",
    altRu: "Врач и пациент",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-21T09:20:00",
    viewCount: 17650,
  },
  {
    id: "soc-5",
    category: "society",
    titleAz: "Mədəni irs obyektlərinin bərpası planı təsdiqləndi",
    titleRu: "Утверждён план реставрации объектов культурного наследия",
    altAz: "Tarixi memarlıq",
    altRu: "Историческая архитектура",
    imageUrl:
      "https://images.unsplash.com/photo-1467269204724-ffaa292b7015?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-19T12:50:00",
    viewCount: 7210,
  },
  {
    id: "soc-6",
    category: "society",
    titleAz: "Gənclər üçün yeni peşə hazırlığı proqramı təqdim olundu",
    titleRu: "Представлена новая программа профподготовки для молодёжи",
    altAz: "Təlim sinfi",
    altRu: "Учебный класс",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-17T10:10:00",
    viewCount: 4890,
  },
  // İdman
  {
    id: "spo-1",
    category: "sports",
    titleAz: "Milli komanda növbəti matç üçün hazırlıqlara başladı",
    titleRu: "Сборная начала подготовку к следующему матчу",
    altAz: "Futbol komandası",
    altRu: "Футбольная команда",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-23T09:30:00",
    viewCount: 34200,
  },
  {
    id: "spo-2",
    category: "sports",
    titleAz: "Bakıda beynəlxalq güləş turniri start götürdü",
    titleRu: "В Баку стартовал международный турнир по борьбе",
    altAz: "Güləş matçı",
    altRu: "Борцовский поединок",
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-22T15:45:00",
    viewCount: 11890,
  },
  {
    id: "spo-3",
    category: "sports",
    titleAz: "Formula 1 azarkeşləri üçün xüsusi fan-zona açılır",
    titleRu: "Для болельщиков Формулы-1 откроют специальную фан-зону",
    altAz: "Yarış avtomobili",
    altRu: "Гоночный автомобиль",
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-21T19:00:00",
    viewCount: 28400,
  },
  {
    id: "spo-4",
    category: "sports",
    titleAz: "Basketbol çempionatında yeni lider müəyyənləşdi",
    titleRu: "В баскетбольном чемпионате определился новый лидер",
    altAz: "Basketbol oyunu",
    altRu: "Баскетбольный матч",
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-20T21:30:00",
    viewCount: 9650,
  },
  {
    id: "spo-5",
    category: "sports",
    titleAz: "Olimpiya komitəsi gənclər arasında seçmə keçirəcək",
    titleRu: "Олимпийский комитет проведёт отбор среди молодёжи",
    altAz: "Atletika yarışı",
    altRu: "Легкоатлетические соревнования",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-19T08:15:00",
    viewCount: 8120,
  },
  {
    id: "spo-6",
    category: "sports",
    titleAz: "Şahmatçımız beynəlxalq turnirdə medal qazandı",
    titleRu: "Наш шахматист завоевал медаль на международном турнире",
    altAz: "Şahmat taxtası",
    altRu: "Шахматная доска",
    imageUrl:
      "https://images.unsplash.com/photo-1528819628955-909372c68701?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-18T13:40:00",
    viewCount: 6340,
  },
  // Hadisə
  {
    id: "inc-1",
    category: "incidents",
    titleAz: "Bakıda yol qəzasında üç nəfər xəsarət alıb",
    titleRu: "В Баку при ДТП пострадали три человека",
    altAz: "Yol hadisəsi",
    altRu: "Дорожное происшествие",
    imageUrl:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40e?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-23T06:20:00",
    viewCount: 42100,
  },
  {
    id: "inc-2",
    category: "incidents",
    titleAz: "Regionda güclü yağış səbəbindən yollar bağlanıb",
    titleRu: "В регионе из-за сильного дождя перекрыты дороги",
    altAz: "Yağışlı hava",
    altRu: "Дождливая погода",
    imageUrl:
      "https://images.unsplash.com/photo-1519692933481-162fa28d15c4?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-22T22:10:00",
    viewCount: 15300,
  },
  {
    id: "inc-3",
    category: "incidents",
    titleAz: "Fövqəladə Hallar Nazirliyi xəbərdarlıq yaydı",
    titleRu: "МЧС распространило предупреждение",
    altAz: "Xilasedici komanda",
    altRu: "Спасательная команда",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-22T11:55:00",
    viewCount: 18760,
  },
  {
    id: "inc-4",
    category: "incidents",
    titleAz: "Mənzildə baş verən yanğın zamanlı söndürülüb",
    titleRu: "Пожар в квартире своевременно потушили",
    altAz: "Yanğınsöndürən maşın",
    altRu: "Пожарная машина",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-4a0e3f2f5860?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-21T20:40:00",
    viewCount: 9120,
  },
  {
    id: "inc-5",
    category: "incidents",
    titleAz: "Şəhərdə qaz sızması aşkarlanıb, ərazi təhlükəsizləşdirilib",
    titleRu: "В городе обнаружена утечка газа, район обезопасили",
    altAz: "Təcili xidmət",
    altRu: "Служба экстренной помощи",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-20T06:50:00",
    viewCount: 13450,
  },
  {
    id: "inc-6",
    category: "incidents",
    titleAz: "Dənizdə axtarış-xilas əməliyyatı başa çatıb",
    titleRu: "Морская поисково-спасательная операция завершена",
    altAz: "Xilasedici gəmi",
    altRu: "Спасательное судно",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-19T07:25:00",
    viewCount: 7680,
  },
  // Dünya
  {
    id: "wld-1",
    category: "world",
    titleAz: "Avropada iqlim sammiti yekun bəyanatla bitdi",
    titleRu: "Климатический саммит в Европе завершился итоговой декларацией",
    altAz: "Beynəlxalq sammit",
    altRu: "Международный саммит",
    imageUrl:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-23T13:10:00",
    viewCount: 16780,
  },
  {
    id: "wld-2",
    category: "world",
    titleAz: "BMT Təhlükəsizlik Şurası yeni qərar qəbul etdi",
    titleRu: "Совбез ООН принял новую резолюцию",
    altAz: "BMT binası",
    altRu: "Здание ООН",
    imageUrl:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-22T16:20:00",
    viewCount: 21340,
  },
  {
    id: "wld-3",
    category: "world",
    titleAz: "Asiyada texnologiya sərgisi rekord iştirakçı sayı ilə keçirilir",
    titleRu: "Технологическая выставка в Азии проходит с рекордным числом участников",
    altAz: "Texnologiya sərgisi",
    altRu: "Технологическая выставка",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-21T12:35:00",
    viewCount: 9450,
  },
  {
    id: "wld-4",
    category: "world",
    titleAz: "Qonşu ölkədə parlament seçkiləri başladı",
    titleRu: "В соседней стране начались парламентские выборы",
    altAz: "Seçki məntəqəsi",
    altRu: "Избирательный участок",
    imageUrl:
      "https://images.unsplash.com/photo-1520523839897-bd9b168c1a2b?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-20T10:45:00",
    viewCount: 13920,
  },
  {
    id: "wld-5",
    category: "world",
    titleAz: "Qlobal fond epidemiyaya qarşı yeni paket təsdiqlədi",
    titleRu: "Глобальный фонд утвердил новый пакет против эпидемии",
    altAz: "Tibbi tədqiqat laboratoriyası",
    altRu: "Медицинская лаборатория",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-19T14:55:00",
    viewCount: 11050,
  },
  {
    id: "wld-6",
    category: "world",
    titleAz: "Beynəlxalq ticarət təşkilatı yeni razılaşma müzakirə edir",
    titleRu: "ВТО обсуждает новое соглашение",
    altAz: "Biznes görüşü",
    altRu: "Деловая встреча",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-05-18T09:30:00",
    viewCount: 8760,
  },
];

const SEEDS: NewsSeed[] = [...BASE_SEEDS, ...createExtraCategoryNewsSeeds()];

function mapSeeds(locale: AppLocale): CategoryNewsItem[] {
  return SEEDS.map((seed) => ({
    id: seed.id,
    category: seed.category,
    title: locale === "ru" ? seed.titleRu : seed.titleAz,
    imageUrl: seed.imageUrl,
    imageAlt: locale === "ru" ? seed.altRu : seed.altAz,
    publishedAt: seed.publishedAt,
    viewCount: seed.viewCount,
  }));
}

const newsByLocale: Record<AppLocale, CategoryNewsItem[]> = {
  az: mapSeeds("az"),
  ru: mapSeeds("ru"),
};

export function getCategoryNews(locale: AppLocale): CategoryNewsItem[] {
  return newsByLocale[locale];
}

export function getCategoryNewsByCatalog(
  locale: AppLocale,
  catalogId: CatalogId,
): CategoryNewsItem[] {
  return getCategoryNews(locale)
    .filter((item) => item.category === catalogId)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}
