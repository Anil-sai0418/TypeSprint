import { useState, useRef, useEffect, useMemo } from "react";
import { X, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaFacebookF,
  FaXTwitter,
  FaEnvelope,
  FaCode,
} from "react-icons/fa6";

export default function ShareModal({ isOpen, onClose }) {
  const shareUrl = window.location.origin ; // Link to the app's type page
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const modalRef = useRef(null);
  const qrRef = useRef(null);

  const qrCode = useMemo(() => {
    return new QRCodeStyling({
      width: 200,
      height: 200,
      data: shareUrl,
      image: "/Type-logo.png",
      dotsOptions: {
        color: "#000000",
        type: "dots",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 8,
        imageSize: 0.4,
      },
      cornersSquareOptions: {
        color: "#000000",
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#000000",
        type: "dot",
      },
      qrOptions: {
        errorCorrectionLevel: "H",
      },
    });
  }, [shareUrl]);

  useEffect(() => {
    if (isOpen && showQR && qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.append(qrRef.current);
    }
  }, [isOpen, showQR, qrCode]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareItems = [
    {
      label: "Embed",
      icon: <FaCode size={20} />,
      bg: "bg-gray-400 dark:bg-gray-600 text-white",
    },
    {
      label: "WhatsApp",
      icon: <FaWhatsapp size={22} />,
      bg: "bg-green-500 text-white hover:bg-green-600",
      link: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Facebook",
      icon: <FaFacebookF size={20} />,
      bg: "bg-blue-600 text-white hover:bg-blue-700",
      link: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      label: "X",
      icon: <FaXTwitter size={20} />,
      bg: "bg-black dark:bg-gray-800 text-white hover:bg-gray-900 dark:hover:bg-gray-700",
      link: `https://twitter.com/intent/tweet?url=${shareUrl}`,
    },
    {
      label: "Email",
      icon: <FaEnvelope size={20} />,
      bg: "bg-orange-500 text-white hover:bg-orange-600",
      link: `mailto:?body=${shareUrl}`,
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300" />

      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Share This App
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              title="Close"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Share Icons */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Share on social media
              </p>
              <div className="grid grid-cols-5 gap-3">
                {shareItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                    title={item.label}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg} transition-all duration-200 transform group-hover:scale-110 shadow-sm`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center line-clamp-2">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-zinc-800" />

            {/* QR Code Section */}
            <div className="space-y-3">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-between w-full group focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Scan QR code
                  </p>
                  {showQR ? (
                    <EyeOff className="h-3.5 w-3.5 text-gray-400" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 dark:bg-zinc-800/50 text-[10px] font-medium text-gray-400 group-hover:text-blue-500 transition-all">
                  {showQR ? "Hide" : "View"}
                  {showQR ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col items-center space-y-3"
                  >
                    <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-100 dark:border-zinc-800 mt-2">
                      <div
                        ref={qrRef}
                        className="[&>canvas]:mx-auto [&>canvas]:rounded-lg"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 text-center max-w-[200px]">
                      Scan this code with your phone camera to open the
                      application instantly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-zinc-800" />

            {/* Copy Link Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Or copy the link
                </p>

                {copied && (
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 animate-in fade-in">
                    Link copied ✓
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 p-3">
                <input
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none truncate"
                />
                <button
                  onClick={copyLink}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 dark:bg-zinc-800/50 p-4 border border-gray-200 dark:border-zinc-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Share this app with your friends and challenge them to improve
                their typing speed! 🚀
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}