"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CheckboxFilters from "@/components/CheckboxFilters";
import RadioFilters from "@/components/RadioFilters";
import FileUploader from "@/components/FileUploader";
import DatasetUploader from "@/components/DatasetUploader";
import ImagePreview from "@/components/ImagePreview";
import TabSelector from "@/components/TabSelector";
import alertify from "alertifyjs";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Resim");
  const [selectedFile, setSelectedFile] = useState(null);
  const [datasetUrl, setDatasetUrl] = useState("");
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    console.log(selectedFilters);
  }, [selectedFilters]);

  const fetchFilters = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/filters");
      setFilters(response.data);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const handleActiveTabChange = (value) => {
    setActiveTab(value);
    setSelectedFilters([]);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFilters((prev) =>
      checked ? [...prev, value] : prev.filter((filter) => filter !== value)
    );
  };

  const handleRadioChange = (e) => {
    setSelectedFilters([e.target.value]);
  };

  const handleFileChange = (e) => {
    setSelectedFile([...e.target.files]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || selectedFilters.length === 0) {
      alert("Lütfen en az bir filtre seçiniz.");
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
    if (!datasetUrl) {
      alert("Lütfen dataset yolunu giriniz.");
      return;
    }
    if (!selectedFilters || selectedFilters.length === 0) {
      alert("Lütfen bir filtre seçiniz.");
      return;
    }

    const data = { input_folder: datasetUrl, filterName: selectedFilters[0] };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/applyToDataset",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alertify.success(`${selectedFilters[0]} başarılı bir şekilde datasete uygulandı.`);
      }
      console.log("Response:", response.data);
    } catch (error) {
      alertify.error("Error applying filters: " + (error.response?.data || error.message));
      console.error("Error applying filters:", error.response?.data || error.message);
    }
  };

  return (
    <div className="w-1/2 mt-10">
      <TabSelector activeTab={activeTab} onTabChange={handleActiveTabChange} />
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
          {activeTab === "Resim" ? (
            <CheckboxFilters
              filters={filters}
              selectedFilters={selectedFilters}
              onFilterChange={handleCheckboxChange}
            />
          ) : (
            <RadioFilters
              filters={filters}
              selectedFilter={selectedFilters[0] || ""}
              onFilterChange={handleRadioChange}
            />
          )}
        </div>
      </div>
      <ImagePreview images={filteredImages} />
    </div>
  );
};

export default Home;
