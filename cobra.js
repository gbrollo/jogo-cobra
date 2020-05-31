let game = document.getElementById('game');
game.style.border = '3px solid #000';

let ctx = game.getContext('2d');

let cobra = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 }
];

let dx = 10;
let dy = 0;
let comidaX = 0;
let comidaY = 0;
let ponto = 0;
let fim = false;
let dificil = false;
let corAB = false;
let intervalo = 100;
let mudandoDirecao = false;

document.addEventListener('keydown', mudarDirecao)

criarComida();
main();

function main () {
  setTimeout(
    function onTick () {
      mudandoDirecao = false;
      clearCanvas();
      desenharComida();
      avancarCobra();
      desenharCobra();

      if (fim) {
        terminarJogo();
      } else {
        main();
      }
    }
    , intervalo);
}

function terminarJogo () {
  document.getElementById('ponto').innerHTML = '<span>Fim do Jogo! ponto:</span> ' + ponto;
}

function randomTen (min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function criarComida () {
  comidaX = randomTen(0, game.width - 10);
  comidaY = randomTen(0, game.height - 10);

  cobra.forEach(
    function comidaEstaNaCobra (part) {
      const comidaNaCobra = part.x == comidaX && part.y == comidaY;
      if (comidaNaCobra) {
        criarComida();
      }
    }
  )
}

function desenharComida () {
  ctx.fillStyle = 'red';
  ctx.strokestyle = 'darkred';
  ctx.fillRect(comidaX, comidaY, 10, 10);
  ctx.strokeRect(comidaX, comidaY, 10, 10);
}

function mudarDirecao (event) {
  const TECLA_ESQUERDA = 37;
  const TECLA_DIREITA = 39;
  const TECLA_CIMA = 38;
  const TECLA_BAIXO = 40;

  const teclaPressionada = event.keyCode;
  const indoPraCima = dy === -10;
  const indoPraBaixo = dy === 10;
  const indoPraDireita = dx === 10;
  const indoPraEsquerda = dx === -10;

  if (mudandoDirecao) {
    return;
  } else {
    mudandoDirecao = true;
  }

  if (teclaPressionada === TECLA_ESQUERDA && !indoPraDireita) {
    dx = -10;
    dy = 0;
  }

  if (teclaPressionada === TECLA_DIREITA && !indoPraEsquerda) {
    dx = 10;
    dy = 0;
  }

  if (teclaPressionada === TECLA_CIMA && !indoPraBaixo) {
    dx = 0;
    dy = -10;
  }

  if (teclaPressionada === TECLA_BAIXO && !indoPraCima) {
    dx = 0;
    dy = 10;
  }
}

function clearCanvas () {
  // Dificulta a visibilidade alternando entre cores
  if (dificil) {
    ctx.fillStyle = corAB ? '#cccccc' : '#9b9b9b';
    corAB = !corAB;
  } else {
    ctx.fillStyle = '#cccccc';
  }
  ctx.strokeStyle = 'black';
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.strokeRect(0, 0, game.width, game.height);
}
q
function desenharCobraParte (parte) {
  ctx.fillStyle = 'lightgreen';
  ctx.strokestyle = 'darkgreen';
  ctx.fillRect(parte.x, parte.y, 10, 10);
  ctx.strokeRect(parte.x, parte.y, 10, 10);
}

function desenharCobra () {
  cobra.forEach(desenharCobraParte);
}

function avancarCobra () {
  const cabeca = {
    x: cobra[0].x + dx,
    y: cobra[0].y + dy
  }

  const tocouNaComida = cabeca.x === comidaX && cabeca.y === comidaY;

  if (tocouNaComida) {
    ponto += 10;
    document.getElementById('ponto').innerHTML = '<span>ponto:</span>' + ponto;

    // aumenta a velocidade de movimento dificultando o jogo
    if (ponto >= 300) {
      dificil = true;
      intervalo = ponto > 350 ? 60 : 80;
    }
    cobra.push(cabeca);
    criarComida();
  }

  cobra.unshift(cabeca);
  cobra.pop();

  for (let i = 1; i < cobra.length; i++) {
    if (cabeca.x == cobra[i].x && cabeca.y == cobra[i].y) {
      fim = true;
      return;
    }
  }

  const tocouX = cabeca.x >= game.width || cabeca.x < 0;
  const tocouY = cabeca.y >= game.height || cabeca.y < 0;
  if (tocouX || tocouY) {
    fim = true;
  }
}
