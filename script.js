'use strict';

const winnerModal = new bootstrap.Modal(document.getElementById('winner-modal'));
const canvasWidth = document.getElementById('myCanvas').offsetWidth;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

const startButton = document.getElementById('start-game');
const animalImage = document.getElementById('animal-img');
const animalImageWin = document.getElementById('animal-img-win');
const returnBtns = document.getElementsByClassName('return-to-start');
const animalMoves = document.getElementById('moves');
const lynxMovesLeftText = document.getElementById('lynx-moves-left');

let lynxMovesLeft = 10;
let gameActive = false;
let activeAnimal = 0;
let fieldColor = "limegreen";

const gridCount = 6;
const gridFieldWidth = gridCount-1;
const gridCellSizePx = canvasWidth / (gridFieldWidth+2);
const ballRadius = gridCellSizePx / 10;

const positions = {};
const relations = {};

const lynxStart = 'p21';
const perdicinaeStart = 'p31';

const lynx = {
    name: 'lynx',
    colour: "#F1B10C",
    position: lynxStart,
};

const perdicinae = {
    name: 'perdicinae',
    colour: "#8F7124",
    position: perdicinaeStart,
};

const animals = [lynx, perdicinae];
const LynxIdx = 0;

function init(){
    for(const r of Array(gridCount).keys()){
        for(const c of Array(gridCount).keys()){
            let key = grid2line(r,c);
            // setup positions
            positions[key] = {x: (c+1)*gridCellSizePx, y: (r+1)*gridCellSizePx};
            // setup relations
            relations[key] = neigborArray(r,c);
        }
    }

    function grid2line(r, c){
        return "p" + (gridCount * r + c + 1).toString();
    }

    function neigborArray(r,c) {
        const nArr = [];
        // standard grid neighbors
        if (r-1 >= 0){
            nArr.push(grid2line(r-1,c));
        }
        if (r+1 < gridCount){
            nArr.push(grid2line(r+1,c));
        }
        if (c-1 >= 0){
            nArr.push(grid2line(r,c-1));
        }
        if (c+1 < gridCount){
            nArr.push(grid2line(r,c+1));
        }

        // center special cross
        const key = grid2line(r,c);
        const center = [[2,2], [2,3], [3,2], [3,3]].map(x => grid2line(x[0], x[1]));
        const idx = center.indexOf(key);
        if(idx !== -1){
            nArr.push(center[(center.length-1) - idx]);
        }
        return nArr;
    }
};

