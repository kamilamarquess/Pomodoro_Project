const timerElement = document.querySelector(".timer");
const startButtonElement = document.querySelector(".start-button");
const resetButtonElement = document.querySelector(".reset-button");
const timeOptionsElement =  document.querySelector("#time-options");
const sessionElement = document.querySelector(".session");
const totalSessionElement = document.querySelector("#total-sessions-options");
const timeModeElement = document.querySelector(".time-mode");
const notificationSound = document.querySelector("#notification");
const circleElement = document.querySelector (".circle-only");

startButtonElement.addEventListener("click", toggleStartPause);
resetButtonElement.addEventListener("click", reset)

let timeLeft = 0;
let timerId = null;
let timerActive = false;
let breakActive = false;
let workTime = 0;
let breakTime = 0;
let longBreakTime = 0;
let totalSessions = 0;
let currentSession = 1;
let totalTime = 0;

document.getElementById("toggle-sett").addEventListener("click", () => {
    const sett = document.getElementById("drop-content");
    sett.style.display = sett.style.display === "none" || !sett.style.display ? "flex" : "none";
});

function toggleStartPause(){
    if (timerActive) {
    pause();
} else {
    start();
}
}

function reset(){
    pause();
    startTimerSetup();
    updateTimerShow();
    update();
}

function startTimerSetup(){
    const workValue =  parseInt (timeOptionsElement.value);
    const sessionValue = parseInt  (totalSessionElement.value);
    timerActive = false;
    breakActive = false;
    workTime = workValue * 60;
    breakTime = (workValue / 5) * 60;
    longBreakTime = (workValue -10) * 60;
    totalSessions = sessionValue
    currentSession = 1;
    totalTime = workTime;
    timeLeft = totalTime;
    timerId = null;
}

function updateSessionShow(){
    const mode = breakActive ? (currentSession < totalSessions ? "Break" : "Long Break") : "Working";
    timeModeElement.innerText = mode;
    sessionElement.innerText =  `${currentSession}/${totalSessions}`; 
}

function setCirclePercent(percent) {
    const circlePerimeter = 565.49;
    const dashOffset = circlePerimeter - (circlePerimeter * percent) / 100;
    circleElement.style.setProperty("--dash-offset", dashOffset);
}

function updateTimerShow() {
        const minutes = Math.floor(timeLeft / 60)
        .toString()
        .padStart(2,"0");
    const seconds = (timeLeft % 60).toString().padStart(2,"0");
    timerElement.innerText = `${minutes}:${seconds}`;
    const percent = (timeLeft / totalTime) * 100;
    setCirclePercent(percent);
}

function nextSession(){
    breakActive = !breakActive;
    if (!breakActive) currentSession++;

    if (currentSession <= totalSessions){
        if (breakActive) {
            totalTime = currentSession < totalSessions ? breakTime : longBreakTime;
            showNotification("Good work!", "It's time to take a break");
        } else {
            totalTime =  workTime;
            showNotification("Keep it going!", "It's time to work again");
        }
        timeLeft = totalTime;
    } else {
        reset();
    }   
}

function showNotification(title, body){
    if(Notification.permission === "granted") {
        const notification = new Notification(title, {body});
        setTimeout(() => notification.close(), 4000);
    }
}

function finishSession(){
    notificationSound.play();
    nextSession();
    update();
}

function updateTimer(){
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerShow();
        updateSessionShow();
    } else {
        finishSession();
    }
}

function update(){
    updateTimerShow();
    updateSessionShow();
}

function start(){
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    timerActive = true;
    startButtonElement.innerText = "Pause";
    timerId = setInterval (updateTimer, 1000);
}

function pause(){
    timerActive = false;
    startButtonElement.innerText = "Start";
    clearInterval(timerId);
}

startTimerSetup();