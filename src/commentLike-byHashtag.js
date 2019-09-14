const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const rp = require('request-promise');
const S = require('string');
const inquirer = require('inquirer');
var fs = require('fs');
var request = require('request');

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
  message:'[>] Insert Hashtag:',
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
  message:'[>] Insert Sleep (In MiliSeconds)',
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

async function ngeComment(session, id, text){
  try {
    await Client.Comment.create(session, id, text);
    return true;
  } catch(e){
    return false;
  }
}

async function ngeLike(session, id){
  try{
    await Client.Like.create(session, id)
    return true;
  } catch(e) {
    return false;
  }
}

const doAction = async (session, params, text) => {
  if (params.hasLiked) {
           return chalk`{bold.blue Already Liked & Comment}`;
  }
  const task = [
  ngeLike(session, params.id),
  ngeComment(session, params.id, text)
  ];
  var [Like,Comment] = await Promise.all(task);
  Comment = Comment ? chalk`{bold.green Comment}` : chalk`{bold.red Comment}`;
  Like = Like ? chalk`{bold.green Like}` : chalk`{bold.red Like}`;
  return chalk`${Like},${Comment} ({cyan ${text}})`;
}


const doMain = async (User, hastag, sleep, accountsPerDelay) => {
  try{
    var text = fs.readFileSync("./commentText.txt","utf-8").split("|");
    console.log(chalk`{yellow \n [?] Try to Login . . .}`)
    var account = await doLogin(User);
    console.log(chalk`{green [!] Login Success!}`)
    const feed = await new Client.Feed.TaggedMedia(account.session, hastag);
    console.log(chalk`{cyan  [?] Like and Comment All Account In Hashtag: #${hastag}}`);
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
        console.log(chalk`{yellow \n [#][>][{cyan Account: ${User.username}}][{cyan Target: ${hastag}}] Delay For ${sleep} MiliSeconds [<][#] \n}`)
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

  [?] {bold.green Comment & Like | Using Hastag Target!}

  ——————————————————  [THANKS TO]  ————————————————————
  [✓] CODE BY CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  [✓] FIXING & TESTING BY SYNTAX (@officialputu_id)
  [✓] CCOCOT.CO | BC0DE.NET | NAONLAH.NET | WingkoColi
  [✓] SGB TEAM REBORN | Zerobyte.id | ccocot@bc0de.net 
  —————————————————————————————————————————————————————}
      `);
//ikiganteng
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
