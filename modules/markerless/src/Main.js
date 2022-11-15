import Object from './Object.js';

const handsfree = new Handsfree({hands: {
    enabled: true,
    maxNumHands: Number(localStorage.getItem("maxNumHands")),
}, showDebug: false});

handsfree.on('modelError', (event) => {
    alert("An error occurred while trying to load the model.");
});

handsfree.on('handsModelReady', (event) => {
    document.getElementById("loader-wrapper").classList.add("hidden");
});

handsfree.start();

let rightHandObj = null;
let leftHandObj = null;

const bin = {
    el: document.getElementById("bin"),
    box3: new THREE.Box3(),
} 

function start(palmX, palmY, palmZ, indexX, indexY, indexZ, data, hand)
{
    let flag = false;
    for(let k = 0; k < Object.set.length && flag === false; k++)
    {
        const obj = Object.set[k];
        obj.box3.setFromObject(obj.element.object3D);
        let handsfreePosZ = 1/obj.element.getAttribute('position').z;
        let aframePos = Object.conversion(data.curPinch.x, data.curPinch.y, handsfreePosZ);
        if( (aframePos[0] > obj.box3.min.x && aframePos[0] < obj.box3.max.x) && (aframePos[1] > obj.box3.min.y && aframePos[1] < obj.box3.max.y) && obj.go === false )
        {
            obj.startingVector = [indexX - palmX, indexY - palmY, indexZ - palmZ];
            obj.go = true;
            if(hand === "right")
                rightHandObj = obj;
            else if(hand === "left")
                leftHandObj = obj;
            flag = true;
        }  
    }
}

function held(palmX, palmY, palmZ, indexX, indexY, indexZ, data, obj, landmark)
{
    if(obj !== null)
    {
        obj.pos = Object.conversion(data.curPinch.x, data.curPinch.y, landmark);
        
        if(obj.pos[2] < -15 || obj.pos[2] > 0)
        {
            obj.pos[2] = -13;
            obj.pos = Object.conversion(data.curPinch.x, data.curPinch.y, 1/obj.pos[2]);
        }

        let p = Object.average(obj.arrayX, obj.arrayY, obj.arrayZ, obj.pos);
        obj.element.setAttribute('position', String(p[0]) + " " + String(p[1]) + " " + String(p[2]) );
        obj.currentVector = [indexX - palmX, indexY - palmY, indexZ - palmZ];
        let startingVector = new THREE.Vector3(obj.startingVector[0], obj.startingVector[1], obj.startingVector[2]);
        let currentVector = new THREE.Vector3(obj.currentVector[0], obj.currentVector[1], obj.currentVector[2]);
        startingVector.normalize();
        currentVector.normalize();

        let anlge = startingVector.angleTo(currentVector);
        let line = new THREE.Vector3();
        line.crossVectors(startingVector, currentVector);
        line.normalize();
        Object.rotateOnWorldAxis(obj.element.object3D, line, Number(localStorage.getItem("rotationSpeed")) * anlge);
        obj.startingVector[0] = obj.currentVector[0];
        obj.startingVector[1] = obj.currentVector[1];
        obj.startingVector[2] = obj.currentVector[2];
    }
}

// Right hand
handsfree.on('finger-pinched-start-1-0', (data) => {
    let palmX = handsfree.data.hands.landmarks[1][0].x; //palm
    let palmY = handsfree.data.hands.landmarks[1][0].y; //palm
    let palmZ = handsfree.data.hands.landmarks[1][0].z; //palm
    let indexX = handsfree.data.hands.landmarks[1][4].x; //thumb
    let indexY = handsfree.data.hands.landmarks[1][4].y; //thumb
    let indexZ = handsfree.data.hands.landmarks[1][4].z; //thumb
    start(palmX, palmY, palmZ, indexX, indexY, indexZ, data, "right");
});

handsfree.on('finger-pinched-held-1-0', (data) => {
    let palmX = handsfree.data.hands.landmarks[1][0].x;
    let palmY = handsfree.data.hands.landmarks[1][0].y;
    let palmZ = handsfree.data.hands.landmarks[1][0].z;
    let indexX = handsfree.data.hands.landmarks[1][4].x; 
    let indexY = handsfree.data.hands.landmarks[1][4].y;
    let indexZ = handsfree.data.hands.landmarks[1][4].z;
    held(palmX, palmY, palmZ, indexX, indexY, indexZ, data, rightHandObj, handsfree.data.hands.landmarks[1][8].z); //index
});


handsfree.on('finger-pinched-released-1-0', (data) => {    
    if(rightHandObj != null && rightHandObj.go === true)
    {
        rightHandObj.go = false;
        
        bin.z = 1/bin.el.getAttribute("position").z;
        bin.box3.setFromObject(bin.el.object3D);
        let temp = Object.conversion(data.curPinch.x, data.curPinch.y, bin.z);
        if( (temp[0] >= bin.box3.min.x && temp[0] <= bin.box3.max.x) && (temp[1] >= bin.box3.min.y && temp[1] <= bin.box3.max.y) )
        {
            rightHandObj.delete();
        }
        
        rightHandObj = null;
    }
});

// Left hand
handsfree.on('finger-pinched-start-0-0', (data) => {
    let palmX = handsfree.data.hands.landmarks[0][0].x;
    let palmY = handsfree.data.hands.landmarks[0][0].y;
    let palmZ = handsfree.data.hands.landmarks[0][0].z;
    let indexX = handsfree.data.hands.landmarks[0][4].x;
    let indexY = handsfree.data.hands.landmarks[0][4].y;
    let indexZ = handsfree.data.hands.landmarks[0][4].z;
    start(palmX, palmY, palmZ, indexX, indexY, indexZ, data, "left");
});

handsfree.on('finger-pinched-held-0-0', (data) => { 
    let palmX = handsfree.data.hands.landmarks[0][0].x;
    let palmY = handsfree.data.hands.landmarks[0][0].y;
    let palmZ = handsfree.data.hands.landmarks[0][0].z;
    let indexX = handsfree.data.hands.landmarks[0][4].x;
    let indexY = handsfree.data.hands.landmarks[0][4].y;
    let indexZ = handsfree.data.hands.landmarks[0][4].z;
    held(palmX, palmY, palmZ, indexX, indexY, indexZ, data, leftHandObj, handsfree.data.hands.landmarks[0][8].z);
});

handsfree.on('finger-pinched-released-0-0', (data) => {
    if(leftHandObj != null && leftHandObj.go === true)
    {
        leftHandObj.go = false;
        
        bin.z = 1/bin.el.getAttribute("position").z;
        bin.box3.setFromObject(bin.el.object3D);
        let temp = Object.conversion(data.curPinch.x, data.curPinch.y, bin.z);
        if( (temp[0] >= bin.box3.min.x && temp[0] <= bin.box3.max.x) && (temp[1] >= bin.box3.min.y && temp[1] <= bin.box3.max.y) )
        {
            leftHandObj.delete();
        }

        leftHandObj = null;
    }
});

function init()
{
    const head = document.getElementsByTagName('head')[0];

    // Flip video
    const style = document.createElement('style');
    style.textContent = "video {	-moz-transform: scale(-1, 1);	-webkit-transform: scale(-1, 1);	-o-transform: scale(-1, 1);	-ms-transform: scale(-1, 1);	transform: scale(-1, 1); }";
    head.appendChild(style);
}

init();