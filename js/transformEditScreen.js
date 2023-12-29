function transformMainCanvas() {
    //Aplica as transformações no contexto do screenEditor
    //mainCanvasCtx.imageSmoothingEnabled = false;
    
    const ESCWidth = editScreenElem.clientWidth;
    const ESCHeight = editScreenElem.clientHeight;
    const MCWidth = mainCanvas.width;
    const MCHeight = mainCanvas.height;
    
    const ESAspectRatio = ESCWidth / ESCHeight;
    const MCAspectRatio = MCWidth / MCHeight;
    
    const scale = editScreenConfig.scale / 1000;
    const padding = 10;

    let width;
    let height;
    
    if(ESAspectRatio <= MCAspectRatio) {
        width = (ESCWidth - padding) * scale;
        height = (width * MCHeight / MCWidth);
    }
    else {
        height = (ESCHeight - padding) * scale;
        width = (height * MCWidth / MCHeight);
    }

    mainCanvas.style.width = width + "px";
    mainCanvas.style.height = height + "px";

    const x = editScreenConfig.x * scale + (ESCWidth - mainCanvas.clientWidth) / 2 - 1;
    const y = editScreenConfig.y * scale + (ESCHeight - mainCanvas.clientHeight) / 2 - 1;

    mainCanvas.style.left = x + "px";
    mainCanvas.style.top = y + "px";
}

function editScreenClientCoordsIntoImageDataCoords(event) {
    const ese = editScreenElem;
    const mc = mainCanvas;
    
    const mcpos = mc.getBoundingClientRect();
    
    const ex = event.clientX ?? Math.trunc(event.targetTouches[0].clientX);
    const ey = event.clientY ?? Math.trunc(event.targetTouches[0].clientY);

    const x = Math.floor((ex - mcpos.x) * mc.width / mc.clientWidth);
    const y = Math.floor((ey - mcpos.y) * mc.height / mc.clientHeight);

    return {x, y}
    
}

//Adicionando eventos
window.addEventListener("resize", transformMainCanvas, false);
//window.addEventListener("click", (event) => {event.preventDefault()}, false);
window.addEventListener("contextmenu", event => event.preventDefault(), false);