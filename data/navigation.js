// Desktop navigation, mobile navigation and footer all use these destinations.
export const companyLinks = [
  { label: 'About Us', href: '/about-us/' },
  { label: 'Core Values', href: '/core-values/' },
  { label: 'Our Awards', href: '/our-awards/' },
  { label: 'FAQs', href: '/faqs/' },
];

export const contactLinks = [
  { label: 'Contact Us', href: '/contact/' },
  { label: 'Branch Offices', href: '/contact/branch-contact/' },
  { label: 'Site Offices', href: '/contact/site-contact/' },
];

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about-us/', children: companyLinks },
  { label: 'Models', href: '/projects/' },
  { label: 'Price List', href: '/price-list/' },
  { label: 'Our Blogs', href: '/blog/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Contact', href: '/contact/', children: contactLinks },
];

export const footerGroups = [
  { title: 'Company', links: companyLinks.slice(0, 3) },
  {
    title: 'Explore',
    links: [
      { label: 'Our Models', href: '/projects/' },
      { label: 'Branch Offices', href: '/contact/branch-contact/' },
      { label: 'Site Offices', href: '/contact/site-contact/' },
      { label: 'Latest News', href: '/blog/' },
    ],
  },
  {
    title: 'Get in Touch',
    links: [
      { label: 'Careers', href: '/careers/' },
      companyLinks[3],
      { label: 'Contact Us', href: '/contact/' },
    ],
  },
];
