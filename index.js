const SIMULATE_INTERVAL = 25; // Define the time interval for simulation in milliseconds

let polyasGame;
let pickBallButton;
let simulateButton;
let resetButton;

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

  resetButton = createButton('Reset');
  resetButton.position(250, 10);
  resetButton.mousePressed(() => {
    polyasGame = new PolyasGame(2); // Reset the game state
    polyasGame.simulateMode = false; // Ensure simulation mode is off
    simulateButton.html('Simulate'); // Reset the simulation button label
    console.log('Game reset');
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

    // Create a TimeSeriesGraph instance for the red percentage history
    this.graph = new TimeSeriesGraph(400, 50, 300, 300);
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
    this.graph.draw();
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
    this.graph.addDataPoint(stats.redPercentage); // Add data point to the graph

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

class TimeSeriesGraph {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.data = [];
  }

  addDataPoint(value) {
    this.data.push(value);
  }

  draw() {
    // Draw axes
    stroke(0);
    line(this.x, this.y, this.x, this.y + this.height); // Y-axis
    line(this.x, this.y + this.height, this.x + this.width, this.y + this.height); // X-axis

    // Add labels
    noStroke();
    fill(0);
    textSize(12);
    textAlign(CENTER);
    text("%", this.x - 20, this.y + this.height / 2 - 10);
    text("of", this.x - 20, this.y + this.height / 2);
    text("Red", this.x - 20, this.y + this.height / 2 + 10);
    textAlign(CENTER);
    text("Time", this.x + this.width / 2, this.y + this.height + 20); // X-axis label

    // Plot the data line
    stroke(255, 0, 0);
    noFill();
    beginShape();
    this.data.forEach((value, index) => {
      const x = this.x + (index / this.data.length) * this.width;
      const y = map(value, 0, 100, this.y + this.height, this.y);
      vertex(x, y);
    });
    endShape();
  }
}