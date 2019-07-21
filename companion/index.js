import * as messaging from "messaging";

messaging.peerSocket.onmessage = function(evt){
    console.log(evt.data);
}