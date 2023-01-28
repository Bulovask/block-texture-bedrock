const states = {
    moveEditScreen: {
        oldX: null,
        oldY: null,
        mainMouseButtonPressed: false,
        //Verifica se o botao principal está sendo pressionado e enquanto o mouse é movido o contexto da tela de edicao o acompanha
        func: (event) => {
            const self = states.moveEditScreen;
            
            if((event.type == "mousedown" && event.buttons == 1) || (event.type == "touchstart")) {
                self.oldX = event.clientX ?? event.targetTouches[0].clientX;
                self.oldY = event.clientY ?? event.targetTouches[0].clientY;
                self.mainMouseButtonPressed = true;
            }

            else if((event.type == "mousemove" && self.mainMouseButtonPressed) || (event.type == "touchmove")) {
                const x = event.clientX ?? event.targetTouches[0].clientX;
                const y = event.clientY ?? event.targetTouches[0].clientY;

                const coords = canvasClientCoordsToCanvasCoords(x, y);
                const oldCoords = canvasClientCoordsToCanvasCoords(self.oldX, self.oldY);
                
                editScreenConfig.x += (coords.x - oldCoords.x) / editScreenConfig.scale;
                editScreenConfig.y += (coords.y - oldCoords.y) / editScreenConfig.scale;
                
                self.oldX = x;
                self.oldY = y;
            }

            else if((event.type == "mouseup" && event.buttons == 0) || (event.type == "touchend")) {
                self.oldX = null;
                self.oldY = null;
                self.mainMouseButtonPressed = false;
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
    }
}

const stateMachine = {
    currentState: states.scaleEditScreen,
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
window.addEventListener("mousedown", stateMachine.control, false);
window.addEventListener("mouseup", stateMachine.control, false);
window.addEventListener("mousemove", stateMachine.control, false);

//Eventos do touchScreen
window.addEventListener("touchstart", stateMachine.control, {passive: false});
window.addEventListener("touchmove", stateMachine.control, {passive: true});
window.addEventListener("touchend", stateMachine.control, {passive: false});

//Eventos de teclado
window.addEventListener("keydown", (event) => { stateMachine.control(event, false) }, false);
window.addEventListener("keyup", (event) => { stateMachine.control(event, false) }, false);


//Parar a propagação no editScreenToolbarElem 
const editScreenToolbarElem = document.getElementById("edit-screen-toolbar");
editScreenToolbarElem.addEventListener("mousedown", (e) => e.stopPropagation(), false);
editScreenToolbarElem.addEventListener("mousemove", (e) => e.stopPropagation(), false);
editScreenToolbarElem.addEventListener("mouseup", (e) => e.stopPropagation(), false);

editScreenToolbarElem.addEventListener("touchstart", (e) => e.stopPropagation(), {passive: false});
editScreenToolbarElem.addEventListener("touchmove", (e) => e.stopPropagation(), {passive: false});
editScreenToolbarElem.addEventListener("touchend", (e) => e.stopPropagation(), {passive: false});