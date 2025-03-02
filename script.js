let gameState = 'start';
let paddle_1 = document.querySelector('.paddle_1');
let paddle_2 = document.querySelector('.paddle_2');
let board = document.querySelector('.board');
let initial_ball = document.querySelector('.ball');
let ball = document.querySelector('.ball');
let score_1 = document.querySelector('.player_1_score');
let score_2 = document.querySelector('.player_2_score');
let message = document.querySelector('.message');
let paddle_1_coord = paddle_1.getBoundingClientRect();
let paddle_2_coord = paddle_2.getBoundingClientRect();
let initial_ball_coord = ball.getBoundingClientRect();
let ball_coord = initial_ball_coord;
let board_coord = board.getBoundingClientRect();
let paddle_common = document.querySelector('.paddle').getBoundingClientRect();
let dx = Math.floor(Math.random() * 4) + 3;
let dy = Math.floor(Math.random() * 4) + 3;
let dxd = Math.floor(Math.random() * 2);
let dyd = Math.floor(Math.random() * 2);

function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || /Mobile|Tablet|Android|iOS|iPhone|iPad/i.test(navigator.userAgent);
}

function isScreenSmall() {
    return window.innerWidth < 768;
}

function resizeGameElements() {
    board_coord = board.getBoundingClientRect();
    
    paddle_1.style.top = (board_coord.height / 2 - paddle_common.height / 2) + board_coord.top + 'px';
    paddle_2.style.top = (board_coord.height / 2 - paddle_common.height / 2) + board_coord.top + 'px';
    
    paddle_1_coord = paddle_1.getBoundingClientRect();
    paddle_2_coord = paddle_2.getBoundingClientRect();
    
    ball.style.top = (board_coord.height / 2 - initial_ball_coord.height / 2) + board_coord.top + 'px';
    ball.style.left = (board_coord.width / 2 - initial_ball_coord.width / 2) + board_coord.left + 'px';
    
    ball_coord = ball.getBoundingClientRect();
}

window.addEventListener('load', function() {
    resizeGameElements();
    updateButtons();
});

function updateButtons() {
    const mobileControls = document.querySelectorAll('.mobile-controls');
    // Forcer l'affichage des contrôles sur petit écran, quelle que soit l'orientation
    if (isScreenSmall() || isMobile()) {
        mobileControls.forEach(control => {
            control.style.display = 'flex';
        });
    } else {
        mobileControls.forEach(control => {
            control.style.display = 'none';
        });
    }
}

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        alert('Veuillez mettre votre appareil en mode horizontal pour une meilleure expérience de jeu.');
    }
    resizeGameElements();
    updateButtons();
}

window.addEventListener('resize', function() {
    resizeGameElements();
    checkOrientation();
    updateMessage();
    updateButtons();
});

window.addEventListener('orientationchange', function() {
    checkOrientation();
    updateMessage();
    updateButtons();
});

checkOrientation();

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        gameState = gameState == 'start' ? 'play' : 'start';
        if (gameState == 'play') {
            message.innerHTML = 'Partie en cours';
            message.style.left = 42 + 'vw';
            requestAnimationFrame(() => {
                dx = Math.floor(Math.random() * 4) + 3;
                dy = Math.floor(Math.random() * 4) + 3;
                dxd = Math.floor(Math.random() * 2);
                dyd = Math.floor(Math.random() * 2);
                moveBall(dx, dy, dxd, dyd);
            });
        }
    }
    if (gameState == 'play') {
        if (e.key == 'z') {
            paddle_1.style.top = Math.max(board_coord.top, paddle_1_coord.top - window.innerHeight * 0.06) + 'px';
            paddle_1_coord = paddle_1.getBoundingClientRect();
        }
        if (e.key == 's') {
            paddle_1.style.top = Math.min(board_coord.bottom - paddle_common.height, paddle_1_coord.top + window.innerHeight * 0.06) + 'px';
            paddle_1_coord = paddle_1.getBoundingClientRect();
        }

        if (e.key == 'ArrowUp') {
            paddle_2.style.top = Math.max(board_coord.top, paddle_2_coord.top - window.innerHeight * 0.1) + 'px';
            paddle_2_coord = paddle_2.getBoundingClientRect();
        }
        if (e.key == 'ArrowDown') {
            paddle_2.style.top = Math.min(board_coord.bottom - paddle_common.height, paddle_2_coord.top + window.innerHeight * 0.1) + 'px';
            paddle_2_coord = paddle_2.getBoundingClientRect();
        }
    }
});

