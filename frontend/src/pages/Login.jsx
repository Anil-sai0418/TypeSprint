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
import { FaGoogle, FaGithub } from "react-icons/fa";
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
    <div className="w-full h-screen bg-gray-100 dark:bg-gray-950 flex justify-center items-center">
      <Card className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Login to your account</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Enter your credentials to continue
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
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
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
              <Button type="submit" className="w-[70%] mt-3" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => alert('Google login coming soon')}
              >
                <FaGoogle className="text-red-500" />
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => alert('GitHub login coming soon')}
              >
                <FaGithub />
                Continue with GitHub
              </Button>
            </div>
            <div className="flex justify-end mt-2 text-sm text-gray-600 dark:text-gray-400">
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
