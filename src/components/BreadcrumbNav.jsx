import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

/**
 * BreadcrumbNav Component
 * 
 * A reusable breadcrumb navigation component that appears below the main navbar.
 * Automatically generates breadcrumb items based on current route.
 * 
 * Usage:
 * <BreadcrumbNav />
 * 
 * Props:
 * - None (uses route from React Router automatically)
 * 
 * Styling:
 * - bg-background/80 : Semi-transparent background
 * - backdrop-blur-sm : Blur effect for depth
 * - border-b border-border/40 : Subtle bottom border
 * - pt-3 pb-3 : Padding top and bottom
 * - px-6 : Padding left and right
 */
export default function BreadcrumbNav() {
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="fixed top-[70px] left-0 w-full z-40 pt-3 pb-3 px-6">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-2 text-sm tracking-wide">
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <BreadcrumbSeparator className="opacity-60 scale-90" />
              )}
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => navigate(item.href)}
                    className="font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-foreground hover:after:w-full after:transition-all after:duration-300"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
