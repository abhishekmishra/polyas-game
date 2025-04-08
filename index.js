let polyasGame;
let pickBallButton;

console.log("Polyá's Urn Simulation");

function setup() {
  createCanvas(400, 400);
  console.log('Canvas created:', document.querySelector('canvas'));
  polyasGame = new PolyasGame(2);

  pickBallButton = createButton('Pick Ball');
  pickBallButton.position(10, 10);
  pickBallButton.mousePressed(() => {
    const pickedColor = polyasGame.pickAndAddBall();
    console.log('Picked Ball Color:', pickedColor === 0 ? 'Red' : 'Blue');
  });
}

function draw() {
  background(220);
  polyasGame.draw();
}

class PolyasGame {
  constructor(startingBalls) {
    // Ensure the first two balls are one red (0) and one blue (1)
    this.urn = [0, 1];

    // Initialize the rest of the urn with random values (0 for red, 1 for blue)
    this.urn.push(...Array.from({ length: startingBalls - 2 }, () => Math.round(Math.random())));
  }

  draw() {
    // Draw the urn as a 3-sided rectangle
    noFill();
    stroke(0);
    rect(50, 50, 300, 300);

    // Draw the balls in the urn from bottom to top, left to right
    const ballSize = 20;
    const cols = Math.floor(300 / ballSize);
    this.urn.forEach((ball, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = 50 + col * ballSize + ballSize / 2;
      const y = 350 - row * ballSize - ballSize / 2;

      // Set color based on ball type (0 for red, 1 for blue)
      fill(ball === 0 ? 'red' : 'blue');
      noStroke();
      ellipse(x, y, ballSize);
    });
  }

  pickAndAddBall() {
    // Pick a random ball from the urn
    const randomIndex = Math.floor(Math.random() * this.urn.length);
    const pickedBall = this.urn[randomIndex];

    // Add a new ball of the same colour to the urn
    this.urn.push(pickedBall);

    // Return the colour of the picked ball (0 for red, 1 for blue)
    return pickedBall;
  }
}