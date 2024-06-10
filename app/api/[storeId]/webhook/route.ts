import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
const serviceAccount = {
  type: "process.env.FIREBASE_TYPE",
  project_id: "process.env.FIREBASE_PROJECT_ID",
  private_key_id: "process.env.FIREBASE_PRIVATE_KEY_ID",
  private_key: "process.env.FIREBASE_PRIVATE_KEY",
  client_email: "process.env.FIREBASE_CLIENT_EMAIL",
  client_id: "process.env.FIREBASE_CLIENT_ID",
  auth_uri: "process.env.FIREBASE_AUTH_URI",
  token_uri: "process.env.FIREBASE_TOKEN_URI",
  auth_provider_x509_cert_url:
    "process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
  client_x509_cert_url: "process.env.FIREBASE_CLIENT_X509_CERT_URL",
  universe_domain: "process.env.FIREBASE_UNIVERSE_DOMAIN",
};

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

const fulfillOrder = async (session: any) => {
  // console.log(session.customer_details.email);
  // console.log(session.customer_details);
  // console.log(session);
  const img = JSON.parse(session.metadata.images);

  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      Name: session.customer_details.name,
      productName: session.metadata.productName,
      productId: session.metadata.productId,
      mobileNo: session.customer_details.phone,
      address: session.customer_details.address,
      oderId: session.metadata.orderId,
      expire: session.expires_at,
      status: session.status,

      // amount_shipping: session.total_details.amount_shipping / 100,
      images: img[0],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      // console.log()
      console.log(
        `Success: ORder ${session.id} has been added to the DATABASE`
      );
    });
};

export async function POST(request: any, response: any) {
  const signature = headers().get("Stripe-Signature") ?? "";
  const body = await request.text();
  const key = process.env.KEY!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, key);
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err.message, { status: 400 });
  }

  // const session = event.data.object;
  // const address = session?.customer_details?.address;
  // const addressComponents = [
  //   address?.line1,
  //   address?.line2,
  //   address?.city,
  //   address?.state,
  //   address?.postal_code,
  //   address?.country,
  // ];
  // const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log(session);

    try {
      // const order = await prismadb.order.update({
      //   where: {
      //     id: session?.metadata?.orderId,
      //   },
      //   data: {
      //     isPaid: true,
      //     address: addressString,
      //     phone: session?.customer_details?.phone || "",
      //   },
      //   include: {
      //     orderItems: true,
      //   },
      // });

      // const productIds = order.orderItems.map(
      //   (orderItem) => orderItem.productId
      // );

      // await prismadb.product.updateMany({
      //   where: {
      //     id: {
      //       in: [...productIds],
      //     },
      //   },
      //   data: {
      //     isArchived: true,
      //   },
      // });

      await fulfillOrder(session);

      return NextResponse.json({
        status: 201,
        message: "This Worked",
        success: true,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        status: 500,
        message: "error is " + error,
        success: false,
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
