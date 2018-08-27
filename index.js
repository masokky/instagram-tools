'use strict'

//const insta = require('./func.js'); 
const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const inquirer = require('inquirer');
//const Spinner = require('cli-spinner').Spinner;

const questionTools = [
  {
    type:"list",
    name:"Tools",
    message:"Select tools:",
    choices:
      [
        "[1]  Botlike v1",
        "[2]  Botlike v2",
        "[3]  Delete All Media",
        "[4]  Unfollow All Following",
        "[5]  Unfollow Not Followback",
        "[6]  Follow Followers Target",
        "[7]  Follow Account By Media",
        "[8]  Follow Account By Hastag",
        "[9]  Follow Account By Location",
        "[10] Follow Followers Target No Like",
	      "[11] Follow Followers Target No Comment & Like",
        "[12] Bom Like Post Target",
	      "[13] Bom Komen Post Target",
        "[14] Repost Media Target by People",
        "[15] Repost Media Target by Hashtag",
        ""
      ] 
  }
]

const main = async () => {
  var spinner;
  try{
    var toolChoise = await inquirer.prompt(questionTools);
    toolChoise = toolChoise.Tools;
    switch(toolChoise){
      case "[1]  Botlike v1":
        const botlike = require('./botlike.js');
        await botlike();
        break;

      case "[2]  Botlike v2":
        const botlike2 = require('./botlike2.js');
        await botlike2();
        break;

      case "[3]  Delete All Media":
        const dellallphoto = require('./dellallphoto.js');
        await dellallphoto();
        break;

      case "[4]  Unfollow All Following":
        const unfollall = require('./unfollall.js');
        await unfollall();
        break;

      case "[5]  Unfollow Not Followback":
        const unfollnotfollback = require('./unfollnotfollback.js');
        await unfollnotfollback();
        break;

      case "[6]  Follow Followers Target":
        const fftauto = require('./fftauto.js');
        await fftauto();
        break;

      case "[7]  Follow Account By Media":
        const flmauto = require('./flmauto.js');
        await flmauto();
        break;

      case "[8]  Follow Account By Hastag":
        const fah = require('./fah.js');
        await fah();
        break;

      case "[9]  Follow Account By Location":
        const flaauto = require('./flaauto.js');
        await flaauto();
        break;
		
	    case "[10] Follow Followers Target No Like":
        const fft = require('./fft.js');
        await fft();
        break;

	    case "[11] Follow Followers Target No Comment & Like":
        const fftold = require('./fftold.js');
        await fftold();
        break;
	    case "[12] Bom Like Post Target":
        const bomlike = require('./bomlike.js');
        await bomlike();
        break;
	    case "[13] Bom Komen Post Target":
        const bomkomen = require('./bomkomen.js');
        await bomkomen();
        break;
      case "[14] Repost Media Target by People":
        const RMTPeople = require('./RMTPeople.js');
        await RMTPeople();
        break;
      case "[15] Repost Media Target by Hashtag":
        const RMTHashtag = require('./RMTHashtag.js');
        await RMTHashtag();
        break;
      default:
        console.log('\nERROR:\n[?] Aw, Snap! \n[!] Something went wrong while displaying this program!\n[!] Please try again!');
    }
  } catch(e) {
    //spinner.stop(true);
    //console.log(e);
  }
}

console.log(chalk`
  {bold.cyan
  ╦┌┐┌┌─┐┌┬┐┌─┐┌─┐┬─┐┌─┐┌┬┐
  ║│││└─┐ │ ├─┤│ ┬├┬┘├─┤│││
  ╩┘└┘└─┘ ┴ ┴ ┴└─┘┴└─┴ ┴┴ ┴
  ╔╦╗┌─┐┌─┐┬  ┌─┐    © 2018
   ║ │ ││ ││  └─┐   SGBTeam 
   ╩ └─┘└─┘┴─┘└─┘   -------       
}
      `);

main()
