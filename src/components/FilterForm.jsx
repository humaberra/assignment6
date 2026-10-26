function FilterForm({ filter, onFilterChange }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="filter">Filter by title: </label>
      <input
        id="filter"
        type="text"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Type to filter..."
      />
    </form>
  );
}

export default FilterForm;