let characters, particles, canvas, context, w, h, current;
let duration =      4000; // duração de cada palavra
let str = ["FELIZ", "ANO", "NOVO", "TE", "AMO", "AMOR"]; // palavras a serem exibidas

init(); // inicia o canvas
resize(); // ajusta o tamanho do canvas
requestAnimationFrame(render); // inicia o loop de renderização
addEventListener("resize", resize); // redimensiona o canvas com o tamanho da tela

function charMaker(c) {
    let temporary = document.createElement("canvas");
    // cria um canvas temporário
    let size = temporary.width = temporary.height = w < 400 ? 200 : 300;
    // operador condicional que define o tamanho do canvas dependendo da largura da tela

    let temporaryContext = temporary.getContext("2d");
    temporaryContext.font = "bold " + size + "px Arial";
    temporaryContext.fillStyle = "white";
    temporaryContext.textBaseline = "middle";
    temporaryContext.textAlign = "center";
    temporaryContext.fillText(c, size / 2, size / 2);
    // configura o estilo do texto e desenha a letra centralizada

    let char2 = temporaryContext.getImageData(0, 0, size, size);
    // pega os pixels da imagem do canvas

    let char2particles = []; // para armazenar as coordenadas x e y das partículas

     // loop que termina quando o array atinge o valor definido        em particles
     for (var i = 0; char2particles.length < particles; i++) {
        let x = size * Math.random();
        let y = size * Math.random();
        // escolhe um ponto aleatório no eixo x e y no canvas 
        let offset = parseInt(y) * size * 4 + parseInt(x) * 4;
        // converte y para um número inteiro, multiplica size com o num de valores RGBA por pixel (4) e soma a posição horizontal ajustada para RGBA
        if (char2.data[offset]) // corresponde a vermelho em RGBA (R)
                char2particles.push([x - size / 2, y - size / 2]);
                // desloca os eixos x e y para que o ponto 0,0 fique no meio, centraliza as partículas no canvas e adiciona os eixos ajustados no array
    }
    return char2particles;
}

// cria um <canvas> e adiciona ao body. 
// remove margens, desabilita scroll, define um fundo preto e permite desenhar o texto
function init() {
     canvas = document.createElement("canvas");
    document.body.append(canvas);
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";
    document.body.style.background = "black";
    context = canvas.getContext("2d");
}

function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    particles = innerWidth < 400 ? 55 : 99;
    // define o número de partículas de acordo com a largura da tela
}

function charsMaker(t) { // t é o tempo da animação passado pelo requestAnimationFrame
    let actual = parseInt(t / duration) % str.length;
    // calcula quantos ciclos de duração (5s) passaram, converte o valor do ciclo em um inteiro e garante que o valor de actual esteja entre os índices de str (0, 1, 2 e 3)
    if (current === actual)
        // current é a palavra atual, se as 2 variáveis forem iguais a mesma palavra está sendo exibida
        return;
        current = actual;
        // atualiza current para o novo índice (actual) e exibe a próxima palavra
        characters = [...str[actual]].map(charMaker);
        // "..." é o operador spread que dividirá a palavra que deverá ser exibida em letras e usa a função charMaker para formar partículas
}

function render(t) {
    charsMaker(t);
    // função que verifica qual letra ou palavra deve ser exibida com base no tempo (t)
    requestAnimationFrame(render);
    // cria um loop que executa a função no próximo quadro de animação
    context.fillStyle = "#00000010";
    context.fillRect(0, 0, w, h);
    // permite que as partículas dos quadros anteriores permaneçam visíveis por um tempo
    characters.forEach((pts, i) => firework(t, i, pts));
    // chama a função firework() para animar gerando o efeito dos fogos
    // pts: conjunto de partículas que formam a letra
    // i: índice da letra (ex.: 0 para "F", 1 para "E", etc.)
    // t: tempo atual da animação requestAnimationFrame
}

function firework(t, i, pts) {
    t -= i * 200;
    // atrasa a animação e cada letra aparece após a outra
    let id = i + characters.length * parseInt(t - t % duration);
    // cria um id para cada letra e calcula o tempo base dentro de um ciclo 
    t = t % duration / duration;
    // normaliza o tempo t para que fique no intervalo [0, 1]
    let dx = (i + 1) * w / (1 + characters.length);
    // deixa a largura do canvas proporcional ao número de letras e posiciona com base no i
    dx += Math.min(0.33, t) * 100 * Math.sin(id);
    // gera um movimento suave com a função seno e limita o movimento horizontal ao 1° 33% do ciclo, amplificando o movimento * 100 para ser visível
    let dy = h * 0.5;
    // define a posição vertical (y) inicial como o meio da altura do canvas
    dy += Math.sin(id * 4547.411) * h * 0.1;
    // usa o id para mudar a posição de cada letra e define a amplitude como 10% da altura do canvas
    if (t < 0.33) {
        rocket(dx, dy, id, t * 3);
        // se o tempo está entre 33% do ciclo chama a função rocket() e normaliza o tempo do intervalo para [0, 1] com t * 3
    } else {
        explosion(pts, dx, dy, id, Math.min(1, Math.max(0, t - 0.33) * 2));
        // chama a função explosion() remove o tempo do foguete com t - 0.33 e normaliza o progresso da explosão
    }
}

function rocket(x, y, id, t) {
    context.fillStyle = "white";
    let r = 2 - 2 * t + Math.pow(t, 15 * t) * 16;
    // o foguete diminui de tamanho (t aumenta)
    // Math.pow(t, 15 * t) * 16 cria brilho com crescimento não linear
    // r é o raio do foguete
    y = h - y * t;
    // define a posição vertical multiplicando y por t subindo o foguete e inverte o eixo y do canvas
    circle(x, y, r);
    // chama a função circle() para deixar o foguete circular
}

function explosion(pts, x, y, id, t) {
    let dy = (t * t * t) * 20;
    // crescimento suave e acelerado do movimento * 20 para que seja visível
    let r = Math.sin(id) * 1 + 3;
    // varia o tamanho das partículas com id, + 3 define o tamanho base
    r = t < 0.5 ? (t + 0.5) * t * r : r - t * r;
    // se estiver na primeira metade da explosão o tamanho das partículas aumenta, se estiver na segunda metade o tamanho diminui
    context.fillStyle = `hsl(${id * 55}, 55%, 55%)`;
    // define tom com base no id, saturação e luminosidade
    pts.forEach((xy, i) => {
        if (i % 20 === 0)
            context.fillStyle = `hsl(${id * 55}, 55%, ${55 + t * Math.sin(t * 55 + i) * 45}%)`;
            // altera a cor de algumas partículas com base em i e vincula com o progresso da explosão
        circle(t * xy[0] + x, h - y + t * xy[1] + dy, r);
        // chama a função circle() para renderizar partículas 
        // t * xy[0] + x move horizontalmente com base no progresso t
        // h - y + t + xy[1] + dy move verticalmente também com base em dy (deslocamento adicional)
        // r define o raio da partícula
    });
}

function circle(x, y, r) {
    context.beginPath();
    // garante que o desenho realizado não se conecte com os anteriores
    context.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
    // desenha círculos com base nos eixos x e y, largura e altura(r, r), rotação do círculo e o ângulo de início/fim
    context.fill();
    // preenche o círculo com a cor definida
}
