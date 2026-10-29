// Edit profile information here. These entries preserve the supplied theme content.
const sharedProfile = {
  summary:
    'Lorem ipsum lobortis amet sit tristique quisque id nunc eu consectetur velit diam mi donec eu nunc laoreet cras vel tempor in felis lorem ipsum id non.',
  phone: '(084) 123 – 456 88',
  about:
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  highlights: [
    'Lecturer, Medical Malpractice and Tort Matters to Legal Community, New York State Trial Lawyers Institute',
    'Lecturer, Medical Malpractice and Tort Matters to Legal Community, American Association for Justice',
    'Pretrial Issues in Laparoscopic Negligence Cases,” ATLA Professional Negligence Section Newsletter',
    'Legislative Caps Take Away the Judge’s Function,” New York Law Journal',
  ],
  biography:
    'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu',
};

export const teamMembers = [
  {
    ...sharedProfile,
    slug: 'bernardo-gordon',
    name: 'Bernardo Gordon',
    role: 'OPERATIONS Manager',
    image: '/images/team-5.jpg',
    email: 'bernardo@example.com',
  },
  {
    ...sharedProfile,
    slug: 'dennis-daniels',
    name: 'Dennis Daniels',
    role: 'founder & ceo',
    image: '/images/team-1.jpg',
    email: 'dennis@example.com',
  },
  {
    ...sharedProfile,
    slug: 'floyd-miles',
    name: 'Floyd Miles',
    role: 'director of architecture',
    image: '/images/team-3.jpg',
    email: 'floydmiles@example.com',
  },
  {
    ...sharedProfile,
    slug: 'johan-sanford',
    name: 'Johan Sanford',
    role: 'excutive assistant',
    image: '/images/team-2.jpg',
    email: 'johansanford@example.com',
  },
  {
    ...sharedProfile,
    slug: 'leslie-alexander',
    name: 'Leslie Alexander',
    role: 'Development manager',
    image: '/images/team-4.jpg',
    email: 'alexander@example.com',
  },
  {
    ...sharedProfile,
    slug: 'ralph-edwards',
    name: 'Ralph Edwards',
    role: 'Construction Manager',
    image: '/images/team-6.jpg',
    email: 'edwards@example.com',
  },
];

export function getTeamMember(slug) {
  return teamMembers.find((member) => member.slug === slug);
}
