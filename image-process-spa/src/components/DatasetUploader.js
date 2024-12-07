import { useState } from "react";
import axios from "axios";

const DatasetUploader = ({ datasetUrl, onInputChange, onApplyFilters }) => {
    const [checkResult, setCheckResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckDataset = async () => {
        if (!datasetUrl) {
            setError("Lütfen bir dataset URL'si girin.");
            return;
        }
        setError(null);
        setCheckResult(null);
        setLoading(true);

        try {
            const path = encodeURIComponent(datasetUrl.replace(/\\/g, "\\"))
            const response = await axios.get(`http://127.0.0.1:8000/checkDataset?folderPath=${path}`);
            console.log(response.data)
            setCheckResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail || "Dataset kontrolü sırasında bir hata oluştu."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                className="w-1/2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dataset url..."
                value={datasetUrl}
                onChange={onInputChange}
            />
            <button
                onClick={handleCheckDataset}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={loading}
            >
                {loading ? "Kontrol Ediliyor..." : "Kontrol Et"}
            </button>
            <button
                onClick={onApplyFilters}
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
                Filtreyi Uygula
            </button>

            <div className="mt-4">
                {error && <p className="text-red-500">{error}</p>}
                {checkResult && (
                    <p className="text-green-500">
                        Klasör geçerli. {checkResult.imageCount} resim bulundu.
                    </p>
                )}
            </div>
        </div>
    );
};

export default DatasetUploader;
