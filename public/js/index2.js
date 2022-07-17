// page States
//      /     \
// Game Menu Start menu
//   /     \
// Initial    Gaming
//           /   |    \
//          Run Restart GameOver
window.addEventListener('load', (_e) => {
    defineVariables();
    addEventListeners();
    const topPageState = window.localStorage.getItem('topPageState');
    if (topPageState) {
        document.getElementById(topPageState).dispatchEvent(new CustomEvent('initialRender'));
    } else {
        homePage.dispatchEvent(new CustomEvent('initialRender'));
    }
});
const ballSpeed = 7;
const paddleSpeed = 7;
// Pages
var homePage, pongGame; 
// Buttons
var startButton, directionsButton, startGameButton, endButton;
// UI Components
var scores, actualGame, userPaddle, computerPaddle, pongBall, removeGameStart, pongArea;
// Variables to Keep Track Of
var userScore, compScore;
// Variables for Gaming
var curDir, inGame;
// sounds
var pongBallBounce, scoreSound;
function defineVariables() {
    // Pages
    homePage = document.getElementById('homePage');
    pongGame = document.getElementById('pongGame');
    // Buttons
    startButton = document.getElementById('startButton');
    directionsButton = document.getElementById('directionsButton'); 
    startGameButton = document.getElementById('startGameButton'); 
    endButton = document.getElementById('endButton'); 
    // UI Components
    scores = document.getElementById('scores'); 
    actualGame = document.getElementById('actualGame'); 
    userPaddle = document.getElementById('userPaddle'); 
    computerPaddle = document.getElementById('computerPaddle'); 
    pongBall = document.getElementById('pongBall');  
    removeGameStart = document.getElementById('removeGameStart');
    pongArea = document.getElementById('pongArea');
    //Sounds
    pongBallBounce = document.getElementById('pongAudio');
    scoreSound = document.getElementById('scoreAudio');
}
function addEventListeners() {
    homePage.addEventListener('initialRender', (e) => {
        window.localStorage.setItem('topPageState','homePage');
        homePage.style.display = 'block';
        pongGame.style.display = 'none';
    });
    pongGame.addEventListener('initialRender', (e) => {
        window.localStorage.setItem('topPageState','pongGame');
        homePage.style.display = 'none';
        pongGame.style.display = 'block';
        pongArea.style.border = '1px solid white';
        removeGameStart.style.display = 'block';
        scores.style.display = 'none';
        actualGame.style.display = 'none';
    });
    pongGame.addEventListener('gameRender', (e) => {
        removeGameStart.style.display = 'none';
        pongArea.style.border = 'none';
        pongArea.style.borderTop = '1px solid white';
        pongArea.style.borderBottom = '1px solid white';
        scores.style.display = 'block';
        userScore = 0;
        compScore = 0;
        setScores();
        actualGame.style.display = 'block';
        pongGame.dispatchEvent(new CustomEvent('startGame'));
    });
    pongGame.addEventListener('startGame',(_e) => {
        inGame = true;
        curDir = 3*Math.PI/4;
        setScores();
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            handleArrow(e.key);
        });
        var animationFrame;
        function runAnimation() {
            moveBall();
            const res = checkForCollision();
            if (res) {
                animationFrame = window.requestAnimationFrame(runAnimation);
            } else {
                inGame = false;
            }
        }
        runAnimation();
        if (!inGame) {
            cancelAnimationFrame(animationFrame);
            debugger;
            handleScore();
        }
        });
    startButton.addEventListener('click', (e) => {
        pongGame.dispatchEvent(new CustomEvent('initialRender'));
    });
    endButton.addEventListener('click',(_e) => {
        homePage.dispatchEvent(new CustomEvent('initialRender'));
    });
    startGameButton.addEventListener('click', (_e) => {
        pongGame.dispatchEvent(new CustomEvent('gameRender'));
    });
}

