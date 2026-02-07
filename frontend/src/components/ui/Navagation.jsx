import { NavLink } from "react-router-dom";
import { UserCircle, Menu, X, LogOut, User, Palette, Plus, Share2, Bell } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BreadcrumbNav from "../BreadcrumbNav";
import Notification from "../notification/notification";
import ShareModal from "../share/Share";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
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
        <div className="h-16 px-3 sm:px-6 flex items-center justify-between">
        
          {/* Left: Logo + Links */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-1 sm:gap-2 cursor-pointer select-none shrink-0"
          >
            <img
              src="/Type-logo.png"
              alt="TypeSprint logo"
              className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
            />
            <span className="hidden sm:inline text-base sm:text-lg font-bold tracking-tight">
              <span className="text-blue-500">Type</span>
              {/* <span className="text-green-500 ml-1">Sprint</span> */}
            </span>
            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium ml-4 sm:ml-10">
              <NavLink to="/type" className={linkClass}>
                Type
              </NavLink>
              <NavLink to="/learning" className={linkClass}>
                Learning
              </NavLink>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <ThemeToggle />
              <Notification />
            </div>

            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/Login")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium transition-colors"
              >
                Login
              </button>
            ) : (
              <div className="relative hidden sm:block">
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
                          setShareModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        Share this app
                      </button>

                      {/* <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate("/themes");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                      >
                        <Palette className="h-4 w-4" />
                        Themes
                      </button> */}
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
              className="sm:hidden p-2 rounded-md hover:bg-muted transition"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2 pb-3 border-b border-border">
              <NavLink
                to="/type"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-green-500/20 text-green-500"
                    : "text-muted-foreground hover:text-green-500"
                }`}
              >
                Type
              </NavLink>

              <NavLink
                to="/learning"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-green-500/20 text-green-500"
                    : "text-muted-foreground hover:text-green-500"
                }`}
              >
                Learning
              </NavLink>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

            {/* Mobile Notifications */}
            <div className="py-2 border-t border-b border-border">
              <NavLink
                to="/notifications"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-green-500/20 text-green-500"
                    : "text-muted-foreground hover:text-green-500"
                }`}
              >
                <Bell className="h-4 w-4" />
                Notifications
              </NavLink>
            </div>

            {/* Mobile User Menu */}
            {isLoggedIn && (
              <div className="pt-2">
                <div className="px-3 py-2 mb-2 border-b border-border">
                  <p className="text-sm font-medium truncate">{userDetails?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userDetails?.email || ""}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-lg transition"
                >
                  <User className="h-4 w-4" />
                  User Details
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    setShareModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-lg transition"
                >
                  <Share2 className="h-4 w-4" />
                  Share this app
                </button>

                {/* <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/themes");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-lg transition"
                >
                  <Palette className="h-4 w-4" />
                  Themes
                </button> */}

                <button
                  onClick={() => {
                    setOpen(false);
                    localStorage.removeItem("token");
                    localStorage.removeItem("userEmail");
                    setIsLoggedIn(false);
                    setUserDetails(null);
                    navigate("/Login");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition mt-2 border-t border-border pt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}

            {!isLoggedIn && (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/Login");
                }}
                className="w-full px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors mt-2"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
      </nav>

      <BreadcrumbNav />

      {/* Share Modal */}
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </>
  );
}