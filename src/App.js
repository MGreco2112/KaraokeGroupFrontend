import React from "react";
import { BrowserRouter } from "react-router-dom";
import {AuthProvider} from "./components/providers/AuthProvider";
import AppRouter from "./components/routes/AppRouter";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
