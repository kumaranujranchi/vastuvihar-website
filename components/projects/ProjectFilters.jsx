import './ProjectFilters.css';
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
        <select name="status" aria-label="Available media" defaultValue={filters.status}>
          <option value="">All Models</option>
          <option value="with-video">With Video</option>
          <option value="with-2d">With 2D Plans</option>
          <option value="with-3d">With 3D Plans</option>
        </select>
        <select name="type" aria-label="Home type" defaultValue={filters.type}>
          <option value="">Home Type</option>
          <option value="bungalow">Bungalow</option>
          <option value="row-house">Row House</option>
          <option value="apartment">Apartment</option>
        </select>
        <select name="beds" aria-label="Bedrooms" defaultValue={filters.beds}>
          <option value="">Bedrooms</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
          <option value="5">5 BHK</option>
          <option value="7">7 BHK</option>
        </select>
        <select name="budget" aria-label="Starting price" defaultValue={filters.budget}>
          <option value="">Starting Price</option>
          <option value="under-20">Under ₹20 Lac</option>
          <option value="20-40">₹20 – 40 Lac</option>
          <option value="40-60">₹40 – 60 Lac</option>
          <option value="60-100">₹60 Lac – 1 Cr</option>
          <option value="100-plus">₹1 Cr and Above</option>
        </select>
        <div className="filter-wrap filter-wrap-button">
          <button type="submit">Search</button>
        </div>
      </form>
    </div>
  );
}
