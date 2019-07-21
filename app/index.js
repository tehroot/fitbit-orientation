import { OrientationSensor } from "orientation";
import * as messaging from "messaging";
import document from "document";

let counter = 0;
let orientation = new OrientationSensor();
orientation.start();

function eulerPitch(a, b, c, d){
    let y = 2*(a*b + c*d);
    let x = (Math.pow(a, 2) - Math.pow(b, 2) - Math.pow(c, 2) + Math.pow(d, 2));
    return Math.round(Math.atan2(y,x) * 180/Math.PI);
}

function eulerRoll(a, b, c, d){
    let operand = 2*(b*d - a*c);
    return -1 * Math.round(Math.asin(operand) * 180/Math.PI);
}

function eulerYaw(a, b, c, d){
    let y = 2*(a*d - b*c);
    let x = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2) - Math.pow(d, 2));
    return Math.round(Math.atan2(y, x) * 180/Math.PI);
}

function readOrientation(){

    counter++;
    let a = orientation.quaternion[0];
    let b = orientation.quaternion[1];
    let c = orientation.quaternion[2];
    let d = orientation.quaternion[3];
    let eulerPitchVal = eulerPitch(a, b, c, d);
    let eulerYawVal = eulerYaw(a, b, c, d);
    let eulerRollVal = eulerRoll(a, b, c, d);
    let eulerArray = [eulerPitchVal, eulerRollVal, eulerRollVal];
    if(counter % 5 == 0 && counter < 60){
        messageQueue(eulerArray);
        console.log("Timestamp: " +orientation.timestamp);
        console.log("Scalar: " +a);
        console.log("Pitch: " +eulerPitchVal);
        console.log("Roll: " +eulerRollVal);
        console.log("Yaw: " +eulerYawVal);
    } else if(counter > 60) {
        counter = 0;
    }
}

function valSmooth(array){
    let aggregateVal = 0;
    let aggregateValArray = new Array();
    for(let i = 0; i < array.length; i++){
        for(let j = 0; j < array[i].length; j++){
            aggregateVal + array[j][i];
        }
        aggregateValArray.push(aggregateVal / 6);
        aggregateVal = 0;
    }
    return aggregateValArray;
}

function messageQueue(eulerArray){
    if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN && messaging.peerSocket.bufferedAmount == 0) {
        messaging.peerSocket.send(eulerArray);
    }
}

messaging.peerSocket.onerror = function(err){
    console.log("Messagng Error: " + err.code + "--" +err.message);
}

messaging.peerSocket.onopen = function(){
}

orientation.onreading = function() {
    readOrientation();
}


//setInterval(readOrientation, 200);