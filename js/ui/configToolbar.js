//  configToolbar
const configToolbar = {
    visible: false,
    currentState: null,
    init: () => {
        creationTab.cancelBtn = true;
        const openConfigBtn = document.getElementById("open-config-btn");
        openConfigBtn.addEventListener("click", configToolbar.toogle, false);
        
        const newImageBtn = document.getElementById("new-image-btn")

        newImageBtn.addEventListener("click", () => {creationTab.toogle(); configToolbar.toogle()}, false);
    },
    toogle: () => {
        const configToolbarElem = document.getElementById("config-toolbar");
        const editScreenToolbar = document.getElementById("edit-screen-toolbar");
        
        
        configToolbarElem.classList.toggle("hidden", configToolbar.visible);
        editScreenToolbar.classList.toggle("hidden", !configToolbar.visible);
        
        if(configToolbar.visible) {
            stateMachine.currentState = configToolbar.currentState; //Ativa o estado anterior
        }
        else {
            configToolbar.currentState = stateMachine.currentState;
            stateMachine.currentState = null; //Desativa os estados
        }

        configToolbar.visible = !configToolbar.visible;
    }
}

configToolbar.init();