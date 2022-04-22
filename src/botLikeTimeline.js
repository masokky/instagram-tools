"use strict";
const { IgApiClient } = require("instagram-private-api");
const delay = require("delay");
const chalk = require("chalk");
const _ = require("lodash");
const inquirer = require("inquirer");
const ig = new IgApiClient();

const User = [
  {
    type: "input",
    name: "username",
    message: "[>] Insert Username:",
    validate: function (value) {
      if (!value) return "Can't Empty";
      return true;
    },
  },
  {
    type: "password",
    name: "password",
    message: "[>] Insert Password:",
    mask: "*",
    validate: function (value) {
      if (!value) return "Can't Empty";
      return true;
    },
  },
  {
    type: "input",
    name: "sleep",
    message: "[>] Insert Sleep (Seconds):",
    validate: function (value) {
      value = value.match(/[0-9]/);
      if (value) return true;
      return "Delay is number";
    },
  },
];

const Login = async (User) => {
  try {
    ig.state.generateDevice(User.username);
    const account = await ig.account.login(User.username, User.password);
    return Promise.resolve({ account });
  } catch (err) {
    return Promise.reject(err);
  }
};

const Like = async (media) => {
  try {
    if (media.has_liked) {
      return chalk`{bold.blue Already Liked}`;
    }
    await ig.media.like({
      mediaId: media.id,
      moduleInfo: "feed_timeline",
      d: 1,
    });
    return chalk`{bold.green Success Like}`;
  } catch (err) {
    return chalk`{bold.red Failed Like}`;
  }
};

const Excute = async (User, sleep) => {
  try {
    console.log(chalk`\n{yellow [?] Try to Login . . .}`);
    await Login(User);
    console.log(chalk`{green [!] Login Succsess}, {yellow [?] Try Like All Media in Feed / Timeline . . .\n}`);
    const timelineFeed = ig.feed.timeline();
    sleep = sleep * 1000;
    do {
      let medias = await timelineFeed.items();
      medias = _.chunk(medias, 1);
      for (let i = 0; i < medias.length; i++) {
        await Promise.all(
          medias[i].map(async (media) => {
            const likeMedia = await Like(media);
            console.log(chalk`[{bold.green Username:}] ${media.user.username}\n[{cyan ${media.id}}] => [${likeMedia}]`);
            await console.log(chalk`{yellow \n [#][>] Delay For ${sleep / 1000} Seconds [<][#] \n}`);
            await delay(sleep);
          })
        );
      }
    } while (timelineFeed.isMoreAvailable());
  } catch (err) {
    console.log(err);
  }
};

console.log(chalk`
 {bold.cyan
  —————————————————— [INFORMATION] ————————————————————

  [?] {bold.green Bot Like Timeline}

  ——————————————————  [+++++++++]  ————————————————————}
      `);

inquirer.prompt(User).then((answers) => {
  Excute(
    {
      username: answers.username,
      password: answers.password,
    },
    answers.sleep
  );
});
