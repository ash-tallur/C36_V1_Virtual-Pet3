var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var readGameState,changeGameState;
var bedImg,gardenImg,washroomImg;
var currentTime;
var gameState;

//loading the respective image of the dog sprite
function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
bedImg = loadImage("Images/Bed Room.png");
gardenImg = loadImage("Images/Garden.png")
washroomImg = loadImage("Images/Wash Room.png");
}

function setup() {

  //creating a copy of the firbase database
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  //setting a listener event who keeps track changes in the foodStock
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  //creating button for feeding the dog
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  //creating button for adding food stock
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readGameState = database.ref("gameState");
  readGameState.on("value",function(data){
    gameState = data.val();
  })

}

function draw() {
  background(46,139,87);

  //displaying the foodstock
  foodObj.display();

  //reading the lastfed time
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  //displayin the time based in lastfed value
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

  currentTme = hour()
  console.log(currentTime)
  if(currentTime === (lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else {
    update("Hungry");
    foodObj.display();
  }

  if(gameState!= "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage("dog",happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//function to update the gamestate in the database 
function update(state){
  database.ref('/').update({
    gameState: state
  });
}

async function hour(){
  var response = await fetch('https://worldclockapi.com/api/json/est/now');
  var responseJSON = await response.json();
  console.log(responseJSON.currentDateTime);
  var datetime = responseJSON.currentDateTime;
  var hour = datetime.slice(11,13);
  return hour;
}
