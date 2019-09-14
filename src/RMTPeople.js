const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const rp = require('request-promise');
const S = require('string');
const inquirer = require('inquirer');
const request = require('request');
const Promise = require('bluebird');
const fs = require('fs');
const coverDir = "./src/cover";

const fileType = {"1":"photo","2":"video","8":"album"};
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
  message:'[>] Insert Username Target (Without @[at]):',
  validate: function(value){
    if(!value) return 'Can\'t Empty';
    return true;
  }
},
{
  type:'input',
  name:'startFrom',
  message:'[>] Start from:',
  validate: function(value){
    if(isNaN(value) || (value <= 0)) return 'Invalid value!';
    return true;
  }
},
{
	type:'input',
	name:'customCaption',
	message:'[>] Use Custom Caption Mode? (Y/N)',
	validate: function(value){
		if(['Y','y','N','n'].indexOf(value) === -1) return 'Only \'Y\' or \'N\' characters are allowed!';
		return true;
	}
},
{
  type:'input',
  name:'sleep',
  message:'[>] Insert Sleep (Minutes):',
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
const Target = async function(username){
  const url = 'https://www.instagram.com/'+username+'/'
  const option = {
    url: url,
    method: 'GET'
  }
  try{
    const account = await rp(option);
    const data = S(account).between('<script type="text/javascript">window._sharedData = ', ';</script>').s
    const json = JSON.parse(data);
    if (json.entry_data.ProfilePage[0].graphql.user.is_private) {
      return Promise.reject('Target is private Account');
    } else {
      const id = json.entry_data.ProfilePage[0].graphql.user.id;
      const followers = json.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
      return Promise.resolve({id,followers});
    }
  } catch (err){
    return Promise.reject(err);
  }
}

async function postPhoto(session, media, caption){
	try {
		await Client.Upload.photo(session, media)
			.then(function(upload) {
				return Client.Media.configurePhoto(session, upload.params.uploadId, caption);
			})
			return true;
	}catch(e){
		return e;
	}
}
async function postVideo(session, media, thumbnail, caption){
	try {
		await Client.Upload.video(session, media, thumbnail)
			.then(function(upload) {
				return Client.Media.configureVideo(session, upload.uploadId, caption, upload.durationms);
		});
			return true;
	}catch(e){
		return e;
	}
}
async function postAlbum(session, medias, caption){
	try {
		await Client.Upload.album(session, medias)
	    	.then(function(payload) {
	        return Client.Media.configureAlbum(session, payload, caption);
	    });
	    	return true;
	}catch(e){
		return e;
	}
}
async function urlToBuffer(url){
	return new Promise(function(resolve,reject){
		request({url,encoding:null},(err,resp,buffer)=>{
			if(buffer)
				resolve(buffer)
			else
				reject(err);
		})
	})
}
async function downloadCover(url,filename){
	return await request(url).pipe(await fs.createWriteStream(coverDir+'/'+filename));
}
async function deleteCover(removeSelf) {
    let dirPath = coverDir;
    if (removeSelf === undefined)
    	removeSelf = true;
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
    	for (var i = 0; i < files.length; i++) {
        	var filePath = dirPath + '/' + files[i];
        	if (fs.statSync(filePath).isFile())
        		fs.unlinkSync(filePath);
        	else
        		deleteCover(filePath);
    }
    if (removeSelf)
      fs.rmdirSync(dirPath);
};
async function parseTag(data,text){
  text = text.replace(/{target}/g,"@"+data.target);
  text = text.replace(/{me}/g,"@"+data.me);
  text = text.replace(/{originalCaption}/g,data.originalCaption);
  return text;
}
async function repostMedia(session, mediaType, media, caption, mediaIndex){
	let repost;
	let timeNow = new Date();
	timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
	switch(mediaType){
		case 1:
			repost = await postPhoto(session, media["data"], caption);
			break;
		case 2:
			repost = await postVideo(session, media["data"], media["thumbnail"], caption);
			break;
		case 8:
			repost = await postAlbum(session, media, caption);
			break;
	}
	mediaType = fileType[mediaType];
	repost = repost ? chalk `{green ${mediaType}}` : chalk `{red ${mediaType}}`;
	return chalk `\n [{magenta ${timeNow}}] {bold.green [>] Media Index: ${mediaIndex} -> Repost} ${repost}`;
}
const Excute = async function(User, target, startFrom, customCaption, Sleep){
  try {
  	Sleep = Sleep*60*1000;
  	const customCaptionText = fs.readFileSync("./customCaption.txt","utf-8");
    console.log(chalk`{yellow \n [?] Trying to Login . . .}`)
    const doLogin = await Login(User);
    console.log(chalk`{green  [!] Login Success, }{yellow [?] Trying to Get ID . . .}`)
    const getTarget = await Target(target);
    console.log(chalk`{green  [!] Success Get ID, Start Trying to Repost Media . . .}`);
   	var cursor;
 	  var feed = await new Client.Feed.UserMedia(doLogin.session, getTarget.id);
    var currentMediaIndex = startFrom;
    var mediaIndex = 0;
    var post = false;
 	  do {
 	  	if(cursor) feed.setCursor(cursor);
 	  	var result = await feed.get();
 	  	result = _.chunk(result,1);
 	  	for(var i=0;i<result.length;i++){
 	  		await Promise.all(result[i].map(async(akun)=>{
          mediaIndex++;
          if(mediaIndex == currentMediaIndex){
            post = true;
            currentMediaIndex++;
          }
          if(post){
           var media = new Array();
 	  			 let type = akun.media_type;
 	  			 let caption = akun.caption.text ? akun.caption.text : "";
 	  			 if(customCaption){
              var data = {target:akun.user.username,
                          me:User.username,
                          originalCaption:caption};
              caption = await parseTag(data,customCaptionText);
            }
 	  			 switch(type){
 	  			 	case 1:
 	  			 		media["data"] = await urlToBuffer(akun.image_versions2[0].url);
 	  			 		break;
 	  			 	case 2:
 	  			 		media["data"] = await urlToBuffer(akun.video_versions[0].url);
 	  			 		var filename = new Date().getTime()+".jpg";
 	  			 		const dlCover = await downloadCover(akun.image_versions2[0].url,filename);
 	  			 		media["thumbnail"] = coverDir+"/"+filename;
 	  			 		break;
 	  			 	case 8:
 	  			 		let carouselMedia = akun.carousel_media;
 	  			 		for(let i=0;i<carouselMedia.length;i++){
 	  			 			let m = new Array();
 	  			 			m["type"] = fileType[carouselMedia[i].media_type];
 	  			 			if(m["type"]=="photo"){
                    m["size"] = [1080,1080];
 	  			 				// m["size"] = [carouselMedia[i]._params.images[0].width,carouselMedia[i]._params.images[0].height];
 	  			 				m["data"] = await urlToBuffer(carouselMedia[i].image_versions2[0].url);
 	  			 			}else{
 	  			 				var filename = new Date().getTime()+".jpg";
 	  			 				const dlCover = await downloadCover(carouselMedia[i].image_versions2[0].url,filename);
 	  			 				m["size"] = [720,720];
                    // m["size"] = [carouselMedia[i]._params.videos[0].width,carouselMedia[i]._params.videos[0].height];
 	  			 				m["data"] = await urlToBuffer(carouselMedia[i].video_versions[0].url);
 	  			 				m["thumbnail"] = coverDir+"/"+filename;
 	  			 			}
 	  			 			await media.push(m);
 	  			 		}
 	  			 		break;
 	  			 }
 	  			 let repost = await repostMedia(doLogin.session, type, media, caption, mediaIndex);
 	  			 if(filename) await deleteCover(false);
 	  			 console.log(repost);
           console.log(chalk`{yellow \n [#][>][{cyan Account: ${User.username}}][{cyan Target: ${target}}] Delay For ${Sleep/60/1000} Minutes [<][#] \n}`);
           await delay(Sleep);
          }
        }));
 	  	}
 	  	cursor = await feed.getCursor();
 	  }while(feed.isMoreAvailable());	
  } catch (err) {
	    console.log(err);
  }
}
console.log(chalk`
  {bold.cyan
  —————————————————— [INFORMATION] ————————————————————

  [!] {bold.green RMTPeople | Repost Media Target By People}

  —————————————————————————————————————————————————————
  
  [?] Auto Repost Instagram Media Using People Target

  [!] Edit {bold.yellow customCaption.txt} file before use
      custom caption mode.
  [!] If you choose 'yes' for using custom caption mode,
      repost will use caption text from {bold.yellow customCaption.txt} file.
  [!] Otherwise, if you choose 'no' repost will use original
      caption from each media target.

  ——————————————————  [THANKS TO]  ————————————————————
  [✓] RMT BY MAS OKKY (@masokky_)
  [✓] CODE BY CYBER SCREAMER CCOCOT (ccocot@bc0de.net)
  [✓] FIXING & TESTING BY SYNTAX (@officialputu_id)
  [✓] CCOCOT.CO | BC0DE.NET | NAONLAH.NET | WingkoColi
  [✓] SGB TEAM REBORN | Zerobyte.id | ccocot@bc0de.net 
  —————————————————————————————————————————————————————
}
      `);
inquirer.prompt(User)
.then(answers => {
  switch(answers.customCaption){
  	case 'Y':
  	case 'y':
  		answers.customCaption = true;
  		break;
  	case 'N':
  	case 'n':
  		answers.customCaption = false;
  		break;
  }
  Excute({
    username:answers.username,
    password:answers.password
  },answers.target,parseInt(answers.startFrom),answers.customCaption,answers.sleep);
})
