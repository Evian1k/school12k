import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (name, index) => {
    if (name === 'admin' || name === 'teacher' || name === 'student' || name === 'parent') {
      return 'Dashboard';
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <nav aria-label="breadcrumb" className="hidden lg:block text-sm text-muted-foreground">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to={`/${pathnames[0]}`} className="hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        {pathnames.slice(1).map((value, index) => {
          const to = `/${pathnames.slice(0, index + 2).join('/')}`;
          const isLast = index === pathnames.length - 2;

          return (
            <React.Fragment key={to}>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                <Link
                  to={to}
                  className={cn(
                    'hover:text-foreground transition-colors',
                    isLast ? 'text-foreground font-medium' : ''
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {getBreadcrumbName(value, index + 1)}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;