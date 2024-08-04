const canvas = document.getElementById("eye");
const ctx = canvas.getContext("2d");

//make sure the face fills up the whole page 
document.getElementById("foreground").width = window.innerWidth;
document.getElementById("foreground").height = window.innerHeight;

//make make the screen glare as large as the screen so it's centered
document.getElementById("screenReflection").width = window.innerWidth;
document.getElementById("screenReflection").height = window.innerHeight;

//grab the images of the pupil from assets
const pupilForeground = new Image();
pupilForeground.src = "./assets/pupilForeground.png";//the actual substance of the eye
const pupilBackground = new Image();
pupilBackground.src = "./assets/pupilBackground.png";//the black background
const pupilCenter = new Image();
pupilCenter.src = "./assets/centerLight.png";//the little light thing in the center

//save current position of eye relative to the borders of the screen(using the cords form the center of the pupil)
let pupilPosX = window.innerWidth/2 - (pupilBackground.width/2);
let pupilPosY = window.innerHeight/2 - (pupilBackground.height/2);

let mousePosX = 0;//position of mouse on the x axis
let mousePosY = 0;//position of mouse on the y axis

console.log("starting pupilPosX and pupilPosY: " + pupilPosX + ", "+ pupilPosY);//for debug

//setting the size of the canvas
canvas.width = window.innerWidth/1.95;
canvas.height = window.innerHeight/1.95;
//moving the canvas into the middle of the screen
canvas.style.top = window.innerHeight/4 + "px";
canvas.style.right = window.innerWidth/4 + "px";

canvas.style.top = window.innerHeight/4 + "px";

//take location of mouse on screen and determine where in on the canvas it should be printed
//takes poisiton of mouse and translates it to where the pupil should be in the canvas(EVERYTHING OUTSIDE OF THIS FUNCTION REFERS TO WHOLE SCREEN)

//debug thing
console.log("pupil height: " + document.getElementById("pupil").height + " pupil width: " + document.getElementById("pupil").width);

/*Name:refreshPupil
Input:
    screenX: where on the screen is the target position
    screenY: where on the screen is the target position
Desciption:
takes where the mouse is, or just where you want the pupil to go, and moves the pupil towards the target position.
First clears the canvas before filling it with the normal solid BG color. THAN draws the pupil
*/
function refreshPupil(screenX, screenY){
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clear the canvas at the start of each frame
    ctx.fillStyle = "#404153";//set the colour of the rectangle
    ctx.fillRect(0,0, canvas.width, canvas.height)//fill the background with grey
    ctx.stroke;//draw the rectangle
    ctx.drawImage(pupilBackground, screenX/2 - (pupilBackground.width/2), screenY/2 - (pupilBackground.height/2));//draw the background of the eye(it's just a empty black plane)
    /*take the target position of the eye and translate it to where it would be on a box 80% the size of the overall canvas. The smaller box is also centered
    explanation on how this works so you don't forget:
    "screenX/2" gives the target value on the canvas itself
    "*0.8" because 1 on the main canvas would only be 0.8 on the smaller canvas
    "+canvas.width/10" because the small canvas has to be centered so is offset from the corner by 1/2 of whatever the ratio is
    "- pupilCenter.width/2" to center the picture of the pupil itself
    */
    ctx.drawImage(pupilCenter, ((screenX/2)*0.8+canvas.width/10) - pupilCenter.width/2, ((screenY/2)*0.8+canvas.height/10) - pupilCenter.height/2);
    ctx.drawImage(pupilForeground, screenX/2 - (pupilForeground.width/2), screenY/2 - (pupilForeground.height/2));//draw the forground of the eye
    //ctx.strokeRect(canvas.width/10, canvas.height/10, canvas.width*0.8, canvas.height*0.8);//debug: draws the smaller box that pupilCenter is confined to
    pupilPosX = screenX;//update the current x value of the eye
    pupilPosY = screenY;//update the current y value of the eye
    //console.log("refreshing...");//debug
}

//watch the foregound/face to see if the mouse moves over it. 
//If detected, checks if it's in a deadzone before updating the mouse posiiton to a global variable
document.getElementById("foreground").addEventListener("mousemove", (e) => {
    //grab the position of the mouse and save it into a global variable
    //check if the mouse is within the deadzone. Deadzone is the outer 1/8 of the screen
    if((e.clientX < window.innerWidth/8 || e.clientX > window.innerWidth*(7/8))||(e.clientY < window.innerHeight/8 || e.clientY > window.innerHeight*(7/8))){
        //if inside a deadzone, just return the center of the screen
        mousePosX = window.innerWidth/2;
        mousePosY = window.innerHeight/2;
        //console.log("mouse in deadzone");//debug
    }
    else{
        //if outside of deadzone, update target cords with mouse position
        mousePosX = e.clientX;
        mousePosY = e.clientY; 
    }
    //console.log("Mouse position: " + mousePosX + ", " + mousePosY);//debug
});

//run this function every given number of milliseconds, use this to give the pupil a consistent movement
setInterval( function() {
    //find the x and y difference and make it hella small so the eye moves slower
    let changePosX = (mousePosX - pupilPosX)/50;
    let changePosY = (mousePosY - pupilPosY)/50;

    refreshPupil(pupilPosX + changePosX, pupilPosY + changePosY);
    //console.log("ChangePos: (" + changePosX + "," + changePosY + ") pupilPox: (" + pupilPosX + "," + pupilPosY + ")");//debug
}, 10);//refresh rate of once every 10 milliseconds
