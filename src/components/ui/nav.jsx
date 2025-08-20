import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ModeToggle } from '../mode-toggle'
import { CircleUserIcon, EditIcon, CameraIcon, PhoneIcon, MapPinIcon, MailIcon, UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Nav() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const dropdownRef = useRef(null);

    // User profile state - phone and address are initially empty
    const [userProfile, setUserProfile] = useState({
        name: 'Anil Sai',
        email: 'anilsai@example.com',
        phone: '', // Initially empty
        address: '', // Initially empty
        profileImage: null
    });

    // Retrieve user info from token and profile info from localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUserProfile(prev => ({
                    ...prev,
                    name: payload.username || prev.name,
                    email: payload.email || prev.email
                }));
            } catch (err) {
                console.error("Invalid token format", err);
            }
        }
        // Retrieve phone, address, and profileImage from localStorage if available
        const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (savedProfile) {
            setUserProfile(prev => ({
                ...prev,
                phone: savedProfile.phone || "",
                address: savedProfile.address || "",
                profileImage: savedProfile.profileImage || null
            }));
        }
    }, []);

    // Handle profile image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserProfile(prev => ({
                    ...prev,
                    profileImage: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle profile update
    const handleProfileUpdate = (field, value) => {
        setUserProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle save profile
    const handleSaveProfile = () => {
        setIsEditing(false);
        const { phone, address, profileImage } = userProfile;
        localStorage.setItem("userProfile", JSON.stringify({ phone, address, profileImage }));
        console.log('Profile updated:', userProfile);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
                setIsEditing(false); // Reset edit mode when menu closes
            }
        };
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <>
        <nav className="h-[60px] w-full bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center relative">
            <p onClick={() => navigate('/home')} className="text-xl sm:text-2xl md:text-xl text-blue-500 font-bold pl-4 sm:pl-8 cursor-pointer">
                TypeSprint
            </p>

            <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[60%] md:w-[30%] h-[50px] bg-primary/30 rounded-[5px] flex justify-center items-center gap-6">
                <Button>Language</Button>
                <Select>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">pink</SelectItem>
                        <SelectItem value="dark">red</SelectItem>
                        <SelectItem value="system">orange</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="ml-auto flex items-center space-x-4 pr-2 sm:pr-4 relative flex-wrap gap-2">
                <div onClick={() => setMenuOpen(true)} className="cursor-pointer">
                    {userProfile.profileImage ? (
                        <img 
                            src={userProfile.profileImage} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                        />
                    ) : (
                        <CircleUserIcon className="w-8 h-8" />
                    )}
                </div>

                {menuOpen && (
                    <div ref={dropdownRef} className="absolute top-full right-2 sm:right-4 mt-2 w-[90vw] max-w-[22rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-md z-50">
                        <div className="p-4">
                            {/* Profile Header */}
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-white">Profile</h3>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsEditing(!isEditing)}
                                  className="p-2"
                                >
                                  <EditIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setMenuOpen(false);
                                    setIsEditing(false); // Reset edit mode when closed manually
                                  }}
                                  className="p-2"
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>

                            {/* Profile Image Section */}
                            <div className="flex flex-col items-center mb-4 relative">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                                    {userProfile.profileImage ? (
                                        <img 
                                            src={userProfile.profileImage} 
                                            alt="Profile" 
                                            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                            <UserIcon className="w-8 h-8 text-gray-500" />
                                        </div>
                                    )}

                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-primary/80 z-10">
                                            <CameraIcon className="w-3 h-3" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Profile Information */}
                            <div className="space-y-3">
                                {/* Name */}
                                <div className="flex items-center space-x-3">
                                    <UserIcon className="w-4 h-4 text-gray-500" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={userProfile.name}
                                            onChange={(e) => handleProfileUpdate('name', e.target.value)}
                                            className="flex-1 px-2 py-1 border rounded text-sm sm:text-base w-full"
                                            placeholder="Full Name"
                                        />
                                    ) : (
                                        <div>
                                            <p className="text-sm sm:text-base font-medium text-white">{userProfile.name}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="flex items-center space-x-3">
                                    <MailIcon className="w-4 h-4 text-gray-500" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={userProfile.email}
                                            onChange={(e) => handleProfileUpdate('email', e.target.value)}
                                            className="flex-1 px-2 py-1 border rounded text-sm sm:text-base w-full"
                                            placeholder="Email"
                                        />
                                    ) : (
                                        <p className="text-xs sm:text-sm text-white">{userProfile.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="flex items-center space-x-3">
                                    <PhoneIcon className="w-4 h-4 text-gray-500" />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={userProfile.phone}
                                            onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                                            className="flex-1 px-2 py-1 border rounded text-sm sm:text-base w-full"
                                            placeholder="Phone Number"
                                        />
                                    ) : (
                                        <p className="text-xs sm:text-sm text-white">
                                            {userProfile.phone || (
                                                <span className="italic text-gray-400">
                                                    Add phone number
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="flex items-start space-x-3">
                                    <MapPinIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                                    {isEditing ? (
                                        <textarea
                                            value={userProfile.address}
                                            onChange={(e) => handleProfileUpdate('address', e.target.value)}
                                            className="flex-1 px-2 py-1 border rounded text-sm sm:text-base w-full resize-none"
                                            placeholder="Address"
                                            rows="2"
                                        />
                                    ) : (
                                        <p className="text-xs sm:text-sm text-white">
                                            {userProfile.address || (
                                                <span className="italic text-gray-400">
                                                    Add address
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Save Button (shown when editing) */}
                            {isEditing && (
                                <div className="mt-4 flex justify-center">
                                    <Button
                                        onClick={handleSaveProfile}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Logout Button */}
                            <Button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    setMenuOpen(false);
                                    navigate('/Login');
                                }}
                                variant="destructive"
                                className="w-full"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
        </>
    );
}