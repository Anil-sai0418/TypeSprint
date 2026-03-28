import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, LogOut, Upload, X } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProfileCard = ({ user, profile, isEditing, setIsEditing, handleLogout, handleImageChange }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <div className="h-24 bg-linear-to-r from-blue-500/20 via-primary/10 to-green-500/20" />
      <CardContent className="px-6 pb-6 -mt-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
                <Upload size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
            <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
          </div>

          <div className="w-full pt-4 border-t border-border flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition shadow-sm"
              >
                <X size={16} />
                Cancel
              </button>
            )}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <AlertDialogTrigger asChild>
                <button
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition shadow-sm"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to logout from the account "{user.name}". You will need to login again to access your profile.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-sm font-medium">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 rounded-md bg-muted/50"><Mail size={16} /></div>
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 rounded-md bg-muted/50"><Phone size={16} /></div>
            <span>{profile?.phone || "Phone not added"}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 rounded-md bg-muted/50"><MapPin size={16} /></div>
            <span>{profile?.address || "Location not added"}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 rounded-md bg-muted/50"><Calendar size={16} /></div>
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
