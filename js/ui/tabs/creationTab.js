// creationTab
const creationTab = {
    visible: false,
    cancelBtn: false,
    init: () => {
        const createBtn = document.getElementById("create-image-btn");
        const cancelBtn = document.getElementById("cancel-image-creation-btn");
        const bgImgBtn = document.getElementById("background-image-button");
        
        bgImgBtn.addEventListener("click", () => {
            colorSelectorTab.bg = true;
            colorSelectorTab.toogle();
        }, false);

        createBtn.addEventListener("click", () => {
            const width = parseInt(document.getElementById("width-image-input").value);
            const height = parseInt(document.getElementById("height-image-input").value);

            resetEditScreen();

            createImageData(width, height, imageConfig.background);
            mainCanvas.classList.remove("hidden");
            creationTab.toogle();
            colorSelectorTab.hidden();
            transformMainCanvas();
            mainLoop();
            colorSelectorTab.bg = false;
        }, false);

        cancelBtn.addEventListener("click", creationTab.toogle, false);
    },
    toogle: () => {
        const creationTabElem = document.getElementById("creationTab");
        const cancelImageCreationBtn = document.getElementById("cancel-image-creation-btn");

        creationTabElem.classList.toggle("hidden", !creationTab.visible);
        
        if(creationTab.cancelBtn) {
            cancelImageCreationBtn.removeAttribute("disabled");
        }
        else {
            cancelImageCreationBtn.setAttribute("disabled", true);
        }
        
        if(creationTab.visible) {
            stateMachine.currentState = null; //Desativa os estados
        }
        else {
            stateMachine.currentState = states.moveEditScreen; //Habilita o estado de movimentação
        }

        creationTab.visible = !creationTab.visible;
    }
}

creationTab.init();