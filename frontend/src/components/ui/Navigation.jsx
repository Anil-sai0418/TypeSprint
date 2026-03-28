import { NavLink } from "react-router-dom";
import { UserCircle, Menu, X, LogOut, User, Share2, Bell } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import BreadcrumbNav from "../BreadcrumbNav";
import Notification from "../notification/Notification";
import { AnimatePresence, motion } from "framer-motion";
import ShareModal from "../share/Share";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
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

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-border/40 bg-transparent backdrop-blur-sm text-foreground">
        <div className="h-16 px-3 sm:px-6 flex items-center justify-between">
          <div onClick={() => navigate("/")} className="flex items-center gap-1 sm:gap-2 cursor-pointer select-none shrink-0">
            <img src="/Type-logo.png" alt="TypeSprint logo" className="h-14 w-14 sm:h-16 sm:w-16 object-contain" />
            <span className="hidden sm:inline text-base sm:text-lg font-bold tracking-tight">
              <span className="text-blue-500">Type</span>
              <span className="text-green-500 ml-1">vex</span>
            </span>
           
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <ThemeToggle />
              <Notification />
            </div>

            {!loading && !isAuthenticated ? (
              <button onClick={() => navigate("/login")} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium transition-colors">Login</button>
            ) : loading ? (
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">Loading...</div>
            ) : (
              <div className="relative hidden sm:block">
                <button 
                  ref={buttonRef} 
                  aria-haspopup="menu" 
                  aria-expanded={userMenuOpen} 
                  onClick={() => setUserMenuOpen(!userMenuOpen)} 
                  className="p-1 rounded-xl transition-all duration-300 group
                             bg-gray-100 dark:bg-zinc-900/50 
                             hover:bg-gray-200 dark:hover:bg-zinc-800 
                             border border-gray-200 dark:border-zinc-700/50
                             focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <div className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center bg-muted/30">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <UserCircle 
                      className={`h-6 w-6 text-muted-foreground transition-transform group-active:scale-90 ${user?.profileImage ? 'hidden' : 'block'}`} 
                    />
                  </div>
                </button>
                {userMenuOpen && (
                  <div ref={menuRef} className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-border bg-background shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                      {user?.provider && <p className="text-xs text-green-500 mt-1">Connected via {user.provider}</p>}
                    </div>
                    <div className="py-2 text-sm">
                      <button onClick={() => { setUserMenuOpen(false); navigate("/profile"); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none transition-colors">
                        <User className="h-4 w-4" />
                        User Details
                      </button>
                      <button onClick={() => { setUserMenuOpen(false); setShareModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none transition-colors">
                        <Share2 className="h-4 w-4" />
                        Share this app
                      </button>
                    </div>
                    <div className="border-t border-border">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setOpen(!open)} className="sm:hidden p-2 rounded-md hover:bg-muted transition">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="sm:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg">
            <div className="px-4 py-3 space-y-3">
              

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>

              <div className="py-2 border-t border-b border-border">
                <NavLink to="/notifications" onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? "bg-green-500/20 text-green-500" : "text-muted-foreground hover:text-green-500"}`}>
                  <Bell className="h-4 w-4" />
                  Notifications
                </NavLink>
              </div>

              {isAuthenticated && user && (
                <div className="pt-2">
                  <div className="px-3 py-2 mb-2 border-b border-border">
                    <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email || ""}</p>
                    {user.provider && <p className="text-xs text-green-500 mt-1">Via {user.provider}</p>}
                  </div>
                  <button onClick={() => { setOpen(false); navigate("/profile"); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-lg transition">
                    <User className="h-4 w-4" />
                    User Details
                  </button>
                  <button onClick={() => { setOpen(false); setShareModalOpen(true); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-lg transition">
                    <Share2 className="h-4 w-4" />
                    Share this app
                  </button>
                  <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition mt-2 border-t border-border pt-2">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}

              {!loading && !isAuthenticated && (
                <button onClick={() => { setOpen(false); navigate("/login"); }} className="w-full px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors mt-2">Login</button>
              )}
            </div>
          </div>
        )}
      </nav>

      <BreadcrumbNav />
      <AnimatePresence>
        {shareModalOpen && (
          <ShareModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
