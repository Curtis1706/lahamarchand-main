import { NextRequest, NextResponse } from "next/server"

// GET /api/debug-cookies - Debug des cookies
export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll()
  
  return NextResponse.json({
    cookies: cookies,
    hasClerkCookie: cookies.some(c => c.name.includes('clerk')),
    allCookieNames: cookies.map(c => c.name)
  })
}