function setScores() {
    const userScoreDisp = document.getElementById('userScoreDisp');
    const compScoreDisp = document.getElementById('compScoreDisp');
    userScoreDisp.innerText = `${userScore}`;
    compScoreDisp.innerText = `${compScore}`;
    userScoreDisp.style.fontSize = '3em';
    userScoreDisp.style.display = 'inline';
    userScoreDisp.style.margin = '0 0 0 10%';
    compScoreDisp.style.fontSize = '3em';
    compScoreDisp.style.display = 'inline';
    compScoreDisp.style.margin = '0 0 0 75%';
}
function handleArrow(key) {
    if (key === 'ArrowUp') {
        let top = getComputedStyle(userPaddle).top;
        top = top.slice(0,top.indexOf('p'));
        top = Number(top) - paddleSpeed;
        top = (top < 37) ? 37 : top;
        userPaddle.style.top = top.toString() + 'px';
    } else if (key === 'ArrowDown') {
        let top = getComputedStyle(userPaddle).top;
        top = top.slice(0,top.indexOf('p'));
        top = Number(top) + paddleSpeed;
        top = (top > 664) ? 664 : top;
        userPaddle.style.top = top.toString() + 'px';
    } else {
        let top, left;
        switch (key) {
            case 'w':
                [top,left] = getCoord();
                pongBall.style.top = (top - 5).toString() + 'px';
                break;
            case 's':
                [top,left] = getCoord();
                pongBall.style.top = (top + 5).toString() + 'px';
                break;
            case 'a':
                [top,left] = getCoord();
                pongBall.style.left = (left - 5).toString() + 'px';
                break;
            case 'd':
                [top,left] = getCoord();
                pongBall.style.left = (left + 5).toString() + 'px';
                break;
            default:
                return;
        }
    }
}

function moveBall() {
    let [top,left] = getCoord();
    pongBall.style.top = ((Math.sin(curDir)*ballSpeed + top)).toString() + 'px';
    pongBall.style.left = ((Math.cos(curDir)*ballSpeed + left)).toString() + 'px';
}
function checkForCollision() {
    let [top,left] = getCoord();
    if (top >= 678 || top <= 30) {
        pongBallBounce.play();
        changeDir();
        moveBallAfterHit();
        return true;
    } else if (left <= -10 || left >= 1408) {
        let res = checkForHit();
        if (!res) {return false;}
    }
    return true;
}
function changeDir() {
    curDir += Math.PI/2;
    curDir = (curDir > 2*Math.PI) ? curDir - 2*Math.PI : curDir;
}
function getCoord() {
    let style = getComputedStyle(pongBall);
    let top = Number(style.top.slice(0,style.top.indexOf('p')));
    let left = Number(style.left.slice(0,style.left.indexOf('p')));
    return [top,left];
} 
function checkForHit() {
    let ballStyle = getComputedStyle(pongBall);
    let compStyle = getComputedStyle(computerPaddle);
    let userStyle = getComputedStyle(userPaddle);
    ballStyle = {
        top: ballStyle.top,
        left: ballStyle.left
    };
    if (Number(ballStyle.left.slice(0,ballStyle.left.indexOf('p'))) < 700) {
        let top = Number(ballStyle.top.slice(0,ballStyle.top.indexOf('p')));
        ballStyle.center = ((top + (top+50))/2);
        userStyle = {
            top: userStyle.top// need to add 30
        };
        let useTop = Number(userStyle.top.slice(0,userStyle.top.indexOf('p'))) - 20;
        let useBot = useTop + 75;
        if (ballStyle.center < useBot && ballStyle.center > useTop) {
            pongBallBounce.play();
            changeDir();
            moveBallAfterHit();
            return true;
        } else {
            scoreSound.play();
            return false;
        }
    } else {
        let top = Number(ballStyle.top.slice(0,ballStyle.top.indexOf('p')));
        ballStyle.center = ((top + (top+50))/2);
        compStyle = {
            top: compStyle.top// need to add 30
        };
        let compTop = Number(compStyle.top.slice(0,compStyle.top.indexOf('p'))) - 20;
        let compBot = compTop + 75;
        if (ballStyle.center < compBot && ballStyle.center > compTop) {
            pongBallBounce.play();
            changeDir();
            moveBallAfterHit();
            return true;
        } else {
            scoreSound.play();
            return false;
        }
    }
}

const moveBallAfterHit = () => {
    for (let i = 0; i < 4; i++) {
        moveBall();
    }
}
function handleScore() {
    let ballStyle = getComputedStyle(pongBall);
    ballStyle = {
        top: ballStyle.top,
        left: ballStyle.left
    };
    if (Number(ballStyle.left.slice(0,ballStyle.left.indexOf('p'))) < 700) {
        compScore += 1;
    } else {
        userScore += 1;
    }
    if (userScore > 10) {
        // end game
    } else if (compScore > 10) {
        // end game
    } else {
        resetLayout();
        pongGame.dispatchEvent(new CustomEvent('startGame'));
    }
}

function resetLayout() {
    debugger;
    // pongball
    pongBall.style.right = '50%';
    pongBall.style.top = '50%';
    pongBall.style.transfrom = 'translate(50%,-50%);'
    //paddles
    userPaddle.style.top = '50%';
    userPaddle.style.transorm = 'translateY(-50%);';
    computerPaddle.style.top = '50%';
    computerPaddle.style.transorm = 'translateY(-50%);';
    // score will be updated
}