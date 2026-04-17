import { useEffect, useState } from "react";
import axios from "axios";

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

  // ✅ Booking Function
  const handleBooking = async (hotelId) => {
    const checkIn = prompt("Enter check-in date (YYYY-MM-DD)");
    const checkOut = prompt("Enter check-out date (YYYY-MM-DD)");

    if (!checkIn || !checkOut) {
      alert("Please enter valid dates");
      return;
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

      alert("Booking successful ✅");
    } catch (err) {
      console.log(err);
      alert("Booking failed ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Hotels
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {hotel.name}
            </h2>

            <p className="text-gray-600">
              📍 {hotel.location}
            </p>

            <p className="text-gray-600">
              💰 ₹{hotel.price}
            </p>

            <p className="text-yellow-500">
              ⭐ {hotel.rating}
            </p>

            {/* ✅ FIXED BUTTON */}
            <button
              onClick={() => handleBooking(hotel._id)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;