import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // ✅ Validation
    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields are required");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:2003/api/auth/register",
        form
      );

      toast.success("Account created successfully 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      toast.error("Registration failed ❌");
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

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/30"></div>

      {/* CARD */}
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
        <h1 className="text-white text-2xl font-semibold mb-3">
          📍 Hotel Booking App
        </h1>

        <h2 className="text-white text-xl font-medium">
          Create Account
        </h2>

        <p className="text-gray-300 text-sm mb-6">
          Sign up to get started
        </p>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 rounded-xl bg-white/90 text-black outline-none"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl bg-white/90 text-black outline-none"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-xl bg-white/90 text-black outline-none"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="
            w-full py-3 rounded-xl text-blue-500 font-semibold
            bg-gradient-to-r from-green-500 to-emerald-600
            hover:scale-105 transition duration-300
            shadow-lg flex justify-center items-center
          "
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Register"
          )}
        </button>

        {/* FOOTER */}
        <p className="text-black text-center mt-8 text-medium font-bold">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 font-bold cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;