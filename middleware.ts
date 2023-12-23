import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  ignoredRoutes: [
    "/api/:storeId/products/public",
    "/api/:storeId/categories/public",
    "/api/:storeId/colors/public",
    "/api/:storeId/size/public",
    "/api/:storeId/products/public/:pid",
    "/api/:storeId/colors/public/:pid",
    "/api/:storeId/size/public/:pid",
    "/api/:storeId/categories/public/:pid",
  ],

  debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
