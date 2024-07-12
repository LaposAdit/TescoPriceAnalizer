import {
    clerkMiddleware,
    createRouteMatcher
} from "@clerk/nextjs/server"

const isDashboardRoute = createRouteMatcher(["/tesco/(.*)", "/tesco"])

export default clerkMiddleware((auth, request) => {
    if (isDashboardRoute(request)) auth().protect()
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};