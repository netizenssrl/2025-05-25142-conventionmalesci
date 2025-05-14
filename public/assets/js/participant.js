let localStorageData = null, participant = null, socket = null, globalTimer = null;
let appStatus = {
    iTimerSeconds: 0,
    currentVotingSessionId: null,
    bVoted: false
};
let tweetsList = [];
$(document).ready(async function () {
    const localStorageData = getLocalStorage();
    if(localStorageData){
        const participantId = localStorageData.participantId;
        participant = await getParticipant(participantId);
        await postLoginAction();
    }
    else{
        $("#login-section").show().css("display", "flex");
    }
    $("#btn-login").click(async function () {
        let sEmail = $("#email-login").val();
        if (sEmail == "") {
            $(".login-error").text("Il campo email non può essere vuoto");
            $(".login-error").show();
        }
        else {
            if(validateEmail(sEmail)){
                participant = await loginParticipant(sEmail);
                if(participant){
                    $(".login-error").hide();
                    $("#email-login").val("");
                    localStorage.setItem("connessialfuturo", JSON.stringify({participantId: participant.id}));
                    await postLoginAction();
                }
            }
            else{
                $(".login-error").text("Inserisci un indirizzo email valido");
                $(".login-error").show();
            }            
        }
    });
    $("#profile-btn").click(function () {
        $("#logout-btn").toggle();
    });
    $("#logout-btn").click(async function () {
        await axios.patch(`/api/participants/logout/${participant.id}`);
        localStorage.removeItem("connessialfuturo");
        location.reload();
    });
    $("#btn-open-programma").click(function () {
        $("#modal-programma").fadeIn(150);
    });
    $("#btn-open-tweets").click(function(){
        $(".tweets-container-outer").hide();
        $(".tweets-container-outer[page='1']").show().css("display", "flex");
        setTimeout(function(){
            $(".tweets-container").scrollTop(0);
        }, 10);
        $("#modal-tweets").fadeIn(150);
    });
    $("#btn-open-new-tweet").click(function(){
        $(".tweets-container-outer").hide();
        $(".tweets-container-outer[page='2']").fadeIn(150).css("display", "flex");
    });
    $(".modal-back-btn").click(function(){
        $(".tweets-container-outer").hide();
        $(".tweets-container-outer[page='1']").fadeIn(150).css("display", "flex");
    });
    $("#tweet-textarea").on("input", function(){
        const text = $(this).val();
        if(text.length > 0){
            $("#btn-send-new-tweet").removeClass("disabled");
        }
        else{
            $("#btn-send-new-tweet").addClass("disabled");
        }
    });
    $("#btn-send-new-tweet").click(async function(){
        const tweetText = $("#tweet-textarea").val();
        const request = await axios.post("/api/tweets", {sTextOriginal: tweetText, participantId: participant.id, roomId: participant.roomId});
        tweetsList.unshift(request.data);
        fillTweetsList();
    });
    $(".modal-close-btn").click(function(){
        var btn = this;
        $(".modal:visible").fadeOut(150, function(){
            if($(btn).parents("#modal-tweets").length){
                $("#tweet-textarea").val("");
                $("#btn-send-new-tweet").addClass("disabled");
            }
        });
    });

    $("#btn-vote").click(async function(){
        const selectedAnswerId = parseInt($(".answer-choice.selected").attr("answerId"));
        $(this).addClass("disabled");
        appStatus.bVoted = true;
        const request = await axios.post("/api/participants/vote", {
            participantId: participant.id, 
            answerId: selectedAnswerId, 
            votingSessionId: appStatus.currentVotingSessionId, 
            roomId: participant.roomId
        });
    });
});

async function postLoginAction(){
    if(participant){
        initSocket();
        initTimer();
        $(".profile-email").text(participant.sEmail);
        $("body").addClass("logged-in");
        const response = await axios.get(`/api/tweets/participant/${participant.id}`);
        tweetsList = response.data;
        fillTweetsList();
    }
}

