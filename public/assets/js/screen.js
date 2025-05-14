const roomId = getRoomId() ? parseInt(getRoomId()) : "all";
let socket = null, globalTimer = null, timerSeconds = 0, currentVotingSessionId = null;
let audioTimer = new Audio("/assets/sounds/timer.mp3");
let audioTimerElapsed = new Audio("/assets/sounds/gong.mp3");
let audioRight = new Audio("/assets/sounds/right.mp3");
let audioPercentage = new Audio("/assets/sounds/percentage.mp3");
$(document).ready(async function() {
    if(roomId !== "all"){
        const response = await axios.get(`/api/rooms/${roomId}`);
        $(".room-name").text(response.data.sName);
        $("body").attr("room", roomId);
    }
    initSocket();
    initTimer();
    $("body.muted").click(function(){
        $(this).removeClass("muted");
        loadAudio();
    });
    const lastStatus = await getLastStatus();
    if(lastStatus){
        setStatus(lastStatus);
    }
    else{
        $("#cover-section").fadeIn(150).css("display", "flex");
    }
});
function getRoomId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('idroom');
}
function loadAudio(){
    audioTimer.load();
    audioTimer.currentTime = 0;
    audioTimer.pause();

    audioTimerElapsed.load();
    audioTimerElapsed.currentTime = 0;
    audioTimerElapsed.pause();

    audioRight.load();
    audioRight.currentTime = 0;
    audioRight.pause();

    audioPercentage.load();
    audioPercentage.currentTime = 0;
    audioPercentage.pause();
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
        audioTimer.currentTime = 0;
        audioTimer.pause();
        audioTimerElapsed.play();
    });
}
function resetTimer(){
    globalTimer.stop();
    $(".timer-box").removeClass("finished");
    $(".timer-box .minutes").text(addZeroBefore(Math.floor(timerSeconds / 60)));
    $(".timer-box .seconds").text(addZeroBefore(timerSeconds % 60));
    $(".timer-box").show();
}
function startTimer(){
    globalTimer.start({countdown: true, startValues: {minutes: Math.floor(timerSeconds / 60), seconds: timerSeconds % 60}});
    audioTimer.play();
}
function stopTimer(){
    globalTimer.pause();
    audioTimer.currentTime = 0;
    audioTimer.pause();
    $(".timer-box").removeClass("finished");
}
function initSocket(){
    socket = io("/screen", {path: "/api/socket", query: {room: roomId}, reconnection: true});

    socket.on("connect", function(){
        console.log("Connected to server");
    });

    socket.on("status:set", setStatus);

    socket.on("status:reset", function(){
        currentVotingSessionId = null;
        $("#cover-section").fadeIn(150).css("display", "flex");
    });

    socket.on("disconnect", function(){
        console.log("Disconnected from server");
    });
}
async function getLastStatus(){
    const response = await axios.get(`/api/status/${roomId}`);
    return response.data;
}
async function setStatus(status){
    if(status.iTimerSeconds){
        timerSeconds = status.iTimerSeconds;
    }
    else{
        if(status.currentQuestion){
            timerSeconds = status.currentQuestion.iTimerSeconds;
        }
    }
    switch(status.sActiveCommandScreen){
        case "Cover":
            activateSection("#cover-section");
            break;
        case "QR Code":
            activateSection("#interactive-session-section");
            break;
        case "Question":
            loadQuestion(status.currentQuestion, false);
            activateSection("#question-section");
            resetTimer();
            break;
        case "Start Session":
            loadQuestion(status.currentQuestion, false);
            activateSection("#question-section");
            startTimer();
            break;
        case "Stop Session":
            loadQuestion(status.currentQuestion, false);
            activateSection("#question-section");
            stopTimer();
            break;
        case "Correct Answer":
            loadQuestion(status.currentQuestion, false);
            activateSection("#question-section");
            $("#question-section").addClass("correct-answers");
            $("#question-section").addClass("animate");
            setTimeout(function(){
                $("#question-section").removeClass("animate");
            }, 2000);
            audioRight.play();
            break;
        case "Team Results":
            currentVotingSessionId = status.currentVotingSessionId;
            loadQuestion(status.currentQuestion, true, true, false);
            activateSection("#question-section");
            break;
        case "Room Results":
            currentVotingSessionId = status.currentVotingSessionId;
            loadQuestion(status.currentQuestion, true, false, true);
            activateSection("#question-section");
            break;
        case "Partial Ranking Teams":
            $(".ranking-title").text("CLASSIFICA EQUIPE");
            loadTeamsRanking(false);
            $("#ranking-section").removeClass("partial-rooms").removeClass("final-rooms").removeClass("final-teams").addClass("partial-teams");
            activateSection("#ranking-section");
            break;
        case "Partial Ranking Rooms":
            $(".ranking-title").text("CLASSIFICA LINEE");
            loadRoomsRanking(false);
            $("#ranking-section").removeClass("partial-teams").removeClass("final-rooms").removeClass("final-teams").addClass("partial-rooms");
            activateSection("#ranking-section");
            break;
        case "Final Ranking Teams":
            $(".ranking-title").text("CLASSIFICA FINALE EQUIPE");
            loadTeamsRanking(true);
            $("#ranking-section").removeClass("partial-rooms").removeClass("partial-teams").removeClass("final-rooms").addClass("final-teams");
            activateSection("#ranking-section");
            break;
        case "Final Ranking Rooms":
            $(".ranking-title").text("CLASSIFICA FINALE LINEE");
            loadRoomsRanking(true);
            $("#ranking-section").removeClass("partial-rooms").removeClass("partial-teams").removeClass("final-teams").addClass("final-rooms");
            activateSection("#ranking-section");
            break;
    }
}
async function loadQuestion(question, bShowResults, bTeamPointsEnabled = null, bRoomPointsEnabled = null){
    if(!bShowResults){
        $("#question-section").removeClass("correct-answers");
    }
    $("#question-section").removeClass("results");
    if(question.iFrontEndOrder === 0){
        $("#question-section .question-text-number").text("DOMANDA DI PROVA");
    }
    else{
        $("#question-section .question-text-number").text(`DOMANDA ${question.iFrontEndOrder}`);
    }
    $("#question-section .question-text").html(question.sText);
    const answers = question.answers;
    let votingSessionResults = null;
    if(bShowResults){
        votingSessionResults = await getResults(bTeamPointsEnabled, bRoomPointsEnabled);
    }
    let answersHtml = "";
    for(answer of answers){
        answersHtml += `
            <div class="answer-choice" bCorrect="${answer.bCorrect}">
                <div class="answer-choice-inner">
                    <p class="answer-letter">${answer.sLetter}</p>
                    <div class="answer-text-box">
                        <p>${answer.sText}</p>
                    </div>
        `;
        if(votingSessionResults){
            const totalVotes = votingSessionResults.length || 1;
            const answerVotes = votingSessionResults.filter(votingSessionResult => votingSessionResult.answerId === answer.id).length;
            const percentage = Math.round((answerVotes / totalVotes) * 100);
            const percentageDeg = percentage * 360 / 100;
            answersHtml += `
                    <div class="percentage-ring-container">
                        <div class="percentage-ring">
                            <div class="percentage-ring-fill" style="background: conic-gradient(#ef454d ${percentageDeg}deg, transparent 0deg 360deg);"></div>
                            <div class="percentage">${percentage}%</div>
                        </div>
                    </div>
            `;
        }                    
        answersHtml += `           
                </div>
            </div>
        `;
    }
    $("#question-section .answer-box-container").html(answersHtml);
    if(votingSessionResults){
        audioPercentage.play();
        setTimeout(function(){
            $("#question-section").addClass("results");
        }, 2700);
    }
}
async function loadTeamsRanking(bFinal){
    const teams = await getTeamsOrderedByScore();
    // se bFinal cicla su 3 squadre altrimenti 10
    let teamsHtml = "";
    for(let i = 0; i < (bFinal ? 3 : 10); i++){
        const team = teams[i];
        teamsHtml += `
            <div class="ranking-element" position="${i + 1}">
                <p class="team-position">${i + 1}</p>
                <p class="team-name">${team.sName}</p>
                <p class="team-score">${team.iScore}</p>
            </div>
        `;
    }
    $(".ranking-container").html(teamsHtml);
    for(let i = 0; i < (bFinal ? 3 : 10); i++){
        const invertedPosition = (bFinal ? (3 - i) : (10 - i));
        setTimeout(function(){
            $(".ranking-element[position=" + (invertedPosition) + "]").addClass("animate");
        }, (i + 1) * (bFinal ? 2000: 500));
    }
}
async function loadRoomsRanking(bFinal){
    const rooms = await getRoomsOrderedByScore();
    let roomsHtml = "";
    for(let i = 0; i < rooms.length; i++){
        const room = rooms[i];
        roomsHtml += `
            <div class="ranking-element" position="${i + 1}">
                <p class="team-position">${i + 1}</p>
                <p class="team-name">${room.sName}</p>
                <p class="team-score">${room.iScore}</p>
            </div>
        `;
    }
    $(".ranking-container").html(roomsHtml);
    for(let i = 0; i < rooms.length; i++){
        const invertedPosition = (rooms.length - i);
        setTimeout(function(){
            $(".ranking-element[position=" + (invertedPosition) + "]").addClass("animate");
        }, (i + 1) * 2000);
    }
}
async function getResults(bTeamPointsEnabled, bRoomPointsEnabled){
    const result = await axios.get(`/api/votingsessions/${currentVotingSessionId}`, {params: {bTeamPointsEnabled, bRoomPointsEnabled, roomId}});
    return result.data;
}
async function getTeamsOrderedByScore(){
    const result = await axios.get(`/api/teams`);
    return result.data;
}
async function getRoomsOrderedByScore(){
    const result = await axios.get(`/api/rooms`);
    return result.data;
}
function activateSection(idSection){
    if($(idSection).is(":visible") && idSection !== "#ranking-section"){
        return;
    }
    $(".app-section").hide();
    $(idSection).fadeIn(150).css("display", "flex");
}