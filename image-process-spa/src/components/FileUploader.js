const FileUploader = ({ onFileChange, onApplyFilters }) => (
    <div>
        <input type="file" onChange={onFileChange} style={{ marginTop: "20px" }} />
        <button onClick={onApplyFilters} style={{ marginLeft: "10px" }}>
            Apply Filters
        </button>
    </div>
);

export default FileUploader;
