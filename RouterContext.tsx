import React, { createContext, useContext, useEffect, useState } from 'react';

type RoutePath = '/' | '/privacy' | '/terms' | '/support' | '/security' | '/dashboard' | string;

interface RouterContextType {
  path: RoutePath;
  navigate: (to: RoutePath, options?: { replace?: boolean; preserveHash?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const normalizePath = (p: string): RoutePath => {
    // 1. Check query param redirect for GitHub Pages SPA (e.g. ?p=/privacy)
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const redirectP = params.get('p') || params.get('path');
      if (redirectP) {
        return redirectP.startsWith('/') ? redirectP : `/${redirectP}`;
      }
    }

    // 2. Check hash route (e.g. #/privacy or #terms)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?/, '/');
      if (hash && hash !== '/') {
        return hash.split('?')[0];
      }
    }

    // 3. Standard pathname check
    const clean = p.split('?')[0].split('#')[0] || '/';
    if (clean === '' || clean === '/home') return '/';
    return clean;
  };

  const [path, setPath] = useState<RoutePath>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: RoutePath, options?: { replace?: boolean; preserveHash?: boolean }) => {
    const targetPath = normalizePath(to);
    setPath(targetPath);

    if (typeof window !== 'undefined') {
      const currentUrl = window.location.pathname;
      if (currentUrl !== to) {
        if (options?.replace) {
          window.history.replaceState({}, '', to);
        } else {
          window.history.pushState({}, '', to);
        }
      }
      // Scroll to top on page change if not an anchor link
      if (!to.includes('#')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, className, children, onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // Allow normal browser behavior for open in new tab (Ctrl/Cmd click) or external links
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
      return;
    }
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
      return;
    }

    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
