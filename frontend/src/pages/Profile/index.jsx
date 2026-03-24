import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navigation from "../../components/ui/Navigation";
import Footer from "../Footer";
import { useTheme } from "../../context/useTheme";

import { useProfile } from "./hooks/useProfile";
import { useImageCrop } from "./hooks/useImageCrop";

import ProfileCard from "./components/ProfileCard";
import AchievementsCard from "./components/AchievementsCard";
import EditProfileForm from "./components/EditProfileForm";
import TypingStatsOverview from "./components/TypingStatsOverview";
import ActivityJourney from "./components/ActivityJourney";
import ImageCropperModal from "./components/ImageCropperModal";

function Profile() {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const {
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
  } = useProfile();

  const {
    imageToCrop,
    setImageToCrop,
    crop,
    setCrop,
    zoom,
    setZoom,
    isCropping,
    setIsCropping,
    onCropComplete,
    showCroppedImage,
    handleImageChange
  } = useImageCrop({ setImagePreview, setEditData });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4 font-medium">{error}</p>
          <button
            onClick={() => {
               localStorage.removeItem("token");
               localStorage.removeItem("userEmail");
               navigate("/login");
            }}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const { user, profile } = userProfile || {};

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 py-28 overflow-x-hidden">
      <Navigation />

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Left Column: Basic Info & Profile Card */}
          <div className="space-y-6">
            <ProfileCard
              user={user}
              profile={profile}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleLogout={handleLogout}
              handleImageChange={handleImageChange}
            />
            <AchievementsCard />
          </div>

          {/* Right Column: Stats, Edit Form, Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Conditional Rendering: Edit Form or Stats Summary */}
            <AnimatePresence mode="wait">
              {isEditing ? (
                <EditProfileForm
                  editData={editData}
                  setEditData={setEditData}
                  imagePreview={imagePreview}
                  handleImageChange={handleImageChange}
                  handleSaveProfile={saveProfile}
                  setIsEditing={setIsEditing}
                />
              ) : (
                <TypingStatsOverview stats={stats} />
              )}
            </AnimatePresence>

            {/* Activity Map Card */}
            <ActivityJourney email={user?.email} theme={theme} />
          </div>
        </div>
      </div>

      {/* Image Adjust Modal */}
      {isCropping && (
        <ImageCropperModal
          imageToCrop={imageToCrop}
          crop={crop}
          setCrop={setCrop}
          zoom={zoom}
          setZoom={setZoom}
          onCropComplete={onCropComplete}
          showCroppedImage={showCroppedImage}
          setIsCropping={setIsCropping}
          setImageToCrop={setImageToCrop}
        />
      )}

      <Footer isLoggedIn={true} />
    </div>
  );
}

export default Profile;
