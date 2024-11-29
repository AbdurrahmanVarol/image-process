const Filters = ({ filters, selectedFilters, onFilterChange }) => (
    <div>
        <h3>Choose filters:</h3>
        {filters.map((filter) => (
            <div key={filter}>
                <label>
                    <input
                        type="checkbox"
                        value={filter}
                        checked={selectedFilters.includes(filter)}
                        onChange={onFilterChange}
                    />
                    {filter}
                </label>
            </div>
        ))}
    </div>
);

export default Filters;
