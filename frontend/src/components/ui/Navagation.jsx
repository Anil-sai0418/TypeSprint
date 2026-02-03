import { NavLink } from "react-router-dom";
import { UserCircle, Menu, X, LogOut, User, Palette, Plus } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BreadcrumbNav from "../BreadcrumbNav";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const token = localStorage.getItem("token");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';
        
        if (email && token) {
          setIsLoggedIn(true);
          const response = await fetch(`${API_BASE_URL}/profile/${email}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUserDetails({
                name: data.user.name,
                email: data.user.email,
                profileImage: data.profile?.profileImage
              });
            }
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUserDetails();

    // Listen for profile updates from Profile page
    const handleProfileUpdate = (event) => {
      const { name, email, profileImage } = event.detail;
      setUserDetails({
        name,
        email,
        profileImage
      });
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") setUserMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-green-500"
        : "text-muted-foreground hover:text-green-500"
    }`;

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-border/40 bg-transparent backdrop-blur-sm text-foreground">
        <div className="h-[70px] px-6 flex items-center justify-between">
        
        {/* Left: Logo + Links */}
    <div
  
      onClick={() => navigate("/")}
      className="flex items-center gap-2 cursor-pointer select-none"
    >
      <img
      
        src="/Type-logo.png"
        alt="TypeSprint logo"
        className="h-20 w-20 md:h-20 md:w-20  object-contain"
      />
      <span className="hidden md:inline text-lg md:text-xl mr-10 font-bold tracking-tight">
        <span className="text-blue-500">Type</span>
        <span className="text-green-500 ml-1">Sprint</span>
      </span>
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <NavLink to="/type" className={linkClass}>
          Type
        </NavLink>
        <NavLink to="/learning" className={linkClass}>
          Learning
        </NavLink>
      </div>
    </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/Login")}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                ref={buttonRef}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              >
                {userDetails?.profileImage ? (
                  <img
                    src={userDetails.profileImage}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-6 w-6 text-muted-foreground" />
                )}
              </button>

              {userMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-border bg-background shadow-xl overflow-hidden
        animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium">{userDetails?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {userDetails?.email || ""}
                    </p>
                  </div>

                  <div className="py-2 text-sm">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                    >
                      <User className="h-4 w-4" />
                      User Details
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/room");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Create Room
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/themes");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                    >
                      <Palette className="h-4 w-4" />
                      Themes
                    </button>
                  </div>

                  <div className="border-t border-border">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        localStorage.removeItem("token");
                        localStorage.removeItem("userEmail");
                        setIsLoggedIn(false);
                        setUserDetails(null);
                        navigate("/Login");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md hover:bg-muted transition"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 text-sm font-medium">
          <NavLink
            to="/home"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Type
          </NavLink>

          <NavLink
            to="/learning"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Learning
          </NavLink>
        </div>
      )}
      </nav>

      <BreadcrumbNav />
    </>
  );
}