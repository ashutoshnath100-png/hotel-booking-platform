import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  MapPin, 
  Users, 
  CreditCard, 
  Calendar, 
  Star, 
  Info, 
  IndianRupee,
  ShieldCheck,
  Coffee
} from "lucide-react";

function HotelDetails() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState({
    name: "",
    members: "",
    aadhaar: "",
    checkIn: "",
    checkOut: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchHotel(), fetchReviews(), fetchBookedDates()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const fetchHotel = async () => {
    const res = await axios.get("http://localhost:2003/api/hotels");
    const found = res.data.find((h) => h._id === id);
    setHotel(found);
  };

  const fetchReviews = async () => {
    const res = await axios.get(`http://localhost:2003/api/reviews/${id}`);
    setReviews(res.data);
  };

  const fetchBookedDates = async () => {
    const res = await axios.get(`http://localhost:2003/api/bookings/check/${id}`);
    setBookedDates(res.data);
  };

  const totalPrice = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const days = (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24);
    return days > 0 ? days * (hotel?.price || 0) : 0;
  }, [booking.checkIn, booking.checkOut, hotel?.price]);

  const handleBooking = async () => {
    if (!Object.values(booking).every(x => x)) return toast.error("Please complete all fields");
    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) return toast.error("Invalid dates");

    try {
      await axios.post("http://localhost:2003/api/bookings/book", 
        { hotelId: id, ...booking },
        { headers: { Authorization: localStorage.getItem("token") }}
      );
      toast.success("Booking confirmed! Enjoy your stay.");
      setBooking({ name: "", members: "", aadhaar: "", checkIn: "", checkOut: "" });
      fetchBookedDates();
    } catch (err) {
      toast.error(err.response?.data || "Booking failed");
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="animate-bounce p-4 bg-white rounded-full shadow-xl">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <Toaster position="top-center" />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="relative h-[450px] overflow-hidden rounded-[2rem] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
            className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
            alt="Hotel"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
            <div className="text-white">
              <span className="bg-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Featured Stay</span>
              <h1 className="text-5xl font-black mt-2 tracking-tight">{hotel?.name}</h1>
              <div className="flex items-center mt-3 text-gray-200">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-lg">{hotel?.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT CONTENT */}
        <div className="lg:col-span-8 space-y-12">
          {/* AMENITIES QUICK VIEW */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center overflow-x-auto">
            <div className="flex flex-col items-center px-4"><Coffee className="w-6 h-6 mb-2 text-blue-500"/><span className="text-xs font-medium">Free Breakfast</span></div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col items-center px-4"><ShieldCheck className="w-6 h-6 mb-2 text-green-500"/><span className="text-xs font-medium">Safe & Secure</span></div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col items-center px-4"><Star className="w-6 h-6 mb-2 text-yellow-500"/><span className="text-xs font-medium">Top Rated</span></div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col items-center px-4"><Users className="w-6 h-6 mb-2 text-indigo-500"/><span className="text-xs font-medium">Family Friendly</span></div>
          </section>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About this space</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Nestled in the heart of {hotel?.location}, this property offers a seamless blend of luxury and convenience. 
              Whether you are here for business or leisure, our rooms are designed to provide the ultimate sanctuary.
            </p>
          </div>

          {/* REVIEWS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">What guests say</h3>
              <span className="text-blue-600 font-semibold">{reviews.length} Reviews</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-1 mb-3">
                    {[...Array(r.rating)].map((_, s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 italic">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - BOOKING CARD */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase">Price</p>
                <div className="flex items-center">
                  <IndianRupee className="w-6 h-6 text-gray-900" />
                  <span className="text-3xl font-black">{hotel?.price}</span>
                  <span className="text-gray-500 ml-1">/ night</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="group relative border border-gray-200 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
                <label className="block text-[10px] font-extrabold text-blue-600 uppercase mb-1">Full Name</label>
                <input 
                  className="w-full bg-transparent outline-none text-gray-900 font-semibold"
                  value={booking.name} 
                  onChange={(e) => setBooking({...booking, name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
                  <label className="block text-[10px] font-extrabold text-blue-600 uppercase mb-1">Guests</label>
                  <input 
                    type="number"
                    className="w-full bg-transparent outline-none text-gray-900 font-semibold"
                    value={booking.members} 
                    onChange={(e) => setBooking({...booking, members: e.target.value})} 
                  />
                </div>
                <div className="border border-gray-200 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
                  <label className="block text-[10px] font-extrabold text-blue-600 uppercase mb-1">ID Number</label>
                  <input 
                    className="w-full bg-transparent outline-none text-gray-900 font-semibold"
                    value={booking.aadhaar} 
                    onChange={(e) => setBooking({...booking, aadhaar: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-2xl overflow-hidden">
                <div className="p-3 border-r border-gray-100">
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Check In</label>
                  <input 
                    type="date" 
                    className="w-full text-xs font-bold outline-none"
                    value={booking.checkIn} 
                    onChange={(e) => setBooking({...booking, checkIn: e.target.value})} 
                  />
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Check Out</label>
                  <input 
                    type="date" 
                    className="w-full text-xs font-bold outline-none"
                    value={booking.checkOut} 
                    onChange={(e) => setBooking({...booking, checkOut: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {bookedDates.length > 0 && (
              <div className="mt-6 flex items-center gap-3 p-4 bg-amber-50 rounded-2xl text-amber-700 text-xs border border-amber-100">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p><strong>Note:</strong> Some dates in our system are already reserved. Double check availability.</p>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center text-gray-600">
                <span>Total for {totalPrice / (hotel?.price || 1)} nights</span>
                <span className="font-bold">₹{totalPrice}</span>
              </div>
              <button
                onClick={handleBooking}
                className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-black rounded-2xl font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95"
              >
                Confirm Reservation
              </button>
              <p className="text-center text-[10px] text-gray-400 font-medium">SECURE CHECKOUT • NO HIDDEN FEES</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;