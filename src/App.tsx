import React from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Grid from "./pages/grid";

function App() {
  return (
    <div className="h-full antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
      <Navbar />
      <Grid />
    </div>
  );
}

export default App;
