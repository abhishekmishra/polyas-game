// Define the time interval for simulation in milliseconds
const SIMULATE_INTERVAL = 5;
// Total number of simulations to run
const TOTAL_SIMS = 3;

let polyasGame;
let pickBallButton;
let simulateButton;
let resetButton;

function setup() {
  // Double the canvas width to accommodate the graph
  createCanvas(800, 400);
  polyasGame = new PolyasGame(2);

  // pickBallButton = createButton('Pick Ball');
  // pickBallButton.position(10, 10);
  // pickBallButton.mousePressed(() => {
  //   const pickedColor = polyasGame.pickAndAddBall();
  //   console.log('Picked Ball Color:', pickedColor === 0 ? 'Red' : 'Blue');
  // });

  simulateButton = createButton("Simulate");
  simulateButton.position(70, 30);
  simulateButton.mousePressed(() => {
    // Toggle simulate mode
    polyasGame.simulateMode = !polyasGame.simulateMode;
    // Update button label
    simulateButton.html(
      polyasGame.simulateMode ? "Stop Simulation" : "Simulate"
    );
  });

  resetButton = createButton("Reset");
  resetButton.position(20, 30);
  resetButton.mousePressed(() => {
    PolyasGame.reset();
    // Reset the game state
    polyasGame = new PolyasGame(2);
    // Ensure simulation mode is off
    polyasGame.simulateMode = false;
    // Reset the simulation button label
    simulateButton.html("Simulate");
  });
}

function draw() {
  background(220);

  // add title text at the top center of the canvas
  textAlign(CENTER);
  textSize(18);
  noStroke();
  fill(0);
  text("Polya's Game Simulation", width / 2, 20);
  textSize(16);

  polyasGame.simulate(() => {
    // if siumlation is stopped check simulationCounter against TOTAL_SIMS
    if (
      polyasGame.simulateMode === false &&
      PolyasGame.simulationCounter >= TOTAL_SIMS
    ) {
      // Stop simulation if max simulations reached
      polyasGame.simulateMode = false;
      console.log("Simulation stopped: Maximum number of simulations reached.");
      // Reset the simulation button label
      simulateButton.html("Simulate");
    } else if (polyasGame.simulateMode === false) {
      // Reset the game state
      polyasGame = new PolyasGame(2);
      // Start simulation if not already started
      polyasGame.simulateMode = true;
      console.log("Simulation started");
    }
  });
  polyasGame.draw();
}
