interface BrevoContact {
  email: string;
  name?: string;
}

interface BrevoSender {
  name: string;
  email: string;
}

interface EmailOptions {
  to: BrevoContact[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  sender?: BrevoSender;
}

class BrevoEmailService {
  private apiKey: string;
  private baseUrl = 'https://api.brevo.com/v3';

  constructor() {
    this.apiKey = process.env.BREVIO_EMAIL_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('BREVIO_EMAIL_API_KEY environment variable is required');
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          sender: options.sender || {
            name: 'PoshPrompt',
            email: 'hello@poshprompt.com'
          },
          to: options.to,
          subject: options.subject,
          htmlContent: options.htmlContent,
          textContent: options.textContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Brevo API error:', errorData);
        return { 
          success: false, 
          error: errorData.message || 'Failed to send email' 
        };
      }

      const data = await response.json();
      console.log('Email sent successfully:', data.messageId);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const emailService = new BrevoEmailService();
