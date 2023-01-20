class ImgData {
    //Muda a cor do pixel de um imageData, é aceitavel passar um indice ou as cordenadas x e y do pixel
    static setPixel(imgData, color, x, y) {
        let i;
        
        if(y !== undefined && x >= 0 && x < imgData.width && y >= 0 && y < imgData.height) {
            i = x + y * imgData.width;
        }
        else if(y === undefined) { i = x }
        
        if(i !== undefined) {
            imgData.data[i * 4 + 0] = color.r ?? color[0] ?? 255;
            imgData.data[i * 4 + 1] = color.g ?? color[1] ?? 255;
            imgData.data[i * 4 + 2] = color.b ?? color[2] ?? 255;
            imgData.data[i * 4 + 3] = color.a ?? color[3] ?? 255;
        }
    }
}
