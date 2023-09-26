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
                const {x, y} = editScreenClientCoordsIntoImageDataCoords(event);
                
                if(self.returnToPreviousState && x >= 0 && y >= 0 && x < currentImageData.width && y < currentImageData.height) {
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
                
                const coords = {x, y};
                const oldCoords = {x: self.oldX, y: self.oldY};
                
                editScreenConfig.x += (coords.x - oldCoords.x);
                editScreenConfig.y += (coords.y - oldCoords.y);
                
                self.oldX = x;
                self.oldY = y;

                transformMainCanvas();
            }
            
            else if((event.type == "mouseup" && event.buttons == 0) || (event.type == "mouseout" && (!(event.target === mainCanvas || event.target === editScreenElem)) || event.relatedTarget === editScreenToolbarElem) || 
                    (event.type == "touchend" && event.targetTouches.length == 1) || (event.type == "touchstart" && event.targetTouches.length > 1)) {
                self.oldX = null;
                self.oldY = null;
                self.mainMouseButtonPressed = false;
            }
            //Altera para o estado de mudar escala da tela de edição
            else if((event.type == "keydown" && ({"-":1,"+":1})[event.key]) || event.type == "wheel" || (event.type == "touchstart" && event.targetTouches.length == 2)) {
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
            if(event.type == "keydown" || event.type == "wheel") {
                if(event.key == "+" || event.deltaY < 0) {
                    editScreenConfig.scale += 0.008;
                    
                    if(editScreenConfig.scale > 10) editScreenConfig.scale = 10;
                    editScreenElem.style.backgroundSize = editScreenConfig.scale * 5 + '% auto';
                    transformMainCanvas();
                }
                else if(event.key == "-" || event.deltaY > 0) {
                    editScreenConfig.scale -= 0.008;
                    
                    if(editScreenConfig.scale < 0.2) editScreenConfig.scale = 0.2;
                    editScreenElem.style.backgroundSize = editScreenConfig.scale * 5 + '% auto';
                    transformMainCanvas();
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
        old: {x: null, y: null}, // Guarda a posição do ultimo píxel que foi pintado
        func: (event) => {
            const self = states.drawWithPencil;
            
            const draw = (auxiliary) => {
                const img_data = auxiliary ? auxiliaryImageData : currentImageData;
                const coords = editScreenClientCoordsIntoImageDataCoords(event);
                const inside = coords.x >= 0 && coords.y >= 0 && coords.x < img_data.width && coords.y < img_data.height; 
                
                if(!(coords.x == self.old.x && coords.y == self.old.y)) {
                    if(self.old.x != null && self.old.y != null) {  
                        const deltax = Math.abs(coords.x - self.old.x);
                        const deltay = Math.abs(coords.y - self.old.y);
                        const deltamax = Math.max(deltax, deltay);
                        const deltamin = Math.min(deltax, deltay);

                        const signalx = (coords.x - self.old.x < 0) ? -1 : 1;
                        const signaly = (coords.y - self.old.y < 0) ? -1 : 1;
                        
                        for(let i = 0; i < deltamax; i++) {
                            const vx = deltax != 0 ? signalx * (deltax / deltamax) : 0;
                            const vy = deltay != 0 ? signaly * (deltay / deltamax) : 0;
                            
                            const x = coords.x - Math.round(i * vx);
                            const y = coords.y - Math.round(i * vy);

                            ImgData.setPixel(img_data, editScreenConfig.colorMain, x, y);
                        }
                        
                        self.old = {x: coords.x, y: coords.y};
                        if(!auxiliary) cache.imageBitmap.modified = true;
                    }
                    else {
                        ImgData.setPixel(img_data, editScreenConfig.colorMain, coords.x, coords.y);
                        self.old = {x: coords.x, y: coords.y};
                        if(!auxiliary) cache.imageBitmap.modified = true;
                    }
                }
                return inside;
            }
            
            const switchToMoveEditScreen = () => {
                self.on = false;
                stateMachine.currentState = states.moveEditScreen;
                states.moveEditScreen.returnToPreviousState = self;
                stateMachine.control(event); // Passa o controle da máquina de estado para outro(a) função/estado
                self.old = {x: null, y: null};
            } 

            //Altera para o estado de mudar escala da tela de edição
            if((event.type == "keydown" && ({"-":1,"+":1})[event.key]) || event.type == "wheel" || (event.type == "touchstart" && event.targetTouches.length == 2)) {
                stateMachine.currentState = states.scaleEditScreen;
                states.scaleEditScreen.automaticStateChange = self;
                stateMachine.control(event, false);
                self.old = {x: null, y: null};
                return
            }
            //Desenha diretamente em currentImageData caso o canal alpha do lapis seja 255
            else if(editScreenConfig.colorMain[3] == 255) {
                if((event.type == "mousedown" && event.buttons == 1) || event.type == "touchstart") {
                    self.on = true;
                    colorSelectorTab.visible = true;
                    colorSelectorTab.toogle();
                    
                    if(!draw()) {
                        switchToMoveEditScreen();
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
                if((event.type == "mousedown" && event.buttons == 1) || event.type == "touchstart") {
                    self.on = true;
                    imageConfig.auxiliaryImage = true;
                    colorSelectorTab.visible = true;
                    colorSelectorTab.toogle();
                    
                    if(!draw(true)) {
                        switchToMoveEditScreen();
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
window.addEventListener("mouseout", (event) => stateMachine.control(event, false), false);
window.addEventListener("mousedown", (event) => stateMachine.control(event, false), false);
window.addEventListener("mouseup", (event) => stateMachine.control(event, false), false);
window.addEventListener("mousemove", (event) => stateMachine.control(event, false), false);

//Eventos da roda do mouse
window.addEventListener("wheel", (event) => {stateMachine.control(event, false)}, false);

//Eventos do touchScreen
window.addEventListener("touchstart", (event) => {stateMachine.control(event, false)}, {passive: false});
window.addEventListener("touchmove", (event) => {stateMachine.control(event, true)}, {passive: false});
window.addEventListener("touchend", (event) => {stateMachine.control(event, false)}, {passive: false});

//Eventos de teclado
window.addEventListener("keydown", (event) => { stateMachine.control(event, false) }, false);
window.addEventListener("keyup", (event) => { stateMachine.control(event, false) }, false);


//Parar a propagação no editScreenToolbarElem 
const editScreenToolbarElem = document.getElementById("edit-screen-toolbar");
editScreenToolbarElem.addEventListener("mousedown", (e) => e.stopPropagation(), false);
editScreenToolbarElem.addEventListener("mousemove", (e) => e.stopPropagation(), false);
//editScreenToolbarElem.addEventListener("mouseup", (e) => e.stopPropagation(), false);
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
moveEditScreenBtn.addEventListener("click", () => {
    stateMachine.currentState = states.moveEditScreen;
    states.moveEditScreen.returnToPreviousState = false;
}, false);
pencilBtn.addEventListener("click", () => stateMachine.currentState = states.drawWithPencil, false);
colorPaletteBtn.addEventListener("click", colorSelectorTab.toogle, false);