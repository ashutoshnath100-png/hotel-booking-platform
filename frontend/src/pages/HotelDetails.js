import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function HotelDetails() {
  const { id } = useParams();

  const [hotel, setHotel] = useState({});
  const [reviews, setReviews] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const [booking, setBooking] = useState({
    name: "",
    members: "",
    aadhaar: "",
    checkIn: "",
    checkOut: ""
  });

  useEffect(() => {
    fetchHotel();
    fetchReviews();
    fetchBookedDates();
  }, []);

  // 🔥 FETCH HOTEL
  const fetchHotel = async () => {
    try {
      const res = await axios.get("http://localhost:2003/api/hotels");
      const found = res.data.find((h) => h._id === id);
      setHotel(found);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 FETCH REVIEWS
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2003/api/reviews/${id}`
      );
      setReviews(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 FETCH BOOKED DATES
  const fetchBookedDates = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2003/api/bookings/check/${id}`
      );
      setBookedDates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 BOOKING FUNCTION
  const handleBooking = async () => {
    if (
      !booking.name ||
      !booking.members ||
      !booking.aadhaar ||
      !booking.checkIn ||
      !booking.checkOut
    ) {
      return toast.error("Fill all fields");
    }

    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
      return toast.error("Invalid date range");
    }

    const checkIn = new Date(booking.checkIn)
      .toISOString()
      .split("T")[0];

    const checkOut = new Date(booking.checkOut)
      .toISOString()
      .split("T")[0];

    try {
      await axios.post(
        "http://localhost:2003/api/bookings/book",
        {
          hotelId: id,
          name: booking.name,
          members: booking.members,
          aadhaar: booking.aadhaar,
          checkIn,
          checkOut
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      // ✅ SUCCESS
      toast.success("Booking successful 🎉");
      setSuccessMsg("Booking successful 🎉");

      // ✅ CLEAR FORM
      setBooking({
        name: "",
        members: "",
        aadhaar: "",
        checkIn: "",
        checkOut: ""
      });

      // ✅ AUTO HIDE MESSAGE
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);

      // 🔄 Refresh booked dates
      fetchBookedDates();

    } catch (err) {
      const msg = err.response?.data || "Booking failed";
      toast.error(msg);
    }
  };

  // 💰 PRICE CALCULATION
  const days =
    (new Date(booking.checkOut) - new Date(booking.checkIn)) /
    (1000 * 60 * 60 * 24);

  const totalPrice = days > 0 ? days * (hotel?.price || 0) : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" />

      {/* HOTEL IMAGE */}
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
        className="w-full h-64 object-cover rounded-xl"
        alt="hotel"
      />

      {/* HOTEL INFO */}
      <h1 className="text-3xl font-bold mt-4">
        {hotel.name}
      </h1>

      <p className="text-gray-600">📍 {hotel.location}</p>
      <p className="text-gray-600">💰 ₹{hotel.price}</p>

      {/* ⭐ REVIEWS */}
      <h2 className="mt-6 text-xl font-semibold">Reviews</h2>

      {reviews.length === 0 && (
        <p className="text-gray-400">No reviews yet</p>
      )}

      {reviews.map((r, i) => (
        <p key={i} className="text-gray-600">
          ⭐ {r.rating} - {r.comment}
        </p>
      ))}

      {/* ⚠ BOOKED WARNING */}
      {bookedDates.length > 0 && (
        <p className="text-red-500 mt-3">
          ⚠ Some dates are already booked
        </p>
      )}

      {/* ✅ SUCCESS MESSAGE */}
      {successMsg && (
        <div className="bg-green-500 text-white p-3 rounded mt-4 text-center">
          {successMsg}
        </div>
      )}

      {/* 📝 BOOKING FORM */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Book Now
        </h2>

        <input
          placeholder="Your Name"
          className="border p-2 w-full mb-2 rounded"
          value={booking.name}
          onChange={(e) =>
            setBooking({ ...booking, name: e.target.value })
          }
        />

        <input
          placeholder="Members"
          className="border p-2 w-full mb-2 rounded"
          value={booking.members}
          onChange={(e) =>
            setBooking({ ...booking, members: e.target.value })
          }
        />

        <input
          placeholder="Aadhaar Number"
          className="border p-2 w-full mb-2 rounded"
          value={booking.aadhaar}
          onChange={(e) =>
            setBooking({ ...booking, aadhaar: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 w-full mb-2 rounded"
          value={booking.checkIn}
          onChange={(e) =>
            setBooking({ ...booking, checkIn: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 w-full mb-2 rounded"
          value={booking.checkOut}
          onChange={(e) =>
            setBooking({ ...booking, checkOut: e.target.value })
          }
        />

        <p className="font-bold mt-2">
          Total Price: ₹{totalPrice}
        </p>

        <button
          onClick={handleBooking}
          className="bg-blue-500 text-white px-4 py-2 mt-3 rounded hover:bg-blue-600 w-full"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default HotelDetails;