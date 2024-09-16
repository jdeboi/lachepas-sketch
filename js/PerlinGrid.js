class PerlinGrid {
  constructor(gridSize, spacing, noiseScale, zOffsetSpeed) {
    this.gridSize = gridSize; // Number of points in the grid (2D)
    this.spacing = spacing; // Distance between grid points
    this.noiseScale = noiseScale/2; // Scale for the noise function
    this.zOffsetSpeed = zOffsetSpeed/3; // How fast the z-offset increases for animation
    this.zOffset = 0; // Initial z-offset
  }

  // Method to update the grid's z-offset (for animation)
  update() {
    this.zOffset += this.zOffsetSpeed;
  }

  // Display method to draw the 2D grid with a 3D illusion using Perlin noise
  display() {
    push();
    rotateX(PI/3);
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        // Calculate 2D noise value based on x, y positions and zOffset for animation
        

        // Map the noise value to a z-displacement range
        
        // Calculate the actual 2D position of the grid point
        let xPos = (x - this.gridSize / 2) * this.spacing;
        let yPos = (y - this.gridSize / 2) * this.spacing;
        let zPos = this.getZ(x, y);
        
        // Draw the point at the calculated position with a 3D depth illusion
        push();
        translate(xPos, yPos, zPos); // zPos adds the illusion of depth
        stroke(255);
        // point(0, 0, 0);
        pop();
      }
    }
    pop();
  }
  
  getZGrid(xPos, yPos) {
     // let xPos = (x - this.gridSize / 2) * this.spacing;
     //    let yPos = (y - this.gridSize / 2) * this.spacing;
    let x = (xPos / this.spacing) + (this.gridSize/2);
    let y = (yPos/ this.spacing) + (this.gridSize/2);
    
    let noiseValue = noise(
          x * this.noiseScale,
          y * this.noiseScale + this.zOffset
        );
     let zPos = map(noiseValue, 0, 1, -50, 50); // This gives the illusion of depth
        zPos = 10*sin(y/5 + frameCount/30);
    return zPos;
  }
  
  getZ(x, y) {

    let noiseValue = noise(
          x * this.noiseScale,
          y * this.noiseScale + this.zOffset
        );
     let zPos = map(noiseValue, 0, 1, -50, 50); // This gives the illusion of depth
        zPos = 10*sin(y/5 + frameCount/30);
    return zPos;
  }
}
