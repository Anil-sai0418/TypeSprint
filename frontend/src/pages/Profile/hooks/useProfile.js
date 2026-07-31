import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfileQuery, useUserStatsQuery, useUpdateProfileMutation } from "../../../hooks/useQueries";

export const useProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail");

  const [editData, setEditData] = useState({ phone: "", address: "", profileImage: "" });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch profile via TanStack Query (uses 10 min cache)
  const {
    data: profileRes,
    isLoading: isProfileLoading,
    error: profileError
  } = useUserProfileQuery(email, token);

  // Fetch stats via TanStack Query (uses 5 min cache)
  const {
    data: statsRes,
    isLoading: isStatsLoading,
    error: statsError
  } = useUserStatsQuery(email, token);

  const updateProfileMutation = useUpdateProfileMutation();

  // Sync form inputs when profile data is fetched or updated in cache
  useEffect(() => {
    if (profileRes?.success && profileRes?.profile) {
      setEditData({
        phone: profileRes.profile.phone || "",
        address: profileRes.profile.address || "",
        profileImage: profileRes.profile.profileImage || ""
      });
      if (profileRes.profile.profileImage) {
        setImagePreview(profileRes.profile.profileImage);
      }
    }
  }, [profileRes]);

  // Handle redirect if missing token/email
  useEffect(() => {
    if (!token || !email) {
      const timer = setTimeout(() => navigate("/login"), 1500);
      return () => clearTimeout(timer);
    }
  }, [token, email, navigate]);

  const userProfile = profileRes?.success ? profileRes : null;
  const stats = statsRes?.success ? statsRes.stats : null;
  const isLoading = isProfileLoading || isStatsLoading;
  const error = (!token || !email) 
    ? "Not logged in. Redirecting to login..." 
    : (profileError?.message || statsError?.message || null);

  const saveProfile = async (newEditData) => {
    try {
      const res = await updateProfileMutation.mutateAsync({ email, data: newEditData, token });
      if (res.success) {
        if (res.profile?.profileImage) {
          setImagePreview(res.profile.profileImage);
        }

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
      return { success: false, message: res.message || "Unknown error" };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, message: err.message };
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
