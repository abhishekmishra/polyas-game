// Define the time interval for simulation in milliseconds
const SIMULATE_INTERVAL = 1;
// Total number of simulations to run
let TOTAL_SIMS = 3;

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

  simulateButton = createButton("Simulate ▶️");
  simulateButton.position(70, 30);
  simulateButton.mousePressed(() => {
    // Toggle simulate mode
    polyasGame.simulateMode = !polyasGame.simulateMode;
    // Update button label
    simulateButton.html(
      polyasGame.simulateMode ? "Stop 🚫" : "Simulate ▶️"
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
    simulateButton.html("Simulate ▶️");
  });

  // label for input
  const label = createDiv("# Runs");
  label.position(170, 30);

  // Create a text input to get the number of
  // simulations from the user
  // start with default value of TOTAL_SIMS
  const input = createInput(TOTAL_SIMS.toString(), "number");
  input.position(220, 30);
  input.size(50);
  // on change set the TOTAL_SIMS to the value in the input
  input.input(() => {
    const value = parseInt(input.value(), 10);
    if (!isNaN(value) && value > 0) {
      TOTAL_SIMS = value;
      console.log("Total simulations set to:", TOTAL_SIMS);
    } else {
      console.error("Invalid input for total simulations:", input.value());
    }
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
      simulateButton.html("Simulate ▶️");
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
