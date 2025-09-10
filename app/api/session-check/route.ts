import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-clerk"

export async function GET(request: NextRequest) {
  console.log("🔍 Session check API called")
  
  const user = await getCurrentUser(request)
  
  return NextResponse.json({
    authenticated: !!user,
    user: user,
    timestamp: new Date().toISOString()
  })
}




