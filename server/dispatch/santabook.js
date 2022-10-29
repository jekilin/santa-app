import axios from 'axios';
import logger from '../logger.js';

const BASE_URL = "https://raw.githubusercontent.com/alj-devops/santa-data/master/";


const getUsersList = async() => {
    try {
        const response = await axios.get(BASE_URL + 'users.json');
        logger.debug(response ? response.data : []);
        return response ? response.data : [];
    } catch (error) {
        logger.error(error);
    }
    return [];
};

const getUserProfileList = async() => {

    try {
        const response = await axios.get(BASE_URL + 'userProfiles.json');
        logger.debug(response ? response.data : []);
        return response ? response.data : [];
    } catch (error) {
        logger.error(error);
    }
    return [];
};

export const getRegisteredList = async() => {

    const _users = await getUsersList();
    const usersProfile = await getUserProfileList();
    const users = _users.map( user => ({username : user.username, userUid : user.uid }));

    const result = [
        ...[...users, ...usersProfile]
          .reduce(
            (acc, curr) => acc.set(curr.userUid, { ...acc.get(curr.userUid), ...curr }),
            new Map()
          )
          .values(),
        ];
      logger.debug(result);

    return result;

 };
