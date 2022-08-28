const cols = {
    "col1": "#333333",
    "col2": "#444f17",
    "col3": "#452129",
    "col4": "#17494f",
    "col5": "#4d4119",
}

let activeColour = "col1";

document.addEventListener('DOMContentLoaded', () => {
    create();
    window.onresize = create;

    let b1 = document.getElementById("col1");
    let b2 = document.getElementById("col2");
    let b3 = document.getElementById("col3");
    let b4 = document.getElementById("col4");
    let b5 = document.getElementById("col5");
    let all = [b1, b2, b3, b4, b5];

    b1.onclick = () => toggle_button(b1, all);
    b2.onclick = () => toggle_button(b2, all);
    b3.onclick = () => toggle_button(b3, all);
    b4.onclick = () => toggle_button(b4, all);
    b5.onclick = () => toggle_button(b5, all);
});

function toggle_button(toggled, all) {
    all.forEach(b => {
        b.style.borderStyle = "none";
        }
    )
    toggled.style.borderStyle = "solid";

    activeColour = toggled.id;
    let target_color = cols[toggled.id];
    let pixels = document.getElementsByClassName("pixels");

    for (let p of pixels) {
        if (p.dataset.colour === "true") {
            p.style.backgroundColor = target_color;
        }
    }

    let items = document.getElementsByClassName("has-colour");
    for (let item of items) {
        item.style.backgroundColor = target_color;
    }

    let items2 = document.getElementsByClassName("has-text-colour");
    for (let item2 of items2) {
        item2.style.color = target_color;
    }
}

const size = 50;

function create() {

    setTimeout(() => {
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");
        let main = document.querySelector("main");
        main.innerHTML = "";

        const remaining_height = window.innerHeight - header.offsetHeight - footer.offsetHeight
        main.style.height = `${remaining_height}px`;

        const n_height = Math.floor(remaining_height / size);
        const n_width = Math.floor(window.innerWidth / size) + 1;

        let [coordinates, colours] = getCoordinates(n_height, n_width, header.offsetHeight);
        placeDivs(coordinates, colours, main);
    }, 100)
}

function placeDivs(coordinates, colours, parent) {
    for (let i = 0; i < coordinates.length; i++) {
        let [x, y] = coordinates[i];
        let colour = colours[i];

        let div = document.createElement("div");
        div.className = "pixels";
        div.style.width = `${size}px`
        div.style.height = `${size}px`

        if (colour) {
            div.style.backgroundColor = cols[activeColour];
            div.dataset.colour = true;
        }
        else {
            div.style.backgroundColor = "#eeeeee";
            div.dataset.colour = false;
        }
        div.onclick = () => changeColour(div);

        div.style.position = "absolute";
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;

        parent.append(div);
    }
}

let CTR = 1;

function changeColour(element) {
    element.classList.remove('onclick');  // https://stackoverflow.com/questions/4847996/css-animation-onclick
    void element.offsetWidth;
    element.classList.add('onclick');

    if (element.style.backgroundColor == "rgb(238, 238, 238)") {
        element.style.backgroundColor = cols[activeColour];
        element.dataset.colour = "true";
    }
    else {
        element.style.backgroundColor = "#eeeeee";
        element.dataset.colour = "false";
    }

    element.style.zIndex = `${CTR}`;
    CTR ++;  // https://stackoverflow.com/questions/15782078/bring-element-to-front-using-css
}

function getCoordinates(n_height, n_width, height_offset) {
    let coordinates = [];
    let colours = [];

    for (let i = 0; i < n_height; i++) {
        const p = i / n_height;

        for (let j = 0; j < n_width; j++) {
            let sample = Math.random();

            if (sample > p) {
                colours.push(true);
            }
            else{
                colours.push(false);
            }

            coordinates.push([j * size, i * size + height_offset]);
        }
    }

    return [coordinates, colours];
}
