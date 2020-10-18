// velocity = mm/s
// pos = mm from origin
// size = mm
let SPEED = 100 // calculations per second in the model
let particles
let walls
function setup() {
  createCanvas(400, 400);
  // create array of particles
  // create array of walls
  walls = createWalls()
  particles = []
  frameRate(60)
}


function draw() {
  background(220);
  //update all particles
  particles.forEach((part, index) =>{
    if(!part.update(particles, walls)){
      particles.splice(index, 1)
    }

  })
  //draw all walls
  walls.forEach(wall => wall.draw())
  //draw all particles
  particles.forEach(part => part.draw())
  if(frameCount%3 == 0){
    particles.push(new Particle(createVector(399.99,200-random(10)),2,createVector(-350,random(-5,-2))))
  }
}

function createWalls(){
  let walls = []
  walls.push(new Wall(createVector(0,220),createVector(60,200),5))
  walls.push(new Wall(createVector(60,200),createVector(80,200),5))
  walls.push(new Wall(createVector(0,220),createVector(0,200),5))
  walls.push(new Wall(createVector(400,200),createVector(400,180),5))
  valve(0,1.5,walls)
  valve(160,1.5,walls)
  valve(320,1.5,walls)
  valve(80,-1.5,walls)
  valve(240,-1.5,walls)
  valve(400,-1.5,walls)
  return walls
}

function valve(x,dir,walls){
  walls.push(new Wall(createVector(x+0,200-0*dir),createVector(x+30,200-10*dir),5))
  walls.push(new Wall(createVector(x+30,200-10*dir),createVector(x+100,200-50*dir),5))
  walls.push(new Wall(createVector(x+100,200-50*dir),createVector(x+120,200-50*dir),5))
  walls.push(new Wall(createVector(x+120,200-50*dir),createVector(x+140,200-30*dir),5))
  walls.push(new Wall(createVector(x+140,200-30*dir),createVector(x+130,200-0*dir),5))
  walls.push(new Wall(createVector(x+130,200-0*dir),createVector(x+160,200-0*dir),5))
  
  walls.push(new Wall(createVector(x+60,200-10*dir),createVector(x+100,200-30*dir),5))
  walls.push(new Wall(createVector(x+100,200-30*dir),createVector(x+100,200-10*dir),5))
  walls.push(new Wall(createVector(x+100,200-10*dir),createVector(x+60,200-10*dir),5))
  return walls
}

class Wall{
  constructor(pt1,pt2,thickness){
    this.pt1 = pt1
    this.pt2 = pt2
    this.n = pt1.copy().sub(pt2)
    this.thickness = thickness/5
  }
  //function to draw a wall
  draw(){
      strokeWeight(this.thickness)
      line(this.pt1.x,this.pt1.y,this.pt2.x,this.pt2.y)
    }
}

class Particle{
  constructor(pos, size, velocity){
    this.pos = pos
    this.size = size
    this.velocity = velocity
  }
  draw(){
    circle(this.pos.x, this.pos.y, this.size)
  }
  
  update(particles, walls){
    //calculate forces between particles and new velocity
    for(let i = 0; i < particles.length; i++){
      let particle = particles[i]
      let force = this.pos.copy().sub(particle.pos)
      if(force.mag()<20){
        console.log(force.mag())
        this.velocity.add(force.normalize().mult(1/(force.mag())))
        particle.velocity.add(force.normalize().mult(1+-1/(force.mag())))
      }
    }
    
    //reflect particles off walls and calculate new velocity
    for(let i = 0; i < walls.length; i++){
      let wall = walls[i]
      if(this.reflectOfWall(wall)){
        break
      }
    }
    //calculate new position of particle
    this.pos.x += this.velocity.x/SPEED
    this.pos.y += this.velocity.y/SPEED
    if(this.pos.x>400||this.pos.x<0||this.pos.y>400||this.pos.y<0){
      return false
    }
    return true
  }
  reflectOfWall(wall){
    let b = wall.pt1.copy().sub(wall.pt2)
    let c = wall.pt2.copy().sub(this.pos)
    let a = this.velocity.copy().div(SPEED)
    
    //a particle should be reflected, if its path intersects with a line
    let facA = (b.y*c.x-b.x*c.y)/(a.x*b.y-a.y*b.x)
    let facB = -(c.y-facA*a.y)/b.y
    //if by is 0, facB is not a number
    if(b.y==0){
      facB =-(c.x-facA*a.x)/b.x
    }
    

    if(facA<=1&&facA>=0&&facB<=1&&facB>=0){
      console.log("inside")
      this.velocity = this.velocity.rotate(this.velocity.angleBetween(wall.n)*2)
      return true;
    }
    return false;
  }
}