import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verificationEmail";

export async function sendVerificationEmail(
    email,
    username,
    verifyCode
) {
    try {
        await resend.emails.send({
            from: `onboarding@${process.env.EMAIL_DOMAIN}`,
            to:email,
            subject: 'Feedify Feedback Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Failed to send verification email.' };
    }
}

