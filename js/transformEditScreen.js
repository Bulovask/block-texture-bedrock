function transformMainCanvas() {
    //Aplica as transformações no contexto do screenEditor
    //mainCanvasCtx.imageSmoothingEnabled = false;
    
    const ESCWidth = editScreenElem.clientWidth;
    const ESCHeight = editScreenElem.clientHeight;
    const ESAspectRatio = ESCWidth / ESCHeight;
    const MCWidth = mainCanvas.width;
    const MCHeight = mainCanvas.height;
    const MCAspectRatio = MCWidth / MCHeight;
    const scale = editScreenConfig.scale;
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
    
    let x = editScreenConfig.x + (ESCWidth - mainCanvas.clientWidth) / 2 - 1;
    let y = editScreenConfig.y + (ESCHeight - mainCanvas.clientHeight) / 2 - 1;

    mainCanvas.style.left = x + "px";
    mainCanvas.style.top = y + "px";
}

function editScreenClientCoordsIntoImageDataCoords(event) {
    const ese = editScreenElem;
    const mc = mainCanvas;
    
    const mcpos = mc.getBoundingClientRect();
    
    const ex = event.clientX ?? event.targetTouches[0].clientX;
    const ey = event.clientY ?? event.targetTouches[0].clientY;

    const x = Math.floor((ex - mcpos.x) * mc.width / mc.clientWidth);
    const y = Math.floor((ey - mcpos.y) * mc.height / mc.clientHeight);

    return {x, y}
    
}

//Adicionando eventos
window.addEventListener("resize", transformMainCanvas, false);
//window.addEventListener("click", (event) => {event.preventDefault()}, false);
window.addEventListener("contextmenu", event => event.preventDefault(), false);