//Valorant colour scheme
//Dark Blue - #0f1923
//Red - #fb4959
//Big Text White - #d9d5cb
//Small Text Gray - #768079 !not sure
//Viper green - #0db25b

//Every item [lowest, highest] acceptable range. if the lowest is not specified then get the round down
const dispArray = [[0,8], //Iron 1 -> Silver 3
[6,11], // Bronze 3 -> Gold 3
[9,14], // Silver 1 -> plat 3
[12,15], // Plat 1 -> Dia 1
[13,16], // 
[14,17],
[15,18], 
[16,19], 
[17,20], 
[18,21]];

function calculateRankStuff(plArray) {
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

function getLowestandHighest(plArray) {
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

function estimateRrReduction() {
    //Todo
}

function playerListUpdated() {
    var plArray = [];
    
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

function doTest() {
    for (var i = 0; i < dispArray.length;i++) {
        console.log(i + " - Lowest: " + numToRankStr(dispArray[i][0]) + ", Highest: " + numToRankStr(dispArray[i][1]))
    }
    for (var i = 0; i < 22;i++) {
        console.log(i + numToRankStr(i))
    }
}



$(function() {
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
        var activeRankItem = $(this);
        var activePlayerListItem = $(this).parent().parent();

        var rankNum = activeRankItem.attr("ranknum");
        activePlayerListItem.css("background-image", "url('rank ims/" + rankNum +".png')");
        activePlayerListItem.attr("ranknum", rankNum);
        playerListUpdated();
    });
});