import React from "react"
import Header from "./components/Header"
import MainContent from "./components/MainContent"
import Footer from "./components/Footer"

import './App.css'

function App() {
  return (
    <div className="grid-container">
      <Header />
      <MainContent />
      <Footer />
    </div>
  )
}

export default App;
