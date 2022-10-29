import { getRegisteredList } from './santabook.js';
import eventEmitter, { reminderEvent } from './reminder.js';
import logger from '../logger.js';

const AGE_LIMIT = 10;
const PENDING_KIDS_WISHES = [];

export const getPendingKidsWishes = () =>  {
  return PENDING_KIDS_WISHES;
};

const checkRequester = async (requesterName, wish) => {
    //get list of registered kids name
    const registered = await getRegisteredList();

    const foundUser = registered.find(({ username }) => username === requesterName);
    
    if (!foundUser){
      return "Sorry, you better be nice next year! Ho ho ho!";
    }
    //check if age exceeds age limit
    const age = getAge(foundUser.birthdate);
    logger.debug("Age is " + age);
    if (age > AGE_LIMIT){
      return "Sorry, but it's time you should know the truth about Santa. Ho ho ho!";
    }
    //check if requester already sent wish 
    const repeater = PENDING_KIDS_WISHES.find(({ username }) => username === requesterName);
    if(repeater){
      return "Sorry, you can only wish once kid! Ho Ho ho!";
    }
    //requester check passed, add to array
    PENDING_KIDS_WISHES.push({name: foundUser.username, address: foundUser.address, wish: wish});
  
    return  "Congratulations! Since you have been good this year, your wish will be sent to Santa. Have a Merry Christmas!";

  }

const getAge = (dobStr) => {
    const datesplit=dobStr.split('/');
    const year = datesplit[0];
    const day = datesplit[1]
    const month = datesplit[2]
    const dob = new Date(month + "/" + day + "/" + year);
    //calculate month difference from current date in time
    const month_diff = Date.now() - dob.getTime();
    
    //convert the calculated difference in date format
    const age_dt = new Date(month_diff); 
    
    //extract year from date    
    const fullYear = age_dt.getUTCFullYear();
    
    //now calculate the age of the user
    return Math.abs(fullYear - 1970);
}


export const handleRequest = async(req, res, next) => {
  let {name, wish} =  req.body;
  logger.info("User name = "+name+", wish = "+wish);

  let resultMsg = "";

  if (!name || !wish){

    resultMsg = "Sorry, you did not fully fill out the form.";

  } else {

    try {
      name = name.toLowerCase();
      resultMsg = await checkRequester(name, wish);

      //invoke reminder service to send emails to santa
      if (PENDING_KIDS_WISHES.length === 1) {
        eventEmitter.emit(reminderEvent);
      }

    } catch(error) {
      logger.error(error);
      resultMsg = "Sorry, something went wrong..";
    }
  }
  res.send(`<p>${resultMsg}</p><button onclick="{window.location = '/';}">Home</button>`);

}
  
