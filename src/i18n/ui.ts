export const languages = { de: 'Deutsch', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'de';

/** Jede Seite hat einen Schlüssel; darüber findet der Sprachumschalter die Übersetzung.
 *  Die deutschen URLs entsprechen der alten WordPress-Seite. */
export const routes = {
  home: { de: '/', en: '/en/' },
  project: { de: '/projekt/', en: '/en/project/' },
  digital: { de: '/digital-empowerment/', en: '/en/digital-empowerment/' },
  hygiene: { de: '/hygiene/', en: '/en/hygiene/' },
  donate: { de: '/spenden/', en: '/en/donate/' },
  team: { de: '/team/', en: '/en/team/' },
  blog: { de: '/blog/', en: '/en/blog/' },
  volunteer: { de: '/volunteer/', en: '/en/volunteer/' },
  contact: { de: '/kontakt/', en: '/en/contact/' },
  imprint: { de: '/impressum/', en: '/en/imprint/' },
  privacy: { de: '/datenschutz/', en: '/en/privacy/' },
} as const satisfies Record<string, Record<Lang, string>>;
export type RouteKey = keyof typeof routes;

export const nav: { key: RouteKey; label: Record<Lang, string> }[] = [
  { key: 'project', label: { de: 'Projekt', en: 'Project' } },
  { key: 'team', label: { de: 'Team', en: 'Team' } },
  { key: 'blog', label: { de: 'Blog', en: 'Blog' } },
  { key: 'volunteer', label: { de: 'Volunteer', en: 'Volunteer' } },
  { key: 'contact', label: { de: 'Kontakt', en: 'Contact' } },
];

export const ui = {
  de: {
    'site.title': 'Smiles Africa Charity',
    'site.claim': 'Bildung, die Zukunft schafft.',
    'site.description':
      'Smiles Africa e.V. ermöglicht Kindern und Jugendlichen aus Korogocho, Nairobi, eine zukunftsorientierte Ausbildung – durch Stipendien und Mentoring vor Ort.',
    'cta.donate': 'Jetzt spenden',
    'cta.join': 'Werde Volunteer',
    'cta.more': 'Mehr erfahren',
    'nav.menu': 'Menü',
    'nav.skip': 'Zum Inhalt springen',
    'footer.contactDe': 'Kontakt Deutschland',
    'footer.contactKe': 'Kontakt Kenia',
    'footer.bank': 'Spendenkonto',
    'footer.follow': 'Folge uns',
    'video.consent':
      'Beim Abspielen wird eine Verbindung zu YouTube (Google) hergestellt. Mehr dazu in der Datenschutzerklärung.',
    'video.play': 'Video laden und abspielen',
  },
  en: {
    'site.title': 'Smiles Africa Charity',
    'site.claim': 'Education that creates a future.',
    'site.description':
      'Smiles Africa e.V. gives children and young people from Korogocho, Nairobi, access to future-oriented education – through scholarships and local mentoring.',
    'cta.donate': 'Donate now',
    'cta.join': 'Become a volunteer',
    'cta.more': 'Learn more',
    'nav.menu': 'Menu',
    'nav.skip': 'Skip to content',
    'footer.contactDe': 'Contact Germany',
    'footer.contactKe': 'Contact Kenya',
    'footer.bank': 'Bank details',
    'footer.follow': 'Follow us',
    'video.consent':
      'Playing the video connects to YouTube (Google). See our privacy policy for details.',
    'video.play': 'Load and play video',
  },
} as const;

export function t(lang: Lang, key: keyof (typeof ui)['de']): string {
  return ui[lang][key] ?? ui[defaultLang][key];
}

export function url(key: RouteKey, lang: Lang): string {
  return routes[key][lang];
}

/** Externe Ziele, die mehrfach vorkommen. */
export const links = {
  betterplace:
    'https://www.betterplace.org/de/projects/59168-qualitative-bildung-fur-kids-jugendliche-in-kenia-smiles-africa-charity',
  betterplaceDonate:
    'https://www.betterplace.org/de/donate/platform/projects/59168-qualitative-bildung-fur-kids-jugendliche-in-kenia-smiles-africa-charity',
  instagramDe: 'https://www.instagram.com/smilesafricacharity_de/',
  instagramKe: 'https://www.instagram.com/smilesafricacharity_ke/',
  facebook: 'https://www.facebook.com/SmilesAfricaCharity/',
  email: 'info@smilesafrica.de',
} as const;

export const org = {
  name: 'Smiles Africa e.V.',
  street: 'Moltkestr. 3a',
  city: '55118 Mainz',
  iban: 'DE46 5519 0000 0928 7020 18',
  bic: 'MVBMDE55',
  kenya: {
    name: 'Smiles Africa CLG',
    contact: 'Peter Mwashi Litonde',
    address: 'Postbox 64349-00620, Nairobi, Kenya',
  },
} as const;
