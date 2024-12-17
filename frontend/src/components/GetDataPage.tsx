import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import NavBar from "./NavBar";

const PARAMETER_OPTIONS = ["name", "app_id", "date"]; // Add more as required

const OPERATORS = {
  name: ["="],
  app_id: ["="],
  date: ["=", "<", ">"],
};

const GetDataPage = () => {
  const [parameter, setParameter] = useState<string>("");
  const [operator, setOperator] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!parameter || !operator || !value) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to access this page.");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/get_data/", {
        params: {
          parameter,
          operator,
          value,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.results.results);
      console.log("data", data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to truncate long text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Get Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="parameter">Parameter</Label>
              <Select onValueChange={(value) => setParameter(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a parameter" />
                </SelectTrigger>
                <SelectContent>
                  {PARAMETER_OPTIONS.map((param) => (
                    <SelectItem key={param} value={param}>
                      {param}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator">Operator</Label>
              <Select
                onValueChange={(value) => setOperator(value)}
                disabled={!parameter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an operator" />
                </SelectTrigger>
                <SelectContent>
                  {parameter &&
                    OPERATORS[parameter]?.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="text"
                placeholder="Enter a value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={fetchData} className="w-full" disabled={loading}>
            {loading ? "Fetching..." : "Get Data"}
          </Button>

          {data.length > 0 && (
            <div className="overflow-auto mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(data[0]).map((col) => (
                      <TableHead key={col} className="p-2 text-left">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx}>
                      {Object.entries(row).map(([key, value]) => (
                        <TableCell
                          key={key}
                          className={`p-2 ${
                            key === "about_the_game"
                              ? "max-w-[300px] whitespace-pre-wrap overflow-hidden text-ellipsis"
                              : ""
                          }`}
                        >
                          {key === "about_the_game"
                            ? truncateText(String(value), 100) // Truncate "about_the_game" text to 100 characters
                            : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GetDataPage;
