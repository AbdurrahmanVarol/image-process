const DatasetUploader = ({ datasetUrl, onInputChange, onApplyFilters }) => (
    <div>
        <input
            type="text"
            className="w-1/2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Dataset url..."
            value={datasetUrl}
            onChange={onInputChange}
        />
        <button onClick={onApplyFilters} style={{ marginLeft: "10px" }}>
            Apply Filters
        </button>
    </div>
);

export default DatasetUploader;
