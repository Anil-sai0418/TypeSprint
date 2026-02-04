import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: 1,
    title: "New Test Available",
    desc: "Try the new speed challenge test.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "Streak Updated",
    desc: "You’re on a 5-day streak. Keep going!",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    title: "Leaderboard Update",
    desc: "You moved up to rank #12.",
    time: "2 days ago",
    unread: false,
  },
];

function NotificationList() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg
                       hover:bg-gray-100 dark:hover:bg-zinc-800
                       transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-zinc-300" />
          </button>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">
            Notifications
          </h1>
        </div>

        {/* Notifications Container */}
        <div
          className="rounded-xl border border-gray-200 dark:border-zinc-800
                     bg-white dark:bg-zinc-900 overflow-hidden"
        >
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`px-5 py-4 border-b last:border-b-0
                border-gray-100 dark:border-zinc-800
                ${item.unread ? "bg-gray-50 dark:bg-zinc-800/40" : ""}
              `}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    {item.desc}
                  </p>
                </div>

                <span className="text-xs text-gray-400 dark:text-zinc-500 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationList;