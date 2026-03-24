import { useState, useCallback, useEffect } from "react";
import { getFullUserProfile, updateProfileData, getUserStats } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export const useProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState({ phone: "", address: "", profileImage: "" });
  const [imagePreview, setImagePreview] = useState(null);

  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");

      if (!token || !email) {
        setError("Not logged in. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const profileRes = await getFullUserProfile(email, token);
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
      }

      const statsRes = await getUserStats(email, token);
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message || "Error loading profile.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const saveProfile = async (newEditData) => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");

      const res = await updateProfileData(email, newEditData, token);
      if (res.success) {
        setUserProfile((prev) => ({
          ...prev,
          profile: { ...prev.profile, ...res.profile }
        }));

        if (res.profile?.profileImage) {
          setImagePreview(res.profile.profileImage);
        }

        await fetchProfileData();
        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: {
              name: userProfile?.user?.name,
              email: userProfile?.user?.email,
              profileImage: res.profile?.profileImage
            }
          })
        );

        return { success: true };
      }
      return { success: false, message: "Unknown error" };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, message: error.message };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return {
    userProfile,
    stats,
    isLoading,
    error,
    editData,
    setEditData,
    imagePreview,
    setImagePreview,
    saveProfile,
    handleLogout,
    navigate
  };
};
