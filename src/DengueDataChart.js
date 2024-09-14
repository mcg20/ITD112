import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './DengueDataChart.css'; // Import the CSS file

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DengueDataChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, 'dengueData');
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => doc.data());

      // Prepare data for chart
      const labels = dataList.map(d => d.date);
      const casesData = dataList.map(d => d.cases);
      const deathsData = dataList.map(d => d.deaths);

      setData({
        labels,
        datasets: [
          {
            label: 'Cases',
            data: casesData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
          },
          {
            label: 'Deaths',
            data: deathsData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dengue Data Chart</h2>
      <Line data={data} />
    </div>
  );
};

export default DengueDataChart;
