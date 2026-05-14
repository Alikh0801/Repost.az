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
  layout: {
    mainPlaceholder: string;
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
