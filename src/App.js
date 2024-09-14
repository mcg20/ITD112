import React from "react";
import AddDengueData from "./AddDengueData";
import DengueDataList from "./DengueDataList";
import DengueDataChart from "./DengueDataChart";
import CsvUploader from "./CsvUploader";
import './App.css'; // Import the updated CSS file

function App() {
  return (
    <div className="App">
      <h1>Dengue Data Dashboard</h1>
      <div className="dashboard">
        <div>
          <AddDengueData />
        </div>
        <div>
          <CsvUploader /> {/* Uncomment if you need CSV upload */}
        </div>
        <div>
          <DengueDataList />
        </div>
        <div>
          <DengueDataChart />
        </div>
      </div>
    </div>
  );
}

export default App;
