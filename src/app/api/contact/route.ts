import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* ── Simple in-memory rate limiter ── */
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max submissions
const RATE_WINDOW = 60 * 60 * 1000; // per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

/* ── POST handler ── */
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, restaurantName, city, message, plan } = body;

    /* ── Validate required fields ── */
    if (!name || !email || !phone || !restaurantName || !city || !plan) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    /* ── SMTP transporter ── */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const planLabels: Record<string, string> = {
      starter: "Starter — ₹49,999 setup + ₹14,999/mo",
      professional: "Professional — ₹99,999 setup + ₹24,999/mo",
      enterprise: "Enterprise — ₹1,99,999 setup + ₹39,999/mo",
      custom: "Custom Solution",
    };

    const planDisplay = planLabels[plan] || plan;

    /* ── Email HTML ── */
    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(201,169,110,0.2);">
        <div style="background: linear-gradient(135deg, #C9A96E, #B08D57); padding: 32px 40px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff;">New Inquiry — Axon Aura</h1>
          <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.8);">A premium restaurant is interested</p>
        </div>

        <div style="padding: 40px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); font-size: 13px; width: 140px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 15px; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); font-size: 13px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #C9A96E; font-size: 15px;"><a href="mailto:${email}" style="color: #C9A96E; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); font-size: 13px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 15px;"><a href="tel:${phone}" style="color: #ffffff; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); font-size: 13px;">Restaurant</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 15px; font-weight: 500;">${restaurantName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); font-size: 13px;">City</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 15px;">${city}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); font-size: 13px;">Selected Plan</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #C9A96E; font-size: 15px; font-weight: 600;">${planDisplay}</td>
            </tr>
            ${
              message
                ? `<tr>
              <td style="padding: 12px 0; color: rgba(255,255,255,0.4); font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
            </tr>`
                : ""
            }
          </table>

          <div style="margin-top: 32px; padding: 20px; background: rgba(201,169,110,0.08); border-radius: 12px; border: 1px solid rgba(201,169,110,0.15);">
            <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.5);">Respond within 2 hours for best conversion. This lead came from the Axon Aura premium segment landing page.</p>
          </div>
        </div>
      </div>
    `;

    const notifyEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_EMAIL;

    await transporter.sendMail({
      from: `"Axon Aura" <${process.env.SMTP_EMAIL}>`,
      to: notifyEmail,
      replyTo: email,
      subject: `🔔 New Inquiry: ${restaurantName} — ${planDisplay}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
