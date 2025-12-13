import { useEffect, useState } from "react";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2"; // Import Line and Doughnut
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement, // Register LineElement for Line Chart
  PointElement, // Register PointElement for Line Chart
} from "chart.js";
import axios from "axios";

// Register all necessary Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement // Register PointElement
);

// Define a consistent set of vibrant colors for charts
const CHART_COLORS = [
  'rgba(255, 99, 132, 0.7)', // Red
  'rgba(54, 162, 235, 0.7)', // Blue
  'rgba(255, 206, 86, 0.7)', // Yellow
  'rgba(75, 192, 192, 0.7)', // Green
  'rgba(153, 102, 255, 0.7)', // Purple
  'rgba(255, 159, 64, 0.7)', // Orange
  'rgba(199, 199, 199, 0.7)', // Grey
  'rgba(83, 102, 255, 0.7)', // Indigo
  'rgba(255, 99, 255, 0.7)', // Pink
  'rgba(99, 255, 255, 0.7)', // Cyan
];

const CHART_BORDER_COLORS = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
    'rgba(255, 99, 255, 1)',
    'rgba(99, 255, 255, 1)',
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }
        const res = await axios.get(
          "http://localhost:5000/api/admin/dashboard-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load dashboard data.");
      }
    };
    fetchStats();
  }, []);

  if (error) return <div className="text-red-600 p-8 text-center text-xl">{error}</div>;
  if (!data) return <div className="p-8 text-center text-gray-600 text-xl">Loading dashboard...</div>;

  // Common chart options for consistency and animation
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to resize freely
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 15,
        }
      },
    },
    animation: { // Explicit animation settings for all charts
      duration: 1200, // Animation duration in milliseconds
      easing: 'easeOutQuart', // Easing function for animation
      // Other animation options can be added here
    }
  };

  // 1. User Registrations Bar Chart Data
  const userBarChartData = {
    labels: data.userRegistrations.map(i => i.month),
    datasets: [
      {
        label: "New Users",
        data: data.userRegistrations.map(i => i.count),
        backgroundColor: CHART_COLORS[1], // Blue
        borderColor: CHART_BORDER_COLORS[1],
        borderWidth: 1,
      },
    ],
  };

  // User Registrations Bar Chart Options
  const userBarChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      title: {
        ...commonChartOptions.plugins.title,
        text: 'Monthly User Registrations',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Users',
          font: { size: 14 },
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: { size: 14 },
        }
      }
    }
  };

  // 2. User Registrations Line Chart Data
  const userLineChartData = {
    labels: data.userRegistrations.map(i => i.month),
    datasets: [
      {
        label: "New Users Trend",
        data: data.userRegistrations.map(i => i.count),
        fill: false,
        borderColor: CHART_COLORS[0], // Red
        backgroundColor: CHART_COLORS[0],
        tension: 0.3, // Makes the line curved
        pointBackgroundColor: CHART_COLORS[0],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: CHART_COLORS[0],
      },
    ],
  };

  // User Registrations Line Chart Options
  const userLineChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      title: {
        ...commonChartOptions.plugins.title,
        text: 'User Registrations Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Users',
          font: { size: 14 },
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: { size: 14 },
        }
      }
    }
  };

  // 3. Bus Status Pie Chart Data
  const busPieChartData = {
    labels: Object.keys(data.busStatus),
    datasets: [
      {
        data: Object.values(data.busStatus),
        backgroundColor: CHART_COLORS.slice(0, Object.keys(data.busStatus).length),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 10, // Adds a slight animation on hover
      },
    ],
  };

  // Bus Status Pie Chart Options
  const busPieChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      title: {
        ...commonChartOptions.plugins.title,
        text: 'Bus Status Distribution (Pie)',
      },
    },
  };

  // 4. Bus Status Doughnut Chart Data (similar to Pie, just visual difference)
  const busDoughnutChartData = {
    labels: Object.keys(data.busStatus),
    datasets: [
      {
        data: Object.values(data.busStatus),
        backgroundColor: CHART_COLORS.slice(Object.keys(data.busStatus).length, Object.keys(data.busStatus).length * 2), // Use different set of colors if more than 5 status
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Bus Status Doughnut Chart Options
  const busDoughnutChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      title: {
        ...commonChartOptions.plugins.title,
        text: 'Bus Status Distribution (Doughnut)',
      },
    },
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[calc(100vh-80px)]"> {/* Added min-h for better layout */}
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition duration-300 ease-in-out">
          <p className="text-xl font-medium">Total Users</p>
          <h2 className="text-5xl font-bold mt-2">{data.totalUsers}</h2>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition duration-300 ease-in-out">
          <p className="text-xl font-medium">Total Buses</p>
          <h2 className="text-5xl font-bold mt-2">{data.totalBuses}</h2>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center transform hover:scale-105 transition duration-300 ease-in-out">
          <p className="text-xl font-medium">Total Paid</p>
          <h2 className="text-5xl font-bold mt-2">Rs {data.totalPaidMoney.toLocaleString()}</h2> {/* Format currency */}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-center items-center min-h-[400px]">
          <Bar data={userBarChartData} options={userBarChartOptions} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-center items-center min-h-[400px]">
          <Line data={userLineChartData} options={userLineChartOptions} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-center items-center min-h-[400px]">
          <Pie data={busPieChartData} options={busPieChartOptions} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-md flex justify-center items-center min-h-[400px]">
          <Doughnut data={busDoughnutChartData} options={busDoughnutChartOptions} />
        </div>
      </div>
    </div>
  );
}