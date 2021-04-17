let densityPoints
let velos
let rows = 500
let cols = 500
let canRows = 1000
let canCols = 1000

function setup() {
  createCanvas(canRows, canCols);
  densityPoints=new Float32Array(rows*cols)

  //the x-velocities are an array, with the dimensions rows-1,cols-1
  xvelos=new Float32Array((rows-1)*(cols-1))
  xvelos.fill(0)

  //the y-velocities are an array, with the dimensions rows-1,cols-1
  yvelos=new Float32Array((rows-1)*(cols-1))
  yvelos.fill(0)
  
  
  for(let y = 0; y < rows;y++) {
    for(let x = 0; x < cols;x++) {
      densityPoints[y*cols+x] = noise(x*1.0/255.0,y*1.0/255.0)*255
    }
  }
}

function draw() {
  frameRate(60)
  
  loadPixels()
  background(100);
  
  //physics loop
  for (let i = 0; i < 500; i++) {
    movements()
  }

  //graphics loop
  for(let y = 0; y < canRows;y++) {
    for(let x = 0; x < canCols;x++) {
      
      let canPos = x+y*canCols
      let pos = Math.floor(y/canRows*rows)*(cols)+Math.floor(x/canCols*cols)

      pixels[canPos*4] = Math.floor(densityPoints[pos])
      pixels[canPos*4+1] = Math.floor(densityPoints[pos])
      pixels[canPos*4+2] = Math.floor(densityPoints[pos])
      pixels[canPos*4+3] = 255
    }
  }
  updatePixels();
}
function getPos(x,y){
  if(x+1>cols||y+1>rows||x<0||y<0){
    return -1
  }
  return x+rows*y
}
function getxvPos(x,y){
  return x+(rows-1)*y
}

function movements(){
  // this funciton will go throu all the possible movements of pixels.
  //currently possible is vertical and horizontal.
  //if a densityPoint has more density,than its neighbors, 
  //the velocity between these Points will be increased towards the Point with the lower density
  
  for(let x=0;x<cols-1;x++){ 
    for(let y=0;y<rows-1;y++){
      xvel(x,y)
    }
  }
  for(let x=0;x<cols-1;x++){ 
    for(let y=0;y<rows-1;y++){
      yvel(x,y)
    }
  }

  for(let x=0;x<cols-1;x++){ 
    for(let y=0;y<rows-1;y++){
      xmovement(x,y)
    }
  }
  for(let x=0;x<cols-1;x++){ 
    for(let y=0;y<rows-1;y++){
      ymovement(x,y)
    }
  }
}

function xvel(x,y){//the x is the x coordinate of the movement, so the x coordinate of the left density point
  //get the densities
  let density1= densityPoints[getPos(x,y)]
  let density2= densityPoints[getPos(x+1,y)]

  //check, how to change the velocities
  let diff = density1-density2
  //increase the velocity of this movement by the difference/someValue
  xvelos[getxvPos(x,y)] = diff/10*0.1+xvelos[getxvPos(x,y)]*0.9
}
function xmovement(x,y){
  //move material using the velocities, check if there is enougth material to transport

  densityPoints[getPos(x,y)] -= xvelos[getxvPos(x,y)]
  densityPoints[getPos(x+1,y)] += xvelos[getxvPos(x,y)]
}

function yvel(x,y){//the x is the x coordinate of the movement, so the x coordinate of the left density point
  //get the densities
  let density1= densityPoints[getPos(x,y)]
  let density2= densityPoints[getPos(x,y+1)]

  //check, how to change the velocities
  let diff = density1-density2
  //increase the velocity of this movement by the difference/someValue
  yvelos[getxvPos(x,y)] = diff/10*0.1+yvelos[getxvPos(x,y)]*0.9
}
function ymovement(x,y){
  //move material using the velocitie
  densityPoints[getPos(x,y)] -= yvelos[getxvPos(x,y)]
  densityPoints[getPos(x,y+1)] += yvelos[getxvPos(x,y)]
}