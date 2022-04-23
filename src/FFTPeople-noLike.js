const { IgApiClient } = require("instagram-private-api");
const delay = require("delay");
const chalk = require("chalk");
const _ = require("lodash");
const inquirer = require("inquirer");
const fs = require("fs");
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
    name: "target",
    message: "[>] Insert Username Target (Without @[at]):",
    validate: function (value) {
      if (!value) return "Can't Empty";
      return true;
    },
  },
  {
    type: "input",
    name: "accountsPerDelay",
    message: "[>] Number of Accounts per Delay:",
    validate: function (value) {
      value = value.match(/[0-9]/);
      if (value) return true;
      return "Use Number Only!";
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

const botFollow = async (userId) => {
  try {
    await ig.friendship.create(userId);
    return true;
  } catch (e) {
    return false;
  }
};

const botComment = async (mediaId, text) => {
  try {
    await ig.media.comment({
      mediaId: mediaId,
      text: text,
    });
    return true;
  } catch (e) {
    return false;
  }
};

const instagramBot = async (userId, text) => {
  const userFeed = await ig.feed.user(userId);
  const getUserItems = await userFeed.items();

  if (getUserItems.length > 0) {
    const latestPost = getUserItems[0];
    const botTask = [botFollow(userId), botComment(latestPost.id, text)];
    const [Follow, Comment] = await Promise.all(botTask);
    let botFollowStatus = Follow ? chalk`{green Follow}` : chalk`{red Follow}`;
    let botCommentStatus = Comment ? chalk`{green Comment}` : chalk`{red Comment}`;
    return chalk`{bold.green ${botFollowStatus},${botCommentStatus}, [${text}]}`;
  }
  return chalk`{bold.white Empty Timeline Feed (SKIPPED)}`;
};

const getAllItemsFromFeed = async (feed) => {
  let items = [];
  do {
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable());
  return items;
};

const Excute = async (User, TargetUsername, Sleep, accountsPerDelay) => {
  try {
    Sleep *= 1000;
    console.log(chalk`{yellow \n [?] Try to Login . . .}`);
    await Login(User);
    console.log(chalk`{green  [!] Login Succsess, }{yellow [?] Try To Get ID & Followers Target . . .}`);
    const getTarget = await ig.user.info(await ig.user.getIdByUsername(TargetUsername));
    console.log(chalk`{green  [!] ${TargetUsername}: [${getTarget.pk}] | Followers: [${getTarget.follower_count}]}`);
    const myFollowersFeed = await ig.feed.accountFollowers(ig.state.cookieUserId);
    const getMyFollowers = await getAllItemsFromFeed(myFollowersFeed);
    console.log(chalk`{cyan  [?] Try to Follow, Comment, and Like Followers Target . . . \n}`);
    const targetFollowersFeed = await ig.feed.accountFollowers(getTarget.pk);
    do {
      let getTargetFollowers = await targetFollowersFeed.items();
      getTargetFollowers = _.chunk(getTargetFollowers, accountsPerDelay);
      for (let i = 0; i < getTargetFollowers.length; i++) {
        var timeNow = new Date();
        timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
        await Promise.all(
          getTargetFollowers[i].map(async (account) => {
            if (!getMyFollowers.includes(account.pk) && account.is_private === false) {
              let commentTexts = fs.readFileSync("commentText.txt", "utf8").split("|");
              let randomCommentTexts = commentTexts[Math.floor(Math.random() * commentTexts.length)];
              const runBot = await instagramBot(account.pk, randomCommentTexts);
              console.log(chalk`[{magenta ${timeNow}}] {bold.green [>]}${account.username} => ${runBot}`);
            } else {
              console.log(chalk`[{magenta ${timeNow}}] {bold.yellow [SKIP]}${account.username} => PRIVATE OR ALREADY FOLLOWED`);
            }
          })
        );
        console.log(chalk`{yellow \n [#][>][{cyan Account: ${User.username}}][{cyan Target: @${TargetUsername}}] Delay For ${Sleep / 1000} Seconds [<][#] \n}`);
        await delay(Sleep);
      }
    } while (targetFollowersFeed.isMoreAvailable());
  } catch (err) {
    console.log(err);
  }
};

console.log(chalk`
  {bold.cyan
  —————————————————— [INFORMATION] ————————————————————

  [?] {bold.green FFTPeople | Follow & Comment Only!}

  ——————————————————  [+++++++++]  ————————————————————}
      `);
inquirer.prompt(User).then((answers) => {
  Excute(
    {
      username: answers.username,
      password: answers.password,
    },
    answers.target,
    answers.sleep,
    answers.accountsPerDelay
  );
});
