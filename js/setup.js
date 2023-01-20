const screenEditorElem = document.getElementById("screen-editor");
const screenEditorCtx = screenEditorElem.getContext("2d");

const screenEditorConfig = {
    x: 0,
    y: 0,
    scale: 1,
    pixelSize: 15 //Tamanho do pixel "virtual" do editor em pixels "reais" do canvas
}

const imageConfig = {
    width: 16,
    height: 16,
    background: [255, 255, 255, 255]
}

//Criando uma imagem e aplicando um fundo branco
let currentImageData = new ImageData(imageConfig.width, imageConfig.height);

for(let i = 0; i < imageConfig.width * imageConfig.height; i++) {
    ImgData.setPixel(currentImageData, imageConfig.background, i);
}

function loop() {
    createImageBitmap(currentImageData).then(img => {
        tranformScreenEditor();
        const x = -imageConfig.width * screenEditorConfig.pixelSize / 2;
        const y = -imageConfig.height * screenEditorConfig.pixelSize / 2;
        const width = imageConfig.width * screenEditorConfig.pixelSize;
        const height = imageConfig.height * screenEditorConfig.pixelSize;

        screenEditorCtx.drawImage(img, x, y, width, height);
        screenEditorCtx.lineWidth = 1.5;
        screenEditorCtx.strokeRect(x + 0.5, y + 0.5, width, height);

        requestAnimationFrame(loop);
    });
}