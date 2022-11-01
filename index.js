
//Get relevent data from valorant api
//this includes:
//

var g_compTiers;
var currentCompIndex=4;

const dispArray = [[0,8], //Iron 1 -> Silver 3 //PROBABLY WRONG
[6,11], // Silver 1 -> Gold 3
[9,14], // Gold 1 -> Plat 3
[12,15], // Plat 1 -> Dia 1
[13,16], // Plat 2 -> Dia 2
[14,17], // Plat 3 -> Dia 3
[15,18], // Dia 1 -> Ace 1
[16,19], // Dia 2 -> Ace 2
[17,20], // Dia 3 -> Ace 3
[18,21], // Ace 1 -> Imm 1
[19, 22], // Ace 2 -> Imm 2
[20, 23], // Ace 3 -> Imm 3
[21, 24] // Imm 1 -> R 1
]; // needs check 

function canPlayersPlay(lowest, highest) {
    var indextouse;
    dispArray.forEach((e,i) => {
        if ((lowest >= e[0]) && (lowest < e[1])) {
            indextouse = i;
        } 
    });
    if (highest > dispArray[indextouse][1]) {
        //too high
        return false;
    } else {
        //all good
        return true;
    }
}

function calculateRankStuff(plArray) { //not dynamic (NEEDS REWORK)
    //returns [canplay, comments, rr reduction if applicable]
    var output = ["",[],0];
    switch (plArray.length) {
        case 0:
            break;
        case 4:
            output[0] = false;
            output[1].push("4 Stacks are not allowed");
            break;
        case 1:
            break;
        case 2:
        case 3:
            {
                const lowhigh = getLowestandHighest(plArray);
                const disp = lowhigh[1] - lowhigh[0];

                canPlay = canPlayersPlay(lowhigh[0], lowhigh[1]);
                output[0] = canPlay;
                if (canPlay == true) {
                    output[1].push("Your all set, no restrictions");
                } else if (canPlay == false) {
                    output[1].push("Rank disparity is too high");
                }
                
            }
            break;
        case 5:
            {
                output[0] = true;
                output[1].push("5 Stacks have no rank restrictions, however you may be subject to RR reduction");
                const lowhigh = getLowestandHighest(plArray);
            }
            break; 
    }
    return output;
}

function getLowestandHighest(plArray) { //not dynamic
    var lowest = 22;
    var highest = 0;
    plArray.forEach(e => {
        var inte = parseInt(e);
        if (inte < lowest) {
            lowest = inte;
        }
        if (inte > highest) {
            highest = inte;
        }
    });
    return [lowest, highest];
}


function numToRankStr(rankNum) {
    var prefix;
    var sufix = (rankNum % 3)+1;
    switch (Math.floor(rankNum/3)) {
        case 0:
            prefix = "Iron";
            break;
        case 1:
            prefix = "Bronze";
            break;
        case 2:
            prefix = "Silver";
            break;
        case 3:
            prefix = "Gold";
            break;
        case 4:
            prefix = "Platinum";
            break;
        case 5:
            prefix = "Diamond";
            break;
        case 6:
            prefix = "Ascendant";
            break;
        case 7:
            prefix = "Imortal";
            break;
        case 8:
            prefix = "Radient";
            break;
    }
    return prefix + " " + sufix;
}

async function getValorantApiValues() {
    const compSeasonsRAW = await fetch('https://valorant-api.com/v1/seasons/competitive'); //probably dont need this
    const compTiersRAW = await fetch('https://valorant-api.com/v1/competitivetiers');
    const compSeasons = await compSeasonsRAW.json()
    const compTiers = await compTiersRAW.json()

    console.log(compSeasons)
    console.log(compTiers.data[compTiers.data.length-1])
    g_compTiers = compTiers.data;
}

function constructCompTiersHTMLDropdown() {
    //TODO
}

function costructEpisodeOptions() {

}

function constructActOptions() {
    
}

