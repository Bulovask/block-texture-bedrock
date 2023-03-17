const states = {
    moveEditScreen: {
        oldX: null,
        oldY: null,
        mainMouseButtonPressed: false,
        //Verifica se o botao principal está sendo pressionado e enquanto o mouse é movido o contexto da tela de edicao o acompanha
        func: (event) => {
            const self = states.moveEditScreen;

            if((event.type == "mousedown" && event.buttons == 1) || (event.type == "touchstart" && event.targetTouches.length == 1)) {
                self.oldX = event.clientX ?? event.targetTouches[0].clientX;
                self.oldY = event.clientY ?? event.targetTouches[0].clientY;
                self.mainMouseButtonPressed = true;
            }

            else if((event.type == "mousemove" && self.mainMouseButtonPressed) || (event.type == "touchmove" && event.targetTouches.length == 1)) {
                const x = event.clientX ?? event.targetTouches[0].clientX;
                const y = event.clientY ?? event.targetTouches[0].clientY;

                const coords = canvasClientCoordsToCanvasCoords(x, y);
                const oldCoords = canvasClientCoordsToCanvasCoords(self.oldX, self.oldY);
                
                editScreenConfig.x += (coords.x - oldCoords.x) / editScreenConfig.scale;
                editScreenConfig.y += (coords.y - oldCoords.y) / editScreenConfig.scale;
                
                self.oldX = x;
                self.oldY = y;
            }

            else if((event.type == "mouseup" && event.buttons == 0) || (event.type == "mouseout") || (event.type == "touchend" && event.targetTouches.length == 1) || (event.type == "touchstart" && event.targetTouches.length > 1)) {
                self.oldX = null;
                self.oldY = null;
                self.mainMouseButtonPressed = false;
            }
            //Altera para o estado de mudar escala da tela de edição
            else if(event.type == "keydown") {
                stateMachine.currentState = states.scaleEditScreen;
                stateMachine.control(event, false);
            }
        }
    },
    scaleEditScreen: {
        func: (event) => {
            const self = states.scaleEditScreen;
            if(event.type == "keydown") {
                if(event.key == "+") {
                    editScreenConfig.scale += 0.02;
                    if(editScreenConfig.scale > 5) editScreenConfig.scale = 5;
                }
                else if(event.key == "-") {
                    editScreenConfig.scale -= 0.02;
                    if(editScreenConfig.scale < 0.2) editScreenConfig.scale = 0.2;
                }
            }
            //Altera para o estado de mover a tela de edição
            else if(event.type == "mousedown" || event.type == "touchstart") {
                stateMachine.currentState = states.moveEditScreen;
                stateMachine.control(event);
            }
        }
    },
    drawWithPencil: {
        on: false,
        func: (event) => {
            const self = states.drawWithPencil;

            const draw = (auxiliary) => {
                const img_data = auxiliary ? auxiliaryImageData : currentImageData;
                const coords = canvasClientCoordsInImageDataCoords(event);
                const inside = ImgData.setPixel(img_data, editScreenConfig.colorMain, coords.x, coords.y);
                if(!auxiliary) cache.imageBitmap.modified = true;
                return inside;
            }

            //Desenha diretamente em currentImageData caso o canal alpha do lapis seja 255
            if(editScreenConfig.colorMain[3] == 255) {
                if(event.type == "mousedown" || event.type == "touchstart") {
                    self.on = true;
                    if(!draw()) {
                        self.on = false;
                        stateMachine.currentState = states.moveEditScreen;
                        stateMachine.control(event);
                    }
                }
                else if((event.type == "mousemove" || event.type == "touchmove") && self.on) {
                    draw();
                }
                else if(event.type == "mouseup" || event.type == "touchend") {
                    self.on = false;
                }
            }
            else {// senão desenhe em auxiliaryImageData e depois mescle 
                if(event.type == "mousedown" || event.type == "touchstart") {
                    self.on = true;
                    imageConfig.auxiliaryImage = true;

                    if(!draw(true)) {
                        self.on = false;
                        stateMachine.currentState = states.moveEditScreen;
                        stateMachine.control(event);
                    }
                }
                else if((event.type == "mousemove" || event.type == "touchmove") && self.on) {
                    draw(true);
                }
                else if(event.type == "mouseup" || event.type == "touchend") {
                    self.on = false;
                    imageConfig.auxiliaryImage = false;
                    mergeImages();
                }
            }
        }
    }
}

const stateMachine = {
    currentState: null,
    control: (event, preventDefault = true) => {
        if(preventDefault) { event.preventDefault() }
        const state = stateMachine.currentState ?? null;
        if(state) {
            state.func(event);
        }
        console.log(event.type);
    }
}

//Eventos do mouse
window.addEventListener("mouseout", stateMachine.control, false);
window.addEventListener("mousedown", stateMachine.control, false);
window.addEventListener("mouseup", stateMachine.control, false);
window.addEventListener("mousemove", stateMachine.control, false);

//Eventos do touchScreen
window.addEventListener("touchstart", stateMachine.control, {passive: false});
window.addEventListener("touchmove", stateMachine.control, {passive: false});
window.addEventListener("touchend", stateMachine.control, {passive: false});

//Eventos de teclado
window.addEventListener("keydown", (event) => { stateMachine.control(event, false) }, false);
window.addEventListener("keyup", (event) => { stateMachine.control(event, false) }, false);


//Parar a propagação no editScreenToolbarElem 
const editScreenToolbarElem = document.getElementById("edit-screen-toolbar");
editScreenToolbarElem.addEventListener("mousedown", (e) => e.stopPropagation(), false);
editScreenToolbarElem.addEventListener("mousemove", (e) => e.stopPropagation(), false);
editScreenToolbarElem.addEventListener("mouseup", (e) => e.stopPropagation(), false);
editScreenToolbarElem.addEventListener("mouseout", (e) => e.stopPropagation(), false);

editScreenToolbarElem.addEventListener("touchstart", (e) => e.stopPropagation(), {passive: false});
editScreenToolbarElem.addEventListener("touchmove", (e) => e.stopPropagation(), {passive: false});
editScreenToolbarElem.addEventListener("touchend", (e) => e.stopPropagation(), {passive: false});

//Botões do elemento edit-screen-toolbar
const moveEditScreenBtn = document.getElementById("moveEditScreenBtn");
const pencilBtn = document.getElementById("pencilBtn");

//Adicionando comportamentos nos botões
moveEditScreenBtn.addEventListener("click", () => stateMachine.currentState = states.moveEditScreen, false);
pencilBtn.addEventListener("click", () => stateMachine.currentState = states.drawWithPencil, false);