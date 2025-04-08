
class TimeSeriesGraph {
    static instance = null; // Static instance to ensure a single graph is shared
  
    constructor(x, y, width, height) {
      if (TimeSeriesGraph.instance) {
        return TimeSeriesGraph.instance; // Return the existing instance if it exists
      }
  
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.dataSeries = []; // Array to hold multiple time series
      this.ensembleAverageSeries = []; // Separate series for ensemble average
      this.ensembleAverageColor = color(50, 150, 50); // Green color for ensemble average
  
      TimeSeriesGraph.instance = this; // Save the instance
    }
  
    reset() {
      this.ensembleAverageSeries = []; // Reset the ensemble average series
      this.dataSeries = []; // Reset the data series
    }
  
    addDataSeries() {
      this.dataSeries.push([]); // Add a new empty time series
    }
  
    addDataPoint(seriesIndex, value) {
      if (this.dataSeries[seriesIndex]) {
        this.dataSeries[seriesIndex].push(value); // Add value to the specified time series
        this.updateEnsembleAverage(); // Update ensemble average after adding a data point
      }
    }
  
    updateEnsembleAverage() {
      if (this.dataSeries.length === 0) return; // No simulations to average
  
      const ensembleAverage = [];
      const numSimulations = this.dataSeries.length;
  
      // Calculate the average for each time step
      for (let i = 0; i < this.dataSeries[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < numSimulations; j++) {
          if (this.dataSeries[j][i] !== undefined) {
            sum += this.dataSeries[j][i];
          }
        }
        ensembleAverage[i] = sum / numSimulations;
      }
  
      // Update the ensemble average series
      this.ensembleAverageSeries = ensembleAverage;
  
      // Debug: Print the updated ensemble average
      // console.log('Updated Ensemble Average:', this.ensembleAverageSeries);
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
  
      // Plot the ensemble average series
      if (this.ensembleAverageSeries.length > 0) {
        stroke(this.ensembleAverageColor); // Green for ensemble average
        noFill();
        beginShape();
        this.ensembleAverageSeries.forEach((value, index) => {
          const x = this.x + (index / this.ensembleAverageSeries.length) * this.width;
          const y = map(value, 0, 100, this.y + this.height, this.y);
          vertex(x, y);
        });
        endShape();
      }
  
      // Plot each time series
      this.dataSeries.forEach((series, seriesIndex) => {
        const lineColor = color(255, 0, 0, 255 - seriesIndex * 50); // Different shades of red for each series
        stroke(lineColor);
        noFill();
        beginShape();
        series.forEach((value, index) => {
          const x = this.x + (index / series.length) * this.width;
          const y = map(value, 0, 100, this.y + this.height, this.y);
          vertex(x, y);
        });
        endShape();
      });
  
      // Add label for ensemble average
      noStroke();
      fill(0);
      textAlign(LEFT);
      textSize(12);
      text("Ensemble average", this.x, this.y + this.height + 40);
  
      // Draw line for ensemble average color
      stroke(this.ensembleAverageColor);
      line(this.x + 120, this.y + this.height + 35, this.x + 160, this.y + this.height + 35);
    }
  }
  