import "./dashboard.css";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import NavbarLayout from "./navbar";
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Initialize with default data
  const [dashboardData, setDashboardData] = useState({
    cityDistribution: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    weekDistribution: [0, 0, 0, 0, 0, 0, 0],
    categoryDistribution: [0, 0, 0],
    tourCounts: {
      individual: 0,
      school: 0,
      cancelled: 0,
      total: 0
    }
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/getDashboardData");
        if (response.status === 200) {
          setDashboardData(response.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("An error occurred while fetching dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const cityData = {
    labels: ['Istanbul', 'Ankara', 'İzmir', 'Bursa', 'Adana', 'Antalya', 'Konya', 'Samsun', 'Erzurum', 'Others'],
    datasets: [{
      data: dashboardData.cityDistribution,
      backgroundColor: 'rgba(90, 120, 190, 0.7)',
    }]
  };

  const weekData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      data: dashboardData.weekDistribution,
      backgroundColor: [
        '#E6B3CC', '#99CCFF', '#B3B3CC', '#CCB3CC',
        '#CC99CC', '#FF99CC', '#FFB3CC',
      ],
    }]
  };

  const categoryData = {
    labels: ['Starred', 'Nurturing', 'Maintenance'],
    datasets: [{
      data: dashboardData.categoryDistribution,
      backgroundColor: [
        '#FF99CC', '#B3B3CC', '#99CCFF',
      ],
    }]
  };

  if (isLoading) {
    return (
      <div className="home-layout">
        <NavbarLayout />
        <div className="content">
          <h1>Dashboard</h1>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <NavbarLayout />
      
      <div className="content">
        <h1>Dashboard</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <div className="dashboard-container">
          <div className="chart-grid">
            <div className="chart-box">
              <h2>Category Distribution</h2>
              {dashboardData.categoryDistribution.some(val => val > 0) ? (
                <Pie data={categoryData} options={{ responsive: true }} />
              ) : (
                <div className="no-data">No category data available</div>
              )}
            </div>

            <div className="chart-box">
              <h2>City Distribution</h2>
              {dashboardData.cityDistribution.some(val => val > 0) ? (
                <Bar 
                  data={cityData}
                  options={{
                    responsive: true,
                    indexAxis: 'y',
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 25
                      }
                    }
                  }}
                />
              ) : (
                <div className="no-data">No city data available</div>
              )}
            </div>

            <div className="chart-box">
              <h2>Week of the Day Distribution</h2>
              {dashboardData.weekDistribution.some(val => val > 0) ? (
                <Pie data={weekData} options={{ responsive: true }} />
              ) : (
                <div className="no-data">No weekly distribution data available</div>
              )}
            </div>

            <div className="stats-box">
              <div className="stat-item">
                <h3>Individual Tours</h3>
                <span>{dashboardData.tourCounts.individual}</span>
              </div>
              <div className="stat-item">
                <h3>School Tours</h3>
                <span>{dashboardData.tourCounts.school}</span>
              </div>
              <div className="stat-item">
                <h3>Cancelled Tours</h3>
                <span>{dashboardData.tourCounts.cancelled}</span>
              </div>
              <div className="stat-item total">
                <h3>Total Tours</h3>
                <span>{dashboardData.tourCounts.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}