import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, firstName, subject } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Back to Leadership C.O.N.N.E.C.T.I.O.N.S.</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #3C50E0 0%, #8B5CF6 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #3C50E0 0%, #8B5CF6 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .acronym {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3C50E0;
          }
          .acronym-item {
            margin: 8px 0;
          }
          .letter {
            color: #3C50E0;
            font-weight: bold;
            font-size: 18px;
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome Back, ${firstName}!</h1>
          <p>We're thrilled to have you rejoin the Leadership C.O.N.N.E.C.T.I.O.N.S. family</p>
        </div>
        
        <div class="content">
          <h2>Your Account Has Been Created!</h2>
          
          <p>Dear ${firstName},</p>
          
          <p>
            Thank you for registering with Leadership C.O.N.N.E.C.T.I.O.N.S.! Your account has been successfully created, 
            and we're excited to reconnect you with our alumni network.
          </p>

          <div class="acronym">
            <h3 style="color: #3C50E0; margin-top: 0;">What C.O.N.N.E.C.T.I.O.N.S. Means:</h3>
            <div class="acronym-item"><span class="letter">C</span>ommitment</div>
            <div class="acronym-item"><span class="letter">O</span>pportunity</div>
            <div class="acronym-item"><span class="letter">N</span>ever ending</div>
            <div class="acronym-item"><span class="letter">N</span>etworks</div>
            <div class="acronym-item"><span class="letter">E</span>mbracing</div>
            <div class="acronym-item"><span class="letter">C</span>ounty</div>
            <div class="acronym-item"><span class="letter">T</span>eamwork</div>
            <div class="acronym-item"><span class="letter">I</span>nfluencing</div>
            <div class="acronym-item"><span class="letter">O</span>ther</div>
            <div class="acronym-item"><span class="letter">N</span>ew Comers to</div>
            <div class="acronym-item"><span class="letter">S</span>ave our YOUTH</div>
          </div>

          <h3>Next Steps:</h3>
          <ul>
            <li><strong>Complete Your Profile:</strong> Add your photo, expertise, and professional information</li>
            <li><strong>Connect with Alumni:</strong> Browse the member directory and reconnect with fellow graduates</li>
            <li><strong>Share Your Story:</strong> Let others know about your journey since graduation</li>
            <li><strong>Get Involved:</strong> Explore mentorship opportunities and upcoming events</li>
          </ul>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ncleadconnect.org'}/admin/lc-profile" class="button">
              Complete Your Profile
            </a>
          </div>

          <p>
            If you have any questions or need assistance, please don't hesitate to reach out to us at 
            <a href="mailto:info@ncleadconnect.org" style="color: #3C50E0;">info@ncleadconnect.org</a>
          </p>

          <p>
            <strong>Together, we build C.O.N.N.E.C.T.I.O.N.S. that last a lifetime.</strong>
          </p>
        </div>

        <div class="footer">
          <p>
            <strong>Leadership C.O.N.N.E.C.T.I.O.N.S.</strong><br>
            Empowering Youth Since 1991
          </p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ncleadconnect.org'}" style="color: #3C50E0;">Visit Our Website</a> | 
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ncleadconnect.org'}/member-directory" style="color: #3C50E0;">Member Directory</a>
          </p>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textContent = `
Welcome Back, ${firstName}!

We're thrilled to have you rejoin the Leadership C.O.N.N.E.C.T.I.O.N.S. family.

Your Account Has Been Created!

Dear ${firstName},

Thank you for registering with Leadership C.O.N.N.E.C.T.I.O.N.S.! Your account has been successfully created, and we're excited to reconnect you with our alumni network.

What C.O.N.N.E.C.T.I.O.N.S. Means:
C - ommitment
O - pportunity
N - ever ending
N - etworks
E - mbracing
C - ounty
T - eamwork
I - nfluencing
O - ther
N - ew Comers to
S - ave our YOUTH

Next Steps:
- Complete Your Profile: Add your photo, expertise, and professional information
- Connect with Alumni: Browse the member directory and reconnect with fellow graduates
- Share Your Story: Let others know about your journey since graduation
- Get Involved: Explore mentorship opportunities and upcoming events

Complete your profile at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ncleadconnect.org'}/admin/lc-profile

If you have any questions or need assistance, please don't hesitate to reach out to us at info@ncleadconnect.org

Together, we build C.O.N.N.E.C.T.I.O.N.S. that last a lifetime.

---
Leadership C.O.N.N.E.C.T.I.O.N.S.
Empowering Youth Since 1991
${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ncleadconnect.org'}
    `;

    // Send email
    await transporter.sendMail({
      from: `"Leadership C.O.N.N.E.C.T.I.O.N.S." <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject || 'Welcome Back to Leadership C.O.N.N.E.C.T.I.O.N.S.!',
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json(
      { message: 'Welcome email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}
