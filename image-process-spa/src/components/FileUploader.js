const FileUploader = ({ onFileChange, onApplyFilters }) => (
    <div>
        <input
            type="file"
            onChange={onFileChange}
            accept="image/*"
            className="mt-5 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />


        <button
            onClick={onApplyFilters}
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
            Filtreleri Uygula
        </button>
    </div>
);

export default FileUploader;
