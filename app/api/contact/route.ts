import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const adminEmails = [
  'brianstittsr@gmail.com',
  'kathy@ncleadconnect.org',
  'gloria@ncleadconnect.org',
  'katherineharrelson527@gmail.com',
  'gloria4god11@gmail.com'
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, program, otherProgram, message } = body;

    // Validate required fields
    if (!name || !email || !program || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store in Firestore
    const contactData = {
      name,
      email,
      program,
      otherProgram: program === 'Other' ? otherProgram : '',
      message,
      createdAt: serverTimestamp(),
      status: 'new'
    };

    const docRef = await addDoc(collection(db, 'contactSubmissions'), contactData);

    // Prepare email content
    const programText = program === 'Other' ? `${program} (${otherProgram})` : program;
    
    const emailSubject = `New Contact Form Submission - ${program}`;
    const emailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Program of Interest:</strong> ${programText}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      <p><em>Submission ID: ${docRef.id}</em></p>
    `;

    // Send email to all admin addresses
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails,
      subject: emailSubject,
      html: emailBody,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully',
        id: docRef.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
