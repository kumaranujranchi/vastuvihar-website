import './ProjectFilters.css';
import FilterDropdown from './FilterDropdown';

const FILTERS = [
  {
    name: 'type',
    label: 'Home Type',
    options: [
      { value: '', label: 'Any type' },
      { value: 'bungalow', label: 'Bungalow' },
      { value: 'row-house', label: 'Row House' },
      { value: 'apartment', label: 'Apartment' },
    ],
  },
  {
    name: 'beds',
    label: 'Bedrooms',
    options: [
      { value: '', label: 'Any size' },
      { value: '1', label: '1 BHK' },
      { value: '2', label: '2 BHK' },
      { value: '3', label: '3 BHK' },
      { value: '4', label: '4 BHK' },
      { value: '5', label: '5 BHK' },
      { value: '7', label: '7 BHK' },
    ],
  },
  {
    name: 'budget',
    label: 'Starting Price',
    options: [
      { value: '', label: 'Any price' },
      { value: 'under-20', label: 'Under ₹20 Lac' },
      { value: '20-40', label: '₹20 – 40 Lac' },
      { value: '40-60', label: '₹40 – 60 Lac' },
      { value: '60-100', label: '₹60 Lac – 1 Cr' },
      { value: '100-plus', label: '₹1 Cr and Above' },
    ],
  },
];

export default function ProjectFilters({ filters = {} }) {
  return (
    <div className="spaciaz-project-filter">
      <form
        className="project-form-filter spaciaz-project-has-filter-style-1"
        data-next-project-filter=""
        method="get"
        action="/projects/"
      >
        <h4 className="filter-title">Filter</h4>
        {FILTERS.map(({ name, label, options }) => (
          <FilterDropdown
            key={name}
            name={name}
            label={label}
            options={options}
            defaultValue={options.some((option) => option.value === filters[name]) ? filters[name] : ''}
          />
        ))}
        <div className="filter-wrap filter-wrap-button search-filter-model">
          <button type="submit">Search</button>
        </div>
      </form>
    </div>
  );
}
