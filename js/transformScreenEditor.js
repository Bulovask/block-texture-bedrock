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

function canvasClientCoordsToCanvasCoords(x, y) {
    return {
        x: x * screenEditorElem.width / screenEditorElem.clientWidth,
        y: y * screenEditorElem.height / screenEditorElem.clientHeight
    }
}

function canvasClientCoordsInImageDataCoords(event) {
    const width = currentImageData.width;
    const height = currentImageData.height;
    const pixelSize = screenEditorConfig.pixelSize;
    const scale = screenEditorConfig.scale;
    const sec = screenEditorConfig;

    const coords = canvasClientCoordsToCanvasCoords(event.clientX, event.clientY);

    return {
        x: Math.floor((-sec.x + coords.x / scale - screenEditorElem.width / scale / 2 + pixelSize * width / 2) / pixelSize),
        y: Math.floor((-sec.y + coords.y / scale - screenEditorElem.height / scale / 2 + pixelSize * height / 2) / pixelSize)
    }
}

function draw(event) {
    const coords = canvasClientCoordsInImageDataCoords(event);
    ImgData.setPixel(currentImageData, [0,Math.random() * 255 | 0,0,255], coords.x, coords.y);
}

//Adicionando eventos
window.addEventListener("resize", resizeScreenEditor, false);
window.addEventListener("mousemove", draw, false);

resizeScreenEditor();
tranformScreenEditor();

//Inicie a função loop que se encontra em "js/setup.js"
loop();