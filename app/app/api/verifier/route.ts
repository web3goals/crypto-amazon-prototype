import { errorToString } from "@/lib/converters";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // Defaults to force-static

/**
 * Structure reference - https://github.com/omniti-labs/jsend
 */
type ResponseData =
  | {
      status: "success" | "fail";
      data: any;
    }
  | {
      status: "error";
      message: string;
    };

export async function GET(request: NextRequest) {
  try {
    // Check params
    const searchParams = request.nextUrl.searchParams;
    const asin = searchParams.get("asin");
    const sellerAmazonToken = searchParams.get("sellerAmazonToken");
    if (!asin || !sellerAmazonToken) {
      return createResponse({ status: "fail", data: "Wrong params" }, 400);
    }
    // Check seller
    const isSeller = await checkSeller(asin, sellerAmazonToken);
    return createResponse(
      {
        status: "success",
        data: isSeller ? "is_seller" : "is_not_seller",
      },
      200
    );
  } catch (error) {
    console.error(error);
    return createResponse(
      { status: "error", message: errorToString(error) },
      500
    );
  }
}

function createResponse(
  responseData: ResponseData,
  responseStatus: number
): Response {
  return Response.json(responseData, {
    status: responseStatus,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

// TODO: Implement using Amazon API
async function checkSeller(
  asin: string,
  sellerAmazonToken: string
): Promise<boolean> {
  return true;
}
