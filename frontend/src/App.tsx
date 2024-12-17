import { useEffect, useState } from "react";
import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import UploadPage from "./components/UploadPage";
import GetDataPage from "./components/GetDataPage";

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
            path="/"
            element={isUserLoggedIn ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/register/"
            element={isUserLoggedIn ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/upload/"
            element={isUserLoggedIn ? <UploadPage /> : <Navigate to="/" />}
          />
          <Route
            path="/get_data/"
            element={isUserLoggedIn ? <GetDataPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login/"
            element={
              isUserLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <LoginPage setIsUserLoggedIn={setIsUserLoggedIn} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
