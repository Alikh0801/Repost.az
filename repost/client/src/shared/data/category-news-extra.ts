import type { CatalogId } from "../types/catalog";

export type NewsSeed = {
  id: string;
  category: CatalogId;
  titleAz: string;
  titleRu: string;
  altAz: string;
  altRu: string;
  imageUrl: string;
  publishedAt: string;
  viewCount: number;
};

const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1541873676-a18131494186?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520523839897-bd9b168c1a2b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504711434967-e33886168f5c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
] as const;

const ID_PREFIX: Record<CatalogId, string> = {
  politics: "pol",
  economy: "eco",
  society: "soc",
  sports: "spo",
  incidents: "inc",
  world: "wld",
};

const EXTRA_TITLES: Record<
  CatalogId,
  { az: readonly string[]; ru: readonly string[] }
> = {
  politics: {
    az: [
      "Milli Məclisdə komitə iclası keçirildi",
      "Dövlət başçısı xarici diplomatları qəbul etdi",
      "Region parlamentləri birgə bəyanat yaydı",
      "Seçki məntəqələrində texniki yeniləmə başladı",
      "Sərhəd əməkdaşlığı üzrə işçi qrup yaradıldı",
      "Kənd təsərrüfatı subsidiyaları müzakirə olundu",
      "Müdafiə sənayesi üzrə yeni investisiya paketi",
      "Diplomatlar qarşılıqlı vizaları sadələşdirdi",
      "Yerli özünüidarə institutları genişləndirilir",
      "Qanun layihəsi ikinci oxunuşda qəbul edildi",
      "Beynəlxalq ekspertlər konstitusiya məsələlərini müzakirə etdi",
      "Prezidentin sərəncamı dövlət proqramını təsdiqlədi",
    ],
    ru: [
      "В Милли Меджлисе прошло заседание комитета",
      "Глава государства принял иностранных дипломатов",
      "Региональные парламенты опубликовали совместную декларацию",
      "На избирательных участках началось техническое обновление",
      "Создана рабочая группа по приграничному сотрудничеству",
      "Обсуждены субсидии для сельского хозяйства",
      "Новый инвестиционный пакет для оборонной промышленности",
      "Дипломаты упростили взаимные визы",
      "Расширяются институты местного самоуправления",
      "Законопроект принят во втором чтении",
      "Международные эксперты обсудили конституционные вопросы",
      "Указ президента утвердил государственную программу",
    ],
  },
  economy: {
    az: [
      "İstehsal sektorunda aylıq göstəricilər açıqlandı",
      "Kiçik biznes üçün vergi güzəştləri uzadıldı",
      "İxrac diversifikasiyası planı təqdim edildi",
      "Banklar ipoteka kreditləri üzrə hesabat verdi",
      "Startap ekosistemində yeni fond fəaliyyətə başladı",
      "Tikinti materiallarının qiymət indeksi dəyişdi",
      "Logistika şirkətləri yeni marşrut açdı",
      "Dövlət investisiya proqramı yeniləndi",
      "Əmək bazarında vakansiya sayı artdı",
      "Fintech tənzimləmələri təsdiqləndi",
      "Sənaye parklarında yeni müəssisələr",
      "Valyuta hərracında həcm rekord səviyyədə",
    ],
    ru: [
      "Опубликованы месячные показатели промышленности",
      "Налоговые льготы для малого бизнеса продлены",
      "Представлен план диверсификации экспорта",
      "Банки отчитались по ипотечным кредитам",
      "В стартап-экосистеме запустили новый фонд",
      "Изменился индекс цен на стройматериалы",
      "Логистические компании открыли новый маршрут",
      "Обновлена государственная инвестиционная программа",
      "На рынке труда выросло число вакансий",
      "Утверждены правила регулирования финтеха",
      "В индустриальных парках открылись новые предприятия",
      "Объём на валютных торгах достиг рекорда",
    ],
  },
  society: {
    az: [
      "Məktəblərdə yeni tədris proqramı tətbiq olunur",
      "Şəhər parklarında abadlaşdırma işləri davam edir",
      "Gənclər üçün mədəni festival başladı",
      "Sosial müavinət qaydaları yeniləndi",
      "Tibbi müəssisələrdə elektron növbə sistemi",
      "Yaşlı insanlar üçün güzəştlər genişləndi",
      "Könüllülər təşəbbüsü rekord iştirak topladı",
      "Muzeylər həftəsonu pulsuz giriş elan etdi",
      "Məişət tullantılarının ayrıca yığılması genişlənir",
      "Uşaq bağçalarında yeni standartlar tətbiq olunur",
      "İctimai nəqliyyatda gediş haqqı müzakirəsi",
      "Universitetlərə yeni qəbul qaydaları",
    ],
    ru: [
      "В школах вводят новую учебную программу",
      "В городских парках продолжаются работы по благоустройству",
      "Стартовал культурный фестиваль для молодёжи",
      "Обновлены правила социальных пособий",
      "В медучреждениях внедряют электронную очередь",
      "Расширены льготы для пожилых людей",
      "Волонтёрская инициатива собрала рекордное число участников",
      "Музеи объявили о бесплатном входе на выходных",
      "Расширяется раздельный сбор бытовых отходов",
      "В детских садах вводят новые стандарты",
      "Обсуждается стоимость проезда в общественном транспорте",
      "Новые правила приёма в университеты",
    ],
  },
  sports: {
    az: [
      "Çempionatda liderlik cədvəli yeniləndi",
      "Gənc futbolçular yoxlama mərhələsini keçdi",
      "Boksçularımız beynəlxalq turnirdə finala çıxdı",
      "Stadionda təhlükəsizlik tədbirləri gücləndirildi",
      "Voleybol komandası səfər qələbəsi qazandı",
      "Atletika yarışlarında yeni rekord qeydə alındı",
      "Hakimlər assosiasiyası qaydaları yenilədi",
      "Gimnastika mərkəzi yenidən açıldı",
      "Eksklüziv müsahibə: milli kapitan",
      "Tennis turniri yerli idmançıya görə təxirə salındı",
      "Məşqçilər seminarında yeni metodika təqdim olundu",
      "Fan klublar birgə dəstək kampaniyası başlatdı",
    ],
    ru: [
      "Обновлена турнирная таблица чемпионата",
      "Юные футболисты прошли отборочный этап",
      "Наши боксёры вышли в финал международного турнира",
      "На стадионе усилили меры безопасности",
      "Волейбольная команда одержала выездную победу",
      "На легкоатлетических соревнованиях установлен рекорд",
      "Ассоциация судей обновила правила",
      "Центр гимнастики вновь открылся",
      "Эксклюзивное интервью: капитан сборной",
      "Теннисный турнир перенесён из-за местного спортсмена",
      "На семинаре тренеров представили новую методику",
      "Фан-клубы запустили совместную кампанию поддержки",
    ],
  },
  incidents: {
    az: [
      "Bakıda nəqliyyat sıxlığı səbəbi ilə alternativ marşrutlar",
      "Regionda elektrik təchizatı qısa müddətə bərpa olundu",
      "Yol təmir işləri gecə saatlarına planlaşdırıldı",
      "Meşə zonasında müşahidə olunan alov söndürüldü",
      "Sərnişin avtobusunda texniki nasazlıq aradan qaldırıldı",
      "Hava limanında reys gecikmələri minimuma endirildi",
      "Küçədə su borusu partığı operativ bağlandı",
      "Dənizkənarı zonanın təhlükəsizliyi gücləndirildi",
      "Tikinti meydançasında təhlükəsizlik yoxlaması keçirildi",
      "Fövqəladə xidmət vətəndaşlara xəbərdarlıq etdi",
      "Şiddətli külək ağacları yerindən sökdü",
      "Bazar ərazisində yanğın təhlükəsi aradan qaldırıldı",
    ],
    ru: [
      "В Баку открыли альтернативные маршруты из-за пробок",
      "В регионе кратковременно восстановили электроснабжение",
      "Ремонт дорог запланировали на ночные часы",
      "Пожар в лесной зоне был потушен",
      "Устранили техническую неисправность пассажирского автобуса",
      "В аэропорту свели к минимуму задержки рейсов",
      "Оперативно перекрыли прорвавшийся водопровод на улице",
      "Усилили безопасность прибрежной зоны",
      "На стройплощадке провели проверку безопасности",
      "МЧС предупредило граждан",
      "Сильный ветер повалил деревья",
      "На рынке устранили угрозу пожара",
    ],
  },
  world: {
    az: [
      "Avropada enerji təhlükəsizliyi sammiti başladı",
      "Asiya bazarında səhmlər artım göstərdi",
      "Afrikada humanitar yardım konvoyu yola çıxdı",
      "Şimali regionda iqlim dəyişikliyi hesabatı",
      "Beynəlxalq məhkəmə yeni işə baxacaq",
      "Qonşu dövlətlər nəqliyyat razılaşması imzaladı",
      "Qlobal texnologiya liderləri AI qaydalarını müzakirə edir",
      "Okean ətrafı ölkələr plastik istifadəni məhdudlaşdırır",
      "Beynəlxalq universitetlər birgə tədqiqat proqramı",
      "Yeni iqtisadi ittifaq bəyanatı dərc olundu",
      "Əhalinin miqrasiya statistikası yeniləndi",
      "Dünya Bankı infrastruktur kreditini təsdiqlədi",
    ],
    ru: [
      "В Европе начался саммит по энергобезопасности",
      "На азиатском рынке акции выросли",
      "В Африке отправили гуманитарный конвой",
      "В северном регионе опубликовали отчёт об изменении климата",
      "Международный суд рассмотрит новое дело",
      "Соседние государства подписали транспортное соглашение",
      "Мировые технологические лидеры обсуждают правила ИИ",
      "Прибрежные страны ограничивают использование пластика",
      "Международные университеты запускают совместную программу",
      "Опубликована декларация нового экономического альянса",
      "Обновлена статистика миграции населения",
      "Всемирный банк утвердил кредит на инфраструктуру",
    ],
  },
};

