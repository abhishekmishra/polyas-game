
class PolyasGame {
    static simulationCounter = -1; // Make simulationCounter static to persist across instances
    static graph =  null;

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

      if (!PolyasGame.graph) {
        PolyasGame.graph = new TimeSeriesGraph(400, 50, 350, 300); // Create a new graph instance if it doesn't exist
      }
  
      // Increment simulationCounter for each new instance
      PolyasGame.simulationCounter++;
  
      // Create a TimeSeriesGraph instance for the red percentage history
    //   PolyasGame.graph.addDataSeries(); // Add a series for ensemble average
    }
  
    static reset() {
      PolyasGame.graph.reset();
      this.simulationCounter = -1; // Reset simulation counter
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
      PolyasGame.graph.draw();
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
  
      // Add data point to the graph for the current simulation
      const seriesIndex = PolyasGame.simulationCounter; // Use static simulationCounter
      if (!PolyasGame.graph.dataSeries[seriesIndex]) {
        PolyasGame.graph.addDataSeries(); // Add a new series if it doesn't exist
      }
      PolyasGame.graph.addDataPoint(seriesIndex, stats.redPercentage);
  
      // console.log(`SimulationCounter (static): ${PolyasGame.simulationCounter}`); // Debug: Log the static simulation counter
      // console.log(`Current Series Index: ${seriesIndex}`); // Debug: Log the current series index
      // console.log(`Data Series Length: ${PolyasGame.graph.dataSeries.length}`); // Debug: Log the number of data series in the graph
  
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
  
    simulate(onFull) {
      if (!this.simulateMode) return; // Exit if simulateMode is false
  
      const currentTime = millis();
      const deltaTime = currentTime - this.lastSimulateTime;
  
      if (deltaTime >= SIMULATE_INTERVAL) {
        if (this.urn.length >= this.maxBalls) {
          this.simulateMode = false; // Stop simulation if max balls reached
          console.log('Simulation stopped: Maximum number of balls reached.');
          onFull(); // Call the callback function when simulation stops
          return;
        }
  
        this.pickAndAddBall();
        this.lastSimulateTime = currentTime;
      }
    }
  }
  