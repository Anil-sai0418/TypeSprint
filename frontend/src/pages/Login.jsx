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
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex justify-center items-center">
      <Card className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Welcome back
          </CardTitle>

          <CardDescription className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Sign in to continue to <span className="font-medium text-gray-900 dark:text-gray-200">Monkey Type</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-4">
              <Button
                type="submit"
                className="w-full mt-4 rounded-xl 
                bg-blue-600 text-white 
                hover:bg-blue-500 
                dark:bg-blue-500 dark:hover:bg-blue-400 
                shadow-md dark:shadow-blue-500/30 
                transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                or
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => alert('Google login coming soon')}
              >
                <FaGoogle />
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => alert('GitHub login coming soon')}
              >
                <FaGithub />
                Continue with GitHub
              </Button>
            </div>
            <div className="flex justify-center mt-6 text-sm text-gray-600 dark:text-gray-400">
              New here?
              <Button
                variant="link"
                className="p-0 ml-1 h-auto font-semibold text-primary hover:underline underline-offset-4 transition"
                onClick={() => navigate("/register")}
              >
                Create an account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
