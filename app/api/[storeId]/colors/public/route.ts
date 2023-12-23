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
  
      const colors = await prismadb.color.findMany({
        where: {
          storeId: params.storeId
        }
      });
    
      return NextResponse.json(colors);
    } catch (error) {
      console.log('[COLORS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  