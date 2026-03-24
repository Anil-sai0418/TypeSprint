import { useState, useCallback } from "react";
import { getCroppedImg } from "../utils/imageCropper";
import { compressImage } from "../../../utils/imageCompression";

export const useImageCrop = ({ setImagePreview, setEditData }) => {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const croppedBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);
      // Further compress the cropped image to ensure it's small for DB
      const result = await compressImage(croppedBase64, 0.7, 400, 400);
      setImagePreview(result);
      setEditData((prev) => ({ ...prev, profileImage: result }));
      setIsCropping(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
      alert("Error cropping image");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
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
  };
};
