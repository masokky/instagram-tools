const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const rp = require('request-promise');
const S = require('string');
const inquirer = require('inquirer');
const fs = require('fs');

const User = [
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
	name:'target',
	message:'[>] Insert Link Media:',
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
	message:'[>] Insert Sleep (MiliSeconds):',
	validate: function(value){
		value = value.match(/[0-9]/);
		if (value) return true;
		return 'Delay is number';
	}
}
]

const Login = async function(User){

	const Device = new Client.Device(User.username);
	const Storage = new Client.CookieMemoryStorage();
	const session = new Client.Session(Device, Storage);

	try {
		await Client.Session.create(Device, Storage, User.username, User.password)
		const account = await session.getAccount();
		return Promise.resolve({session,account});
	} catch (err) {
		return Promise.reject(err);
	}

}

const Target = async function(link){
	const url = link+'?__a=1'
	const option = {
		url: url,
		method: 'GET',
		json:true
	}
	try{
		const account = await rp(option);
		return Promise.resolve(account.graphql.shortcode_media.id);
	} catch (err){
		return Promise.reject(err);
	}

}

async function ngefollow(session,accountId){
	try {
		await Client.Relationship.create(session, accountId);
		return true
	} catch (e) {
		return false
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

const CommentAndLike = async function(session, accountId, text){
	var result;

	const feed = new Client.Feed.UserMedia(session, accountId);

	try {
		result = await feed.get();
	} catch (err) {
		return chalk`{bold.red ${err}}`;
	}

	if (result.length > 0) {
		if (result[0].params.hasLiked) {
        return chalk`{bold.blue Already Follow,Liked & Comment}`;
        }
		const task = [
		ngefollow(session, accountId),
		ngeComment(session, result[0].params.id, text),
		ngeLike(session, result[0].params.id)
		]
		const [Follow,Comment,Like] = await Promise.all(task);
		const printFollow = Follow ? chalk`{green Follow}` : chalk`{red Follow}`;
		const printComment = Comment ? chalk`{green Comment}` : chalk`{red Comment}`;
		const printLike = Like ? chalk`{green Like}` : chalk`{red Like}`;
		return chalk`{bold.green ${printFollow},${printComment},${printLike} [${text}]}`;
	}
	return chalk`{bold.cyan Timeline Kosong (SKIPPED)}`
};

const Followers = async function(session, id){
	const feed = new Client.Feed.AccountFollowers(session, id);
	try{
		const Pollowers = [];
		var cursor;
		do {
			if (cursor) feed.setCursor(cursor);
			const getPollowers = await feed.get();
			await Promise.all(getPollowers.map(async(akun) => {
				Pollowers.push(akun.id);
			}))
			cursor = await feed.getCursor();
		} while(feed.isMoreAvailable());
		return Promise.resolve(Pollowers);
	} catch(err){
		return Promise.reject(err);
	}
}

const Excute = async function(User, TargetUsername, Sleep, accountsPerDelay){
	try {
		console.log(chalk`{yellow \n [?] Try to Login . . .}`)
		const doLogin = await Login(User);
		console.log(chalk`{green  [!] Login Succsess, }{yellow [?] Try To Get Link & Media ID Target . . .}`)
		const getTarget = await Target(TargetUsername);
		console.log(chalk`{green  [!] ${TargetUsername} [${getTarget}]}`);
		const getFollowers = await Followers(doLogin.session, doLogin.account.id);
		console.log(chalk`{cyan  [?] Try to Follow, Comment, and Like Followers Target . . . \n}`)
		var Text = fs.readFileSync("./commentText.txt","utf-8").split("|");
		var TargetResult = await Client.Media.likers(doLogin.session, getTarget);
		TargetResult = _.chunk(TargetResult, accountsPerDelay);
		for (var i = 0; i < TargetResult.length; i++) {
			var timeNow = new Date();
			timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
			await Promise.all(TargetResult[i].map(async(akun) => {
				if (!getFollowers.includes(akun.id) && akun.params.isPrivate === false) {
					var ranText = Text[Math.floor(Math.random() * Text.length)];
					const ngeDo = await CommentAndLike(doLogin.session, akun.id, ranText)
					console.log(chalk`[{magenta ${timeNow}}] {bold.green [>]} @${akun.params.username} => ${ngeDo}`)
				} else {
					console.log(chalk`[{magenta ${timeNow}}] {bold.yellow [SKIPPED]}${akun.params.username} => PRIVATE OR ALREADY FOLLOWED`)
				}
			}));
			console.log(chalk`{yellow \n [#][>][{cyan Account: ${User.username}}][{cyan Target: ${TargetUsername}}] Delay For ${Sleep} MiliSeconds [<][#] \n}`);
			await delay(Sleep);
		}
	} catch (err) {
		console.log(err);
	}
}

console.log(chalk`
  {bold.cyan
  —————————————————— [INFORMATION] ————————————————————

  [?] {bold.green FFTMedia | Using Media/Link Target}

  ——————————————————  [THANKS TO]  ————————————————————
  [✓] CODE BY CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  [✓] FIXING & TESTING BY SYNTAX (@officialputu_id)
  [✓] CCOCOT.CO | BC0DE.NET | NAONLAH.NET | WingkoColi
  [✓] SGB TEAM REBORN | Zerobyte.id | ccocot@bc0de.net 
  —————————————————————————————————————————————————————}
      `);
inquirer.prompt(User)
.then(answers => {
	Excute({
		username:answers.username,
		password:answers.password
	},answers.target,answers.sleep,answers.accountsPerDelay);
})
