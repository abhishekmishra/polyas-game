const SIMULATE_INTERVAL = 5; // Define the time interval for simulation in milliseconds
const TOTAL_SIMS = 3; // Total number of simulations to run

let polyasGame;
let pickBallButton;
let simulateButton;
let resetButton;

function setup() {
  createCanvas(800, 400); // Double the canvas width to accommodate the graph
  console.log("Canvas created:", document.querySelector("canvas"));
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
    polyasGame.simulateMode = !polyasGame.simulateMode; // Toggle simulate mode
    simulateButton.html(
      polyasGame.simulateMode ? "Stop Simulation" : "Simulate"
    ); // Update button label
  });

  resetButton = createButton("Reset");
  resetButton.position(20, 30);
  resetButton.mousePressed(() => {
    PolyasGame.reset();
    polyasGame = new PolyasGame(2); // Reset the game state
    polyasGame.simulateMode = false; // Ensure simulation mode is off
    simulateButton.html("Simulate"); // Reset the simulation button label
    console.log("Game reset");
  });
}

function draw() {
  background(220);

  // add title text at the top center of the canvas
  textAlign(CENTER);
  textSize(18);
  fill(0);
  text("Polya's Game Simulation", width / 2, 20);
  textSize(16);

  polyasGame.simulate(() => {
    // if siumlation is stopped check simulationCounter against TOTAL_SIMS
    if (
      polyasGame.simulateMode === false &&
      PolyasGame.simulationCounter >= TOTAL_SIMS
    ) {
      polyasGame.simulateMode = false; // Stop simulation if max simulations reached
      console.log("Simulation stopped: Maximum number of simulations reached.");
      // change button label to simulate
      simulateButton.html("Simulate"); // Reset the simulation button label
    } else if (polyasGame.simulateMode === false) {
      polyasGame = new PolyasGame(2); // Reset the game state
      polyasGame.simulateMode = true; // Start simulation if not already started
      console.log("Simulation started");
    }
  });
  polyasGame.draw();
}
