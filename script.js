'use strict';

const myModal = new bootstrap.Modal(document.getElementById('winner-modal'));
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
let showMoves = false;
let activeAnimal = 0;
let fieldColor = "limegreen";
let mouse;

const size = canvasWidth / 7;
const ballRadius = size / 10;

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

function init(){
    let arrSize = 6;
    for(const r of Array(arrSize).keys()){
        for(const c of Array(arrSize).keys()){
            let key = grid2line(r,c);
            // setup positions
            positions[key] = {x: (c+1)*size, y: (r+1)*size};
            // setup relations
            relations[key] = neigborArray(r,c);
        }
    }

    function grid2line(r, c){
        return "p" + (arrSize * r + c + 1).toString();
    }

    function neigborArray(r,c) {
        const nArr = [];
        // standard grid neighbors
        if (r-1 >= 0){
            nArr.push(grid2line(r-1,c));
        }
        if (r+1 < arrSize){
            nArr.push(grid2line(r+1,c));
        }
        if (c-1 >= 0){
            nArr.push(grid2line(r,c-1));
        }
        if (c+1 < arrSize){
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
    Object.keys(positions).forEach(function (key) {
        let position = positions[key];
        ctx.beginPath();
        ctx.arc(position.x, position.y, ballRadius, 0, Math.PI*2, false);
        ctx.fillStyle = fieldColor;
        ctx.fill();
        ctx.closePath();

        if (!relations[key]) {
            return;
        }

        relations[key].forEach(function (relation) {
            ctx.beginPath();
            ctx.moveTo(position.x, position.y);
            ctx.lineTo(positions[relation].x, positions[relation].y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = fieldColor;
            ctx.stroke();
        })
    });
}

function drawAnimals() {
    animals.forEach(animal => {
        ctx.beginPath();
        ctx.arc(
            positions[animal.position].x,
            positions[animal.position].y,
            size / 5,
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
    ctx.strokeStyle = animal.colour;
    ctx.arc(positions[position].x, positions[position].y, size / 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function startGame() {
    getInitialState();
    drawMoves(animals[activeAnimal]);
    gatAnimalImage(animals[activeAnimal]);

    showMoves = true;

    startButton.textContent = 'Sākt vēlreiz';
    animalMoves.classList.remove('visually-hidden');
    startButton.classList.remove('btn-warning');
    startButton.classList.add('btn-danger');
    animalImage.classList.remove('visually-hidden');
}

function getInitialState() {
    activeAnimal = 0;
    lynxMovesLeft = 10;
    lynxMovesLeftText.textContent = String(lynxMovesLeft);
    lynx.position = lynxStart;
    perdicinae.position = perdicinaeStart;

    draw();
}

function gatAnimalImage(animal) {
    animalImage.style.borderColor = animal['colour'];
    animalImage.src = `${animal['name']}.jpg`;
}

startButton.addEventListener('click', startGame);

document.querySelectorAll('.return-to-start').forEach(item => {
    item.addEventListener('click', event => {
        getInitialState();

        startButton.textContent = 'Sākt spēli';
        animalMoves.classList.add('visually-hidden');
        startButton.classList.add('btn-warning');
        startButton.classList.remove('btn-danger');
        animalImage.classList.add('visually-hidden');

        showMoves = false;
    })
})

canvas.addEventListener(
    "click",
    function(event) {
        if (!showMoves) {
            return;
        }

        mouse = oMousePos(canvas, event);

        const modalText = document.getElementById('winner');

        let possibleMoves = relations[animals[activeAnimal].position];

        for (const move of possibleMoves) {
            drawOneMove(animals[activeAnimal], move);

            if (ctx.isPointInPath(mouse.x, mouse.y)) {
                const x = Math.round(mouse.x / size) * size;
                const y = Math.round(mouse.y / size) * size;

                animals[activeAnimal].position = Object.keys(positions)
                    .find(key => positions[key].x === x && positions[key].y === y);

                if (activeAnimal === 0) {
                    lynxMovesLeft--;
                    lynxMovesLeftText.textContent = String(lynxMovesLeft);
                }

                if (lynx.position === perdicinae.position) {
                    modalText.textContent = String('Lūsis noķēra irbi');
                    animalImageWin.src = `${lynx.name}-win.jpg`;
                    myModal.show();

                    break;
                }

                if (lynxMovesLeft === 0) {
                    modalText.textContent = String('Irbe aizbēga');
                    animalImageWin.src = `${perdicinae.name}-win.jpg`;
                    myModal.show();

                    break;
                }

                activeAnimal = activeAnimal === 0 ? 1 : 0;

                let animalName = activeAnimal === 0 ? 'Lūša' : 'Irbes';

                document.getElementById('animal').textContent = `${animalName} gājiens`;

                gatAnimalImage(animals[activeAnimal]);
                draw();
                drawMoves(animals[activeAnimal]);

                break;
            } else {
                console.log("not in path");
            }
        }
    },
    false
);

function oMousePos(canvas, evt) {
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
