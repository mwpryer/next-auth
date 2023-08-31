import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/utils/db"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ message: "Missing fields" }, { status: 400 })

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return NextResponse.json({ message: "Email already in use" }, { status: 409 })

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { email, hashedPassword } })
    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
