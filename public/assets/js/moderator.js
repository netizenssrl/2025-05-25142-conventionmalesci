const roomId = getRoomId() ? parseInt(getRoomId()) : "all";
let socket = null, tweetsList = [];
$(document).ready(async function() {
    if(roomId !== "all"){
        const response = await axios.get(`/api/rooms/${roomId}`);
        $(".room-name").text(response.data.sName);
    }
    const response = await axios.get(`/api/tweets/room/${roomId}`);
    tweetsList = response.data.filter( tweet => tweet.bApproved );
    fillTweetsList();
    initSocket();
      
});
function getRoomId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('idroom');
}
function initSocket(){
    socket = io("/screen", {path: "/api/socket", query: {room: roomId}, reconnection: true});
    socket.on("connect", function(){
        console.log("Connected to server");
    });
    socket.on("tweet:created", function(data){
        if(data.bApproved){
            tweetsList.unshift(data);
            fillTweetsList();
            animateTweet(data.id)
        }
    });
    socket.on("tweet:updated", function(data){
        if(data.bApproved){
            // if tweet is already in list, update it
            const index = tweetsList.findIndex( tweet => tweet.id === data.id );
            if(index !== -1){
                tweetsList[index] = data;
            }
            else{
                tweetsList.unshift(data);
            }
            fillTweetsList();
            animateTweet(data.id)
        }
        else{
            // remove tweet from list
            tweetsList = tweetsList.filter( tweet => tweet.id !== data.id );
            fillTweetsList();
        }
    });
    socket.on("tweet:deleted", function(tweetsArrayIds){
        tweetsList = tweetsList.filter( tweet => !tweetsArrayIds.includes(tweet.id) );
        fillTweetsList();
    });
    socket.on("disconnect", function(){
        console.log("Disconnected from server");
    });
}
function fillTweetsList(){
    let tweetsListHtml = "";
    if(tweetsList.length === 0){
        tweetsListHtml += `
            <p class="no-tweets-text">No tweets yet</div>
        `;
    }
    else{
        for( const tweet of tweetsList ){
            const sTweetText = tweet.sTextEdited ? tweet.sTextEdited : tweet.sTextOriginal;
            const timeApproved = new Date(tweet.dtmApproved).toLocaleTimeString();
            tweetsListHtml += `
                <div class="tweet" tweetId="${tweet.id}">
                    ${sTweetText.replace(/\n/g, "<br>")}
                    <div class="approval-date">${timeApproved}</div>
                </div>
            `;
        }
    }
    $(".tweets-container").html(tweetsListHtml);
}
function animateTweet(id){
    $(".tweet[tweetId='"+id+"']").addClass("animate");
    setTimeout(function(){
        $(".tweet[tweetId='"+id+"']").removeClass("animate");
    }, 3000);
}