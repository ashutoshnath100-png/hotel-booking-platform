import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:2003/api/admin/dashboard",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Hotel App</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
    }}
    className="bg-red-500 text-white px-3 py-1 rounded"
  >
    Logout
  </button>
</div>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Bookings</h2>
          <p className="text-2xl font-bold text-blue-500">
            {data.totalBookings}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Hotels</h2>
          <p className="text-2xl font-bold text-green-500">
            {data.totalHotels}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold text-red-500">
            ₹{data.totalRevenue}
          </p>
        </div>

      </div>
    </div>
    </div>
  );
}

export default Admin;