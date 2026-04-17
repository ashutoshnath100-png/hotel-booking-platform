import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Hotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:2003/api/hotels");
      setHotels(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBooking = async (hotelId) => {
    const checkIn = prompt("Enter check-in date (YYYY-MM-DD)");
    const checkOut = prompt("Enter check-out date (YYYY-MM-DD)");

    if (!checkIn || !checkOut) {
      return toast.error("Enter valid dates");
    }

    try {
      await axios.post(
        "http://localhost:2003/api/bookings/book",
        { hotelId, checkIn, checkOut },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      toast.success("Booking successful ✅");
    } catch (err) {
      toast.error("Booking failed ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* 🔥 NAVBAR */}
      <div className="absolute top-0 w-full flex justify-between items-center px-8 py-4 text-white z-10">
        <h1 className="text-xl font-bold">🏨 HotelApp</h1>

        <div className="hidden md:flex gap-6">
          <span className="cursor-pointer">Home</span>
          <span className="cursor-pointer">Explore</span>
          <span className="cursor-pointer">Bookings</span>
          <span
            onClick={handleLogout}
            className="cursor-pointer text-red-300"
          >
            Logout
          </span>
        </div>
      </div>

      {/* 🔥 HERO SECTION */}
      <div
        className="h-[60vh] bg-cover bg-center flex flex-col justify-center items-center text-white relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <h1 className="text-4xl font-bold z-10">
          Welcome 👋
        </h1>

        <p className="z-10 mt-2 text-lg">
          Find your perfect stay
        </p>

        {/* SEARCH BAR */}
        <div className="z-10 mt-6 bg-white rounded-full px-4 py-3 flex gap-4 items-center shadow-lg w-[90%] md:w-[700px]">
          <input
            placeholder="Location"
            className="flex-1 outline-none"
          />
          <input type="date" className="outline-none" />
          <input type="date" className="outline-none" />
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full">
            Search
          </button>
        </div>
      </div>

      {/* 🔥 HOTEL SECTION */}
      <div className="p-6 md:p-10 -mt-16">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            Featured Hotels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                  alt="hotel"
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold">
                    {hotel.name}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    📍 {hotel.location}
                  </p>

                  <p className="text-gray-500 text-sm">
                    💰 ₹{hotel.price}
                  </p>

                  <p className="text-yellow-500 text-sm">
                    ⭐ {hotel.rating}
                  </p>

                  <button
                    onClick={() => handleBooking(hotel._id)}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hotels;