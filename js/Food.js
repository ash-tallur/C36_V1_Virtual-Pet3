class Food {
    constructor(){
    this.foodStock=0;
    this.lastFed;
    this.image=loadImage('Images/Milk.png');
    }


//updating the food stock in the database
   updateFoodStock(foodStock){
    this.foodStock=foodStock;
   }
//reading the last fed time from the database
   getFedTime(lastFed){
     this.lastFed=lastFed;
   }

//deducting the foodstock
   deductFood(){
     if(this.foodStock>0){
      this.foodStock=this.foodStock-1;
     }
    }
//reading the food stock data from the database
    getFoodStock(){
      return this.foodStock;
    }

//displaying the milk bottles based on the food stock
    display(){
      var x=80,y=100;
      
      imageMode(CENTER);
      image(this.image,720,220,70,70);
      
      if(this.foodStock!=0){
        for(var i=0;i<this.foodStock;i++){
          if(i%10==0){
            x=80;
            y=y+50;
          }
          image(this.image,x,y,50,50);
          x=x+30;
        }
      }
    }

    bedroom(){
      background(bedImg)
    }

    garden(){
      background(gardenImg)
    }

    washroom(){
      background(washroomImg)
    }
}
