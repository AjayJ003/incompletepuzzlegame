const GameDifficulty=[20,0,0];

function displayImage() {
    var url = document.getElementById('imageURL').value;
    var img = document.querySelector('img');
    img.src = url;
    img.alt = "Image Description";
    img.width = 3500;
    img.height = 380;
}

class Game{
    difficulty;//difficulty based on GameDifficulty array
    cols=3;//how many colomns
    rows=3;//how many rows
    count;//cols*rows
    blocks;//the html elements with className="puzzle_block"
    emptyBlockCoords=[2,2];//the coordinates of the empty block
    indexes=[];//keeps track of the order of the blocks

    constructor(difficultyLevel=1){
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.count=this.cols*this.rows;
        this.blocks=document.getElementsByClassName("puzzle_block");//grab the blocks
        this.init();
    }

    init(){//position each block in its proper position
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                let blockIdx=x+y*this.cols;
                if(blockIdx+1>=this.count)break;
                let block=this.blocks[blockIdx];
                this.positionBlockAtCoord(blockIdx,x,y);
                block.addEventListener('click',(e)=>this.onClickOnBlock(blockIdx));
                this.indexes.push(blockIdx);
            }
        }
        this.indexes.push(this.count-1);
        this.randomize(this.difficulty);
    }

    randomize(iterationCount){//move a random block (x iterationCount)
        for(let i=0;i<iterationCount;i++){
            let randomBlockIdx=Math.floor(Math.random()*(this.count-1));
            let moved=this.moveBlock(randomBlockIdx);
            if(!moved)i--;
        }
    }

    moveBlock(blockIdx){//moves a block and return true if the block has moved
        let block=this.blocks[blockIdx];
        let blockCoords=this.canMoveBlock(block);
        if(blockCoords!=null){
            this.positionBlockAtCoord(blockIdx,this.emptyBlockCoords[0],this.emptyBlockCoords[1]);
            this.indexes[this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols]=this.indexes[blockCoords[0]+blockCoords[1]*this.cols];
            this.emptyBlockCoords[0]=blockCoords[0];
            this.emptyBlockCoords[1]=blockCoords[1];
            return true;
        }
        return false;
    }
    
    canMoveBlock(block){//return the block coordinates if he can move else return null
        let blockPos=[parseInt(block.style.left),parseInt(block.style.top)];
        let blockWidth=block.clientWidth;
        let blockCoords=[blockPos[0]/blockWidth,blockPos[1]/blockWidth];
        let diff=[Math.abs(blockCoords[0]-this.emptyBlockCoords[0]),Math.abs(blockCoords[1]-this.emptyBlockCoords[1])];
        let canMove=(diff[0]==1&&diff[1]==0)||(diff[0]==0&&diff[1]==1);
        if(canMove)return blockCoords;
        else return null;
    }

    positionBlockAtCoord(blockIdx,x,y){//position the block at a certain coordinates
        let block=this.blocks[blockIdx];
        block.style.left=(x*block.clientWidth)+"px";
        block.style.top=(y*block.clientWidth)+"px";
    }

    onClickOnBlock(blockIdx){//try move block and check if puzzle was solved
        if(this.moveBlock(blockIdx)){
            if(this.checkPuzzleSolved()){
                setTimeout(()=>alert("Puzzle Solved!!"),600);
            }
        }
    }

    checkPuzzleSolved(){//return if puzzle was solved
        for(let i=0;i<this.indexes.length;i++){
            if(i==this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols)continue;
            if(this.indexes[i]!=i)return false;
        }
        return true;
    }

    setDifficulty(difficultyLevel){//set difficulty
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.randomize(this.difficulty);
    }

}

var game=new Game(1);//instantiate a new Game


//taking care of the difficulty buttons
var difficulty_buttons=Array.from(document.getElementsByClassName("difficulty_button"));
difficulty_buttons.forEach((elem,idx)=>{
    elem.addEventListener('click',(e)=>{
        difficulty_buttons[GameDifficulty.indexOf(game.difficulty)].classList.remove("active");
        elem.classList.add("active");
        game.setDifficulty(idx+1);
    });
});



var splitImages = [];

   function splitImage() {
     var imageInput = document.getElementById('imageInput');
     var imageGrid = document.getElementById('imageGrid');
     var file = imageInput.files[0];
   
     var reader = new FileReader();
     reader.onload = function(e) {
       var img = new Image();
       img.src = e.target.result;
       img.onload = function() {
         var canvas = document.createElement('canvas');
         var ctx = canvas.getContext('2d');
         var width = img.width / 3;
         var height = img.height / 3;
         canvas.width = width;
         canvas.height = height;
   
         for (var i = 0; i < 9; i++) {
           var x = (i % 3) * width;
           var y = Math.floor(i / 3) * height;
           ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
           var splitImage = canvas.toDataURL('image/jpeg');
           localStorage.setItem('splitImage' + i, splitImage);
           splitImages[i] = splitImage;
           var imageElement = document.createElement('img');
           imageElement.src = splitImage;
           imageElement.classList.add('splitImage');
           imageElement.dataset.index = i;
           imageElement.addEventListener('click', handleImageClick);
           imageGrid.appendChild(imageElement);
           for (let j = 0; j < 9; j++) {
            // Assuming you have an input element with type="file" and id="image-input"
            const fileInput = document.getElementById('image-input');

            // Assuming you have an image element with id="image-display"
            let imgvar = 'puzzle_block_'+j;
            const imageDisplay = document.getElementById(imgvar);

            // Retrieve the image data from local storage
            const imageData = localStorage.getItem('splitImage' + j, splitImage);

            // Set the image source to the retrieved data URL
            imageDisplay.src = imageData;
           }
           


         }
       }
     };
     reader.readAsDataURL(file);
   }
   
   function handleImageClick(event) {
     var clickedImage = event.target;
     var clickedIndex = parseInt(clickedImage.dataset.index);
     var emptyIndex = findEmptyIndex();
   
     if (emptyIndex !== -1) {
       swapImages(clickedIndex, emptyIndex);
       updateImageGrid();
     }
   }
   
   function findEmptyIndex() {
     for (var i = 0; i < splitImages.length; i++) {
       if (!splitImages[i]) {
         return i;
       }
     }
     return -1;
   }
   
   function swapImages(index1, index2) {
     var temp = splitImages[index1];
     splitImages[index1] = splitImages[index2];
     splitImages[index2] = temp;
   }
   
   function updateImageGrid() {
     var imageGrid = document.getElementById('imageGrid');
     imageGrid.innerHTML = '';
   
     for (var i = 0; i < splitImages.length; i++) {
       var splitImage = splitImages[i];
       if (splitImage) {
         var imageElement = document.createElement('img');
         imageElement.src = splitImage;
         imageElement.classList.add('splitImage');
         imageElement.dataset.index = i;
         imageElement.addEventListener('click', handleImageClick);
         imageGrid.appendChild(imageElement);
       }
     }
   }

