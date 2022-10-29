import nodemailer from 'nodemailer';
import { getPendingKidsWishes } from './sorter.js';
import logger from '../logger.js';

const SANTA_EMAIL_ADD = "santa@northpole.com";
const NOREPLY_EMAIL_ADD = "do_not_reply@northpole.com";

const transporter = nodemailer.createTransport({

  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
  }
});

export const sendEmail = () => {

  const kidsWishes = getPendingKidsWishes();
  const body = kidsWishes.map((kid) => [kid.name, kid.address, kid.wish].join(' <br>')).join('<br><br>');
  logger.debug(body);

  let message = {
    from: NOREPLY_EMAIL_ADD, // sender address
    to: SANTA_EMAIL_ADD, // receiver
    subject: "Reminder for Santa", // Subject line
    html: body, // html body
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
        logger.error('Error occurred. ' + err.message);
        return process.exit(1);
    }

    logger.info('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    logger.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }); 

};

