import "./css/App.css"
import {Routes, Route} from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import LogIn from "./pages/login"

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Dashboard/>}></Route>
        <Route path="/login" element={<LogIn/>}></Route>
      </Routes>
    </main>
  )
}

export default App
