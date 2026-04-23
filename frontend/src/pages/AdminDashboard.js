import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import toast, { Toaster } from "react-hot-toast";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [data, setData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    rating: ""
  });

  useEffect(() => {
    fetchDashboard();
    fetchBookings();
    fetchHotels();
  }, []);

  // 📊 DASHBOARD
  const fetchDashboard = async () => {
    const res = await axios.get(
      "http://localhost:2003/api/admin/dashboard",
      {
        headers: { Authorization: localStorage.getItem("token") }
      }
    );
    setData(res.data);
  };

  // 📅 BOOKINGS
  const fetchBookings = async () => {
    const res = await axios.get(
      "http://localhost:2003/api/bookings",
      {
        headers: { Authorization: localStorage.getItem("token") }
      }
    );
    setBookings(res.data || []);
  };

  // 🏨 HOTELS
  const fetchHotels = async () => {
    const res = await axios.get(
      "http://localhost:2003/api/hotels"
    );
    setHotels(res.data || []);
  };

  // ➕ ADD HOTEL
  const handleAddHotel = async () => {
    if (!form.name || !form.price) {
      return toast.error("Name & Price required");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:2003/api/hotels/add",
        form,
        {
          headers: { Authorization: localStorage.getItem("token") }
        }
      );

      toast.success("Hotel added");
      setForm({ name: "", location: "", price: "", rating: "" });
      fetchHotels();

    } catch {
      toast.error("Error adding hotel");
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE HOTEL
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:2003/api/hotels/${id}`,
        {
          headers: { Authorization: localStorage.getItem("token") }
        }
      );

      toast.success("Deleted");
      fetchHotels();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // 📊 CHART
  const chartData = {
    labels: ["Bookings", "Hotels", "Revenue"],
    datasets: [
      {
        label: "Stats",
        data: [
          data.totalBookings || 0,
          data.totalHotels || 0,
          data.totalRevenue || 0
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />

      {/* NAVBAR */}
      <div className="bg-white p-4 flex justify-between shadow">
        <h1 className="font-bold text-xl">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 p-4">
        <button onClick={() => setTab("dashboard")}>
          Dashboard
        </button>
        <button onClick={() => setTab("hotels")}>
          Manage Hotels
        </button>
      </div>

      <div className="p-6">

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            {/* CARDS */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded shadow">
                Bookings: {data.totalBookings}
              </div>
              <div className="bg-white p-6 rounded shadow">
                Hotels: {data.totalHotels}
              </div>
              <div className="bg-white p-6 rounded shadow">
                Revenue: ₹{data.totalRevenue}
              </div>
            </div>

            {/* CHART */}
            <div className="bg-white p-6 rounded shadow mb-6">
              <Bar data={chartData} />
            </div>

            {/* BOOKINGS TABLE */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="mb-4 font-semibold">Bookings</h2>
              {bookings.map((b, i) => (
  <div key={i} className="border-b py-2">
    {b.hotelId?.name || "Hotel"} - ₹{b.totalPrice}
  </div>
))}
            </div>
          </>
        )}

        {/* HOTEL MANAGEMENT */}
        {tab === "hotels" && (
          <>
            {/* ADD FORM */}
            <div className="bg-white p-6 rounded shadow mb-6">
              <h2 className="font-semibold mb-4">Add Hotel</h2>

              <input
                placeholder="Name"
                className="border p-2 mr-2"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Location"
                className="border p-2 mr-2"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />

              <input
                placeholder="Price"
                className="border p-2 mr-2"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              <button
                onClick={handleAddHotel}
                className="bg-green-500 text-white px-4 py-2"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>

            {/* HOTEL LIST */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="mb-4 font-semibold">Hotels</h2>

              {hotels.map((h) => (
                <div
                  key={h._id}
                  className="flex justify-between border-b py-2"
                >
                  <span>
                    {h.name} - ₹{h.price}
                  </span>

                  <button
                    onClick={() => handleDelete(h._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;