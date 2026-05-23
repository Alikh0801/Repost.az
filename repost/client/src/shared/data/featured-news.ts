import type { AppLocale } from "../../i18n/types";

export type FeaturedNewsCategory =
  | "politics"
  | "economy"
  | "society"
  | "sports"
  | "incidents"
  | "world";

export type FeaturedNewsItem = {
  id: string;
  category: FeaturedNewsCategory;
  title: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
};

const featuredNewsAz: FeaturedNewsItem[] = [
  {
    id: "1",
    category: "politics",
    title: "Bakıda regional enerji forumu başladı",
    summary:
      "Region ölkələrinin nümayəndələri təmiz enerji investisiyaları və yeni tranzit koridorları üzrə birgə bəyanat imzaladı.",
    imageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Konfrans zalında iştirakçılar",
    publishedAt: "2026-05-23T09:15:00",
  },
  {
    id: "2",
    category: "economy",
    title: "Manat məzənnəsi sabit qalır, bazarlarda aktivlik artır",
    summary:
      "Mərkəzi Bank rəsmiləri valyuta bazarının sabitliyini qorumaq üçün əlavə likvidlik alətlərindən istifadə edəcəyini bildirdi.",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Maliyyə qrafikləri ekranda",
    publishedAt: "2026-05-23T08:40:00",
  },
  {
    id: "3",
    category: "society",
    title: "Paytaxtda yeni metro stansiyasının açılışı təxirə salındı",
    summary:
      "Nəqliyyat Nazirliyi tikinti işlərinin yekunlaşdırılması üçün əlavə texniki yoxlamalar aparılacağını açıqladı.",
    imageUrl:
      "https://images.unsplash.com/photo-1515169067868-5387bc6f9fbf?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Metro platforması",
    publishedAt: "2026-05-22T19:05:00",
  },
  {
    id: "4",
    category: "sports",
    title: "Milli komanda DÇ seçmə mərhələsində qələbə qazandı",
    summary:
      "Matçın son dəqiqəsində vurulan qol azarkeşləri stadionda uzun müddət ayağa qaldırdı.",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Futbol stadionunda oyun",
    publishedAt: "2026-05-22T16:30:00",
  },
  {
    id: "5",
    category: "world",
    title: "Avropa liderləri iqlim sammitində yeni hədəflər müzakirə edir",
    summary:
      "Sammitdə karbon emissiyalarının azaldılması və yaşıl texnologiyalar üzrə ortaq fond yaradılması planlaşdırılır.",
    imageUrl:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Diplomatik görüş",
    publishedAt: "2026-05-22T11:20:00",
  },
];

const featuredNewsRu: FeaturedNewsItem[] = [
  {
    id: "1",
    category: "politics",
    title: "В Баку стартовал региональный энергетический форум",
    summary:
      "Представители стран региона подписали совместную декларацию о чистой энергетике и новых транзитных коридорах.",
    imageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Участники конференции в зале",
    publishedAt: "2026-05-23T09:15:00",
  },
  {
    id: "2",
    category: "economy",
    title: "Курс маната остаётся стабильным, активность на рынках растёт",
    summary:
      "Центральный банк сообщил, что для поддержания стабильности валютного рынка будут использованы дополнительные инструменты ликвидности.",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Финансовые графики на экране",
    publishedAt: "2026-05-23T08:40:00",
  },
  {
    id: "3",
    category: "society",
    title: "Открытие новой станции метро в столице отложено",
    summary:
      "Министерство транспорта сообщило, что для завершения строительства будут проведены дополнительные технические проверки.",
    imageUrl:
      "https://images.unsplash.com/photo-1515169067868-5387bc6f9fbf?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Платформа метро",
    publishedAt: "2026-05-22T19:05:00",
  },
  {
    id: "4",
    category: "sports",
    title: "Сборная одержала победу в отборочном матче ЧМ",
    summary:
      "Гол в концовке встречи долго удерживал болельщиков на ногах на стадионе.",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Футбольный матч на стадионе",
    publishedAt: "2026-05-22T16:30:00",
  },
  {
    id: "5",
    category: "world",
    title: "Лидеры Европы обсуждают новые климатические цели на саммите",
    summary:
      "На саммите планируют создать общий фонд для сокращения выбросов и развития зелёных технологий.",
    imageUrl:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Дипломатическая встреча",
    publishedAt: "2026-05-22T11:20:00",
  },
];

export function getFeaturedNews(locale: AppLocale): FeaturedNewsItem[] {
  return locale === "ru" ? featuredNewsRu : featuredNewsAz;
}
