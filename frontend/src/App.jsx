import "./css/App.css";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <div className="app-content">
      <HeroSection />
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default App;
