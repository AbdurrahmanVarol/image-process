const RadioFilters = ({ filters, selectedFilter, onFilterChange }) => (
    <div>
        <h3>Choose a filter:</h3>
        {filters.map((filter) => (
            <div key={filter}>
                <label>
                    <input
                        type="radio"
                        name="filter-group" // Radio gruplaması için name gerekli
                        value={filter}
                        checked={selectedFilter === filter}
                        onChange={onFilterChange}
                    />
                    {filter}
                </label>
            </div>
        ))}
    </div>
);

export default RadioFilters;
