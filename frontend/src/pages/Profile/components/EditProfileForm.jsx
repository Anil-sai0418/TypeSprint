import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Upload, Phone, MapPin, Loader2 } from "lucide-react";
import { User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const EditProfileForm = ({ editData, setEditData, imagePreview, handleImageChange, handleSaveProfile, setIsEditing }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // Optional phone, but if present must be mostly valid characters and 7-15 length
    const phoneRegex = /^\+?[0-9\s\-()]{7,16}$/;
    if (editData.phone && editData.phone.trim() !== "" && !phoneRegex.test(editData.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    if (editData.address && editData.address.trim() !== "" && editData.address.length < 3) {
      toast.error("Location should be at least 3 characters long");
      return false;
    }

    return true;
  };

  const onSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const { success } = await handleSaveProfile(editData);
      if (success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("An error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="edit-form"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 10 }}
      className="w-full relative"
    >
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-primary/5 flex flex-col max-h-[88vh] sm:max-h-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-zinc-900 dark:via-zinc-100 to-transparent opacity-20" />
        
        <CardHeader className="pb-6 pt-8 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg -rotate-3">
               <Edit className="text-white dark:text-zinc-900 w-5 h-5" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Update Profile
            </CardTitle>
          </div>
          <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
            Modify your personal details and how others see you on TypeSprint.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-2 overflow-y-auto px-6 pb-6">
          {/* Profile Picture Section */}
          <div className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="relative group shrink-0">
              <div className="h-24 w-24 rounded-full bg-white dark:bg-zinc-900 border-[3px] border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-md">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800/50">
                    <User size={36} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Profile Picture</h4>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-sm">
                Click below to choose a new image. You can adjust and crop it in the next step.
              </p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md active:scale-[0.98]">
                <Upload size={14} />
                Change Image
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <Input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded-xl transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <Input
                  type="text"
                  value={editData.address || ''}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  placeholder="City, Country"
                  className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded-xl transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-end gap-3 pb-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto h-11 px-6 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-bold transition-all order-2 sm:order-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              className="w-full sm:w-auto h-11 px-8 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium transition-all shadow-lg active:scale-[0.98] order-1 sm:order-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EditProfileForm;
