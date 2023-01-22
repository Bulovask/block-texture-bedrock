createImageData(16, 16, [255, 0, 0, 255]);
imageConfig.background = [0, 255, 0, 2];

resizeEditScreen();
transformEditScreen();

//Inicie a função mainLoop que se encontra em "js/setup.js"
mainLoop();


//TESTANDO O ALGORITMO DE SOBREPOSIÇÃO DE CORES
/*
ImgData.drawPixel(currentImageData, [0,0,0,128], 0, 0);
ImgData.drawPixel(currentImageData, [255,0,0,128], 0, 1);
ImgData.drawPixel(currentImageData, [0,255,0,128], 0, 2);
ImgData.drawPixel(currentImageData, [0,0,255,128], 0, 3);

let i = 0;
function sss() {
    ImgData.drawPixel(currentImageData, [0,0,0,255], 0, i % 3 + 1);
    i++;
    if(i < 3 * 255) setTimeout(sss, 200)
    cache.imageBitmap.modified = true;
}

setTimeout(() => {sss()}, 10);
*/