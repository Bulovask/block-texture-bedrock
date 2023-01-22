const editScreenElem = document.getElementById("screen-editor");
const editScreenCtx = editScreenElem.getContext("2d");

let currentImageData;

const editScreenConfig = {
    x: 0,
    y: 0,
    scale: 1,
    pixelSize: 15, //Tamanho do pixel "virtual" do editor em pixels "reais" do canvas
    border: true,
    borderColor: "#000",
    borderWeight: 1
}

const imageConfig = {
    width: 16,
    height: 16,
    background: [255, 255, 255, 255]
}

const cache = {
    //Guarda o cache da imagem atual, isso evita que a cada novo frame ser criado um novo imageBitmap
    imageBitmap: {
        modified: true,
        image: null
    }
}

function renderImagemInEditScreen(img) {
    //Desenhar a imagem na tela
    const x = -imageConfig.width * editScreenConfig.pixelSize / 2;
    const y = -imageConfig.height * editScreenConfig.pixelSize / 2;
    const width = imageConfig.width * editScreenConfig.pixelSize;
    const height = imageConfig.height * editScreenConfig.pixelSize;
    
    editScreenCtx.drawImage(img, x, y, width, height);
    
    //Desenha uma borda em torno da imagem
    if(editScreenConfig.border) {
        //offsets: para corrigir bordas borradas
        const offsetX = (editScreenElem.width % 2 == 1 ? 0 : 0.5) - editScreenConfig.x % 1;
        const offsetY = (editScreenElem.height % 2 == 1 ? 0 : 0.5) - editScreenConfig.y % 1;
        editScreenCtx.lineWidth = editScreenConfig.borderWeight;
        editScreenCtx.strokeStyle = editScreenConfig.borderColor;
        editScreenCtx.strokeRect(x + offsetX, y + offsetY, width, height);
    }
}

function createImageData(width = 16, height = 16, background = [255, 255, 255, 255]) {
    imageConfig.width = width;
    imageConfig.height = height;
    imageConfig.background = background;
    cache.imageBitmap.image = null;
    cache.imageBitmap.modified = true;

    currentImageData = new ImageData(imageConfig.width, imageConfig.height);

    for(let i = 0; i < imageConfig.width * imageConfig.height; i++) {
        ImgData.setPixel(currentImageData, imageConfig.background, i);
    }

    resizeEditScreen(); //Função que se encontra em js/transformEditScreen.js
}

function mainLoop() {
    transformEditScreen(); //Função que se encontra em js/transformEditScreen.js
    if(cache.imageBitmap.modified) {
        createImageBitmap(currentImageData).then(img => {
            renderImagemInEditScreen(img);
            cache.imageBitmap.image = img;
            cache.imageBitmap.modified = false;
        });
        requestAnimationFrame(mainLoop);
    }
    else {
        renderImagemInEditScreen(cache.imageBitmap.image);
        requestAnimationFrame(mainLoop);
    }
}