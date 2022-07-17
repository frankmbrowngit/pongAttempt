var pageStates = ["homePage", "pongGame"];
var homePage, pongGame;
var removeGameStart, userPaddle, computerPaddle;
var pongBall, actualGame;
var endButton, startButton, directionsButton;
var gameIsOn, userPoints, compPoints, pongAudio, scoreAudio;
var compScoreDisplay, userScoreDisplay;
window.addEventListener("load", function (e) {
    defineVariables();
    addEventListeners();
    const pageState = window.localStorage.getItem("pageState");
    if (!pageState) {
        homePage.dispatchEvent(new CustomEvent('initialRender'));
    } else {
        this
        .document
        .getElementById(pageState)
        .dispatchEvent(new CustomEvent('initialRender'));
    }
});
function addEventListeners() {
    homePage
    .addEventListener('initialRender', function(e) {
        const spaPages = document.querySelectorAll('body')[0].children;
        for (let children of spaPages) {
            if (children.id === 'homePage') {
                document
                .getElementById(children.id)
                .style.display = 'block';
            } else {
                document
                .getElementById(children.id)
                .style.display = 'none';
            }
        }
        window.localStorage.setItem("pageState", 'homePage');
    });
    pongGame
    .addEventListener('initialRender', function(e) {
        const spaPages = document.querySelectorAll('body')[0].children;
        for (let children of spaPages) {
            if (children.id === 'pongGame') {
                pongGame.style.display = 'block';
                actualGame.style.display = 'none';
                document.getElementById("removeGameStart").style.display = "1px solid white";
                pongGame.querySelector("h2").innerHTML =
                "Click <span id = 'directionsButton'>HERE</span> for directions"; 
                const pongArea = document.getElementById("pongArea");
                pongArea.style.border = "1px solid white";
                pongArea.querySelector('h2').style.display = 'block';
            } else {
                document
                .getElementById(children.id)
                .style.display = 'none';
            }
        }
        window.localStorage.setItem("pageState", 'pongGame');
    });
    startButton
    .addEventListener("click", function (e) {
            pongGame.dispatchEvent(new CustomEvent('initialRender'));
    });
    endButton
    .addEventListener("click", function (e) {
            homePage.dispatchEvent(new CustomEvent('initialRender'));
    });
    startGameButt
    .addEventListener("click", function (e) {
        startGame();
    });
    pongBall
    .addEventListener('collision',function(e) {
        checkForCollision();
    })
}
function defineVariables() {
    scoreAudio = document.getElementById('scoreAudio');
    pongAudio = document.getElementById('pongAudio');
    pongGame = document.getElementById('pongGame');
    homePage = document.getElementById('homePage');
    removeGameStart = document.getElementById('removeGameStart');
    userPaddle = document.getElementById('userPaddle');
    computerPaddle = document.getElementById('computerPaddle');
    pongBall = document.getElementById('pongBall');
    actualGame = document.getElementById('actualGame');
    endButton = document.getElementById('endButton');
    startButton = document.getElementById("startButton");
    directionsButton = document.getElementById("directionsButton");
    startGameButt = document.getElementById("startGameButton");
}

function startGame() {
    userPoints = 0;
    compPoints = 0;
    removeGameStart.style.display = "none";
    pongGame.querySelector("h2").innerHTML = " "
    const pongArea = document.getElementById("pongArea");
    pongArea.style.border = "none";
    pongArea.style.borderTop = "1px solid white";
    pongArea.style.borderBottom = "1px solid white";
    actualGame.style.display = 'block';
    gameIsOn = true;
    runGame();
    if (userPoints >= 10 && compPoints >= 10) {
        endGame();
    } else {
        restartGame();
    }
}
var cont = true;
function runGame() {
    pongGame.addEventListener('keydown',(e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleKeyPress(e.key);
        }
    });
    function makeChangesAndCheck() {
            console.log('moving Ball');
            moveBall();
            if (!cont) {
                cont = false;
                window.cancelAnimationFrame(makeChangesAndCheck); 
                return;
            }
            window.requestAnimationFrame(makeChangesAndCheck);
    }
    if (cont) {makeChangesAndCheck();}
}
function endGame() {
    // document.getElementById('pongGame').removeEventListener('keydown',
}

