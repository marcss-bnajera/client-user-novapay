import { useState } from 'react'
import { AppRoutes } from './routes/AppRoutes';
import { Toaster, toast } from "react-hot-toast"
import './App.css'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: "8px",
          },
        }}
      />

      {/* Ejemplo de Mensaje */}
      <button
        onClick={() => toast("Hola 👋")}
        style={{ margin: "20px" }}
      >
        Test Toast
      </button>

      <AppRoutes />
    </>
  );
}

export default App;
