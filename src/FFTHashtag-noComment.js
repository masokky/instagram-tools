'use strict'

const Client = require('instagram-private-api').V1;
const chalk = require('chalk');
const delay = require('delay');
const _ = require('lodash');
const inquirer = require('inquirer');
const fs = require('fs');

const question = [
{
  type:'input',
  name:'username',
  message:'[>] Insert Username:',
  validate: function(value){
    if(!value) return 'Can\'t Empty';
    return true;
  }
},
{
  type:'password',
  name:'password',
  message:'[>] Insert Password:',
  mask:'*',
  validate: function(value){
    if(!value) return 'Can\'t Empty';
    return true;
  }
},
{
  type:'input',
  name:'hastag',
  message:'[>] Insert Hashtag (Without #):',
  validate: function(value){
    if(!value) return 'Can\'t Empty';
    return true;
  }
},
{
  type:'input',
  name:'accountsPerDelay',
  message:'[>] Number of Accounts per Delay:',
  validate: function(value){
    value = value.match(/[0-9]/);
    if (value) return true;
    return 'Use Number Only!';
  }
},
{
  type:'input',
  name:'sleep',
  message:'[>] Insert Sleep (In MiliSeconds):',
  validate: function(value){
    value = value.match(/[0-9]/);
    if (value) return true;
    return 'Delay is number';
  }
}
]


const doLogin = async (params) => {
  const Device = new Client.Device(params.username);
  const Storage = new Client.CookieMemoryStorage();
  const session = new Client.Session(Device, Storage);
  try {
    await Client.Session.create(Device, Storage, params.username, params.password)
    const account = await session.getAccount();
    return Promise.resolve({session,account});
  } catch (err) {
    return Promise.reject(err);
  }
}

const grabFollowers = async (session, id) => {
  const feed = new Client.Feed.AccountFollowers(session, id);
  try{
    feed.map = item => item.params;
    return Promise.resolve(feed.all());
  }catch (e){
    return Promise.reject(err);
  }
}

const doFollow = async (session, id) => {
  try {
    await Client.Relationship.create(session, id);
    return true;
  } catch (e) {
    return false;
  }
}

const doComment = async (session, id, text) => {
  try {
    await Client.Comment.create(session, id, text);
    return true;
  } catch(e){
    return false;
  }
}

const doLike = async (session, id) => {
  try{
    await Client.Like.create(session, id);
    return true;
  } catch(e) {
    return false;
  }
}

const doAction = async (session, params, text) => {
  const task = [
  doFollow(session, params.account.id),
  doLike(session, params.id),
  doComment(session, params.id, text)
  ];
  var [printFollow,printLike,printComment] = await Promise.all(task);
  printFollow = printFollow ? chalk`{bold.green Follow}` : chalk`{bold.red Follow}`;
  printComment = printComment ? chalk`{bold.green Comment}` : chalk`{bold.red Comment}`;
  printLike = printLike ? chalk`{bold.green Like}` : chalk`{bold.red Like}`;
  return chalk`{bold.green ${printFollow},${printComment},${printLike} [${text}]}`;
}

const doMain = async (User, hastag, sleep, accountsPerDelay) => {
  console.log(chalk`{yellow \n [?] Try to Login . . .}`)
  var account = await doLogin(User);
  console.log(chalk`{green  [!] Login Success!}`)
  try {
  const ranhastag = hastag[Math.floor(Math.random() * hastag.length)];
  var text = fs.readFileSync("./commentText.txt","utf-8").split("|");
  const feed = new Client.Feed.TaggedMedia(account.session, ranhastag);
  console.log(chalk`{cyan  [?] Try to Follow, Like and Comment All Account In Hashtag: #${ranhastag}}`);
    var cursor;
    var count = 0;
    do {
      if (cursor) feed.setCursor(cursor);
      count++;  
      var media = await feed.get();
      media = _.chunk(media, accountsPerDelay);
      for (media of media) {
        var timeNow = new Date();
        timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
        await Promise.all(media.map(async(media)=>{
          const ranText = text[Math.floor(Math.random() * text.length)];
          const resultAction = await doAction(account.session, media.params, ranText);
          console.log(chalk`[{magenta ${timeNow}}] {cyanBright @${media.params.account.username}} => ${resultAction}`);
        }))
        console.log(chalk`{yellow \n [#][>][{cyan Account: ${User.username}}][{cyan Target: #${hastag}}] Delay For ${sleep} MiliSeconds [<][#] \n}`)
        await delay(sleep);
      }
      cursor = await feed.getCursor();
    } while(feed.isMoreAvailable());
  } catch(e) {
    console.log(e);
  }
}

console.log(chalk`
  {bold.cyan
  —————————————————— [INFORMATION] ————————————————————

  [?] {bold.green FFTHashtag | Using Hastag Media Target!}

  ——————————————————  [THANKS TO]  ————————————————————
  [✓] CODE BY CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  [✓] FIXING & TESTING BY SYNTAX (@officialputu_id)
  [✓] CCOCOT.CO | BC0DE.NET | NAONLAH.NET | WingkoColi
  [✓] SGB TEAM REBORN | Zerobyte.id | ccocot@bc0de.net 
  —————————————————————————————————————————————————————}
      `);

inquirer.prompt(question)
.then(answers => {
  var hastag = answers.hastag.split('|');
  doMain({
    username:answers.username, 
    password:answers.password},hastag,answers.sleep,answers.accountsPerDelay);
})
.catch(e => {
  console.log(e);
})
