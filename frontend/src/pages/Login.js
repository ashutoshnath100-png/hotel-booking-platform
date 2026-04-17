import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:2003/api/auth/login",
        form
      );

      // localStorage.setItem("token", res.data.token);
      // toast.success("Login successful 🎉");

      // setTimeout(() => navigate("/hotels"), 1000);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // 🔥 Role based redirect
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/hotels");
      }

    } catch (err) {
      toast.error("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Toaster position="top-right" />

      {/* DARK + WARM OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/30"></div>

      {/* GLOW CARD */}
      <div className="
        relative z-10
        w-[90%] max-w-md
        p-8
        rounded-3xl
        bg-white/10 backdrop-blur-xl
        border border-white/30
        shadow-[0_0_40px_rgba(255,200,100,0.25)]
      ">

        {/* HEADER */}
        <h1 className="text-white text-2xl font-semibold flex items-center gap-2 mb-3">
          📍 Hotel Booking App
        </h1>

        <h2 className="text-white text-xl font-medium">
          Welcome Back
        </h2>

        <p className="text-gray-300 text-sm mb-6">
          Login to your account
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="
              w-full p-3 rounded-xl
              bg-white/90 text-black
              placeholder-gray-600
              outline-none border border-white/30
              focus:ring-2 focus:ring-blue-500
            "
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            className="
              w-full p-3 rounded-xl
              bg-white/90 text-black
              placeholder-gray-600
              outline-none border border-white/30
              focus:ring-2 focus:ring-blue-500
            "
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* FORGOT */}
        <p className="text-right text-blue-500 font-semibold text-sm mb-4 cursor-pointer">
          Forgot password?
        </p>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full py-3 rounded-xl text-blue-500 font-semibold
            bg-gradient-to-r from-blue-500 to-blue-700
            hover:scale-105 transition duration-300
            shadow-lg flex justify-center items-center
          "
        >
          {loading ? (
            <div className="w-5 h-5 text-blue border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>

        {/* FOOTER */}
        <p className="text-black text-center mt-2.5 text-medium font-bold">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")} className="text-blue-300 font-bold cursor-pointer">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;