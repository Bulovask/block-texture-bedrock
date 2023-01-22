function transformEditScreen() {
    //Aplica as transformações no contexto do screenEditor e limpa a tela
    editScreenCtx.imageSmoothingEnabled = false;
    
    const scale = editScreenConfig.scale;
    const x = editScreenConfig.x;
    const y = editScreenConfig.y;

    editScreenCtx.resetTransform();
    editScreenCtx.translate(editScreenElem.width / 2, editScreenElem.height / 2);
    editScreenCtx.scale(scale, scale);
    editScreenCtx.translate(x, y);

    editScreenCtx.clearRect(
        -x - editScreenElem.width  / 2 / scale,
        -y - editScreenElem.height / 2 / scale,
        editScreenElem.width  / scale,
        editScreenElem.height / scale
    );
}

function resizeEditScreen() {
    if(imageConfig.height * editScreenElem.clientWidth < imageConfig.width * editScreenElem.clientHeight) { 
        editScreenElem.width = imageConfig.width * 1.25 * editScreenConfig.pixelSize;
        editScreenElem.height = Math.trunc(editScreenConfig.pixelSize * 1.25 * imageConfig.width / editScreenElem.clientWidth * editScreenElem.clientHeight);
    }
    else {
        editScreenElem.height = imageConfig.height * 1.25 * editScreenConfig.pixelSize;
        editScreenElem.width = Math.trunc(editScreenConfig.pixelSize * 1.25 * imageConfig.height / editScreenElem.clientHeight * editScreenElem.clientWidth);
    }
}

function canvasClientCoordsToCanvasCoords(x, y) {
    return {
        x: x * editScreenElem.width / editScreenElem.clientWidth,
        y: y * editScreenElem.height / editScreenElem.clientHeight
    }
}

function canvasClientCoordsInImageDataCoords(event) {
    const width = currentImageData.width;
    const height = currentImageData.height;
    const pixelSize = editScreenConfig.pixelSize;
    const scale = editScreenConfig.scale;
    const esc = editScreenConfig;

    const coords = canvasClientCoordsToCanvasCoords(event.clientX, event.clientY);

    return {
        x: Math.floor((-esc.x + coords.x / scale - editScreenElem.width / scale / 2 + pixelSize * width / 2) / pixelSize),
        y: Math.floor((-esc.y + coords.y / scale - editScreenElem.height / scale / 2 + pixelSize * height / 2) / pixelSize)
    }
}

//Essa função é apenas para testes, não permanecerá aqui e nem será assim
function draw(event) {
    const coords = canvasClientCoordsInImageDataCoords(event);
    ImgData.drawPixel(currentImageData, imageConfig.background, coords.x, coords.y);
    cache.imageBitmap.modified = true;
}

//Adicionando eventos
window.addEventListener("resize", resizeEditScreen, false);
window.addEventListener("click", (event) => {event.preventDefault()}, false);
window.addEventListener("contextmenu", event => event.preventDefault(), false);
window.addEventListener("mousedown", (e) => {}, false);
window.addEventListener("mouseup", (e) => {}, false);
window.addEventListener("mousemove", draw, false);
