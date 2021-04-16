let pxls
let velos
let rows = 400
let cols = 400

function setup() {
  createCanvas(400, 400);
  pxls=new Float32Array(rows*cols)
  velos=new Float32Array(rows*cols*2)
  velos.fill(1)
  
  
  for(let y = 0; y < rows;y++) {
    for(let x = 0; x < cols;x++) {
      pxls[y*rows+x] = noise(x*1.0/255.0,y*1.0/255.0)*200
    }
  }
}

function draw() {
  frameRate(60)
  
  loadPixels()
  background(100);
  for(let y = 0; y < rows;y++) {
    for(let x = 0; x < cols;x++) {
      updateVelo(x,y)
      updatePxl(x,y)
      
      let pos = getPos(x,y)
      pixels[pos*4] = Math.floor(pxls[pos])
      pixels[pos*4+1] = Math.floor(pxls[pos])
      pixels[pos*4+2] = Math.floor(pxls[pos])
      pixels[pos*4+3] = 255
    }
  }
  updatePixels();
}
function getPos(x,y){
  return x+rows*y
}

function updateVelo(x,y){
  //calculates x and y velocity, negativ will be to left top
  //velo will be increased, if the pixel right or bottom has a higher value, than the oposite pxl
  let top = getPos(x,y-1)
  let bottom = getPos(x,y+1)
  let left = getPos(x-1,y)
  let right = getPos(x+1,y)
  let pos = getPos(x,y)
  let diffx = 0
  let diffy = 0
  
  if(x>0 && x<399){
    diffx = pxls[right] - pxls[left]
  }
  
  if(y>0 && y<399){
    diffy = pxls[bottom] - pxls[top]
  }
  
  velos[pos*2] -= diffx/10
  velos[pos*2+1] -= diffy/10
  
  if(x==20&&y==20){
    console.log(diffx)
    console.log(diffy)
    console.log(pxls[bottom])
    console.log(pxls[top])
    console.log(pxls[left])
    console.log(pxls[right])
  }
  
}


function updatePxl(x,y){
  let top = getPos(x,y-1)
  let bottom = getPos(x,y+1)
  let left = getPos(x-1,y)
  let right = getPos(x+1,y)
  let pos = getPos(x,y)
  let velx = velos[pos*2]
  let vely = velos[pos*2+1]
  
  curr = pxls[pos]
  
  curr-=Math.abs(velx/100)
  if(velx>0){
    pxls[right]+=velx/100
  }else{
    pxls[left]-=velx/100
  }
  
  curr-=Math.abs(vely/100)
  if(vely>0){
    pxls[bottom]+=vely/100
  }else{
    pxls[top]-=vely/100
  }
  
  pxls[pos] = curr
}