import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"FoodRush" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your FoodRush Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFFFFF; border-radius: 8px; border-top: 5px solid #C83C3C;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #C83C3C; font-size: 28px; margin: 0;">
            <span style="color: #C83C3C; font-weight: bold;">FoodRush</span>
          </h1>
          <div style="margin-top: 5px;">
            <span style="display: inline-block; width: 18px; height: 3px; background-color: #C83C3C; margin-right: 3px;"></span>
            <span style="display: inline-block; width: 18px; height: 3px; background-color: #C83C3C; margin-right: 3px;"></span>
            <span style="display: inline-block; width: 18px; height: 3px; background-color: #C83C3C;"></span>
          </div>
        </div>
        <div style="background-color: #FFF8E8; padding: 25px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #FFD95F;">
          <h2 style="color: #331C1C; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Verification Required</h2>
          <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for registering with FoodRush! Please use the code below to verify your account.</p>
          <div style="background-color: #FFFFFF; border: 1px dashed #C83C3C; border-radius: 6px; padding: 15px; text-align: center; margin: 25px 0;">
            <span style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #C83C3C;">${code}</span>
          </div>
          <p style="color: #555555; font-size: 14px; margin-top: 20px;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div style="text-align: center; padding-top: 15px; border-top: 1px solid #EEEEEE; font-size: 12px; color: #999999;">
          <p>© ${new Date().getFullYear()} FoodRush. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};
