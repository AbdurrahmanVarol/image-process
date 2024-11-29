"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Filters from "@/components/Filters";
import FileUploader from "@/components/FileUploader";
import DatasetUploader from "@/components/DatasetUploader";
import ImagePreview from "@/components/ImagePreview";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Resim");
  const [selectedFile, setSelectedFile] = useState(null);
  const [datasetUrl, setDatasetUrl] = useState("");
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);

  const tabClass = (tabName) =>
    tabName === activeTab
      ? "inline-block p-4 text-primary bg-primary-light rounded-t-lg"
      : "inline-block p-4 text-white hover:bg-primary-light hover:text-primary";

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/filters");
      setFilters(response.data);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const handleActiveTabChange = (value) => {
    setActiveTab(value)
    setSelectedFilters([])
  }
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFilters((prev) =>
      checked ? [...prev, value] : prev.filter((filter) => filter !== value)
    );
  };

  const handleFileChange = (e) => {
    setSelectedFile([...e.target.files]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || selectedFilters.length === 0) {
      alert("Please select a file and at least one filter.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile[0]);
    formData.append("filters", JSON.stringify(selectedFilters));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/applyToImage/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFilteredImages(response.data.filtered_images);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleDatasetUpload = async () => {
    if (!datasetUrl || selectedFilters.length === 0) {
      alert("Please provide a dataset URL and at least one filter.");
      return;
    }

    const data = { input_folder: datasetUrl, filter_name: "Median" };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/applyToDataset",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error applying filters:", error.response?.data || error.message);
    }
  };


  return (
    <div className="w-1/2 mt-10">
      <div>
        <ul className="flex flex-wrap rounded-md justify-center mt-6 text-sm font-medium text-center bg-primary pt-2">
          <li className="me-2">
            <button
              onClick={() => handleActiveTabChange("Resim")}
              className={tabClass("Resim")}
            >
              Resim
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => handleActiveTabChange("Dataset")}
              className={tabClass("Dataset")}
            >
              Dataset
            </button>
          </li>
        </ul>
      </div>
      <div className="flex gap-1 mt-2">
        <div className="bg-white w-2/3 rounded-l-md p-3">
          {activeTab === "Resim" ? (
            <FileUploader
              onFileChange={handleFileChange}
              onApplyFilters={handleFileUpload}
            />
          ) : (
            <DatasetUploader
              datasetUrl={datasetUrl}
              onInputChange={(e) => setDatasetUrl(e.target.value)}
              onApplyFilters={handleDatasetUpload}
            />
          )}
        </div>
        <div className="bg-white w-1/3 rounded-r-md p-3">
          <Filters
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      <ImagePreview images={filteredImages} />
    </div>
  );
};

export default Home;
