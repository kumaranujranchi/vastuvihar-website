export function modelType(model) {
  if (model.type === 'Row House') return 'row-house';
  if (model.type === 'Apartment') return 'apartment';
  return 'bungalow';
}

export function startingPriceLakhs(price) {
  const match = String(price).replace('₹', '').trim().match(/^(\d+(?:\.\d+)?)\s*(Cr|Lac)?/i);
  if (!match) return null;
  return Number(match[1]) * (/^cr$/i.test(match[2] || '') ? 100 : 1);
}

export function isInStartingBudget(price, budget) {
  if (!budget) return true;
  const amount = startingPriceLakhs(price);
  if (amount === null) return false;
  switch (budget) {
    case 'under-20': return amount < 20;
    case '20-40': return amount >= 20 && amount < 40;
    case '40-60': return amount >= 40 && amount < 60;
    case '60-100': return amount >= 60 && amount < 100;
    case '100-plus': return amount >= 100;
    default: return true;
  }
}

export function matchesMedia(project, filter) {
  if (!filter) return true;
  const layouts = (project.modelTypes || []).flatMap((type) => type.layouts || []);
  if (filter === 'with-video') return Boolean(project.youtubeId);
  if (filter === 'with-2d') return layouts.some((layout) => layout.type === '2D');
  if (filter === 'with-3d') return layouts.some((layout) => layout.type === '3D');
  return true;
}

export function filterProjects(projects, filters = {}) {
  return projects.filter((model) =>
    matchesMedia(model, filters.status) &&
    (!filters.type || modelType(model) === filters.type) &&
    (!filters.beds || model.bedrooms === filters.beds) &&
    isInStartingBudget(model.priceRange, filters.budget)
  );
}

