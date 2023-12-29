// colorSelectorTab
const colorSelectorTab = {
    visible: false,
    hue: 0,
    opacity: 255,
    color: [255, 0, 0, 255],
    draw: () => {
        const self = colorSelectorTab;
        const canvas = document.querySelector("#colorSelectorWidget canvas#colorSelectorCanvas");
        const hueChannelCanvas = document.querySelector("#colorSelectorWidget canvas#auxiliaryChannelSelector");
        const alphaChannelCanvas = document.querySelector("#colorSelectorWidget canvas#alphaChannelSelector");

        if(hueChannelCanvas.clientWidth > hueChannelCanvas.clientHeight) {
            hueChannelCanvas.width = alphaChannelCanvas.width = 256;
            hueChannelCanvas.height = alphaChannelCanvas.height = 1;
        }
        else {
            hueChannelCanvas.width = alphaChannelCanvas.width = 1;
            hueChannelCanvas.height = alphaChannelCanvas.height = 256;
        }

        const ctx = canvas.getContext("2d");
        const hueCtx = hueChannelCanvas.getContext("2d");
        const alphaCtx = alphaChannelCanvas.getContext("2d");

        const imgData = new ImageData(256, 256);
        const hueImgData = new ImageData(hueChannelCanvas.width, hueChannelCanvas.height);
        const alphaImgData = new ImageData(alphaChannelCanvas.width, alphaChannelCanvas.height);
        
        const setColor = (x,y,r,g,b,a, imgDataObj) => {
            const i = y * 256 + x;
                imgDataObj.data[4 * i + 0] = r;
                imgDataObj.data[4 * i + 1] = g;
                imgDataObj.data[4 * i + 2] = b;
                imgDataObj.data[4 * i + 3] = a;
        }
        
        const HSVToRGB = (hue, saturation, value) => {
            const C = value * saturation,
                  X = C * (1 - Math.abs((hue / 60) % 2 - 1)),
                  m = value - C;

            let rl;
            let gl;
            let bl;
                
            if(hue >= 0 && hue < 60) {
                rl = C;
                gl = X;
                bl = 0;
            }
            else if(hue >= 60 && hue < 120) {
                rl = X;
                gl = C;
                bl = 0;
            }
            else if(hue >= 120 && hue < 180) {
                rl = 0;
                gl = C;
                bl = X;
            }
            else if(hue >= 180 && hue < 240) {
                rl = 0;
                gl = X;
                bl = C;
            }
            else if(hue >= 240 && hue < 300) {
                rl = X;
                gl = 0;
                bl = C;
            }
            else if(hue >= 300 && hue < 360) {
                rl = C;
                gl = 0;
                bl = X;
            }

            const r = (rl + m) * 255 >> 0;
            const g = (gl + m) * 255 >> 0;
            const b = (bl + m) * 255 >> 0;

            return {r, g, b}
        }

        //Desenhar a grade de cores
        for(let x = 0; x < 256; x++) {
            for(let y = 0; y < 256; y++) {
                const value = (255 - y) / 255, 
                    saturation = x / 255;

                const c = HSVToRGB(self.hue, saturation, value);

                setColor(x, y, c.r, c.g, c.b, self.opacity, imgData);
            }
        }

        //Desenhar canais hue e alpha
        for(let x = 0; x < hueChannelCanvas.width; x++) {
            for(let y = 0; y < hueChannelCanvas.height; y++) {
                const percent = hueChannelCanvas.width > hueChannelCanvas.height ? x / hueChannelCanvas.width : y / hueChannelCanvas.height;
                const c = HSVToRGB(percent * 360 >> 0, 1, 1);

                //console.log(hueChannelCanvas.width > hueChannelCanvas.height)

                if(hueChannelCanvas.width > hueChannelCanvas.height) {
                    setColor(x, y, c.r, c.g, c.b, self.opacity, hueImgData);
                }
                else {
                    setColor(y, x, c.r, c.g, c.b, self.opacity, hueImgData);
                }
            } 
        }

        createImageBitmap(imgData).then(img => ctx.drawImage(img, 0, 0));
        createImageBitmap(hueImgData).then(img => hueCtx.drawImage(img, 0, 0));
        createImageBitmap(alphaImgData).then(img => alphaCtx.drawImage(img, 0, 0));
    },
    toogle: () => {
        const colorSelectorTabElem = document.getElementById("colorSelectorTab");
        colorSelectorTabElem.classList.toggle("hidden", colorSelectorTab.visible);
        
        if(!colorSelectorTab.visible) {
            colorSelectorTab.draw();
        }

        colorSelectorTab.visible = !colorSelectorTab.visible;
    }
}

// creationTab
const creationTab = {
    visible: false,
    cancelBtn: false,
    init: () => {
        const createBtn = document.getElementById("create-image-btn");
        const cancelBtn = document.getElementById("cancel-image-creation-btn");

        createBtn.addEventListener("click", () => {
            const width = parseInt(document.getElementById("width-image-input").value);
            const height = parseInt(document.getElementById("height-image-input").value);
            const color = document.getElementById("background-image-input").value;

            imageConfig.width = width;
            imageConfig.height = height;
            imageConfig.background = color.split(",").map(n => parseInt(n));
            editScreenConfig.x = 0;
            editScreenConfig.y = 0;
            editScreenConfig.scale = 1000;

            createImageData(imageConfig.width, imageConfig.height, imageConfig.background);
            mainCanvas.classList.remove("hidden");
            creationTab.toogle();
            transformMainCanvas();
            mainLoop();
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