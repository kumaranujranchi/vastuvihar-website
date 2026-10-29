// Desktop navigation, mobile navigation and footer all use these destinations.
export const companyLinks = [
  { label: 'About Us', href: '/about-us/' },
  { label: 'Core Values', href: '/core-values/' },
  { label: 'Our Awards', href: '/our-awards/' },
  { label: 'Our Team', href: '/our-team/' },
  { label: 'FAQs', href: '/faqs/' },
];

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about-us/', children: companyLinks },
  { label: 'Projects', href: '/projects/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerGroups = [
  { title: 'Company', links: companyLinks.slice(0, 4) },
  {
    title: 'Explore',
    links: [
      { label: 'Our Projects', href: '/projects/' },
      { label: 'Completed Projects', href: '/project-status/completed/' },
      { label: 'Under Construction', href: '/project-status/under-construction/' },
      { label: 'Latest News', href: '/blog/' },
    ],
  },
  {
    title: 'Get in Touch',
    links: [
      { label: 'Careers', href: '/careers/' },
      companyLinks[4],
      { label: 'Contact Us', href: '/contact/' },
    ],
  },
];
