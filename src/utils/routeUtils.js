export const isProtectedRoute = (pathname) => {
    const protectedRoutes = ['/dashboard', '/sites', '/analytics', '/profile'];
    return protectedRoutes.some(route => pathname.startsWith(route));
}; 