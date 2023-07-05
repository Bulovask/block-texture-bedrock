const states = {
    moveEditScreen: {
        oldX: null,
        oldY: null,
        mainMouseButtonPressed: false,
        returnToPreviousState: false,
        //Verifica se o botao principal está sendo pressionado e enquanto o mouse é movido o contexto da tela de edicao o acompanha
        func: (event) => {
            const self = states.moveEditScreen;

            if((event.type == "mousedown" && event.buttons == 1) || (event.type == "touchstart" && event.targetTouches.length == 1)) {
                const {x, y} = canvasClientCoordsInImageDataCoords(event);
                
                if(self.returnToPreviousState && x >= 0 && y >= 0 && x <= currentImageData.width && y <= currentImageData.height) {
                    stateMachine.currentState = self.returnToPreviousState;
                    self.returnToPreviousState = false;
                    stateMachine.control(event);
                    return
                }
                else {
                    self.oldX = event.clientX ?? event.targetTouches[0].clientX;
                    self.oldY = event.clientY ?? event.targetTouches[0].clientY;
                    self.mainMouseButtonPressed = true;
                }
                
            }

            else if((event.type == "mousemove" && self.mainMouseButtonPressed) || (event.type == "touchmove" && event.targetTouches.length == 1 && self.mainMouseButtonPressed)) {
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
                states.scaleEditScreen.automaticStateChange = self;
                stateMachine.control(event, false);
            }
        }
    },
    scaleEditScreen: {
        automaticStateChange: false,
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
            // Altera para o estado anterior a este / o estado que chamou este
            else if((event.type == "mousedown" || event.type == "touchstart") && self.automaticStateChange) {
                stateMachine.currentState = self.automaticStateChange;
                self.automaticStateChange = false;
                stateMachine.control(event);
            }
        }
    },
    drawWithPencil: {
        on: false,
        old: {x: null, y: null},
        func: (event) => {
            const self = states.drawWithPencil;
            
            const draw = (auxiliary) => {
                const img_data = auxiliary ? auxiliaryImageData : currentImageData;
                const coords = canvasClientCoordsInImageDataCoords(event);
                const inside = coords.x >= 0 && coords.y >= 0 && coords.x <= img_data.width && img_data.height; 
                if(!(coords.x == self.old.x && coords.y == self.old.y)) {
                    ImgData.setPixel(img_data, editScreenConfig.colorMain, coords.x, coords.y);
                    self.old = {x: coords.x, y: coords.y};
                    if(!auxiliary) cache.imageBitmap.modified = true;
                }
                return inside;
            }
            
            //Altera para o estado de mudar escala da tela de edição
            if(event.type == "keydown") {
                stateMachine.currentState = states.scaleEditScreen;
                states.scaleEditScreen.automaticStateChange = self;
                stateMachine.control(event, false);
                return
            }
            //Desenha diretamente em currentImageData caso o canal alpha do lapis seja 255
            else if(editScreenConfig.colorMain[3] == 255) {
                if(event.type == "mousedown" || event.type == "touchstart") {
                    self.on = true;
                    colorSelectorTab.visible = true;
                    colorSelectorTab.toogle();
                    
                    if(!draw()) {
                        self.on = false;
                        stateMachine.currentState = states.moveEditScreen;
                        states.moveEditScreen.returnToPreviousState = self;
                        stateMachine.control(event); // Passa o controle da máquina de estado para outro(a) função/estado
                        return //Faz com que a execução desta função termine aqui
                    }
                }
                else if((event.type == "mousemove" || event.type == "touchmove") && self.on) {
                    draw();
                }
                else if(event.type == "mouseup" || event.type == "touchend") {
                    self.on = false;
                    self.old = {x: null, y: null};
                }
            }
            else {// senão desenhe em auxiliaryImageData e depois mescle 
                if(event.type == "mousedown" || event.type == "touchstart") {
                    self.on = true;
                    imageConfig.auxiliaryImage = true;
                    colorSelectorTab.visible = true;
                    colorSelectorTab.toogle();
                    
                    if(!draw(true)) {
                        self.on = false;
                        stateMachine.currentState = states.moveEditScreen;
                        states.moveEditScreen.returnToPreviousState = self;
                        stateMachine.control(event); // Passa o controle da máquina de estado para outro(a) função/estado
                        return //Faz com que a execução desta função termine aqui
                    }
                }
                else if((event.type == "mousemove" || event.type == "touchmove") && self.on) {
                    draw(true);
                }
                else if(event.type == "mouseup" || event.type == "touchend") {
                    self.on = false;
                    self.old = {x: null, y: null};
                    imageConfig.auxiliaryImage = false;
                    mergeImages();
                }
            }
        }
    }
}

const stateMachine = {
    currentState: states.moveEditScreen,
    control: (event, preventDefault = true) => {
        if(preventDefault) { event.preventDefault() }
        const state = stateMachine.currentState ?? null;
        if(state && currentImageData) {
            state.func(event);
        }
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

//Parar a propagação no colorSelectorTabElem
const colorSelectorTabElem = document.getElementById("colorSelectorTab");
colorSelectorTabElem.addEventListener("mousedown", (e) => e.stopPropagation(), false);
colorSelectorTabElem.addEventListener("mousemove", (e) => e.stopPropagation(), false);
colorSelectorTabElem.addEventListener("mouseup", (e) => e.stopPropagation(), false);
colorSelectorTabElem.addEventListener("mouseout", (e) => e.stopPropagation(), false);

editScreenToolbarElem.addEventListener("touchstart", (e) => e.stopPropagation(), {passive: false});
editScreenToolbarElem.addEventListener("touchmove", (e) => e.stopPropagation(), {passive: false});
editScreenToolbarElem.addEventListener("touchend", (e) => e.stopPropagation(), {passive: false});

//Botões do elemento edit-screen-toolbar
const moveEditScreenBtn = document.getElementById("moveEditScreenBtn");
const pencilBtn = document.getElementById("pencilBtn");
const colorPaletteBtn = document.getElementById("colorPaletteBtn");

//Adicionando comportamentos nos botões
moveEditScreenBtn.addEventListener("click", () => stateMachine.currentState = states.moveEditScreen, false);
pencilBtn.addEventListener("click", () => stateMachine.currentState = states.drawWithPencil, false);
colorPaletteBtn.addEventListener("click", colorSelectorTab.toogle, false);