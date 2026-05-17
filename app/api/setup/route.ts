import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// One-time setup endpoint to create the initial admin user
// Remove or protect this in production!
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, setupKey } = body;

    // Basic protection — require a setup key from env
    if (setupKey !== process.env.SETUP_KEY && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("POST /api/setup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