function getRoomId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('idroom');
}
function getLocalStorage(){
    const storedData = localStorage.getItem("connessialfuturo");
    if(storedData){
        const data = JSON.parse(storedData);
        return data;
    }
    else{
        return null;
    }
}

async function loginParticipant(sEmail) {
    try{
        const response = await axios.get(`/api/participants/login/?sEmail=${sEmail}`);
        return response.data;
    }
    catch(error){
        let errorMessage = "";
        if(error.response){
            errorMessage = error.response.data.error;
        }
        else if(error.request){
            errorMessage = error.request;
        }
        else{
            errorMessage = error.message;
        }
        $(".login-error").text(errorMessage);
        $(".login-error").show();
    }
}
async function getParticipant(participantId) {
    try{
        const response = await axios.get(`/api/participants/${participantId}`);
        return response.data;
    }
    catch(error){
        $(".app-section").hide();
        $("#login-section").fadeIn(150).css("display", "flex");
    }
}
function validateEmail(email) {
    // Regex per validare un'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function initSocket(){
    socket = io("/participant", {path: "/api/socket", query: {room: participant.roomId, participantId: participant.id}, reconnection: true});
    socket.on("connect", async function(){
        console.log("Connected to server");
        const lastStatus = await getLastStatus();
        if(lastStatus){
            setStatus(lastStatus);
        }
        else{
            $(".app-section").hide();
            $("#home-section").fadeIn(150).css("display", "flex");
        }
    });
    socket.on("status:set", setStatus);
    socket.on("status:reset", function(){
        $(".app-section").hide();
        appStatus.bVoted = false;
        appStatus.currentVotingSessionId = null;
        appStatus.iTimerSeconds = 0;
        $("#home-section").fadeIn(150).css("display", "flex");
    });
    socket.on("tweet:deleted", function(tweetId){
        tweetsList = tweetsList.filter(tweet => tweet.id != tweetId);
        fillTweetsList();
    });
    socket.on("disconnect", function(){
        console.log("Disconnected from server");
    });
}
function resetSocket(){
    if(socket){
        socket.disconnect();
    }
}

async function getLastStatus(){
    const room = participant.roomId ? participant.roomId : "all";
    const response = await axios.get(`/api/status/${room}`);
    return response.data;
}
function setStatus(status){
    if(status.bTweetEnabled){
        $("#btn-open-tweets").removeClass("disabled");
    }
    else{
        $("#btn-open-tweets").addClass("disabled");
        $("#modal-tweets").hide();
    }
    if(status.iTimerSeconds){
        appStatus.iTimerSeconds = status.iTimerSeconds;
    }
    else{
        if(status.currentQuestion){
            appStatus.iTimerSeconds = status.currentQuestion.iTimerSeconds;
        }
    }
    if(status.currentVotingSessionId){
        appStatus.currentVotingSessionId = status.currentVotingSessionId;
    }
    switch(status.sActiveCommandParticipant){
        case "Cover":
        case "QR Code":
        case "Partial Ranking Teams":
        case "Partial Ranking Rooms":
        case "Final Ranking Teams":
        case "Final Ranking Rooms":
            $(".app-section").not("#home-section").hide();
            $("#home-section").fadeIn(150).css("display", "flex");
            $(".logo-box").removeClass("question");
            break;
        case "Login":
            $(".app-section").hide();
            resetSocket();
            localStorage.removeItem("connessialfuturo");
            $("body").removeClass("logged-in");
            $(".profile-email").text("");
            $("#login-section").fadeIn(150).css("display", "flex");
            break;
        case "Question":
            appStatus.bVoted = false;
            $(".app-section").not("#question-section").hide();
            loadQuestion(status.currentQuestion, false);
            $("#question-section").fadeIn(150).css("display", "flex");
            $(".logo-box").addClass("question");
            resetTimer();
            break;
        case "Start Session":
            appStatus.bVoted = false;
            $(".app-section").not("#question-section").hide();
            loadQuestion(status.currentQuestion, true);
            $("#question-section").fadeIn(150).css("display", "flex");
            $(".logo-box").addClass("question");
            resetTimer();
            startTimer();
            break;
        case "Stop Session":
            $(".app-section").not("#question-section").hide();
            loadQuestion(status.currentQuestion, false);
            $("#question-section").fadeIn(150).css("display", "flex");
            $(".logo-box").addClass("question");
            stopTimer();
            break;
        case "Correct Answer":
        case "Results":
        case "Team Points":
        case "Room Points":
            $(".app-section").not("#question-section").hide();
            loadQuestion(status.currentQuestion, false);
            $("#question-section").fadeIn(150).css("display", "flex");
            $(".logo-box").addClass("question");
            resetTimer();
            $("#question-section").addClass("correct-answers");
            break;
    }
}

