
// Core Values - Vastu Vihar
// Preserves the original IDs, schema, and SVG icons.

const icons = {
  quality: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M4.265 7.999c0-2.057 1.674-3.734 3.734-3.734s3.734 1.674 3.734 3.734c0 2.057-1.674 3.734-3.734 3.734s-3.734-1.674-3.734-3.734zM0 7.999c0 4.418 3.581 7.999 7.999 7.999s7.999-3.581 7.999-7.999c0-4.418-3.581-7.999-7.999-7.999s-7.999 3.581-7.999 7.999z"/>
    <path d="M0 24.001c0-4.418 3.581-7.999 7.999-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999s-7.999-3.583-7.999-7.999z"/>
    <path d="M15.999 7.999c0-4.418 3.583-7.999 8.002-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999s-8.002-3.581-8.002-7.999z"/>
    <path d="M20.266 24.001c0-2.057 1.674-3.734 3.734-3.734s3.734 1.674 3.734 3.734c0 2.060-1.674 3.734-3.734 3.734s-3.734-1.677-3.734-3.734zM15.999 24.001c0 4.418 3.581 7.999 7.999 7.999s7.999-3.581 7.999-7.999c0-4.418-3.581-7.999-7.999-7.999s-7.999 3.581-7.999 7.999z"/>
  </svg>`,

  community: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M15.999 24.532c4.117 0 7.466 3.348 7.466 7.466h8.533c0-8.837-7.162-15.999-15.999-15.999s-15.999 7.165-15.999 16.001h8.533c0-4.117 3.348-7.468 7.466-7.468z"/>
    <path d="M15.999 7.466c-4.117 0-7.466-3.348-7.466-7.466h-8.533c0 8.837 7.162 15.999 15.999 15.999s16.001-7.162 16.001-15.999h-8.533c0 4.117-3.351 7.466-7.468 7.466z"/>
  </svg>`,

  environment: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M24.001 5.333c-1.471 0-2.666 1.195-2.666 2.666s1.195 2.667 2.666 2.667 2.666-1.195 2.666-2.667h5.333c0 4.418-3.581 7.999-7.999 7.999s-7.999-3.581-7.999-7.999c-0.002-4.418 3.581-7.999 7.999-7.999v5.333z"/>
    <path d="M5.333 7.999c0 1.471 1.195 2.667 2.666 2.667s2.667-1.195 2.667-2.667c0-1.471-1.195-2.666-2.667-2.666v-5.333c4.418 0 7.999 3.581 7.999 7.999s-3.581 7.999-7.999 7.999c-4.418 0-7.999-3.581-7.999-7.999h5.333z"/>
    <path d="M26.667 24.001c0-1.471-1.195-2.667-2.666-2.667s-2.667 1.195-2.667 2.667c0 1.471 1.195 2.666 2.667 2.666v5.333c-4.418 0-7.999-3.581-7.999-7.999s3.581-7.999 7.999-7.999c4.418 0 7.999 3.581 7.999 7.999h-5.333z"/>
    <path d="M7.999 26.667c1.471 0 2.667-1.195 2.667-2.666s-1.195-2.667-2.667-2.667c-1.471 0-2.666 1.195-2.666 2.667h-5.333c0-4.418 3.581-7.999 7.999-7.999s7.999 3.581 7.999 7.999c0 4.418-3.581 7.999-7.999 7.999v-5.333z"/>
  </svg>`,

  innovation: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M24 0c4.418 0 7.999 3.581 7.999 7.999h-16.001c0-4.418 3.583-7.999 8.002-7.999z"/>
    <path d="M24 7.999c4.418 0 7.999 3.581 7.999 7.999h-16.001c0-4.418 3.583-7.999 8.002-7.999z"/>
    <path d="M7.999 32c-4.418 0-7.999-3.583-7.999-7.999h15.999c0 4.416-3.581 7.999-7.999 7.999z"/>
    <path d="M7.999 24.001c-4.418 0-7.999-3.583-7.999-8.002h15.999c0 4.418-3.581 8.002-7.999 8.002z"/>
    <path d="M32 24.001c0 4.418-3.581 7.999-7.999 7.999v-16.001c4.416 0 7.999 3.583 7.999 8.002z"/>
    <path d="M24.001 24.001c0 4.418-3.581 7.999-7.999 7.999v-16.001c4.416 0 7.999 3.583 7.999 8.002z"/>
    <path d="M0 7.999c0-4.418 3.581-7.999 7.999-7.999v15.999c-4.418 0-7.999-3.581-7.999-7.999z"/>
    <path d="M7.999 7.999c0-4.418 3.581-7.999 7.999-7.999v15.999c-4.418 0-7.999-3.581-7.999-7.999z"/>
  </svg>`,

  affordability: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M16 11.139c-1.692 0-3.064-1.372-3.064-3.064v-8.074h6.126v8.077c0.003 1.692-1.37 3.062-3.062 3.062z"/>
    <path d="M16 20.861c-1.692 0-3.064 1.372-3.064 3.064v8.074h6.126v-8.077c0.003-1.692-1.37-3.062-3.062-3.062z"/>
    <path d="M12.564 12.564c-1.196 1.196-3.136 1.196-4.332 0l-5.714-5.711 4.334-4.334 5.711 5.711c1.196 1.198 1.196 3.136 0 4.334z"/>
    <path d="M19.438 19.438c-1.196 1.196-1.196 3.136 0 4.332l5.711 5.711 4.332-4.332-5.711-5.711c-1.198-1.198-3.136-1.198-4.332 0z"/>
    <path d="M11.139 16c0 1.692-1.372 3.064-3.064 3.064h-8.074v-6.129h8.077c1.692 0 3.062 1.372 3.062 3.064z"/>
    <path d="M20.861 16c0 1.692 1.372 3.064 3.064 3.064h8.074v-6.129h-8.077c-1.692 0-3.062-1.372-3.062-3.064z"/>
    <path d="M12.564 19.438c1.196 1.196 1.196 3.136 0 4.332l-5.711 5.711-4.334-4.334 5.711-5.711c1.198-1.196 3.136-1.196 4.334 0.003z"/>
    <path d="M19.438 12.564c1.196 1.196 3.136 1.196 4.332 0l5.711-5.711-4.334-4.334-5.709 5.711c-1.198 1.198-1.198 3.136 0 4.334z"/>
  </svg>`,

  commitment: `<svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32">
    <path d="M23.268 0h-23.268c0 8.457 6.546 15.38 14.844 15.994-8.298 0.615-14.844 7.535-14.844 15.992h32.014v-31.986h-8.746zM16.043 30.475v-28.961c0.725 7.758 6.974 13.904 14.773 14.481-7.799 0.576-14.048 6.723-14.773 14.481z"/>
  </svg>`,

  integrity: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M26.251 16c5.225-7.761 5.695-14.889 5.749-16-1.112 0.054-8.239 0.524-16 5.748-7.76-5.225-14.888-5.694-16-5.748 0.054 1.112 0.524 8.239 5.748 16-5.225 7.761-5.694 14.889-5.748 16 1.112-0.054 8.239-0.524 16-5.748 7.761 5.225 14.889 5.695 16 5.748-0.053-1.112-0.523-8.239-5.749-16z"/>
  </svg>`,

  trust: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M20.746 32h11.254v-11.254c-1.598 5.402-5.853 9.656-11.254 11.254z"/>
    <path d="M32 11.254v-11.254h-11.254c5.401 1.598 9.656 5.853 11.254 11.254z"/>
    <path d="M11.254 0h-11.254v11.254c1.598-5.401 5.853-9.656 11.254-11.254z"/>
    <path d="M0 20.746v11.254h11.254c-5.401-1.598-9.656-5.853-11.254-11.254z"/>
    <path d="M21.634 24.367c4.62-3.11 5.843-9.377 2.733-13.997s-9.377-5.843-13.997-2.733c-4.62 3.111-5.843 9.377-2.733 13.997s9.377 5.843 13.997 2.733z"/>
  </svg>`
};

export const coreValues = [
  {
    id: "08223cf",
    title: "Quality Construction",
    description:
      "We focus on durable construction, thoughtful planning, and reliable workmanship to create homes designed for lasting comfort and value.",
    svg: icons.quality
  },
  {
    id: "e9f4961",
    title: "Community Living",
    description:
      "We believe a home is more than four walls. Our residential townships encourage connected communities, family living, and a sense of belonging.",
    svg: icons.community
  },
  {
    id: "5a430cc",
    title: "Green Living",
    description:
      "We value open spaces, greenery, and healthier surroundings, integrating parks and landscaped areas into our township planning wherever feasible.",
    svg: icons.environment
  },
  {
    id: "1b2271a",
    title: "Thoughtful Innovation",
    description:
      "We continually explore practical designs, modern amenities, and smarter residential solutions that meet the evolving needs of families.",
    svg: icons.innovation
  },
  {
    id: "3d71b0f",
    title: "Affordable Homeownership",
    description:
      "We strive to make independent homeownership accessible through diverse bungalow options, competitive pricing, and flexible payment opportunities.",
    svg: icons.affordability
  },
  {
    id: "58cf0ca",
    title: "Customer Commitment",
    description:
      "We aim to support homebuyers throughout their journey, from choosing the right property to understanding payments, documentation, and ownership.",
    svg: icons.commitment
  },
  {
    id: "fcf4dfb",
    title: "Integrity & Fairness",
    description:
      "We believe in honest communication, transparent dealings, and responsible business practices that build confidence in every customer relationship.",
    svg: icons.integrity
  },
  {
    id: "f498351",
    title: "Trust & Relationships",
    description:
      "We value lasting relationships with our customers, working to earn their trust through dependable service, accountability, and long-term support.",
    svg: icons.trust
  }
];
