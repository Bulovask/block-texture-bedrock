const editScreenElem = document.getElementById("edit-screen");
const mainCanvas = document.getElementById("main-canvas");
const mainCanvasCtx = mainCanvas.getContext("2d");

let currentImageData;
let auxiliaryImageData;

const editScreenConfig = {
    x: 0,
    y: 0,
    scale: 1000,
    border: true,
    borderColor: "#000",
    borderWeight: 1,
    colorMain: [0, 0, 0, 255],
    colorSecondary: [255, 255, 255, 255]
}

const imageConfig = {
    width: 16,
    height: 16,
    background: [255, 255, 255, 255],
    auxiliaryImage: false
}

const cache = {
    //Guarda o cache da imagem atual, isso evita que a cada novo frame ser criado um novo imageBitmap
    imageBitmap: {
        modified: true,
        image: null
    }
}

function renderImageInEditScreen(img, auxImg) {
    //Desenhar a imagem na tela
    const width = imageConfig.width;
    const height = imageConfig.height;

    mainCanvasCtx.clearRect(0, 0, width, height);
    mainCanvasCtx.drawImage(img, 0, 0, width, height);
    //Renderiza imagem auxiliar que é chamada por alguns estados de máquina como o DrawWithPencil
    if(auxImg) {
        mainCanvasCtx.drawImage(auxImg, 0, 0, width, height);
    }
}

function createImageData(width = 16, height = 16, background = [255, 255, 255, 255]) {
    imageConfig.width = width;
    imageConfig.height = height;
    imageConfig.background = background;
    cache.imageBitmap.image = null;
    cache.imageBitmap.modified = true;

    currentImageData = new ImageData(imageConfig.width, imageConfig.height);
    auxiliaryImageData = new ImageData(imageConfig.width, imageConfig.height);

    mainCanvas.width = width;
    mainCanvas.height = height;

    for(let i = 0; i < imageConfig.width * imageConfig.height; i++) {
        ImgData.setPixel(currentImageData, imageConfig.background, i);
        ImgData.setPixel(auxiliaryImageData, [0,0,0,0], i);
    }
}

//Mescla a auxiliaryImageData em currentImageData e redefine auxiliaryImageData para uma imagem transparente
function mergeImages() {
    for(let i = 0; i < imageConfig.width * imageConfig.height; i++) {
        const color = ImgData.getPixel(auxiliaryImageData, i);
        ImgData.drawPixel(currentImageData, color, i);
        cache.imageBitmap.modified = true;
    }
    auxiliaryImageData = new ImageData(imageConfig.width, imageConfig.height);
}

function mainLoop() {
    if(currentImageData) { // Verifica se a currentImageData foi criada pela função createImageData()
        if(cache.imageBitmap.modified) {
            createImageBitmap(currentImageData).then(img => {
                renderImageInEditScreen(img);
                cache.imageBitmap.image = img;
                cache.imageBitmap.modified = false;
            });
        }
        else {
            if(imageConfig.auxiliaryImage) {
                createImageBitmap(auxiliaryImageData).then(auxImg => {
                    renderImageInEditScreen(cache.imageBitmap.image, auxImg);
                });
            }
            // else { // Necessário caso o MainCanvas seja redimensionado, mas isso é improvável
                      // Removi para não ficar redesenhando a imagem a todo momento
            //     renderImageInEditScreen(cache.imageBitmap.image);
            // }
        }
    }
    requestAnimationFrame(mainLoop);
}