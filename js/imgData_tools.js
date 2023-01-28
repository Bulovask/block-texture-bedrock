class ImgData {
    //Muda a cor do pixel de um imageData, é aceitavel passar o índice ou as cordenadas x e y do pixel
    static setPixel(imgData, color, x, y) {
        let i;
        
        if(y !== undefined && x >= 0 && x < imgData.width && y >= 0 && y < imgData.height) {
            i = x + y * imgData.width;
        }
        else if(y === undefined) { i = x }
        
        if(i !== undefined) {
            imgData.data[i * 4 + 0] = color.r ?? color[0] ?? 0;
            imgData.data[i * 4 + 1] = color.g ?? color[1] ?? 0;
            imgData.data[i * 4 + 2] = color.b ?? color[2] ?? 0;
            imgData.data[i * 4 + 3] = color.a ?? color[3] ?? 255;
        }
    }
    //Retorna a cor do pixel de um imageData ou undefined caso o índice ou as coordenadas x e y estejam fora do imageData
    static getPixel(imgData, x, y) {
        let i;
        if(y !== undefined && x >= 0 && x < imgData.width && y >= 0 && y < imgData.height) {
            i = x + y * imgData.width;
        }
        else if(y === undefined) { i = x }
        
        if(i !== undefined) {
            const data = imgData.data;
            const k = i * 4;
            return [data[k], data[k+1], data[k+2], data[k+3]];
        }
    }
    //É parecido com o setPixel, mas ele mistura a cor do pixel com a cor passada como parâmetro
    static drawPixel(imgData, color, x, y) {
        const pixel = ImgData.getPixel(imgData, x, y);
        if(pixel) {
            const normalizedPixel = [pixel[0], pixel[1], pixel[2], pixel[3] / 255];
            const normalizedColor = [color[0], color[1], color[2], color[3] / 255];
            if(normalizedColor[3] < 0.007) normalizedColor[3] = 0;

            const ctx = ImgData.createPixelManipulationCanvas(1, 1).ctx;
            ctx.clearRect(-1, -1, 3, 3);
            ctx.fillStyle = "rgba(" + normalizedPixel + ")";
            ctx.fillRect(-1, -1, 3, 3);
            ctx.fillStyle = "rgba(" + normalizedColor + ")";
            ctx.fillRect(-1, -1, 3, 3);

            const newColor = Array.from(ctx.getImageData(0,0,1,1).data);
            ImgData.setPixel(imgData, newColor, x, y);
        }
    }
    //Cria um canvas para manipulação de pixels, pode ser usado para combinar pixels individuais ou imageDatas inteiros 
    static createPixelManipulationCanvas(width = 1, height = 1) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", {willReadFrequently: true});
        return {
            ctx, canvas,
            context: ctx,
            cnv: canvas
        }
    }
}
