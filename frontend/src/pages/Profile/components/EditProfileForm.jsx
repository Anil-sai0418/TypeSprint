import React from "react";
import { motion } from "framer-motion";
import { Edit, Upload, Phone, MapPin } from "lucide-react";
import { User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";

const EditProfileForm = ({ editData, setEditData, imagePreview, handleImageChange, handleSaveProfile, setIsEditing }) => {
  const onSave = async () => {
    const { success } = await handleSaveProfile(editData);
    if (success) {
      alert("Profile updated successfully!");
      setIsEditing(false);
    } else {
      alert("Failed to update profile");
    }
  };

  return (
    <motion.div
      key="edit-form"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 10 }}
      className="w-full"
    >
      <Card className="border-primary/20 shadow-lg ring-1 ring-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="text-primary" size={20} />
            Update Profile
          </CardTitle>
          <CardDescription>
            Modify your personal details and how others see you on TypeSprint.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group shrink-0">
              <div className="h-20 w-20 rounded-full bg-background border-2 border-border overflow-hidden shadow-sm shadow-primary/5">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/20">
                    <User size={32} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h4 className="text-sm font-bold">Profile Picture</h4>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                Click below to choose a new image. You can adjust and crop it in the next step.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors">
                <Upload size={14} />
                Change Image
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  placeholder="City, Country"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-lg border border-border font-bold hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition shadow-md"
            >
              Save Changes
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EditProfileForm;
