import { useLocation } from "react-router-dom";

export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Define breadcrumb configuration
  const breadcrumbConfig = {
    "/home": [
      { label: "Home", href: "/home" },
    ],
    "/type": [
      { label: "Home", href: "/home" },
      { label: "Type", href: "/type" },
    ],
    "/leaderboard": [
      { label: "Home", href: "/home" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
    "/profile": [
      { label: "Home", href: "/home" },
      { label: "Profile", href: "/profile" },
    ],
    "/learning": [
      { label: "Home", href: "/home" },
      { label: "Learning", href: "/learning" },
    ],
  };

  // Get breadcrumbs for current path, or generate from path segments
  const getBreadcrumbs = () => {
    // Check if we have a specific configuration for this path
    if (breadcrumbConfig[pathname]) {
      return breadcrumbConfig[pathname];
    }

    // Generate breadcrumbs from path segments
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      { label: "Home", href: "/home" },
    ];

    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, href });
    });

    return breadcrumbs;
  };

  return getBreadcrumbs();
};
