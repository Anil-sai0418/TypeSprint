import { useState } from "react";
import { X } from "lucide-react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaXTwitter,
  FaEnvelope,
  FaCode,
} from "react-icons/fa6";

export default function ShareModal({ isOpen, onClose }) {
  const shareUrl = window.location.href;
  const [copied, setCopied] = useState(false);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Transparent Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-bold text-foreground">Share This App</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              title="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Share Icons */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-4">
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
                    <span className="text-xs font-medium text-foreground text-center line-clamp-2">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-zinc-800" />

            {/* Copy Link Section */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Or copy the link
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 p-3">
                <input
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-foreground outline-none truncate"
                />
                <button
                  onClick={copyLink}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors duration-200"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 animate-in fade-in">
                  Link copied to clipboard!
                </p>
              )}
            </div>

            {/* QR Code or Additional Info */}
            <div className="rounded-lg bg-gray-50 dark:bg-zinc-800/50 p-4 border border-gray-200 dark:border-zinc-700">
              <p className="text-xs text-muted-foreground text-center">
                Share this app with your friends and challenge them to improve their typing speed! 🚀
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-zinc-800 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}