const TabSelector = ({ activeTab, onTabChange }) => {
  const tabClass = (tabName) =>
    tabName === activeTab
      ? "inline-block p-4 text-primary bg-primary-light rounded-t-lg"
      : "inline-block p-4 text-white hover:bg-primary-light hover:text-primary";

  return (
    <div>
      <ul className="flex flex-wrap rounded-md justify-center mt-6 text-sm font-medium text-center bg-primary pt-2">
        <li className="me-2">
          <button
            onClick={() => onTabChange("Resim")}
            className={tabClass("Resim")}
          >
            Resim
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => onTabChange("Dataset")}
            className={tabClass("Dataset")}
          >
            Dataset
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TabSelector;
