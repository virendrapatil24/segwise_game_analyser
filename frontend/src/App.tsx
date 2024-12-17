import { useEffect, useState } from "react";
import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import RegisterPage from "./components/RegisterPage";

const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    setIsUserLoggedIn(isAuthenticated);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/register/"
            element={isUserLoggedIn ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
