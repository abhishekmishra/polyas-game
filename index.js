const SIMULATE_INTERVAL = 25; // Define the time interval for simulation in milliseconds

let polyasGame;
let pickBallButton;
let simulateButton;

console.log("Polyá's Urn Simulation");

function setup() {
  createCanvas(800, 400); // Double the canvas width to accommodate the graph
  console.log('Canvas created:', document.querySelector('canvas'));
  polyasGame = new PolyasGame(2);

  pickBallButton = createButton('Pick Ball');
  pickBallButton.position(10, 10);
  pickBallButton.mousePressed(() => {
    const pickedColor = polyasGame.pickAndAddBall();
    console.log('Picked Ball Color:', pickedColor === 0 ? 'Red' : 'Blue');
  });

  simulateButton = createButton('Simulate');
  simulateButton.position(100, 10);
  simulateButton.mousePressed(() => {
    polyasGame.simulateMode = !polyasGame.simulateMode; // Toggle simulate mode
    simulateButton.html(polyasGame.simulateMode ? 'Stop Simulation' : 'Simulate'); // Update button label
  });
}

function draw() {
  background(220);

  polyasGame.simulate();
  polyasGame.draw();
}

class PolyasGame {
  constructor(startingBalls) {
    // Ensure the first two balls are one red (0) and one blue (1)
    this.urn = [0, 1];

    // Initialize the rest of the urn with random values (0 for red, 1 for blue)
    this.urn.push(...Array.from({ length: startingBalls - 2 }, () => Math.round(Math.random())));

    this.lastPickedBall = null; // Initialize last picked ball as null
    this.redPercentageHistory = []; // Initialize history for red percentage
    this.simulateMode = false; // Initialize simulate mode as false
    this.lastSimulateTime = 0; // Track the last time simulate was called
    this.maxBalls = Math.floor((300 / 20) ** 2); // Calculate max balls based on urn size and ball size
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

    // Display the status message below the urn
    const stats = this.stats();
    const lastPicked = this.lastPickedBall !== null ? (this.lastPickedBall === 0 ? 'Red' : 'Blue') : 'None';
    const statusMessage = `Last Picked: ${lastPicked}, Red: ${stats.redPercentage.toFixed(2)}%, Blue: ${stats.bluePercentage.toFixed(2)}%`;
    fill(0);
    noStroke();
    textSize(16);
    textAlign(CENTER);
    text(statusMessage, 200, 380);

    // Draw the graph on the right side of the canvas
    this.drawGraph();
  }

  pickAndAddBall() {
    // Pick a random ball from the urn
    const randomIndex = Math.floor(Math.random() * this.urn.length);
    const pickedBall = this.urn[randomIndex];

    // Add a new ball of the same colour to the urn
    this.urn.push(pickedBall);

    this.lastPickedBall = pickedBall; // Update last picked ball

    // Update the red percentage history
    const stats = this.stats();
    this.redPercentageHistory.push(stats.redPercentage);

    // Return the colour of the picked ball (0 for red, 1 for blue)
    return pickedBall;
  }

  stats() {
    const totalBalls = this.urn.length;
    const redCount = this.urn.filter(ball => ball === 0).length;
    const blueCount = totalBalls - redCount;

    return {
      redPercentage: (redCount / totalBalls) * 100,
      bluePercentage: (blueCount / totalBalls) * 100
    };
  }

  drawGraph() {
    // Draw the graph for red percentage
    const graphX = 400;
    const graphY = 50;
    const graphWidth = 300;
    const graphHeight = 300;

    // Draw axes
    stroke(0);
    line(graphX, graphY, graphX, graphY + graphHeight); // Y-axis
    line(graphX, graphY + graphHeight, graphX + graphWidth, graphY + graphHeight); // X-axis

    // Add labels
    noStroke();
    fill(0);
    textSize(12);
    textAlign(CENTER);
    text("%", graphX - 20, graphY + graphHeight / 2 - 10);
    text("of", graphX - 20, graphY + graphHeight / 2);
    text("Red", graphX - 20, graphY + graphHeight / 2 + 10);
    textAlign(CENTER);
    text("Time", graphX + graphWidth / 2, graphY + graphHeight + 20); // X-axis label

    // Plot the red percentage line
    stroke(255, 0, 0);
    noFill();
    beginShape();
    this.redPercentageHistory.forEach((percentage, index) => {
      const x = graphX + (index / this.redPercentageHistory.length) * graphWidth;
      const y = map(percentage, 0, 100, graphY + graphHeight, graphY);
      vertex(x, y);
    });
    endShape();
  }

  simulate() {
    if (!this.simulateMode) return; // Exit if simulateMode is false

    const currentTime = millis();
    const deltaTime = currentTime - this.lastSimulateTime;

    if (deltaTime >= SIMULATE_INTERVAL) {
      if (this.urn.length >= this.maxBalls) {
        this.simulateMode = false; // Stop simulation if max balls reached
        simulateButton.html('Simulate'); // Update button label
        console.log('Simulation stopped: Maximum number of balls reached.');
        return;
      }

      this.pickAndAddBall();
      this.lastSimulateTime = currentTime;
    }
  }
}