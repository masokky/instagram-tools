const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const rp = require('request-promise');
const S = require('string');
const inquirer = require('inquirer');
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
  name:'mysyntx',
  message:'[>] Input Total of Amount You Want :',
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

function randomString1() {
	var chars = "abcdefghiklmnopqrstuvwxyz";
	var string_length = 5;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}


function randomString() {
	var chars = "0123456789abcdefghiklmnopqrstuvwxyz";
	var string_length = 5; //ubah sesuai keinginanmu
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

async function Ngecek(session, users){
		try{
    await Client.Account.searchForUser(session, users)
        return true;
  } catch(e) {
        return false;
  }	
}

const test = async function(session, accountId){
    const task = [
    Ngecek(session, accountId)
    ]
    const [Check] = await Promise.all(task);
    const printCheck = Check ? chalk`{red Not Available}` : chalk`{green Available}`;
    return chalk`{bold.green ${printCheck}}`;
};


const Excute = async function(User, Sleep, mysyntx){
    try {
         console.log(chalk`{yellow \n [?] Try to Login . . .}`)
    const doLogin = await Login(User);
    console.log(chalk`{green  [!] Login Succsess, }{yellow [?] Try To Check Random Username . . . \n}`)
	for (var i = 0; i <mysyntx; i++) {
	var timeNow = new Date();
	timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
	var iki = randomString();
    const getTarget = await test(doLogin.session, iki);
	var fs = require('fs');fs.appendFile('log.txt', `[Username: ${iki}] => ${getTarget} \n`, function (err) {
  if (err) {
    // append failed
  } else {
    // done
  }
})
	console.log(chalk`\n [{magenta ${timeNow}}] {bold.green [>]} [Username: ${iki}] => ${getTarget}`)
	console.log(chalk`{yellow \n [#][>] Delay For ${Sleep} MiliSeconds [<][#] \n}`);
	await delay(Sleep);
	}
	} catch (err){
		console.log(err);
	}
}
console.log(chalk`
  {bold.cyan
  —————————————————— [INFORMATION] ————————————————————

  [?] {bold.green Check Username Account *AUTO!}
  [?] {bold.green Save Result to Log.txt}

  ——————————————————  [THANKS TO]  ————————————————————
  [✓] CODE BY CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  [✓] FIXING & TESTING BY SYNTAX (@officialputu_id)
  [✓] CCOCOT.CO | BC0DE.NET | NAONLAH.NET | WingkoColi
  [✓] SGB TEAM REBORN | Zerobyte.id | ccocot@bc0de.net 
  —————————————————————————————————————————————————————}
      `);
//ikiganteng
inquirer.prompt(User)
.then(answers => {
  Excute({
    username:answers.username,
    password:answers.password
  },answers.sleep,answers.mysyntx);
})