function fillTweetsList(){
    let tweetsListHtml = "";
    for( const tweet of tweetsList ){
        tweetsListHtml += `
            <div class="tweet">${tweet.sTextOriginal}</div>
        `;
    }
    $(".tweets-container").html(tweetsListHtml);
    $("#tweet-textarea").val("");
    $(".tweets-container-outer").hide();
    $(".tweets-container-outer[page='1']").fadeIn(150).css("display", "flex");
}
function addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
}
function initTimer(){
    globalTimer = new easytimer.Timer({precision: 'seconds', countdown: true});
    globalTimer.addEventListener("secondsUpdated", function (e) {
        $(".timer-box .minutes").text(addZeroBefore(globalTimer.getTimeValues().minutes));
        $(".timer-box .seconds").text(addZeroBefore(globalTimer.getTimeValues().seconds));
    });
    globalTimer.addEventListener("targetAchieved", function (e) {
        $(".timer-box").addClass("finished");
    });
}
function resetTimer(){
    globalTimer.stop();
    $(".timer-box").removeClass("finished");
    $(".timer-box .minutes").text(addZeroBefore(Math.floor(appStatus.iTimerSeconds / 60)));
    $(".timer-box .seconds").text(addZeroBefore(appStatus.iTimerSeconds % 60));
    $(".timer-box").show();
}
function startTimer(){
    globalTimer.start({countdown: true, startValues: {minutes: Math.floor(appStatus.iTimerSeconds / 60), seconds: appStatus.iTimerSeconds % 60}});
}
function stopTimer(){
    globalTimer.pause();
    $(".timer-box").removeClass("finished");
}
function loadQuestion(question, bVoteEnabled){
    $("#question-section").removeClass("correct-answers");
    $("#question-section .question-text-number").text(`DOMANDA ${question.iFrontEndOrder}`);
    $("#question-section .question-text").html(question.sText);
    if(!appStatus.bVoted){
        const answers = question.answers;
        let answersHtml = "";
        for(const answer of answers){
            answersHtml += `
                <div class="answer-choice" bCorrect="${answer.bCorrect}" answerId="${answer.id}">
                    <div class="answer-choice-inner">
                        <p class="answer-letter">${answer.sLetter}</p>
                        <div class="answer-text-box">
                            <p>${answer.sText}</p>
                        </div>
                    </div>
                </div>`;
        }
        $("#question-section .answer-box-container").html(answersHtml);
        if(bVoteEnabled){
            $(".answer-choice").click(function(){
                if(appStatus.bVoted){
                    return;
                }
                $(".answer-choice").removeClass("selected");
                $(this).addClass("selected");
                $("#btn-vote").removeClass("disabled");
                // scroll .qa-container to bottom
                $(".qa-container").animate({ scrollTop: $(".qa-container").prop("scrollHeight")}, 150);
            });
        }
        else{
            $("#btn-vote").addClass("disabled");
        }
    }
    else{

    }

}