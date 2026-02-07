import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { register } from "../services/api";


export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await register(formData.name, formData.email, formData.password);
      if (data.success) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert(`Registration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }
 
  return (
    <div className="w-full h-screen bg-gray-100 dark:bg-gray-950 flex justify-center items-center">
      <Card className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Create your account
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Enter your details to get started
          </CardDescription>
          <CardAction>
          
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your mail"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-center items-center">
              <Button type="submit" className="w-[70%]" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
          <div className="flex justify-end mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 ml-1 h-auto"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
