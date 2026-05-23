/** Bütün dillərdə eyni açarlar olmalıdır (az / ru faylları buna uyğun gəlir) */
export type AppMessages = {
  sidebar: {
    ariaNav: string;
    brandTagline: string;
    lang: string;
    lightMode: string;
    darkMode: string;
    social: string;
    socialInstagram: string;
    socialFacebook: string;
    socialTelegram: string;
  };
  footer: {
    ariaFooter: string;
    rightsLine: string;
    citationLine: string;
    developedBy: string;
  };
  hero: {
    ariaRegion: string;
    prevSlide: string;
    nextSlide: string;
    goToSlide: string;
    slideList: string;
    readMore: string;
  };
  ad: {
    ariaLabel: string;
    label: string;
    placeholder: string;
  };
  news: {
    today: string;
    views: string;
  };
  article: {
    backToHome: string;
    notFoundTitle: string;
    notFoundText: string;
    relatedTitle: string;
    relatedHint: string;
  };
  nav: {
    ariaLabel: string;
    politics: string;
    economy: string;
    society: string;
    sports: string;
    incidents: string;
    world: string;
  };
};
