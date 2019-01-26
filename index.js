/**
 *
 * Node.JS Instagram Tools
 * 
 * Original author of this project is man who say himself as "CCOCOT"
 * He deleted his own repository, then several members of SGBTeam are taking care
 * of development and new features.
 * 
 * And this is collection of several developments that have been carried out so far
 *
 * All credits to contributor are written in their each file development
 * 
 * Thank to all of contributors for developing this project
 * Especially you :)
 *
 */

'use strict'

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const inquirer = require('inquirer');

const questionTools = [
  {
    type:"list",
    name:"Tools",
    message:"Select tools:",
    choices:
      [
        "[1]  Bot Like Timeline",
        "[2]  Follow Followers Target by People",
        "[3]  Follow Followers Target by Media",
        "[4]  Follow Followers Target by Hastag",
        "[5]  Follow Followers Target by Location",
        "[6]  Follow Followers Target by People - with DM",
        "[7]  Follow Followers Target by People - No Like",
	      "[8]  Follow Followers Target by People - No Comment & Like",
        "[9]  Repost Media Target by People",
        "[10] Repost Media Target by Hashtag",
        "[11] Repost Media Target by Link",
        "[12] Comment & Like Followers Target by People",
        "[13] Comment & Like Followers Target by Hashtag",
        "[14] Bom Like Target's Post",
        "[15] Bom Comment Target's Post",
        "[16] Unfollow Not Followback",
        "[17] Unfollow All Following",
        "[18] Delete All Media",
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
      case "[1]  Bot Like Timeline":
        await require("./src/botLikeTimeline.js");
        break;
      case "[2]  Follow Followers Target by People":
        await require("./src/FFTPeople.js");
        break;
      case "[3]  Follow Followers Target by Media":
        await require("./src/FFTMedia.js");
        break;
      case "[4]  Follow Followers Target by Hastag":
        await require("./src/FFTHashtag.js");
        break;
      case "[5]  Follow Followers Target by Location":
        await require("./src/FFTLocation.js");
        break;
      case "[6]  Follow Followers Target by People - with DM":
        await require("./src/FFTPeople-DM.js");
        break;
      case "[7]  Follow Followers Target by People - No Like":
        await require("./src/FFTPeople-noLike.js");
        break;
      case "[8]  Follow Followers Target by People - No Comment & Like":
        await require("./src/FFTPeople-noLikeComment.js");
        break;
      case "[9]  Repost Media Target by People":
        await require("./src/RMTPeople.js");
        break;
      case "[10] Repost Media Target by Hashtag":
        await require("./src/RMTHashtag.js");
        break;
      case "[11] Repost Media Target by Link":
        await require("./src/RMTLink.js");
        break;
      case "[12] Comment & Like Followers Target by People":
        await require("./src/commentLike-byPeople.js");
        break;
      case "[13] Comment & Like Followers Target by Hashtag":
        await require("./src/commentLike-byHashtag.js");
        break;
      case "[14] Bom Like Target's Post":
        await require("./src/bomLike.js");
        break;
      case "[15] Bom Comment Target's Post":
        await require("./src/bomComment.js");
        break;
      case "[16] Unfollow Not Followback":
        await require("./src/unfollowNotFollowBack.js");
        break;
      case "[17] Unfollow All Following":
        await require("./src/unfollowAllFollowing.js");
        break;
      case "[18] Delete All Media":
        await require("./src/deleteAllMedia.js");
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
  ╔╦╗┌─┐┌─┐┬  ┌─┐    © 2019
   ║ │ ││ ││  └─┐   SGBTeam 
   ╩ └─┘└─┘┴─┘└─┘   -------       
}
      `);

main()
