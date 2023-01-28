createImageData(16, 16, [255, 255, 0, 255]);
imageConfig.background = [0, 255, 0, 2];

resizeEditScreen();
transformEditScreen();

//Inicie a função mainLoop que se encontra em "js/setup.js"
mainLoop();