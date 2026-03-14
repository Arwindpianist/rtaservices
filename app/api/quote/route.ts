import { NextRequest, NextResponse } from 'next/server';

const VALID_SERVICES = ['rta-tpm', 'rta-oss', 'rta-ps', 'general'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, companyName, contactPerson, email, phone, requirements } = body;

    // Validation
    if (!service || !VALID_SERVICES.includes(service)) {
      return NextResponse.json(
        { error: 'Please select a valid service (rta-tpm, rta-oss, rta-ps, or general)' },
        { status: 400 }
      );
    }

    if (!companyName || !contactPerson || !email || !phone || !requirements) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 8) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Here you would typically send an email using a service like:
    // - Resend (recommended for Vercel)
    // - Nodemailer
    // - SendGrid
    // - AWS SES
    
    // For now, we'll just log and return success
    // In production, replace this with actual email sending logic
    console.log('Quote request submission:', {
      service,
      companyName,
      contactPerson,
      email,
      phone,
      requirements,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement actual email sending
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'quotes@rtaservices.net',
    //   to: 'sales@rtaservices.net',
    //   subject: `Quote Request [${service}] from ${companyName}`,
    //   html: `
    //     <p><strong>Service:</strong> ${service}</p>
    //     <p><strong>Company:</strong> ${companyName}</p>
    //     <p><strong>Contact Person:</strong> ${contactPerson}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone}</p>
    //     <p><strong>Requirements:</strong></p>
    //     <p>${requirements}</p>
    //   `,
    // });

    return NextResponse.json(
      { message: 'Quote request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing quote request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

