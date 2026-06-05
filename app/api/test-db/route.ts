import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await prisma.$connect()

    return NextResponse.json({
      success: true,
      message: "Database connected successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error
    })
  }
}