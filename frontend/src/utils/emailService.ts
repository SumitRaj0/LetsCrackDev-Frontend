/**
 * Email Service using EmailJS
 * Sends emails directly from the frontend without backend
 */

// EmailJS configuration - these will be set via environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * Send contact form email using EmailJS
 */
export const sendContactEmail = async (data: ContactFormData): Promise<void> => {
  // Check if EmailJS is configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error(
      'Email service is not configured. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your environment variables.'
    )
  }

  // Dynamically import EmailJS to avoid loading it if not needed
  const emailjs = await import('@emailjs/browser')

  // Initialize EmailJS with public key
  emailjs.init(EMAILJS_PUBLIC_KEY)

  // Prepare template parameters for main contact email
  const templateParams = {
    from_name: data.name,
    from_email: data.email,
    subject: data.subject,
    message: data.message,
    to_email: 'letscrackdev@gmail.com', // Recipient email
    // Required for auto-reply functionality - send all possible variable names
    reply_to: data.email, // Used by EmailJS auto-reply feature
    user_email: data.email, // Alternative parameter for auto-reply
    email: data.email, // Common variable name used in EmailJS templates
    to_name: data.name, // User's name for auto-reply
  }

  // Send main contact email
  // Note: Auto-reply is handled by EmailJS's built-in Auto-Reply feature in the dashboard
  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
}

