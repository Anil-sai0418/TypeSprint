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
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../services/api";


export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(formData.email, formData.password);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", formData.email);
        alert("Login successful!");
        navigate("/home");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = err.message.toLowerCase();
      if (errorMsg.includes("invalid email")) {
        alert("Invalid email address. Please try again.");
      } else if (errorMsg.includes("incorrect password")) {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Login failed: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black flex justify-center items-center">
      <Card className="w-full max-w-sm bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
         
          </CardDescription>
          <CardAction>
         
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your mail"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-4">
              <Button type="submit" className="w-[70%] mt-3 text-white" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
            <div className="flex justify-end mt-2 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 ml-1 h-auto"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
