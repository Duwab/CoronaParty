import { Nicknames } from '../../reducers/nicknames';
import { ME } from '../../constants';

export default {
  getCurrentHumanId() {
    if (localStorage && !localStorage.humanId) {
      localStorage.humanId = getRandomHumanId();
    }

    return localStorage && localStorage.humanId;
  },
  getCurrentUserNickname() {
    if (localStorage && !localStorage.nickname) {
      localStorage.nickname = getRandomName();
    }

    return localStorage && localStorage.nickname;
  },
  setCurrentUserNickname(newNickname: string) {
    if (localStorage) {
      localStorage.nickname = newNickname;
    }

    return localStorage && localStorage.nickname;
  },
  getUserNickname(nicknames: Nicknames, userId: string): string {
    const nickname = nicknames[userId];
    if (nickname) {
      return nickname;
    }
    if (userId === ME) {
      return 'You';
    }
    return userId;
  },
};

function getRandomName() {
  const randomName = [
    'John Doe',
    'Smith',
    'Sponge Bob',
    'Rambo',
    'Luke',
    'Leia',
    'Xena',
    'Madonna',
  ];
  const i = Math.floor(Math.random() * randomName.length);
  return randomName[i];
}

function getRandomHumanId() {
  const random = Math.floor(Math.random() * 100000);
  return `human-${random}`;
}
