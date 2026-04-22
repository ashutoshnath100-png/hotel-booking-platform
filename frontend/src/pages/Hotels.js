import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, Star, LogOut, ShieldCheck, Headphones, 
  CreditCard, Zap, Compass, Globe, Home, Tag, Menu 
} from "lucide-react";

function Hotels() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [avgRatings, setAvgRatings] = useState({});
  const [search, setSearch] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:2003/api/hotels");
      setHotels(res.data);
      setFilteredHotels(res.data);
      res.data.forEach((hotel) => fetchAvgRating(hotel._id));
    } catch (err) {
      toast.error("Failed to load listings");
    }
  };

  const fetchAvgRating = async (hotelId) => {
    try {
      const res = await axios.get(`http://localhost:2003/api/reviews/average/${hotelId}`);
      setAvgRatings((prev) => ({
        ...prev,
        [hotelId]: res.data.avgRating,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = hotels;
      if (search.location) {
        filtered = filtered.filter((hotel) =>
          hotel.location.toLowerCase().includes(search.location.toLowerCase())
        );
      }
      if (search.checkIn && search.checkOut && search.checkOut < search.checkIn) {
        toast.error("Check-out must be after check-in");
        return;
      }
      setFilteredHotels(filtered);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, hotels]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-[#2D3142]">
      <Toaster position="top-center" />

      {/* PREMIUM FLOATING NAVBAR */}
      <nav className="fixed top-4 inset-x-0 z-[100] mx-auto w-[95%] max-w-[1400px]">
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl px-6 py-3 transition-all duration-300">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <h1 className="text-xl font-black tracking-tighter text-slate-800 hidden sm:block">
                BookMy<span className="text-blue-600">Stay</span>
              </h1>
            </div>

            {/* Nav Links - Pill Style */}
            <div className="hidden md:flex items-center bg-gray-100/50 rounded-full px-1 py-1 border border-gray-200/50">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold bg-white text-blue-600 shadow-sm transition-all"
              >
                <Home size={16} /> Home
              </button>
              <button className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-all">
                <Compass size={16} /> Explore
              </button>
              <button className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition-all">
                <Tag size={16} /> Deals
              </button>
            </div>

            {/* Action Area */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-red-500 transition-all duration-300 shadow-md hover:shadow-red-200 group"
              >
                <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Adjusted Padding for Fixed Nav */}
      <div className="max-w-[1400px] mx-auto px-6 pt-24 relative">
        <div className="relative h-[550px] rounded-[48px] overflow-hidden shadow-2xl">
          <img
             src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
            className="w-full h-full object-cover"
            alt="Luxury Resort"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute top-1/2 -translate-y-1/2 left-16 max-w-xl text-white">
            <span className="bg-blue-600/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
              Premium Escapes
            </span>
            <h2 className="text-7xl font-black leading-[1.1] mb-6 tracking-tight">
              Your Journey <br /> <span className="text-blue-400">Begins Here.</span>
            </h2>
            <p className="text-lg text-gray-200 mb-8 font-medium max-w-md">
              Discover handpicked luxury hotels and exclusive packages curated just for your comfort.
            </p>
          </div>

          FLOATING SEARCH BAR
          
          <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 
w-[75%] max-w-2xl bg-white/95 backdrop-blur-md rounded-full 
flex items-center shadow-xl border border-gray-200 overflow-hidden">

  {/* LOCATION */}
  <div className="flex-1 px-5 py-3 hover:bg-gray-100 transition">
    <div className="flex items-center gap-1 text-blue-600 mb-1">
      <MapPin className="w-3 h-3" />
      <label className="text-[9px] font-bold uppercase">Location</label>
    </div>
    <input
      value={search.location}
      placeholder="Where to?"
      className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-gray-400"
      onChange={(e) => setSearch({ ...search, location: e.target.value })}
    />
  </div>

  {/* DIVIDER */}
  <div className="h-8 w-[1px] bg-gray-200"></div>

  {/* CHECK IN */}
  <div className="px-5 py-3 hover:bg-gray-100 transition">
    <label className="text-[9px] font-bold text-blue-600 uppercase mb-1 block">
      Check in
    </label>
    <input
      type="date"
      className="w-full outline-none text-sm font-medium bg-transparent"
      onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
    />
  </div>

  {/* DIVIDER */}
  <div className="h-8 w-[1px] bg-gray-200"></div>

  {/* CHECK OUT */}
  <div className="px-5 py-3 hover:bg-gray-100 transition">
    <label className="text-[9px] font-bold text-blue-600 uppercase mb-1 block">
      Check out
    </label>
    <input
      type="date"
      className="w-full outline-none text-sm font-medium bg-transparent"
      onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
    />
  </div>

  {/* SEARCH BUTTON */}
  <button className="mx-2 bg-blue-600 hover:bg-blue-700 text-white 
  px-5 py-2 rounded-full text-sm font-semibold transition 
  shadow-md hover:shadow-lg">
    Search
  </button>

</div>
        </div>
      </div>

      {/* HOTELS LISTING */}
      <section className="max-w-[1400px] mx-auto px-6 mt-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-4xl font-black tracking-tight mb-2">Featured Stays</h3>
            <p className="text-gray-500 font-medium italic">Explore our most-loved properties worldwide</p>
          </div>
          <button className="px-6 py-2 rounded-full border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 font-bold text-sm transition-all">
            View All Properties
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => navigate(`/hotel/${hotel._id}`)}
                className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-50 cursor-pointer"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={hotel.name}
                  />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[11px] font-black uppercase flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    {avgRatings[hotel._id]?.toFixed(1) || "4.8"}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition mb-1">{hotel.name}</h4>
                      <div className="flex items-center text-gray-400 text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                        {hotel.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600 leading-none">AED {hotel.price}</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">/ night</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-50 flex gap-6">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                       <Compass className="w-4 h-4 text-blue-400" /> Free WiFi
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                       <CreditCard className="w-4 h-4 text-blue-400" /> No Deposit
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 text-lg">No hotels found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mt-40 px-6">
        {[
          { icon: <Zap className="text-yellow-500" />, title: "Best Prices", desc: "Guaranteed lowest rates" },
          { icon: <ShieldCheck className="text-green-500" />, title: "Secure Booking", desc: "100% encrypted payments" },
          { icon: <Headphones className="text-blue-500" />, title: "24/7 Support", desc: "We're here to help anytime" },
          { icon: <Globe className="text-purple-500" />, title: "Global Reach", desc: "Over 50,000+ properties" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center p-8 rounded-[32px] bg-white border border-gray-50 hover:shadow-xl transition-all duration-300">
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">{item.icon}</div>
            <h5 className="font-bold text-base mb-2">{item.title}</h5>
            <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* NEWSLETTER SECTION */}
      {/* NEWSLETTER SECTION */}
      <section className="max-w-[1300px] mx-auto px-6 mt-32">
        <div className="bg-blue-600 rounded-[48px] p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h3 className="text-4xl font-black mb-4">Join our travel club</h3>
          <p className="opacity-80 mb-8 max-w-md mx-auto">Get exclusive access to member-only deals and travel inspiration directly in your inbox.</p>
          <div className="flex max-w-md mx-auto bg-white rounded-2xl p-2 shadow-xl">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-2 outline-none text-gray-800"
            />
            <button className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-40 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-10 py-20 grid grid-cols-1 md:grid-cols-4 gap-16 text-sm">
          <div>
            <h1 className="text-2xl font-black text-blue-600 mb-6">BookMyStay</h1>
            <p className="text-gray-500 leading-loose font-medium">
              We curate world-class experiences for the modern traveler. From boutique retreats to luxury high-rises.
            </p>
          </div>

          <div>
            <h6 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-[11px]">Services</h6>
            <ul className="space-y-4 text-gray-500 font-semibold">
              <li className="hover:text-blue-600 cursor-pointer transition">Premium Stays</li>
              <li className="hover:text-blue-600 cursor-pointer transition">Private Concierge</li>
              <li className="hover:text-blue-600 cursor-pointer transition">Corporate Travel</li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-[11px]">Company</h6>
            <ul className="space-y-4 text-gray-500 font-semibold">
              <li className="hover:text-blue-600 cursor-pointer transition">Our Story</li>
              <li className="hover:text-blue-600 cursor-pointer transition">Sustainability</li>
              <li className="hover:text-blue-600 cursor-pointer transition">Terms & Privacy</li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-[11px]">Connect</h6>
            <div className="flex gap-4 mb-8">
              {[Globe, Compass, ShieldCheck].map((Icon, idx) => (
                <div key={idx} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer border border-gray-100 shadow-sm">
                  <Icon size={18} />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-bold">© 2026 BOOKMYSTAY GLOBAL LTD.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Hotels;