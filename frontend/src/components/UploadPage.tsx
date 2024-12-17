import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import NavBar from "./NavBar";

const UploadPage = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (link.trim() === "") {
      alert("Please enter a valid link.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("User not authenticated. Please log in first.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/upload_csv/?file_url=${encodeURIComponent(
          link
        )}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("File uploaded successfully!");
        setLink("");
      } else {
        alert(response.data.detail || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Upload Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="url"
              placeholder="Enter a link to upload"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full"
            />
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default UploadPage;
