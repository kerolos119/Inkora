package com.kerolos119.inkora.services;

import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.model.EmailTemplate;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServices {

    private static final Logger log = LoggerFactory.getLogger(EmailServices.class);
    private final JavaMailSender sender;
    private final TemplateEngine templateEngine;
    private final String from;

    public EmailServices(JavaMailSender sender, TemplateEngine templateEngine, @Value("${spring.mail.username}") String from) {
        this.sender = sender;
        this.templateEngine = templateEngine;
        this.from= from;
    }

    public void sendMail(String toMail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(toMail);
        message.setSubject(subject);
        message.setText(body);

        sender.send(message);
    }

    public void sendHtmlMail(String toMail, EmailTemplate template){
        try {
            Context context = new Context();
            context.setVariables(template.toVariables());

            String html = templateEngine.process(template.templateName(), context);

            MimeMessage message =  sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(toMail);
            helper.setSubject(template.subject());
            helper.setText(html, true);
            sender.send(message);
        } catch (MessagingException e) {
            throw new CustomException(ExceptionMessage.EMAIL_SENDING_FAILED);
        } catch (Exception e){
            log.warn("Unexpected error while sending email to {}: {}", toMail, e.getMessage());
        }
    }


}
