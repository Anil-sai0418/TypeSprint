import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navigation from "../../components/ui/Navigation";
import Footer from "../Footer";
import { useTheme } from "../../context/useTheme";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 py-28 overflow-x-hidden">
        <Navigation />

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <div className="space-y-6">
              <Card className="border-border shadow-sm overflow-hidden">
                <Skeleton className="h-24 w-full rounded-none" />
                <CardContent className="px-6 pb-6 -mt-12">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40 mx-auto" />
                      <Skeleton className="h-4 w-52 mx-auto" />
                    </div>
                    <div className="w-full pt-4 border-t border-border flex items-center gap-3">
                      <Skeleton className="h-10 flex-1 rounded-lg" />
                      <Skeleton className="h-10 w-10 rounded-lg" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm h-full flex flex-col w-full">
                <CardHeader className="pb-3 pt-4 px-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-2 pt-0 px-4 pb-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="p-3 rounded-lg border border-border/40">
                      <div className="flex items-start justify-between mb-3">
                        <Skeleton className="h-6 w-6 rounded-md" />
                        <Skeleton className="h-3 w-10 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="col-span-full grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="p-4 rounded-xl border border-border">
                          <Skeleton className="h-3 w-24 mx-auto mb-2" />
                          <Skeleton className="h-5 w-16 mx-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-48" />
                    <div className="grid grid-cols-4 gap-3 p-4 rounded-lg border border-border">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="p-3 rounded-md border border-border">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-6 w-16 mt-2" />
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-lg border border-border overflow-x-auto">
                      <div className="grid grid-rows-7 grid-flow-col gap-1 min-w-130">
                        {Array.from({ length: 28 }).map((_, index) => (
                          <Skeleton key={index} className="h-3 w-3 rounded-[2px]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-10" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Skeleton key={index} className="h-3 w-3 rounded-[2px]" />
                        ))}
                      </div>
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
            <AchievementsCard achievements={profile?.achievements || []} />
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
