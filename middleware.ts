import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  ignoredRoutes: [
    "/api/:storeId/products/public",
    "/api/:storeId/categories/public",
    "/api/:storeId/billboards/public",
    "/api/:storeId/colors/public",
    "/api/:storeId/size/public",
    "/api/:storeId/products/public/:pid",
    "/api/:storeId/colors/public/:pid",
    "/api/:storeId/size/public/:pid",
    "/api/:storeId/categories/public/:pid",
    "/api/:storeId/billboards/public/:pid",
    "/api/:storeId/checkout/public",
    "/api/:storeId/checkout/public/:pid",
  ],

  debug: false,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
