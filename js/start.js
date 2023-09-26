const log = console.log;

log("\nPara desenvolvedores: Alguns comandos que pode ajudar a manusear o programa inacabado")
log("createImageData(width, height, [red, green, blue, alpha]) // cria uma nova imagem para edição; Os valores passados para red, green, blue e alpha são inteiros de 0 a 255 inclusive")
log("Para mudar a cor do lápiz\neditScreenConfig.colorMain = [red, green, blue, alpha]")
log("Para escolher a cor de fundo da imagem (Precisa ser feito antes de apertar no botão criar)", 
"imageConfig.background = [red, green, blue, alpha]")


// function line(x,y, x1, y1) {
//     const event0 = new Event("mousedown")
//     const event1 = new Event("mousemove")
//     const event2 = new Event("mousemove")
//     const event3 = new Event("mouseup")
    
//     event0.clientX = x;
//     event0.clientY = y;
//     event1.clientX = x;
//     event1.clientY = y;
//     event2.clientX = x1;
//     event2.clientY = y1;
//     event3.clientX = x1;
//     event3.clientY = y1;

//     event0.buttons = 1;
//     event1.buttons = 1;
//     event2.buttons = 1;
//     event3.buttons = 1;

//     ([event0, event1, event2, event3]).forEach(event => {
//         window.dispatchEvent(event);
//     });
// }


// const ppp = {x:null, y:null}

// function drawline(e) {
//     if(e.buttons == 2) {
//         console.log("clique", e.clientX, e.clientY);
        
//         if(ppp.x == null) {
//             ppp.x = e.clientX
//             ppp.y = e.clientY
//             console.log("if")
//         }
//         else {
//             line(ppp.x, ppp.y, e.clientX, e.clientY)

//             ppp.x = ppp.y = null
//             console.log("else")
//         }
//     }
// }

// window.addEventListener('mousedown', drawline, false)