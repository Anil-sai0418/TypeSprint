import { Button } from "../components/ui/button"
import { useNavigate, Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useState } from "react"
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
        navigate("/home");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = err.message ? err.message.toLowerCase() : "unknown error";
      if (errorMsg.includes("invalid email")) {
        alert("Invalid email address. Please try again.");
      } else if (errorMsg.includes("incorrect password")) {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Login failed: " + (err.message || "Unknown error"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-50 dark:bg-black selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 flex items-center justify-center p-4">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden flex items-center justify-center">
         <span className="text-[20vw] font-black text-zinc-200/50 dark:text-zinc-900/50 leading-none tracking-tighter opacity-50 blur-sm">
            LOGIN
         </span>
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-900 dark:via-zinc-100 to-transparent opacity-20" />
          
          <CardHeader className="space-y-1 text-center pb-8 pt-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-12 h-12 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg rotate-3"
            >
              <span className="text-2xl">⌨️</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
              Enter your credentials to continue your journey
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded-xl transition-all"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded-xl pr-10 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl font-medium transition-all shadow-lg shadow-zinc-900/10 dark:shadow-zinc-100/10 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                Don't have an account?{' '}
              </span>
              <Link 
                to="/register" 
                className="font-semibold text-zinc-900 dark:text-white hover:underline decoration-2 underline-offset-4"
              >
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
