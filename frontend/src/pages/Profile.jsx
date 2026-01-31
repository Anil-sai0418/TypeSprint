import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  LogOut,
  Zap,
  Trophy,
  Clock,
  Activity,
  X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import Navigation from "../components/ui/Navagation";
import Footer from "./Footer";
import { getFullUserProfile, updateProfileData, getUserStats, getUserActivity } from "../services/api";
import { compressImage } from "../utils/imageCompression";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [activityMap, setActivityMap] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState({ phone: "", address: "", profileImage: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");

      console.log("Token:", token ? "exists" : "missing");
      console.log("Email:", email);

      if (!token || !email) {
        setError("Not logged in. Redirecting to login...");
        setTimeout(() => navigate("/Login"), 1500);
        return;
      }

      // Fetch full profile
      console.log("Fetching profile for:", email);
      const profileRes = await getFullUserProfile(email, token);
      console.log("Profile response:", profileRes);
      
      if (profileRes.success) {
        setUserProfile(profileRes);
        setEditData({
          phone: profileRes.profile.phone || "",
          address: profileRes.profile.address || "",
          profileImage: profileRes.profile.profileImage || ""
        });
        if (profileRes.profile.profileImage) {
          setImagePreview(profileRes.profile.profileImage);
        }
      } else {
        setError(profileRes.message || "Failed to load profile");
      }

      // Fetch stats
      const statsRes = await getUserStats(email, token);
      console.log("Stats response:", statsRes);
      
      if (statsRes.success) {
        setStats(statsRes.stats);
      } else {
        setError(statsRes.message || "Failed to load stats");
      }

      // Fetch activity map
      const activityRes = await getUserActivity(email, token);
      console.log("Activity response:", activityRes);
      
      if (activityRes.success) {
        setActivityMap(activityRes.activityMap);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message || "Error loading profile. Make sure backend is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");

      console.log("Saving profile with data:", editData);
      const res = await updateProfileData(email, editData, token);
      console.log("Update response:", res);
      
      if (res.success) {
        // Update local state with new profile data
        setUserProfile(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            ...res.profile
          }
        }));
        
        // Update image preview to show the saved image
        if (res.profile?.profileImage) {
          setImagePreview(res.profile.profileImage);
        }
        
        // Refresh the data from server to ensure everything is synced
        await fetchProfileData();
        
        // Dispatch event to notify Navigation component of update
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: {
            name: userProfile?.user?.name,
            email: userProfile?.user?.email,
            profileImage: res.profile?.profileImage
          }
        }));
        
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/Login");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB for original)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert("Only JPG, PNG, or WebP images are supported");
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // Compress image before setting
          const compressedBase64 = await compressImage(reader.result, 0.7, 400, 400);
          setImagePreview(compressedBase64);
          setEditData({ ...editData, profileImage: compressedBase64 });
        } catch (error) {
          console.error("Error compressing image:", error);
          alert("Error processing image. Please try another.");
        }
      };
      reader.onerror = () => {
        alert("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userEmail");
              navigate("/Login");
            }}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile || !stats) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load profile. Please try again.</p>
          <button 
            onClick={() => fetchProfileData()}
            className="mt-4 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { user, profile } = userProfile;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 px-4 sm:px-6 pt-28">
      <Navigation />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Left: Profile Card */}
        <div className="lg:col-span-1 rounded-xl border border-border dark:border-gray-700 bg-card dark:bg-gray-800 p-6 space-y-6 h-fit text-center lg:text-left">
      <div className="flex flex-col items-center text-center gap-3">
            <div className="h-20 w-20 rounded-full bg-muted dark:bg-gray-700 flex items-center justify-center">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-muted-foreground dark:text-gray-400" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {user.email}
              </p>
            </div>

                <div className="pt-5 border-t border-border dark:border-gray-700 flex items-center justify-between gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-md border border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-700 transition"
            >
              <Edit size={16} />
              {isEditing ? "Cancel Edit" : "Edit "}
            </button>

            <button 
              onClick={handleLogout}
              className="flex-1 inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-md border border-border dark:border-gray-700 text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          </div>

          <div className="pt-4 border-t border-border dark:border-gray-700 space-y-3 text-sm">
            <InfoLine icon={<Mail />} text={user.email} />
            <InfoLine icon={<Phone />} text={profile?.phone || "Not added"} />
            <InfoLine icon={<MapPin />} text={profile?.address || "Not added"} />
            <InfoLine icon={<Calendar />} text={`Joined on ${new Date(user.createdAt).toLocaleDateString()}`} />
          </div>

          {/* Achievements */}
          <div className="pt-5 border-t border-border dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground dark:text-gray-400">
              Achievements
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <AchievementItem title="100 WPM Club" subtitle="Peak speed reached" />
              <AchievementItem title="7-Day Streak" subtitle="Typed daily for a week" />
              <AchievementItem title="First Test" subtitle="Completed first test" />
              <AchievementItem title="Speed Improver" subtitle="Improved average speed" />
            </div>
          </div>


      
        </div>

        {/* Right: Stats & Details */}
        <div className="lg:col-span-2 space-y-8">

          {/* Typing Overview */}
          <div className="rounded-xl border border-border dark:border-gray-700 bg-card dark:bg-gray-800 p-6 space-y-6">
            <h2 className="text-lg font-semibold">Typing Overview</h2>

            {stats && Object.keys(stats).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatBox
                  icon={<Zap />}
                  label="Highest Speed"
                  value={`${stats.highestSpeed || 0} WPM`}
                  accent
                />
                <StatBox
                  icon={<Trophy />}
                  label="Fastest Completion"
                  value={`${stats.bestTest || 0}s`}
                />
                <StatBox
                  icon={<Clock />}
                  label="Total Tests"
                  value={stats.totalTests || 0}
                />
              </div>
            ) : (
              <div className="p-8 text-center rounded-lg bg-muted/40 dark:bg-gray-700/40 border border-border dark:border-gray-700">
                <p className="text-muted-foreground dark:text-gray-400">No typing tests yet. Start practicing to see stats!</p>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <div className="rounded-xl border border-border dark:border-gray-700 bg-card dark:bg-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Activity Summary</h2>

            {stats ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <SummaryCard title="Daily Streak" value={`${stats.dailyStreak || 0} days`} />
                <SummaryCard title="Average Speed" value={`${stats.averageSpeed || 0} WPM`} />
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg bg-muted/40 dark:bg-gray-700/40 border border-border dark:border-gray-700">
                <p className="text-sm text-muted-foreground dark:text-gray-400">Loading stats...</p>
              </div>
            )}
          </div>

          {/* Edit Profile Card - Using Shadcn Card */}
          {isEditing && (
            <Card className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 shadow-lg animate-in fade-in slide-in-from-bottom-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border dark:border-gray-700">
                <div>
                  <CardTitle className="text-xl font-semibold">Edit Profile</CardTitle>
                  <CardDescription>Update your profile information and picture</CardDescription>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-muted-foreground hover:text-foreground transition p-1 rounded-md hover:bg-muted dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-6">
                {/* Profile Image Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold">Profile Picture</label>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 dark:bg-gray-700/30 border border-border dark:border-gray-700">
                    <div className="h-24 w-24 rounded-full bg-muted dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0 border-2 border-border dark:border-gray-600">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-12 w-12 text-muted-foreground dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Choose Image</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 rounded-md border border-border dark:border-gray-700 bg-background dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm cursor-pointer hover:border-blue-500/50 transition"
                      />
                      <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2 flex items-center gap-1">
                        <span>✓</span> JPG, PNG supported (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t border-border dark:border-gray-700">
                  <label className="block text-sm font-semibold">Contact Information</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Phone Number</label>
                      <input 
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-border dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm placeholder:text-muted-foreground/60 transition hover:border-blue-500/50"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Address</label>
                      <input 
                        type="text"
                        value={editData.address}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-border dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm placeholder:text-muted-foreground/60 transition hover:border-blue-500/50"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 border-t border-border dark:border-gray-700 pt-6">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setImagePreview(null);
                      setEditData({ phone: "", address: "", profileImage: "" });
                    }}
                    className="flex-1 px-4 py-2.5 rounded-md border-2 border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-700/50 text-foreground dark:text-gray-100 font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Heatmap */}
          <div className="rounded-xl border border-border dark:border-gray-700 bg-card dark:bg-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Activity className="text-muted-foreground dark:text-gray-400" size={18} />
                <h2 className="text-lg font-semibold">Typing Activity</h2>
              </div>

              <select
                className="text-sm px-3 py-1.5 rounded-md border border-border dark:border-gray-700 bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                defaultValue="2026"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Active typing days in the last year
            </p>

            {Object.keys(activityMap).length > 0 ? (
              <ActivityHeatmap activityMap={activityMap} />
            ) : (
              <div className="p-12 text-center rounded-lg bg-muted/40 dark:bg-gray-700/40 border border-border dark:border-gray-700">
                <Activity className="mx-auto mb-4 text-muted-foreground dark:text-gray-400" size={32} />
                <p className="text-muted-foreground dark:text-gray-400">No activity yet. Complete typing tests to see your heatmap!</p>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer isLoggedIn={true} />
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

function InfoLine({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground dark:text-gray-400">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatBox({ icon, label, value, accent }) {
  return (
    <div
      className={`p-5 rounded-xl flex items-center gap-4 ${
        accent
          ? "bg-green-500/10 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/30"
          : "bg-muted/40 dark:bg-gray-700/40 border border-border dark:border-gray-700"
      }`}
    >
      <div className={`${accent ? "text-green-500 dark:text-green-400" : "text-muted-foreground dark:text-gray-400"}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground dark:text-gray-400">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="p-4 rounded-lg bg-muted/40 dark:bg-gray-700/40 border border-border dark:border-gray-700">
      <p className="text-xs text-muted-foreground dark:text-gray-400">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function ActivityHeatmap({ activityMap }) {
  // Generate 52 weeks of data (looking back from today)
  const today = new Date();
  const weeksData = [];
  
  // Go back 52 weeks and generate weeks starting from Monday
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)); // Start from Monday of current week
  startDate.setDate(startDate.getDate() - (52 * 7)); // Go back 52 weeks
  
  for (let week = 0; week < 52; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + week * 7 + day);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const count = activityMap[dateKey] || 0;
      
      weekDays.push({
        date: dateKey,
        count,
        display: date
      });
    }
    weeksData.push(weekDays);
  }

  // Function to get color based on activity count
  const getActivityColor = (count) => {
    if (count === 0) return "bg-muted/40 dark:bg-gray-700/40";
    if (count === 1) return "bg-green-200 dark:bg-green-900/40";
    if (count <= 3) return "bg-green-400 dark:bg-green-700/60";
    if (count <= 5) return "bg-green-500 dark:bg-green-600";
    return "bg-green-600 dark:bg-green-500";
  };

  // Calculate stats
  const totalTests = Object.values(activityMap).reduce((sum, count) => sum + count, 0);
  const activeDay = Object.keys(activityMap).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground dark:text-gray-400 mb-4">
        <div>Total: <span className="font-semibold text-foreground dark:text-gray-100">{totalTests} tests</span></div>
        <div>Active Days: <span className="font-semibold text-foreground dark:text-gray-100">{activeDay}</span></div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-2">
          {weeksData.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-2">
              {week.map((dayData, dayIdx) => {
                const isToday = dayData.date === today.toISOString().split('T')[0];
                const isFuture = dayData.display > today;
                
                return (
                  <div
                    key={dayIdx}
                    className={`h-5 w-5 rounded-md ${getActivityColor(dayData.count)} ${
                      isToday ? "ring-2 ring-blue-500/80" : ""
                    } ${
                      isFuture ? "opacity-50 cursor-not-allowed" : "hover:ring-2 hover:ring-green-400/40 cursor-pointer transition"
                    }`}
                    title={`${dayData.date}: ${dayData.count} ${dayData.count === 1 ? "test" : "tests"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground dark:text-gray-400 mt-6 pt-4 border-t border-border dark:border-gray-700">
        <span>Less</span>
        <div className="h-5 w-5 rounded-md bg-muted/40 dark:bg-gray-700/40" title="0 tests" />
        <div className="h-5 w-5 rounded-md bg-green-200 dark:bg-green-900/40" title="1 test" />
        <div className="h-5 w-5 rounded-md bg-green-400 dark:bg-green-700/60" title="2-3 tests" />
        <div className="h-5 w-5 rounded-md bg-green-500 dark:bg-green-600" title="4-5 tests" />
        <div className="h-5 w-5 rounded-md bg-green-600 dark:bg-green-500" title="6+ tests" />
        <span>More</span>
      </div>
    </div>
  );
}

function AchievementItem({ title, subtitle }) {
  return (
    <div className="p-3 rounded-lg bg-muted/40 dark:bg-gray-700/40 hover:bg-muted dark:hover:bg-gray-700/60 transition">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground dark:text-gray-400">{subtitle}</p>
    </div>
  );
}

export default Profile;
