import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './Login'
import Heading from "./Heading"

function App() {
  const [count, setCount] = useState(0)

  return (
  <Router>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/lobby" element={<Heading />} />
    </Routes>
  </Router>
  )
}

export default App
