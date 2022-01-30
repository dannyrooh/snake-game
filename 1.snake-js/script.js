let canvas = document.getElementById("snack");
let context = canvas.getContext("2d");
let box = 32;

let jogo;
let fruit = 0;

let defaultFood = "square";
let snake = [];


let novo = document.getElementById("newGame");
novo.onclick = function( ) {
    fruit = 0;
    clearInterval(jogo);
    start();
}

let stop = document.getElementById("stopGame");

stop.onclick = function () {
    clearInterval(jogo);
    criarBG();
    drawPlacar();
}


/*direções da cobrinha*/
const TECLA = {
        right: "right",
        down: "down",
        left: "left",
        up: "up"
};

const KEYCODE = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
    
};

/*food*/
function randomFood() {
    return {
        x: Math.floor(Math.random() * 15 + 1) * box,
        y: Math.floor(Math.random() * 15 + 1) * box    
    }
}

let food = randomFood();

let direction = TECLA.right;

/* background*/
function criarBG() {
    context.fillStyle = "lightgreen";
    context.fillRect(0,0, 16 * box, 16 * box);
}

/*create snack*/
function criarCobrinha(){
    for(i=0; i < snake.length; i++) {
        context.fillStyle = "green";
        context.fillRect( snake[i].x, snake[i].y, box, box);
    }
}

/*desenhar comida*/
function drawFood() {

   if (defaultFood == "square"){
      context.fillStyle = "red";
      context.fillRect(food.x, food.y, box, box);
   } else {
     const radius = box / 2;
     context.beginPath();
     context.arc(food.x, food.y, radius, 0, 2 * Math.PI, false);
     context.fillStyle = 'red';
     context.fill();
   }
    
}


/* evento para capturar das teclas*/
document.addEventListener('keydown', update);

/* a direção da cobra não pode ser oposta*/
function update(event){

    if(event.keyCode == KEYCODE.left && direction != TECLA.right) {
        direction = TECLA.left;
    }else if(event.keyCode == KEYCODE.down && direction != TECLA.up) {
        direction = TECLA.down;
    }else if(event.keyCode == KEYCODE.right && direction != TECLA.left) {
        direction = TECLA.right;
    }else if(event.keyCode == KEYCODE.up && direction != TECLA.down) {
        direction = TECLA.up;
    }

}


function drawPlacar() {
    /*fruta comidas*/
    context.font='25px arial';
    context.fillStyle='blue';
    context.lineWidth=4;
    context.fillText('Frutas: '+ fruit, 200, 300);
    fruit = 0;
}


function drawGameOver() {
    
    context.font='50px arial';
    context.fillStyle='blue';
    context.lineWidth=4;
    context.fillText('GAME OVER! :(', 100, 250);

    drawPlacar();
}


/*verifica se a cobra se choca*/
function snakeTouch(){

    let result = true;
    for(i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            clearInterval(jogo);
            criarBG();
            drawGameOver();
            result = false;
        }
    }

    return result;
}


/*tratamento para a cobra coltar para o plano cartesiano e atravesar o canvas*/
function inverterDirecao(){
   if (snake[0].x > 15 * box && direction == TECLA.right) {
       snake[0].x = 0;
   } else if (snake[0].x < 0  && direction == TECLA.left) {
       snake[0].x = 16 * box;
   } else if (snake[0].y > 15 * box && direction == TECLA.down) {
       snake[0].y = 0;
   } else if (snake[0].y < 0  && direction == TECLA.up) {
       snake[0].y = 16 * box;
   }
}

/*função daemon do jogo*/
function iniciarJogo() {

    inverterDirecao();

    if (!snakeTouch())
      return;

    criarBG();
    criarCobrinha();
    drawFood();

    let snakeX =  snake[0].x;
    let snakeY =  snake[0].y;

    //lado para que a cobra vai
    if(direction == TECLA.right){
      snakeX += box;
    } else if (direction == TECLA.left) {
      snakeX -= box;
    } else if (direction == TECLA.up) {
        snakeY -= box;
    }
    else if (direction == TECLA.down)  {
        snakeY += box;
    };

    /*cobra comendo a comida*/
    if ( snakeX != food.x || snakeY != food.y){
        snake.pop();
    }else {
        food = randomFood();
        fruit += 1;
    }

    //acrescentar movimento da cobra
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    snake.unshift(newHead);

}


function start() {
    snake = [];
    snake.push( { x: 8 * box, y: 8 * box} );
    jogo = setInterval(iniciarJogo, 100);
}

start();