function publishedAtForExtra(
  categoryIndex: number,
  itemIndex: number,
): string {
  const base = new Date(2026, 4, 16, 20, 0, 0);
  const hoursBack = categoryIndex * 3 + itemIndex * 4 + 2;
  base.setHours(base.getHours() - hoursBack);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  const h = String(base.getHours()).padStart(2, "0");
  const min = String(base.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:00`;
}

export function createExtraCategoryNewsSeeds(): NewsSeed[] {
  const categories = Object.keys(EXTRA_TITLES) as CatalogId[];
  const seeds: NewsSeed[] = [];

  categories.forEach((category, categoryIndex) => {
    const titles = EXTRA_TITLES[category];
    const prefix = ID_PREFIX[category];

    for (let i = 0; i < 12; i++) {
      const num = i + 7;
      seeds.push({
        id: `${prefix}-${num}`,
        category,
        titleAz: titles.az[i],
        titleRu: titles.ru[i],
        altAz: `${titles.az[i]} — foto`,
        altRu: `${titles.ru[i]} — фото`,
        imageUrl: IMAGE_POOL[i % IMAGE_POOL.length],
        publishedAt: publishedAtForExtra(categoryIndex, i),
        viewCount: 4200 + categoryIndex * 900 + i * 311,
      });
    }
  });

  return seeds;
}
