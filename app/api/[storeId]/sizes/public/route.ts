import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
      if (!params.storeId) {
        return new NextResponse("Store id is required", { status: 400 });
      }
  
      const sizes = await prismadb.size.findMany({
        where: {
          storeId: params.storeId
        }
      });
    
      return NextResponse.json(sizes);
    } catch (error) {
      console.log('[SIZES_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  