function drawField() {
    Object.keys(positions).forEach(key => {
        let position = positions[key];
        ctx.beginPath();
        ctx.arc(position.x, position.y, ballRadius, 0, Math.PI*2, false);
        ctx.fillStyle = fieldColor;
        ctx.fill();
        ctx.closePath();

        if (!relations[key]) {
            return;
        }

        relations[key].forEach(relation => {
            ctx.beginPath();
            ctx.moveTo(position.x, position.y);
            ctx.lineTo(positions[relation].x, positions[relation].y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = fieldColor;
            ctx.stroke();
        });
    });
}

function drawAnimals() {
    animals.forEach(animal => {
        ctx.beginPath();
        ctx.arc(
            positions[animal.position].x,
            positions[animal.position].y,
            gridCellSizePx / 5,
            0,
            Math.PI * 2
            , false
        );
        ctx.fillStyle = animal.colour;
        ctx.fill();
        ctx.closePath();
        console.log();
    })
}

function drawMoves(animal) {
    let possibleMoves = relations[animal.position];

    possibleMoves.forEach(position => {
        drawOneMove(animal, position);
    })
}

function drawOneMove(animal, position) {
    ctx.beginPath();
    ctx.arc(positions[position].x, positions[position].y, gridCellSizePx / 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = animal.colour;
    ctx.stroke();
    ctx.closePath();
}

function positionWithinMove(animal, position, mouse) {
    // Hack to allow using isPointInPath function
    // by redrawing already existing possible move ball
    drawOneMove(animal, position);

    return ctx.isPointInPath(mouse.x, mouse.y);
}

function startGame() {
    resetAnimalPositions();
    drawMoves(animals[activeAnimal]);
    updateAnimalImage(animals[activeAnimal]);

    // show startButton as active
    startButton.classList.remove('btn-warning');
    startButton.classList.add('btn-danger');
    startButton.textContent = 'Sākt vēlreiz';

    // show game HUD details
    animalMoves.classList.remove('visually-hidden');
    animalImage.classList.remove('visually-hidden');

    gameActive = true;
}

function resetAnimalPositions() {
    activeAnimal = 0;
    lynxMovesLeft = 10;
    lynxMovesLeftText.textContent = String(lynxMovesLeft);
    lynx.position = lynxStart;
    perdicinae.position = perdicinaeStart;

    draw();
}

function updateAnimalImage(animal) {
    animalImage.style.borderColor = animal['colour'];
    animalImage.src = `${animal['name']}.jpg`;
}

startButton.addEventListener('click', startGame);

document.querySelectorAll('.return-to-start').forEach(item => {
    item.addEventListener('click', event => {
        resetAnimalPositions();

        // show startButton (inactive?) green
        startButton.classList.add('btn-warning');
        startButton.classList.remove('btn-danger');
        startButton.textContent = 'Sākt spēli';

        // hide game HUD details
        animalMoves.classList.add('visually-hidden');
        animalImage.classList.add('visually-hidden');

        gameActive = false;
    })
})

canvas.addEventListener(
    "click",
    function(event) {
        if (!gameActive) {
            return;
        }

        const mouse = getMousePos(canvas, event);
        const modalText = document.getElementById('winner');

        let possibleMoves = relations[animals[activeAnimal].position];

        let validMove = null;
        for (const move of possibleMoves) {
            if (positionWithinMove(activeAnimal, move, mouse)) {
                // mouse click on possible move
                validMove = move;
                break;
            }
        }
        if (validMove == null){
            // mouse click outside all possible move's ballRadius-es
            // do nothing
            return;
        }

        const aniPosX = Math.round(mouse.x / gridCellSizePx) * gridCellSizePx;
        const aniPosY = Math.round(mouse.y / gridCellSizePx) * gridCellSizePx;

        animals[activeAnimal].position = Object.keys(positions)
            .find(key => positions[key].x === aniPosX && positions[key].y === aniPosY);

        // update lynx moves left
        if (activeAnimal === LynxIdx) {
            lynxMovesLeft--;
            lynxMovesLeftText.textContent = String(lynxMovesLeft);
        }

        // end game: lynx caught perdicinae
        if (lynx.position === perdicinae.position) {
            modalText.textContent = String('Lūsis noķēra irbi');
            animalImageWin.src = `${lynx.name}-win.jpg`;
            winnerModal.show();
            return;
        }

        // end game: lynx ran out of moves
        if (lynxMovesLeft === 0) {
            modalText.textContent = String('Irbe aizbēga');
            animalImageWin.src = `${perdicinae.name}-win.jpg`;
            winnerModal.show();
            return;
        }

        activeAnimal = activeAnimal === LynxIdx ? 1 : LynxIdx;

        // update game HUD for animal turn details
        let animalName = activeAnimal === LynxIdx ? 'Lūša' : 'Irbes';
        document.getElementById('animal').textContent = `${animalName} gājiens`;

        updateAnimalImage(animals[activeAnimal]);
        draw();
        drawMoves(animals[activeAnimal]);

    },
    false
);

function getMousePos(canvas, evt) {
    let ClientRect = canvas.getBoundingClientRect();

    return {
        x: Math.round(evt.clientX - ClientRect.left),
        y: Math.round(evt.clientY - ClientRect.top)
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawField();
    drawAnimals();
}

init();
draw();
