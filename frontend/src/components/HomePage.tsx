import { Card, CardContent } from "./ui/card";
import NavBar from "./NavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Card className="w-full max-w-lg p-6 text-center shadow-lg">
          <CardContent>
            <h2 className="text-3xl font-bold mb-4">Welcome to Home Page</h2>
            <p className="text-gray-600">
              Explore the available endpoints using the navigation bar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
