package services

import (
	"fmt"
	"net/smtp"
	"os"
)

type EmailService interface {
	SendVerificationEmail(email, name, token string) error
	SendPasswordResetEmail(email, name, token string) error
}

type emailService struct {
	smtpHost     string
	smtpPort     string
	smtpUsername string
	smtpPassword string
	fromEmail    string
	baseURL      string
}

func NewEmailService() EmailService {
	return &emailService{
		smtpHost:     getEnv("SMTP_HOST", "localhost"),
		smtpPort:     getEnv("SMTP_PORT", "587"),
		smtpUsername: getEnv("SMTP_USERNAME", ""),
		smtpPassword: getEnv("SMTP_PASSWORD", ""),
		fromEmail:    getEnv("FROM_EMAIL", "noreply@microbridge.com"),
		baseURL:      getEnv("FRONTEND_URL", "http://localhost:3000"),
	}
}

func (s *emailService) SendVerificationEmail(email, name, token string) error {
	verificationURL := fmt.Sprintf("%s/auth/verify-email?token=%s", s.baseURL, token)
	
	subject := "Verify Your Email - MicroBridge"
	body := s.getVerificationEmailTemplate(name, verificationURL)
	
	return s.sendEmail(email, subject, body)
}

func (s *emailService) SendPasswordResetEmail(email, name, token string) error {
	resetURL := fmt.Sprintf("%s/auth/reset-password?token=%s", s.baseURL, token)
	
	subject := "Reset Your Password - MicroBridge"
	body := s.getPasswordResetEmailTemplate(name, resetURL)
	
	return s.sendEmail(email, subject, body)
}

func (s *emailService) sendEmail(to, subject, body string) error {
	// If SMTP is not configured, just log the email (for development)
	if s.smtpUsername == "" || s.smtpPassword == "" {
		fmt.Printf("📧 [EMAIL] To: %s, Subject: %s\n", to, subject)
		fmt.Printf("📧 [EMAIL] Body:\n%s\n", body)
		return nil
	}

	// Create the message
	msg := []byte("To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"Content-Type: text/html; charset=UTF-8\r\n" +
		"\r\n" +
		body + "\r\n")

	// SMTP authentication
	auth := smtp.PlainAuth("", s.smtpUsername, s.smtpPassword, s.smtpHost)

	// Send the email
	err := smtp.SendMail(
		s.smtpHost+":"+s.smtpPort,
		auth,
		s.fromEmail,
		[]string{to},
		msg,
	)

	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}

func (s *emailService) getVerificationEmailTemplate(name, verificationURL string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to MicroBridge!</h1>
        </div>
        <div class="content">
            <h2>Hi %s,</h2>
            <p>Thank you for signing up for MicroBridge! To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="%s" class="button">Verify Email Address</a>
            </p>
            <p>If you can't click the button, copy and paste this link into your browser:</p>
            <p><a href="%s">%s</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with MicroBridge, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 MicroBridge. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`, name, verificationURL, verificationURL, verificationURL)
}

func (s *emailService) getPasswordResetEmailTemplate(name, resetURL string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 4px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hi %s,</h2>
            <p>We received a request to reset your password for your MicroBridge account.</p>
            <div class="warning">
                <strong>⚠️ Important:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
            <p>To reset your password, click the button below:</p>
            <p style="text-align: center;">
                <a href="%s" class="button">Reset Password</a>
            </p>
            <p>If you can't click the button, copy and paste this link into your browser:</p>
            <p><a href="%s">%s</a></p>
            <p><strong>This link will expire in 1 hour</strong> for security reasons.</p>
            <p>After clicking the link, you'll be able to create a new password for your account.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 MicroBridge. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`, name, resetURL, resetURL, resetURL)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}