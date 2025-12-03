import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./routes/AppRoute";
import Navbar from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <Router>
        <Navbar />
        <AppRoute />
        <Footer />
    </Router>
  );
}

export default App;
