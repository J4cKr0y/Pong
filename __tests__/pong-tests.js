// pong.test.js

// Mock du DOM pour simuler l'environnement navigateur
document.body.innerHTML = `
	<div class="mobile-controls">
        <div class="player1-controls">
            <button class="control-button player1-up">↑</button>
            <button class="control-button player1-down">↓</button>
        </div>
	</div>
<div class="board">
        <div class='ball'>
            <div class="ball_effect"></div>
        </div>
        <div class="paddle_1 paddle"></div>
        <div class="paddle_2 paddle"></div>
        <h1 class="player_1_score">0</h1>
        <h1 class="player_2_score">0</h1>
        <h1 class="message">
        </h1>
</div>
    <div class="mobile-controls">
        <button class="start-button">Start</button>
        <div class="player2-controls">
            <button class="control-button player2-up">↑</button>
            <button class="control-button player2-down">↓</button>
        </div>
    </div>  
`;

// Mock des fonctions du navigateur
window.innerHeight = 1000;
window.innerWidth = 1000;

describe('Pong Game Tests', () => {
  let gameState;
  let ball;
  let paddle1;
  let paddle2;
  let score1;
  let score2;
  let message;
  
  beforeEach(() => {
    // Réinitialisation des éléments avant chaque test
    gameState = 'start';
    ball = document.querySelector('.ball');
    paddle1 = document.querySelector('.paddle_1');
    paddle2 = document.querySelector('.paddle_2');
    score1 = document.querySelector('.player_1_score');
    score2 = document.querySelector('.player_2_score');
	message = document.querySelector('.message');
    
    // Reset des positions
    ball.style.top = '50%';
    ball.style.left = '50%';
    paddle1.style.top = '55px';
    paddle2.style.top = '55px';
  });

  describe('État initial du jeu', () => {
    test('Le jeu devrait commencer en état "start"', () => {
      expect(gameState).toBe('start');
    });

    test('Les scores devraient être à 0', () => {
      expect(score1.innerHTML).toBe('0');
      expect(score2.innerHTML).toBe('0');
    });

    test('La balle devrait être au centre', () => {
      const ballCoord = ball.getBoundingClientRect();
      const boardCoord = document.querySelector('.board').getBoundingClientRect();
      
      expect(ballCoord.left + ballCoord.width/2).toBeCloseTo(boardCoord.width/2, 1);
      expect(ballCoord.top + ballCoord.height/2).toBeCloseTo(boardCoord.height/2, 1);
    });
  });

  describe('Contrôles du jeu', () => {
    test('La touche Entrée devrait démarrer le jeu', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
      
      const message = document.querySelector('.message');
      expect(message.innerHTML).toBe('Partie en cours');
    });

    test('La raquette gauche devrait monter avec la touche Z', () => {
      const initialTop = paddle1.getBoundingClientRect().top;
      const event = new KeyboardEvent('keydown', { key: 'z' });
      document.dispatchEvent(event);
      
      expect(paddle1.getBoundingClientRect().top).toBeLessThan(initialTop);
    });

    test('La raquette droite devrait descendre avec la flèche bas', () => {
      const initialTop = paddle2.getBoundingClientRect().top;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
      
      expect(paddle2.getBoundingClientRect().top).toBeGreaterThan(initialTop);
    });
  });

  describe('Détection des collisions', () => {
    test('La balle devrait rebondir sur les raquettes', () => {
      // Simuler une collision avec la raquette gauche
      ball.style.left = paddle1.getBoundingClientRect().right + 'px';
      ball.style.top = paddle1.getBoundingClientRect().top + 'px';
      
      const initialDirection = ball.style.left;
      moveBall(3, 3, 0, 0);
      
      expect(ball.style.left).not.toBe(initialDirection);
    });

    test('Le score devrait augmenter quand la balle dépasse une raquette', () => {
      // Simuler la balle dépassant la raquette droite
      ball.style.left = document.querySelector('.board').getBoundingClientRect().right + 'px';
      moveBall(3, 3, 1, 0);
      
      expect(score1.innerHTML).toBe('1');
    });
  });

  describe('Support mobile', () => {
    test('Les contrôles mobiles devraient être visibles sur petit écran', () => {
      window.innerWidth = 500; // Simuler un petit écran
      const mobileControls = document.querySelector('.mobile-controls');
      
      expect(window.getComputedStyle(mobileControls).display).not.toBe('none');
    });

    test('Le bouton Start devrait simuler la touche Entrée', () => {
      const startButton = document.querySelector('.start-button');
      startButton.dispatchEvent(new Event('touchstart'));
      
      const message = document.querySelector('.message');
      expect(message.innerHTML).toBe('Partie en cours');
    });
  });
});