function handleKeyPress(key) {
    var top = getComputedStyle(userPaddle).top;
    top = top.slice(0,top.indexOf('p'));
    if (key === 'ArrowUp') {
        if (top > 40) {
            userPaddle.style.top = (Number(top) - 8).toString() + 'px';
        }
    } else {
        if (top < 660) {
            userPaddle.style.top = (Number(top) + 8).toString() + 'px';
        }
    }
}
var currentDir = 135;
function moveBall() {
    var top = getComputedStyle(pongBall).top;
    top = top.slice(0,top.indexOf('p'));
    var left = getComputedStyle(pongBall).left;
    left = left.slice(0,left.indexOf('p'));
    // console.log(`${degToRad(currentDir[1])}`);
    // debugger;
    pongBall.style.top = (Number(top) + 7*(Math.sin(degToRad(currentDir)))).toString() + 'px';
    pongBall.style.left = (Number(left) + 7*(Math.cos(degToRad(currentDir)))).toString() + 'px';
    top = Number(top);
    left = Number(left);
    var bottom = top - 50;
    var right = left + 50;
    if (top >= 625 || bottom <= 25 || left < 0 || right > 1465) {
        console.log('Dispatching Event')
        const ret = pongBall.dispatchEvent(new CustomEvent('collision'));
        return ret;
    }
    return true;
}
const degToRad = (deg) => {
    return Math.PI*(deg/180);
}
function moveComputerPaddle() {

}
function checkForCollision() {
    /*
    Returns false and updates score if there has been a collision, else: returns true
    Updates path of pongBall
    */
    var pongBallStyle = getComputedStyle(pongBall);
    var userPadStyle = getComputedStyle(userPaddle);
    var compPadStyle = getComputedStyle(computerPaddle);
    var pongBallTop = Number(pongBallStyle.top.slice(0,pongBallStyle.top.indexOf('p')));
    var pongBallBott = pongBallTop - 50;
    var pongBallLeft = Number(pongBallStyle.left.slice(0,pongBallStyle.left.indexOf('p')));
    var pongBallRight = pongBallLeft + 50;
    var compPadTop = Number(compPadStyle.top.slice(0,compPadStyle.top.indexOf('p')));
    var compPadBott = compPadTop - 75;
    var userPadTop = Number(userPadStyle.top.slice(0,userPadStyle.top.indexOf('p')));
    var userPadBot = userPadTop - 75;
    const checkVert = () => {
        if (pongBallBott >= 625) {
            pongAudio.play();
            currentDir += 270 + (Math.random() > 0.5 ? Math.random()*5 : Math.random()*-5);
            currDir = currentDir > 360 ? currentDir - 360 : currentDir;
        } else if (pongBallTop <= 25) {
            pongAudio.play();
            currentDir += 270 + (Math.random() > 0.5 ? Math.random()*5 : Math.random()*-5);
            currDir = currentDir > 360 ? currentDir - 360 : currentDir;
        }
    }
    const checkHor = () => {
        debugger;
        let pongBallCent = (pongBallBott + pongBallTop)/2;
        if (pongBallLeft < 0) {
            if (pongBallCent > (userPadBot - 20) && pongBallCent < userPadTop) {
                currentDir += 270;
                currDir = currentDir > 360 ? currentDir - 360 : currentDir;
                pongAudio.play();
                return true;
            } else {
                scoreAudio.play();
                compPoints += 1;
                return false;
            }
        } else if (pongBallRight > 1465) {
            if (pongBallCent > (compPadBott - 20) && pongBallCent < compPadTop) {
                currentDir += 270;
                currDir = currentDir > 360 ? currentDir - 360 : currentDir;
                pongAudio.play();
                return true;
            } else {
                scoreAudio.play();
                userPoints += 1;
                return false;
            }
        }
        return true;
    }
    checkVert();
    var check = checkHor();
    if (check) {return true;}
    else {return false;}
}

function restartGame() {

}