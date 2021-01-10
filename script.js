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

const positions = {
    p1: {
        x: size,
        y: size
    },
    p2: {
        x: 2 * size,
        y: size
    },
    p3: {
        x: 3 * size,
        y: size
    },
    p4: {
        x: 4 * size,
        y: size
    },
    p5: {
        x: 5 * size,
        y: size
    },
    p6: {
        x: 6 * size,
        y: size
    },
    p7: {
        x: size,
        y: 2 * size
    },
    p8: {
        x: 2 * size,
        y: 2 * size
    },
    p9: {
        x: 3 * size,
        y: 2 * size
    },
    p10: {
        x: 4 * size,
        y: 2 * size
    },
    p11: {
        x: 5 * size,
        y: 2 * size
    },
    p12: {
        x: 6 * size,
        y: 2 * size
    },
    p13: {
        x: size,
        y: 3 * size
    },
    p14: {
        x: 2 * size,
        y: 3 * size
    },
    p15: {
        x: 3 * size,
        y: 3 * size
    },
    p16: {
        x: 4 * size,
        y: 3 * size
    },
    p17: {
        x: 5 * size,
        y: 3 * size
    },
    p18: {
        x: 6 * size,
        y: 3 * size
    },
    p19: {
        x: size,
        y: 4 * size
    },
    p20: {
        x: 2 * size,
        y: 4 * size
    },
    p21: {
        x: 3 * size,
        y: 4 * size
    },
    p22: {
        x: 4 * size,
        y: 4 * size
    },
    p23: {
        x: 5 * size,
        y: 4 * size
    },
    p24: {
        x: 6 * size,
        y: 4 * size
    },
    p25: {
        x: size,
        y: 5 * size
    },
    p26: {
        x: 2 * size,
        y: 5 * size
    },
    p27: {
        x: 3 * size,
        y: 5 * size
    },
    p28: {
        x: 4 * size,
        y: 5 * size
    },
    p29: {
        x: 5 * size,
        y: 5 * size
    },
    p30: {
        x: 6 * size,
        y: 5 * size
    },
    p31: {
        x: size,
        y: 6 * size
    },
    p32: {
        x: 2 * size,
        y: 6 * size
    },
    p33: {
        x: 3 * size,
        y: 6 * size
    },
    p34: {
        x: 4 * size,
        y: 6 * size
    },
    p35: {
        x: 5 * size,
        y: 6 * size
    },
    p36: {
        x: 6 * size,
        y: 6 * size
    },
};

const relations = {
    p1: ['p2', 'p7'],
    p2: ['p1', 'p3', 'p8'],
    p3: ['p2', 'p4', 'p9'],
    p4: ['p3', 'p5', 'p10'],
    p5: ['p4', 'p6', 'p11'],
    p6: ['p5', 'p12'],
    p7: ['p1', 'p8', 'p13'],
    p8: ['p7', 'p9', 'p2', 'p14'],
    p9: ['p8', 'p10', 'p3', 'p15'],
    p10: ['p9', 'p11', 'p4', 'p16'],
    p11: ['p10', 'p12', 'p5', 'p17'],
    p12: ['p11', 'p6', 'p18'],
    p13: ['p14', 'p7', 'p19'],
    p14: ['p13', 'p15', 'p8', 'p20'],
    p15: ['p14', 'p16', 'p9', 'p21', 'p22'],
    p16: ['p15', 'p17', 'p10', 'p21', 'p22'],
    p17: ['p16', 'p18', 'p11', 'p23'],
    p18: ['p17', 'p12', 'p24'],
    p19: ['p20', 'p13', 'p25'],
    p20: ['p19', 'p21', 'p14', 'p26'],
    p21: ['p20', 'p22', 'p15', 'p16', 'p27'],
    p22: ['p21', 'p23', 'p16', 'p28', 'p15'],
    p23: ['p22', 'p24', 'p17', 'p29'],
    p24: ['p23', 'p18', 'p30'],
    p25: ['p26', 'p19', 'p31'],
    p26: ['p25', 'p27', 'p20', 'p32'],
    p27: ['p26', 'p28', 'p21', 'p33'],
    p28: ['p27', 'p29', 'p22', 'p34'],
    p29: ['p28', 'p30', 'p23', 'p35'],
    p30: ['p29', 'p24', 'p36'],
    p31: ['p25', 'p32'],
    p32: ['p31', 'p33', 'p26'],
    p33: ['p32', 'p34', 'p27'],
    p34: ['p33', 'p35', 'p28'],
    p35: ['p34', 'p36', 'p29'],
    p36: ['p35', 'p30'],
};

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

draw();
