import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import './DengueDataList.css'; // Import the CSS file

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      setDengueData(dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteAll = async () => {
    const batch = writeBatch(db);
    try {
      dengueData.forEach((data) => {
        const dengueDocRef = doc(db, "dengueData", data.id);
        batch.delete(dengueDocRef);
      });
      await batch.commit();
      setDengueData([]);
      alert("All data deleted successfully!");
    } catch (error) {
      console.error("Error deleting all documents: ", error);
    }
  };

  return (
    <div className="dengue-data-list">
      <h2>Dengue Data List</h2>
      {editingId ? (
        <form className="edit-form" onSubmit={handleUpdate}>
          <input
            className="form-input"
            type="text"
            placeholder="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            required
          />
          <input
            className="form-input"
            type="number"
            placeholder="Cases"
            value={editForm.cases}
            onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
            required
          />
          <input
            className="form-input"
            type="number"
            placeholder="Deaths"
            value={editForm.deaths}
            onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
            required
          />
          <input
            className="form-input"
            type="date"
            placeholder="Date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            required
          />
          <input
            className="form-input"
            type="text"
            placeholder="Regions"
            value={editForm.regions}
            onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
            required
          />
          <button className="form-button" type="submit">Update Data</button>
          <button className="form-button cancel-button" type="button" onClick={() => setEditingId(null)}>Cancel</button>
        </form>
      ) : (
        <>
          <button className="form-button delete-all-button" onClick={handleDeleteAll}>Delete All</button>
          <ul className="data-list">
            {dengueData.map((data) => (
              <li className="data-item" key={data.id}>
                <div>
                  {data.location} - {data.cases} cases - {data.deaths} deaths - {data.date} - {data.regions}
                </div>
                <div>
                  <button className="data-button edit-button" onClick={() => handleEdit(data)}>Edit</button>
                  <button className="data-button delete-button" onClick={() => handleDelete(data.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DengueDataList;
