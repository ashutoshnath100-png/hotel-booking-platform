import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  CircleDot,
  Loader2 
} from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      return toast.error("All credentials required");
    }
    if (form.password.length < 6) {
      return toast.error("Security key must be 6+ characters");
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:2003/api/auth/register", form);
      
      toast.success("Membership Confirmed 🎉");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden font-serif">
      <Toaster position="top-center" reverseOrder={false} />

      {/* DYNAMIC BACKGROUND ENGINE */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.25 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000')] bg-cover bg-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black" />
        <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-black" />
      </div>

      {/* FLOATING DECORATIVE ORBS */}
      <motion.div 
        animate={{ x: [0, 30, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-80 h-80 bg-blue-900/10 rounded-full blur-[100px]"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          
          {/* BRAND LOGO SECTION */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="w-14 h-14 border border-amber-500/50 rounded-full flex items-center justify-center mb-4"
            >
              <CircleDot className="text-amber-500 w-6 h-6" />
            </motion.div>
            <h1 className="text-3xl font-light tracking-[0.2em] text-white uppercase italic">
              BookMy<span className="font-bold text-amber-500 not-italic">Stay</span>
            </h1>
            <p className="text-amber-500/60 text-[10px] tracking-[0.4em] uppercase mt-2 font-sans">Apply for Membership</p>
          </div>

          <div className="space-y-5">
            {/* NAME FIELD */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-amber-500/40 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="FULL NAME"
                className="w-full bg-white/[0.06] border border-white/10 rounded-2xl py-4 pl-2 pr-4 text-white placeholder:text-gray-600 placeholder:tracking-[0.2em] text-[11px] focus:bg-white/[0.07] focus:border-amber-500/50 outline-none transition-all"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* EMAIL FIELD */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-amber-500/40 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-2 pr-4 text-white placeholder:text-gray-600 placeholder:tracking-[0.2em] text-[11px] focus:bg-white/[0.07] focus:border-amber-500/50 outline-none transition-all"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-amber-500/40 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="SECURITY KEY"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-0 pr-6 text-white placeholder:text-gray-600 placeholder:tracking-[0.2em] text-[11px] focus:bg-white/[0.07] focus:border-amber-500/50 outline-none transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* ACTION BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f59e0b" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={loading}
              className="relative w-full overflow-hidden group rounded-2xl py-4 bg-amber-600 font-bold uppercase tracking-[0.3em] text-black shadow-[0_10px_30px_rgba(245,158,11,0.2)] disabled:opacity-50 transition-all mt-4"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative flex items-center justify-center gap-2 text-xs">
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>Confirm Registration <ChevronRight size={16} /></>
                )}
              </span>
            </motion.button>
          </div>

          {/* FOOTER */}
          <div className="mt-10 text-center border-t border-white/5 pt-6">
            <p className="text-gray-500 text-[10px] tracking-widest uppercase">
              Existing Member?{" "}
              <span 
                onClick={() => navigate("/")}
                className="text-white hover:text-amber-500 cursor-pointer font-bold transition-colors underline underline-offset-8 decoration-amber-500/30 ml-2"
              >
                Access Portal
              </span>
            </p>
          </div>
        </div>

        {/* BOTTOM BRAND TAG */}
        <p className="text-center mt-8 text-white/20 text-[9px] uppercase tracking-[0.6em]">
          Encrypted Registration • BookMyStay Global
        </p>
      </motion.div>
    </div>
  );
};

export default Register;