function constructCompTiersRankPicker(tierIndex) {
    console.log(g_compTiers)
    var rankPickerDiv = $('<div class="rankpicker hide">')
    var realCounter = 0;
    var objTHing = []
    for (var i = 0; i < g_compTiers[tierIndex].tiers.length; i++) {
        var openObj = g_compTiers[tierIndex].tiers[i];
        if (openObj.division == "ECompetitiveDivision::INVALID" || openObj.division == "ECompetitiveDivision::UNRANKED") {
            continue;
        }
        if (realCounter % 3 == 0) {
            objTHing.push([])
        }
        objTHing[objTHing.length-1].push(openObj)
       



        //rankPickerDiv.append($(`<img class="rankitem" src="${openObj.largeIcon}" alt="${openObj.tierName}" ranknum="${realCounter}" rawnum="${i}">`))
        realCounter++;
    }
    var sndCounter = 0;
    objTHing.forEach((item) => {
        var obj = $('<div class="rankdiv">')
        item.forEach((itemV) => {
            obj.append($(`<img class="rankitem" src="${itemV.largeIcon}" alt="${itemV.tierName}" ranknum="${sndCounter}" rawnum="${itemV.tier}">`))
            sndCounter++;
        })
        rankPickerDiv.append(obj)
    })
    

    console.log(rankPickerDiv)
    return rankPickerDiv;
}

function remakeAllRankPickers(tierIndex) {
    const rankPickerHTML = constructCompTiersRankPicker(tierIndex)
    $(".rankpicker").replaceWith(rankPickerHTML)
    assignEvents();
}

function playerListUpdated() {
    //This funtion performs rank analysis on the ranks
    // As follows:
    // get ranks from page
    // claculate rank stuff from ^ data
    // Inject back into page
    

    var plArray = [];
    // Get ranknum from HTML
    const playerListItems = $(".playerlistitem");
    for (var i = 0; i < playerListItems.length; i++) {
        var activePlayerListItem = $(playerListItems[i]);

        if ((activePlayerListItem.attr("ranknum")) && (activePlayerListItem.attr("ranknum") != -1)) {
            plArray.push(parseInt(activePlayerListItem.attr("ranknum")));
        }
    }
    var playerlist = $(".playerlist");
    if (plArray.length>1) {
        var rankStuff = calculateRankStuff(plArray);
        var outp = $("#outputp");
        outp.text(rankStuff[1]);
        if (rankStuff[0] == false) {
            playerlist.css("background-color", "#fb4959");
        } else if (rankStuff[0] == true){
            playerlist.css("background-color", "#097e40");
        } else {
            playerlist.css("background-color", "");
        }
    } else {
        playerlist.css("background-color", "");
    }

}

function assignEvents() {
    $(".playerlistitem").on("click", function() {
        var activePlayerListItem = $(this);
        var rankPickerobj = activePlayerListItem.children(".rankpicker");
        if (rankPickerobj.hasClass("hide")) {
            rankPickerobj.removeClass("hide");
            activePlayerListItem.css("background-image", "")
        } else {
            rankPickerobj.addClass("hide");
            
        }
    });
    $(".rankitem").on("click", function() {
        console.log("BEANS")
        var activeRankItem = $(this);
        var activePlayerListItem = $(this).parent().parent().parent();

        var rankNum = activeRankItem.attr("ranknum");
        var rawNum = activeRankItem.attr("rawnum");
        console.log(g_compTiers[currentCompIndex].tiers)
        activePlayerListItem.css("background-image", `url(${g_compTiers[currentCompIndex].tiers[rawNum].largeIcon})`);
        activePlayerListItem.attr("ranknum", rankNum);
        playerListUpdated();
    });
}



function testRankPrint() {
    dispArray.forEach((item,index) => {
        console.log(`${item} => [${numToRankStr(item[0])}, ${numToRankStr(item[1])}]`)
    })
}



async function firstRun() {
    await getValorantApiValues()
    remakeAllRankPickers(4)
    testRankPrint()
}

firstRun()