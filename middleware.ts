import { NextRequest, NextResponse, } from "next/server";

export const middleware = (request: NextRequest): NextResponse =>
{
    const response: NextResponse = NextResponse.next ();

    return response;
};
