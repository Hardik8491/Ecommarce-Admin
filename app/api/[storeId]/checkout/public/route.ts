import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { items, email, productIds } = await req.json();
  // const imageUrl = items[0]?.images[0]?.url || "";

  if (!productIds || productIds.length === 0) {
    console.log(productIds);
    console.log(productIds.length === 0);

    return new NextResponse("Product ids are required", { status: 400 });
  }

  // Update Stripe Account
  // try {
  //   const account = await stripe.accounts.update(
  //     '{{CONNECTED_STRIPE_ACCOUNT_ID}}', // Replace with your connected Stripe account ID
  //     {
  //       settings: {
  //         branding: {
  //           icon: 'file_123',
  //           logo: 'file_456',
  //           primary_color: '#663399',
  //           secondary_color: '#4BB543',
  //         },
  //       },
  //     }
  //   );
  //   console.log("Stripe Account Updated:", account);
  // } catch (error) {
  //   console.error("Error updating Stripe Account:", error);
  //   // Handle error appropriately
  // }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const listLineItems = items.map((item: any) => ({
    quantity: 1,
    price_data: {
      currency: "INR",
      unit_amount: item.price * 100,
      product_data: {
        name: item.name,
        images: [item.images[0].url],
        metadata: { productId: item.id },
      },
    },
  }));
  console.log(listLineItems);

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });
  console.log(items.map((item: any) => item.name).toString(),);
  

  const session = await stripe.checkout.sessions.create({
    line_items: listLineItems,
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "IN"],
    },
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/order?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/order?canceled=1`,
    metadata: {
      email,
      productName: items.map((item: any) => item.name).toString(),
       productId: items.map((item: any) => item.id).toString(),
      images: JSON.stringify(items.map((item: any) => item.images[0].url)),
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}

// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// import { stripe } from "@/lib/stripe";
// import prismadb from "@/lib/prismadb";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   const { items, email, productIds } = await req.json();
//   console.log(email);
//   console.log(items);

//   // if (!productIds || productIds.length === 0) {
//   //   console.log(productIds);
//   //   console.log(productIds.length === 0);

//   //   return new NextResponse("Product ids are required", { status: 400 });
//   // }

//   // const products = await prismadb.product.findMany({
//   //   where: {
//   //     id: {
//   //       in: productIds
//   //     }
//   //   }
//   // });
//   // console.log(products);

//   //   const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
//   // console.log(line_items);

//   // products.forEach((product) => {
//   //   line_items.push({
//   //     quantity: 1,
//   //     price_data: {
//   //       currency: 'INR',
//   //       product_data: {
//   //         name: product.name,
//   //       },
//   //       unit_amount: parseFloat(product.price) * 100
//   //     }
//   //   });
//   // });

//   const listLineItems = items.map((item: any) => ({
//     quantity: 1,
//     price_data: {
//       currency: "INR",
//       unit_amount: parseInt(item.price) * 100,
//       // Convert price to integer and convert to paise (100 times)
//       product_data: {
//         name: item.name,
//         // Use item.name instead of item.title
//         description: item.description,
//         // Use item.description if available
//         images: item.images[0].url,

//         // Map images to their URLs
//         metadata: {
//           productId: item.id,
//         },
//         // Use item.id instead of item.product
//       },
//     },
//   }));

//   console.log(listLineItems);
//   const order = await prismadb.order.create({
//     data: {
//       storeId: params.storeId,
//       isPaid: false,
//       orderItems: {
//         create: productIds.map((productId: string) => ({
//           product: {
//             connect: {
//               id: productId,
//             },
//           },
//         })),
//       },
//     },
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items: listLineItems,
//     mode: "payment",
//     billing_address_collection: "required",
//     phone_number_collection: {
//       enabled: true,
//     },
//     success_url: `${process.env.FRONTEND_STORE_URL}/order?success=1`,
//     cancel_url: `${process.env.FRONTEND_STORE_URL}/order?canceled=1`,
//     metadata: {
//       email,
//       orderId: order.id,
//       images: JSON.stringify(items.map((item: any) => item.images[0]?.url)),
//     },
//   });

//   return NextResponse.json({ url: session.url }, { headers: corsHeaders });
// }
