import React from "react";
import Cropper from "react-easy-crop";
import { X, RotateCcw, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";

const ImageCropperModal = ({
  imageToCrop,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  showCroppedImage,
  setIsCropping,
  setImageToCrop
}) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-8 overflow-y-auto">
      <Card className="w-full max-w-xl bg-card border-border shadow-2xl">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Adjust Profile Picture</CardTitle>
            <button
              onClick={() => setIsCropping(false)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
            >
              <X size={20} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div className="relative h-96 w-full rounded-xl overflow-hidden bg-black ring-1 ring-border">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="round"
              showGrid={false}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>Zoom Level</span>
                <span className="text-primary">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground px-1">
                <span>1x</span>
                <span>2x</span>
                <span>3x</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setIsCropping(false);
                  setImageToCrop(null);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border font-bold hover:bg-muted transition"
              >
                <RotateCcw size={18} />
                Reset
              </button>
              <button
                onClick={showCroppedImage}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition shadow-lg"
              >
                <Check size={18} />
                Apply Changes
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageCropperModal;
