import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ username: string; password: string }>();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login/");
  };

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", {
        username: data.username,
        password: data.password,
      });
      if (response.status === 200) {
        navigate("/login/");
      } else {
        const message = response.data.message || "Something went wrong!";
        alert(message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>
            Create a new account to get started.
          </CardDescription>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 p-0 pt-10">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username", {
                    required: true,
                  })}
                />
                {errors.username && (
                  <span className="text-red-600">username is required</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: true,
                  })}
                />
                {errors.password && (
                  <span className="text-red-600">password is required</span>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 p-0 pt-12">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
              <div className="flex items-center justify-center w-full">
                <span className="text-sm text-gray-500">
                  Already have an account.
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm"
                  onClick={handleLoginClick}
                >
                  Log In
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardHeader>
      </Card>
    </div>
  );
};

export default RegisterPage;
