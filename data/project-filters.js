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

export function getStartingBudget(minPrice) {
  if (minPrice == null || isNaN(minPrice)) return '';
  if (minPrice < 20) return 'under-20';
  if (minPrice < 40) return '20-40';
  if (minPrice < 60) return '40-60';
  if (minPrice < 100) return '60-100';
  return '100-plus';
}

export function getBudgetCategories(model) {
  const min = typeof model === 'number'
    ? model
    : (model.minPrice ?? startingPriceLakhs(model.priceRange || model.price));

  const category = getStartingBudget(min);
  return category ? [category] : [];
}

export function isInStartingBudget(modelOrPrice, budget) {
  if (!budget) return true;
  let min = null;
  if (typeof modelOrPrice === 'object' && modelOrPrice !== null) {
    min = modelOrPrice.minPrice ?? startingPriceLakhs(modelOrPrice.priceRange || modelOrPrice.price);
  } else if (typeof modelOrPrice === 'number') {
    min = modelOrPrice;
  } else {
    min = startingPriceLakhs(modelOrPrice);
  }
  if (min === null || isNaN(min)) return false;
  switch (budget) {
    case 'under-20': return min < 20;
    case '20-40': return min >= 20 && min < 40;
    case '40-60': return min >= 40 && min < 60;
    case '60-100': return min >= 60 && min < 100;
    case '100-plus': return min >= 100;
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
    (!filters.beds || String(model.bedrooms) === String(filters.beds)) &&
    isInStartingBudget(model, filters.budget)
  );
}

