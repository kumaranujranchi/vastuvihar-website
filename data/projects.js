// Project-detail view model from the supplied 16 models; no sample projects.
// Install this file as data/projects.js next to data/project.js.
import { projectsData } from './project.js';

const normalizedStat = (label) => label.toLowerCase().replace(/[^a-z0-9]/g, '');

function getStat(model, labels) {
  const accepted = new Set(labels.map(normalizedStat));
  const stats = (model.modelTypes || []).flatMap((type) => type.stats || []);
  const match = stats.find((item) => accepted.has(normalizedStat(item.label)));
  if (!match || match.value === '' || match.value === null || match.value === undefined) return 'Not specified';
  return `${match.value}${match.unit ? ` ${match.unit}` : ''}`;
}

function getHomeType(model) {
  if (['nano', 'aditi', 'ganga-new-2bhk'].includes(model.slug)) return 'Apartment';
  if (model.name.toLowerCase().includes('row house')) return 'Row House';
  return 'Bungalow';
}

const modelSlugs = Object.keys(projectsData);
export const projects = modelSlugs.map((slug, index) => {
  const model = projectsData[slug];
  return {
    ...model,
    slug,
    title: model.name,
    type: getHomeType(model),
    image: model.gallery?.[0] || '',
    bedrooms: getStat(model, ['Bedrooms', 'Bedroom']),
    bathrooms: getStat(model, ['Bathrooms', 'Bathroom']),
    builtUp: getStat(model, ['Built-up', 'Built-up Area', 'Builtup Area']),
    plotArea: getStat(model, ['Plot Area', 'Land Area']),
    priceRange: model.price,
    minPrice: model.minPrice,
    maxPrice: model.maxPrice,
    priceRangeNumeric: [model.minPrice, model.maxPrice],
    location: 'Vastu Vihar Home Models',
    locationHref: '/projects/',
    previousSlug: index ? modelSlugs[index - 1] : null,
    nextSlug: index < modelSlugs.length - 1 ? modelSlugs[index + 1] : null,
  };
});
const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
export function getProject(slug) {
  return projectBySlug.get(slug) ?? null;
}
