import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  // The matcher determines which routes will be processed by Clerk middleware.
  matcher: [
    // Skip Next.js internals and all static files (css, js, images, etc.) unless a query string is present:
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Also run middleware for API routes or any route starting with /trpc
    '/(api|trpc)(.*)',
  ],
};
