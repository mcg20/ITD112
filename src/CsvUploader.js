// src/CsvUploader.js
import React, { useState } from "react";
import Papa from "papaparse";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const CsvUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }

    setStatus("Uploading...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data;
          console.log("Parsed data:", data); // Debug: Log parsed data

          if (!Array.isArray(data) || data.length === 0) {
            setStatus("No data found in the file.");
            return;
          }

          for (const item of data) {
            if (!item.loc || !item.cases || !item.deaths || !item.date || !item.Region || !item.year) {
              console.warn("Skipping incomplete record:", item);
              continue;
            }

            // Firestore expects consistent field names
            await addDoc(collection(db, "dengueData"), {
              location: item.loc,         // Mapping CSV header 'loc' to 'location'
              cases: Number(item.cases),  // Ensuring data is numeric
              deaths: Number(item.deaths), // Ensuring data is numeric
              date: item.date,
              regions: item.Region,       // Mapping CSV header 'Region' to 'regions'
              year: item.year             // Mapping CSV header 'year' (if needed)
            });
          }

          setStatus("Data uploaded successfully!");
        } catch (error) {
          console.error("Error uploading data: ", error.message);
          setStatus(`Error uploading data: ${error.message}`);
        }
      },
      error: (error) => {
        console.error("CSV parsing error: ", error.message);
        setStatus(`Error parsing CSV file: ${error.message}`);
      }
    });
  };

  return (
    <div>
      <h2>Upload CSV Data</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default CsvUploader;
