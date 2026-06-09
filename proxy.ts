import { NextRequest, NextResponse, } from "next/server";

export function proxy (request: NextRequest): NextResponse
{
    return NextResponse.next ();
}
