import type { AppLocale } from "../../i18n/types";

export function buildLeadSummary(title: string, locale: AppLocale): string {
  if (locale === "ru") {
    return `Подробности по теме: «${title}». Мы собрали ключевые факты, комментарии экспертов и хронологию событий.`;
  }
  return `«${title}» mövzusu ilə bağlı əsas faktlar, ekspert rəyləri və hadisələrin xronologiyası bir məqalədə.`;
}

export function buildArticleBody(
  _summary: string,
  title: string,
  locale: AppLocale,
): string[] {
  if (locale === "ru") {
    return [
      `По данным источников, тема «${title}» остаётся одной из самых обсуждаемых в информационном пространстве страны. Первые сообщения появились рано утром, после чего ситуация начала активно развиваться и привлекла внимание как официальных структур, так и широкой общественности.`,
      "Представители компетентных органов провели оперативное совещание, на котором были рассмотрены текущие обстоятельства и намечены ближайшие шаги. По итогам встречи сообщалось, что все необходимые меры принимаются в рамках действующего законодательства и в координации с заинтересованными ведомствами.",
      "Очевидцы, с которыми поговорила редакция, отмечают, что процессы развиваются стремительно. «Мы ожидали определённых решений, однако происходящее сейчас требует более детального анализа», — сказал один из участников событий, пожелавший остаться анонимным.",
      "Эксперты, комментируя ситуацию, подчёркивают, что подобные случаи всегда имеют как краткосрочные, так и долгосрочные последствия. По их мнению, важно не только оперативно реагировать на текущие вызовы, но и выстраивать системный подход, который снизит риски в будущем.",
      "Аналитики отмечают, что общественный интерес к теме «${title}» в последние часы заметно вырос. Социальные сети активно обсуждают детали, однако специалисты призывают отличать проверенную информацию от неподтверждённых слухов и фейковых публикаций.",
      "В официальном заявлении говорится, что дополнительные разъяснения будут предоставлены по мере поступления новых данных. Гражданам рекомендуют следить за сообщениями только на доверенных ресурсах и официальных страницах государственных органов.",
      "Международные наблюдатели также обратили внимание на развитие событий. Некоторые из них отметили, что подобные процессы в регионе неоднократно становились предметом дискуссий на международных площадках и требовали взвешенной оценки со стороны партнёров.",
      "Журналисты RePost.az продолжают мониторинг ситуации. Наша редакция связывается с участниками процесса, изучает документы и готовит дополнительные материалы, которые помогут читателям получить более полную картину происходящего.",
      "Напоминаем, что при цитировании материалов ссылка на первоисточник обязательна. Любые официальные обновления по теме «${title}» будут оперативно отражены на нашем портале в отдельных публикациях и кратких новостных заметках.",
    ];
  }

  return [
    `Məlumatlara görə, «${title}» mövzusu ölkə informasiya məkanında ən çox müzakirə olunan mövzular sırasındadır. İlk xəbərlər səhər saatlarında yayıldıqdan sonra hadisələr sürətlə inkişaf etdi və rəsmi qurumların da, ictimaiyyətin də diqqət mərkəzinə gəldi.`,
    "Müvafiq qurumların nümayəndələri operativ iclas keçirərək mövcud vəziyyəti və növbəti addımları müzakirə ediblər. Toplantının nəticələrində bildirilib ki, qüvvədə olan qanunvericiliyə uyğun olaraq bütün zəruri tədbirlər görülür və maraqlı tərəflər arasında koordinasiya təmin olunur.",
    "Redaksiyamızın danışdığı eyeşahidlər prosesin sürətlə dəyişdiyini qeyd edirlər. «Müəyyən qərarlar gözlənilirdi, amma indi baş verənlər daha dərindən təhlil tələb edir», — deyə bilən iştirakçılardan biri anonim qalmaq istəyib.",
    "Ekspertlər vəziyyəti şərh edərkən vurğulayırlar ki, belə halların həm qısamüddətli, həm də uzunmüddətli nəticələri olur. Onların fikrincə, cari çağırışlara operativ cavab verməklə yanaşı, gələcəkdə riskləri azaldacaq sistemli yanaşma da formalaşdırılmalıdır.",
    "Analitiklər «${title}» mövzusuna ictimai marağın son saatlarda xeyli artdığını bildirirlər. Sosial şəbəkələrdə detallar geniş müzakirə olunsa da, mütəxəssislər yoxlanılmış məlumat ilə təsdiqlənməmiş şayiələrin və saxta xəbərlərin bir-birindən ayırd edilməsinə çağırırlar.",
    "Rəsmi açıqlamada qeyd olunur ki, yeni məlumatlar daxil olduqca əlavə izahatlar veriləcək. Vətəndaşlardan yalnız etibarlı mənbələrdən və dövlət orqanlarının rəsmi səhifələrindən xəbərdar olmaları tövsiyə edilir.",
    "Beynəlxalq müşahidəçilər də hadisələrin gedişatına diqqət yetirirlər. Onlardan bəziləri qeyd edib ki, regionda belə proseslər əvvəllər də beynəlxalq müzakirələrin mövzusu olub və tərəfdaş ölkələrin tərəfdar qiymətləndirməsini tələb edib.",
    "RePost.az redaksiyası vəziyyəti izləməyə davam edir. Müxbirlərimiz proses iştirakçıları ilə əlaqə saxlayır, sənədləri araşdırır və oxuculara baş verənlərin daha tam mənzərəsini təqdim edəcək əlavə materiallar hazırlayır.",
    "Xatırladaq ki, materiallardan istifadə edərkən mənbəyə istinad mütləqdir. «${title}» mövzusu üzrə rəsmi yeniləmələr olduqca tezliklə portolumuzda ayrıca yazı və qısa xəbər formatında əks etdiriləcək.",
  ];
}
