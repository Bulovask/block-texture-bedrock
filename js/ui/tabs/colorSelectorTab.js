const colorSelectorTab = {
    visible: false,
    color: [0, 0, 0, 255],
    bg: false,
    ok_func: () => {}, // Função vazia para ser sobrescrita 
    update_func: () => {}, // Função vazia para ser sobrescrita
    cancel_func: () => {}, // Função vazia para ser sobrescrita
    init: () => {
        const RGBASelector = document.getElementById("RGBASelector");
        const colorDiv = RGBASelector.querySelector(".color");
        
        const red_range = RGBASelector.querySelector(".red > input[type='range']");
        const green_range = RGBASelector.querySelector(".green > input[type='range']");
        const blue_range = RGBASelector.querySelector(".blue > input[type='range']");
        const alpha_range = RGBASelector.querySelector(".alpha > input[type='range']");

        const red_number = RGBASelector.querySelector(".red > input[type='number']");
        const green_number = RGBASelector.querySelector(".green > input[type='number']");
        const blue_number = RGBASelector.querySelector(".blue > input[type='number']");
        const alpha_number = RGBASelector.querySelector(".alpha > input[type='number']");

        const ok = RGBASelector.querySelector(".ok");
        const cancel = RGBASelector.querySelector(".cancel");
        
        ok.addEventListener("click", () => {
            colorSelectorTab.toogle();
            colorSelectorTab.ok_func([...colorSelectorTab.color]);
        }, false);

        cancel.addEventListener("click", () => {
            colorSelectorTab.toogle();
            colorSelectorTab.cancel_func([...colorSelectorTab.color]);
        }, false);

        const updateColor = () => {
            const color = colorSelectorTab.color;
            colorDiv.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
            colorSelectorTab.update_func([...color]);
        }

        const update = (a, b, _index) => {
            a.value = Number(a.value.replace(".", ""));

            if(a.value > 255) a.value = 255;
            else if(a.value < 0) a.value = 0;
            colorSelectorTab.color[_index] = b.value = a.value;
            updateColor();
        }

        red_range.addEventListener("input", () => update(red_range, red_number, 0), false);
        green_range.addEventListener("input", () => update(green_range, green_number, 1), false);
        blue_range.addEventListener("input", () => update(blue_range, blue_number, 2), false);
        alpha_range.addEventListener("input", () => update(alpha_range, alpha_number, 3), false);

        red_number.addEventListener("input", () => update(red_number, red_range, 0), false);
        green_number.addEventListener("input", () => update(green_number, green_range, 1), false);
        blue_number.addEventListener("input", () => update(blue_number, blue_range, 2), false);
        alpha_number.addEventListener("input", () => update(alpha_number, alpha_range, 3), false);
    },
    toogle: () => {
        const colorSelectorTabElem = document.getElementById("colorSelectorTab");
        colorSelectorTabElem.classList.toggle("hidden", colorSelectorTab.visible);
        colorSelectorTabElem.classList.toggle("up", colorSelectorTab.bg);

        colorSelectorTab.visible = !colorSelectorTab.visible;
    },
    hidden: () => {
        const colorSelectorTabElem = document.getElementById("colorSelectorTab");
        colorSelectorTabElem.classList.add("hidden");
        colorSelectorTab.visible = false;
    }
}

colorSelectorTab.init();