function moveBall(dx, dy, dxd, dyd) {
    ball_coord = ball.getBoundingClientRect();
    board_coord = board.getBoundingClientRect();
    paddle_1_coord = paddle_1.getBoundingClientRect();
    paddle_2_coord = paddle_2.getBoundingClientRect();
    
    if (ball_coord.top <= board_coord.top) {
        dyd = 1;
    }
    if (ball_coord.bottom >= board_coord.bottom) {
        dyd = 0;
    }
    
    if (ball_coord.left <= paddle_1_coord.right && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
        dxd = 1;
        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
    }
    if (ball_coord.right >= paddle_2_coord.left && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
        dxd = 0;
        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
    }
    if (ball_coord.left <= board_coord.left) {
        score_2.innerHTML = +score_2.innerHTML + 1;
        gameState = 'start';
        ball.style.top = (board_coord.height / 2 - initial_ball_coord.height / 2) + board_coord.top + 'px';
        ball.style.left = (board_coord.width / 2 - initial_ball_coord.width / 2) + board_coord.left + 'px';
        ball_coord = ball.getBoundingClientRect();
        message.innerHTML = isMobile() || isScreenSmall() ? 'Appuyez sur Start pour commencer' : 'Appuyez sur Entrer pour lancer la partie, - Z et S à gauche, ↑ et ↓ à droite.';
        return;
    }
    if (ball_coord.right >= board_coord.right) {
        score_1.innerHTML = +score_1.innerHTML + 1;
        gameState = 'start';
        ball.style.top = (board_coord.height / 2 - initial_ball_coord.height / 2) + board_coord.top + 'px';
        ball.style.left = (board_coord.width / 2 - initial_ball_coord.width / 2) + board_coord.left + 'px';
        ball_coord = ball.getBoundingClientRect();
        message.innerHTML = isMobile() || isScreenSmall() ? 'Appuyez sur Start pour commencer' : 'Appuyez sur Entrer pour lancer la partie, - Z et S à gauche, ↑ et ↓ à droite.';
        return;
    }
    ball.style.top = ball_coord.top + dy * (dyd == 0 ? -1 : 1) + 'px';
    ball.style.left = ball_coord.left + dx * (dxd == 0 ? -1 : 1) + 'px';
    ball_coord = ball.getBoundingClientRect();
    if (gameState === 'play') {
        requestAnimationFrame(() => {
            moveBall(dx, dy, dxd, dyd);
        });
    }
}

function updateMessage() {
    if (isMobile() || isScreenSmall()) {
        message.innerHTML = 'Appuyez sur Start pour commencer';
    } else {
        message.innerHTML = 'Appuyez sur Entrer pour lancer la partie, - Z et S à gauche, ↑ et ↓ à droite.';
    }
}

updateMessage();

function simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', { key: key });
    document.dispatchEvent(event);
}

document.querySelector('.player1-up').addEventListener('touchstart', function(e) {
    e.preventDefault();
    simulateKeyPress('z');
});

document.querySelector('.player1-down').addEventListener('touchstart', function(e) {
    e.preventDefault();
    simulateKeyPress('s');
});

document.querySelector('.player2-up').addEventListener('touchstart', function(e) {
    e.preventDefault();
    simulateKeyPress('ArrowUp');
});

document.querySelector('.player2-down').addEventListener('touchstart', function(e) {
    e.preventDefault();
    simulateKeyPress('ArrowDown');
});

document.querySelector('.start-button').addEventListener('touchstart', function(e) {
    e.preventDefault();
    simulateKeyPress('Enter');
});

document.querySelectorAll('.control-button, .start-button').forEach(button => {
    button.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
});