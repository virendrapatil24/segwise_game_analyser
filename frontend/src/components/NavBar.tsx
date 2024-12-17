import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const NavBar = () => {
  return (
    <div>
      <nav className="w-full bg-white shadow-md p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1>
            <Button variant="link" className="text-xl font-bold">
              <Link to="/">Game Analyser</Link>
            </Button>
          </h1>
          <div className="flex space-x-4">
            <Button variant="link">
              <Link to="/upload">Upload</Link>
            </Button>
            <Button variant="link">
              <Link to="/get_data">Get Data</Link>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
