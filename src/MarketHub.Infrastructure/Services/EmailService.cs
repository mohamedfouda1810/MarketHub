using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using MarketHub.Application.Common.Interfaces;
using Hangfire;

namespace MarketHub.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["EmailSettings:FromEmail"]));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            if (isHtml) bodyBuilder.HtmlBody = body;
            else bodyBuilder.TextBody = body;

            email.Body = bodyBuilder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["EmailSettings:SmtpHost"], 
                int.Parse(_config["EmailSettings:SmtpPort"] ?? "587"), 
                MailKit.Security.SecureSocketOptions.StartTls);
            
            // await smtp.AuthenticateAsync(_config["EmailSettings:SmtpUser"], _config["EmailSettings:SmtpPass"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }

        public void EnqueueEmail(string to, string subject, string templateName, object model)
        {
            // For now, just send it immediately or use BackgroundJob.Enqueue
            BackgroundJob.Enqueue(() => SendEmailAsync(to, subject, $"Template: {templateName}", true));
        }
    }
}
