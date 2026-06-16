import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from "react-hot-toast";
import './App.css';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(16,185,129,0.2)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#f1f5f9" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" } },
        }}
      />
    </>
  );
}

export default App;
