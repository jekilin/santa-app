import { EventEmitter } from 'node:events';
import { sendEmail } from './mailer.js';
import logger from '../logger.js';

const DELAY = 15000; //15 seconds delay
export const reminderEvent = 'startReminderJob';

const eventEmitter = new EventEmitter();

function onStartReminder(){
    logger.info("Starting reminder service to send emails to Santa..");
    setInterval(sendEmail, DELAY);
}

eventEmitter.once(reminderEvent, onStartReminder);

export default eventEmitter;
