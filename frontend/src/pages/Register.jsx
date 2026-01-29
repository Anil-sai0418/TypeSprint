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
    <div className="w-full h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black flex justify-center items-center text-white">
      <Card className="w-full max-w-sm bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">Register your account</CardTitle>
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
                    className="text-sm text-blue-500 hover:text-blue-400"
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
              <Button type="submit" className="w-[70%] text-white" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
          <div className="flex justify-end mt-2 text-sm text-white">
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
