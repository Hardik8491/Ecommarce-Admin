import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  ignoredRoutes: ["/api/:storeId/products/public","/api/:storeId/products/public/:pid","/api/:storeId/categories/public","/api/:storeId/categories/public/:cid"],
  debug:true
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};