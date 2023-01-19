const screenEditorElem = document.getElementById("screen-editor");
const screenEditorCtx = screenEditorElem.getContext("2d");

const screenEditorConfig = {
    x: 0,
    y: 0,
    scale: 1,
    pixelSize: 10 //Tamanho do pixel "virtual" do editor em pixels "reais" do canvas
}

const imageConfig = {
    width: 16,
    height: 16
}

//Criando uma imagem e aplicando um fundo branco
let currentImageData = new ImageData(imageConfig.width, imageConfig.height);

for(let i = 0; i < imageConfig.width * imageConfig.height; i++) {
    r = randint
    setPixel(currentImageData, [r(), r(), r(), 255], i);
}

function randint(min = 0, max = 255) {
    return Math.trunc(min + Math.random() * (max - min));
}


function loop() {
    createImageBitmap(currentImageData).then(img => {
        tranformScreenEditor();
        const x = -imageConfig.width * screenEditorConfig.pixelSize / 2;
        const y = -imageConfig.height * screenEditorConfig.pixelSize / 2;
        const width = imageConfig.width * screenEditorConfig.pixelSize;
        const height = imageConfig.height * screenEditorConfig.pixelSize;

        screenEditorCtx.drawImage(img, x, y, width, height);
        screenEditorCtx.strokeRect(x + 0.5, y + 0.5, width, height);

        requestAnimationFrame(loop);
    });
}

function setPixel(imgData, color = {r: 255, g: 255, b: 255, a: 255}, x, y) {
    let i;
    if(y && x >= 0 && x < imgData.width && y >= 0 && y < imgData.height) {
        i = x + y * imgData.width;
    }
    else {
        i = x;
    }
    if(i !== undefined) {
        imgData.data[i * 4 + 0] = color.r ?? color[0];
        imgData.data[i * 4 + 1] = color.g ?? color[1];
        imgData.data[i * 4 + 2] = color.b ?? color[2];
        imgData.data[i * 4 + 3] = color.a ?? color[3];
    }
}

function tranformScreenEditor() {
    //Aplica as transformações no contexto do screenEditor e limpa a tela
    screenEditorCtx.imageSmoothingEnabled = false;
    
    const scale = screenEditorConfig.scale;
    const x = screenEditorConfig.x;
    const y = screenEditorConfig.y;

    screenEditorCtx.resetTransform();
    screenEditorCtx.translate(screenEditorElem.width / 2, screenEditorElem.height / 2);
    screenEditorCtx.scale(scale, scale);
    screenEditorCtx.translate(x, y);

    screenEditorCtx.clearRect(
        -x - screenEditorElem.width  / 2 / scale,
        -y - screenEditorElem.height / 2 / scale,
        screenEditorElem.width  / scale,
        screenEditorElem.height / scale
    );
}

function resizeScreenEditor() {
    if(imageConfig.height * screenEditorElem.clientWidth < imageConfig.width * screenEditorElem.clientHeight) { 
        screenEditorElem.width = imageConfig.width * 1.25 * screenEditorConfig.pixelSize;
        screenEditorElem.height = Math.trunc(screenEditorConfig.pixelSize * 1.25 * imageConfig.width / screenEditorElem.clientWidth * screenEditorElem.clientHeight);
    }
    else {
        screenEditorElem.height = imageConfig.height * 1.25 * screenEditorConfig.pixelSize;
        screenEditorElem.width = Math.trunc(screenEditorConfig.pixelSize * 1.25 * imageConfig.height / screenEditorElem.clientHeight * screenEditorElem.clientWidth);
    }
}

window.addEventListener("resize", resizeScreenEditor, false);

resizeScreenEditor();
tranformScreenEditor();
loop();