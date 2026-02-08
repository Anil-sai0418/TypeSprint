import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] flex justify-center items-center">
      {/* --- Premium Typing Background Element --- */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none select-none overflow-hidden font-mono text-[10px] leading-none text-blue-500/40">
        <div className="animate-pulse flex flex-wrap gap-2 p-4">
          {Array.from({ length: 1000 }).map((_, i) => (
            <span key={i} className="transition-opacity duration-1000">
              {["function", "const", "let", "=>", "{", "}", "import", "type", "true", "false", "return"][i % 11]}
            </span>
          ))}
        </div>
      </div>
      
      {/* Floating Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* --- Main Content --- */}
      <Card className="relative z-10 w-full max-w-sm rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Create account
          </CardTitle>

          <CardDescription className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Join <span className="font-medium text-blue-500">Monkey Type</span> and start improving
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  className="bg-gray-50/50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800 focus:ring-blue-500"
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
                  className="bg-gray-50/50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-gray-50/50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                type="submit"
                className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Register"}
              </Button>
            </div>
          </form>
          <div className="flex justify-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 ml-1 h-auto font-semibold text-blue-500 hover:text-blue-400"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}