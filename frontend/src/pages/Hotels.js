import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Hotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [reviews, setReviews] = useState({});
  const [avgRatings, setAvgRatings] = useState({});
  const [search, setSearch] = useState({
    location: "",
    minPrice: "",
    maxPrice: ""
  });
  const [showModal, setShowModal] = useState(false);
const [selectedHotel, setSelectedHotel] = useState(null);
const [booking, setBooking] = useState({
  checkIn: "",
  checkOut: ""
});

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = async () => {
  try {
    const res = await axios.get(
      "http://localhost:2003/api/hotels/search",
      {
        params: {
          location: search.location || "",
          minPrice: search.minPrice || "",
          maxPrice: search.maxPrice || "",
          rating: search.rating || ""
        }
      }
    );

    setHotels(res.data);

  } catch (err) {
    console.log(err);
    alert("Search failed");
  }
};

//   const fetchReviews = async (hotelId) => {
//   const res = await axios.get(
//     `http://localhost:2003/api/reviews/${hotelId}`
//   );

//   setReviews((prev) => ({
//     ...prev,
//     [hotelId]: res.data
//   }));
// };

const fetchReviews = async (hotelId) => {
  try {
    const res = await axios.get(
      `http://localhost:2003/api/reviews/${hotelId}`
    );

    setReviews((prev) => ({
      ...prev,
      [hotelId]: res.data
    }));
  } catch (err) {
    console.log(err);
  }
};

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:2003/api/hotels");
      setHotels(res.data);
      res.data.forEach((hotel) => {
      fetchAvgRating(hotel._id);
    });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBooking = async () => {
  if (!booking.checkIn || !booking.checkOut) {
    alert("Please select dates");
    return;
  }

  try {
    await axios.post(
      "http://localhost:2003/api/bookings/book",
      {
        hotelId: selectedHotel,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      },
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );

    alert("Booking successful ✅");
    setShowModal(false);

  } catch (err) {
    alert("Booking failed ❌");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleReview = async (hotelId) => {
    const rating = prompt("Enter rating (1-5)");
    const comment = prompt("Enter comment");

    if (!rating) return;

    try {
      await axios.post(
        "http://localhost:2003/api/reviews/add",
        { hotelId, rating, comment },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      alert("Review added ✅");
    } catch {
      alert("Error adding review");
    }
  };

  

const fetchAvgRating = async (hotelId) => {
  try {
    const res = await axios.get(
      `http://localhost:2003/api/reviews/average/${hotelId}`
    );

    setAvgRatings((prev) => ({
      ...prev,
      [hotelId]: res.data.avgRating
    }));

  } catch (err) {
    console.log(err);
  }
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

    {/* 🔥 HERO */}
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

      {/* 🔍 SEARCH */}
      <div className="z-10 mt-6 bg-white rounded-full px-4 py-3 flex gap-4 items-center shadow-lg w-[90%] md:w-[700px]">

        <input
          placeholder="Location"
          className="flex-1 outline-none"
          onChange={(e) =>
            setSearch({ ...search, location: e.target.value })
          }
        />

        <input
          placeholder="Min Price"
          className="w-24 outline-none"
          onChange={(e) =>
            setSearch({ ...search, minPrice: e.target.value })
          }
        />

        <input
          placeholder="Max Price"
          className="w-24 outline-none"
          onChange={(e) =>
            setSearch({ ...search, maxPrice: e.target.value })
          }
        />

        <input
          placeholder="Rating"
          className="w-20 outline-none"
          onChange={(e) =>
            setSearch({ ...search, rating: e.target.value })
          }
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-full"
        >
          Search
        </button>
      </div>
    </div>

    {/* 🏨 HOTELS */}
    <div className="p-6 md:p-10 -mt-16">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          Featured Hotels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              onClick={() => fetchReviews(hotel._id)}
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

                <p className="text-yellow-500 text-sm font-semibold">
                  ⭐ {avgRatings[hotel._id]?.toFixed(1) || "New"}
                </p>

                {/* REVIEWS */}
                {/* <div className="mt-2">
                  {reviews[hotel._id]?.map((r, i) => (
                    <p key={i} className="text-sm text-gray-500">
                      ⭐ {r.rating} - {r.comment}
                    </p>
                  ))}
                </div> */}

                {/* BOOK */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // IMPORTANT
                    setSelectedHotel(hotel._id);
                    setShowModal(true);
                  }}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Book Now
                </button>

                {/* REVIEW */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReview(hotel._id);
                  }}
                  className="mt-2 w-full bg-yellow-500 text-white py-1 rounded"
                >
                  Add Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 🔥 ✅ MODAL (ADD HERE AT END) */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        
        <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
          
          <h2 className="text-xl font-semibold mb-4">
            Book Hotel
          </h2>

          <input
            type="date"
            className="w-full border p-2 rounded mb-3"
            onChange={(e) =>
              setBooking({ ...booking, checkIn: e.target.value })
            }
          />

          <input
            type="date"
            className="w-full border p-2 rounded mb-4"
            onChange={(e) =>
              setBooking({ ...booking, checkOut: e.target.value })
            }
          />

          <div className="flex justify-between">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            {/* <button
              onClick={handleBooking}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Confirm Booking
            </button> */}
            <button
  onClick={() => navigate(`/hotel/${selectedHotel}`)}
  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
>
  View Details
</button>
{/* <button
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/hotel/${hotel._id}`);
  }}
  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
>
  View Details
</button> */}
          </div>

        </div>
      </div>
    )}

  </div>
);}

export default Hotels;