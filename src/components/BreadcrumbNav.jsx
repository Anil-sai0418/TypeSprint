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
    <div className="fixed top-[70px] left-0 w-full z-40 bg-background/80 backdrop-blur-sm border-b border-border/40 pt-3 pb-3 px-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center gap-1.5">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink onClick={() => navigate(item.href)}>
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
