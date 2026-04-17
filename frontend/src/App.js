import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Hotels from "./pages/Hotels";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;