import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Mail, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  CircleDot,
  Loader2 
} from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) return toast.error("Credentials required");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:2003/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      
      toast.success("Welcome to the Collection");
      setTimeout(() => navigate(res.data.role === "admin" ? "/admin" : "/hotels"), 1200);
    } catch (err) {
      toast.error("Access Denied: Invalid Credentials");
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
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2000')] bg-cover bg-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>

      {/* FLOATING DECORATIVE ELEMENTS */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-96 h-96 bg-amber-900/20 rounded-full blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* BRAND LOGO SECTION */}
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 border-2 border-amber-500 rounded-full flex items-center justify-center mb-4"
            >
              <CircleDot className="text-amber-500 w-8 h-8" />
            </motion.div>
            <h1 className="text-4xl font-light tracking-[0.2em] text-yellow-400  italic">
              BookMyStay
            </h1>
            <div className="h-[1px] w-12 bg-amber-500/50 mt-2" />
          </div>

          <div className="space-y-6">
            {/* EMAIL FIELD */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-amber-500/50 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="PROMENADE EMAIL"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-0 pr-2 text-white placeholder:text-gray-600 placeholder:tracking-widest text-sm focus:bg-white/[0.07] focus:border-amber-500/50 outline-none transition-all"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-amber-500/50 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="SECRET KEY"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-2 pr-0 text-white placeholder:text-gray-600 placeholder:tracking-widest text-sm focus:bg-white/[0.07] focus:border-amber-500/50 outline-none transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-between items-center px-1">
               <label className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-tighter cursor-pointer">
                  <input type="checkbox" className="accent-amber-500" /> Remember Session
               </label>
               <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest hover:text-amber-400 cursor-pointer transition-colors">
                 Forget Password?
               </span>
            </div>

            {/* LUXURY BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="relative w-full overflow-hidden group rounded-2xl py-4 bg-amber-500 font-bold uppercase tracking-[0.3em] text-black shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-50"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Enter Lounge <ChevronRight size={18} /></>
                )}
              </span>
            </motion.button>
          </div>

          {/* FOOTER */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-xs tracking-widest uppercase">
              New to BookMyStay?{" "}
              <span 
                onClick={() => navigate("/register")}
                className="text-white hover:text-amber-500 cursor-pointer font-bold transition-colors underline underline-offset-8 decoration-amber-500/30"
              >
                Create an Account
              </span>
            </p>
          </div>
        </div>

        {/* BOTTOM BRAND TAG */}
        <p className="text-center mt-8 text-white/20 text-[10px] uppercase tracking-[0.5em]">
          © 2026 BookMyStay • Privacy Secured
        </p>
      </motion.div>
    </div>
  );
};

export default Login;