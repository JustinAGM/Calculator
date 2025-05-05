const keys = document.querySelectorAll(".key");
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";

// Click Event
for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        key.classList.add('active');
        setTimeout(() => key.classList.remove('active'), 150);
        if (value === "clear") {
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "";
        } else if (value === "backspace") {
            input = input.slice(0, -1);
            display_input.innerHTML = CleanInput(input);
        } else if (value === "=") {
            try {
                let result = eval(PrepareInput(input));
                display_output.innerHTML = CleanOutput(result);
            } catch {
                display_output.innerHTML = "Error";
            }
        } else if (value === "brackets") {
            if (
                input.indexOf("(") === -1 ||
                (input.indexOf("(") !== -1 &&
                    input.indexOf(")") !== -1 &&
                    input.lastIndexOf("(") < input.lastIndexOf(")"))
            ) {
                input += "(";
            } else {
                input += ")";
            }
            display_input.innerHTML = CleanInput(input);
        } else {
            if (ValidateInput(value)) {
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
    });
}

// Clean Input
function CleanInput(input) {
    const map = {
        "*": { class: "operator", symbol: "X" },
        "/": { class: "operator", symbol: "÷" },
        "-": { class: "operator", symbol: "-" },
        "+": { class: "operator", symbol: "+" },
        "%": { class: "percent", symbol: "%" },
        "(": { class: "brackets", symbol: "(" },
        ")": { class: "brackets", symbol: ")" }
    };

    let formatted = '';
    let buffer = '';

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (!isNaN(char) || char === ".") {
            buffer += char;
        } else {
            if (buffer) {
                formatted += addCommas(buffer);
                buffer = '';
            }

            if (map[char]) {
                formatted += `<span class="${map[char].class}">${map[char].symbol}</span>`;
            } else {
                formatted += char;
            }
        }
    }

    if (buffer) {
        formatted += addCommas(buffer);
    }

    return formatted;
}

// Add Comma if >3 digits are input
function addCommas(numberStr) {
    if (numberStr.includes(".")) {
        let [int, dec] = numberStr.split(".");
        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return int + "." + dec;
    } else {
        return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// Clean Output
function CleanOutput(output) {
    let output_string = output.toString();
    let [int, dec] = output_string.split(".");
    let output_array = int.split("");

    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i -= 3) {
            output_array.splice(i, 0, ",");
        }
    }

    if (dec) {
        output_array.push(".");
        output_array.push(dec);
    }

    return output_array.join("");
}

// Input Validation
function ValidateInput(value) {
    const last_input = input.slice(-1);
    const operators = ["+", "-", "*", "/"];

    if (value === "." && last_input === ".") return false; // Prevent multiple dots
    if (operators.includes(value) && operators.includes(last_input)) return false; // Prevent consecutive operators

    return true;
}

// Decimal function
function PrepareInput(input) {
    let input_array = input.split("");

    for (let i = 0; i < input_array.length; i++) {
        if (input_array[i] == "%") {
            input_array[i] = "/100";
        }
    }
    return input_array.join("");
}

// For keyboard Users
document.addEventListener('keydown', (event) => {
    const keyMap = {
        'Enter': '=',
        'Backspace': 'backspace',
        'Delete': 'clear',
        '*': '*',
        '/': '/',
        '+': '+',
        '-': '-',
        '.': '.',
        '%': '%',
        '(': 'brackets',
        ')': 'brackets'
    };

    const key = event.key;

    // If key is relevant to calculator
    if (!isNaN(key) || keyMap[key]) {
        event.preventDefault();
        const mappedKey = !isNaN(key) ? key : keyMap[key];
        simulateClick(mappedKey);
    }
});

let currentIndex = 0;

function focusKey(index) {
    keys.forEach((key, i) => {
        if (i === index) {
            key.focus();
        }
    });
}

// Initial focus
focusKey(currentIndex);

document.addEventListener('keydown', (event) => {
    const rowLength = 4; // 4 columns per row

    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();

        if (event.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % keys.length;
        } else if (event.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + keys.length) % keys.length;
        } else if (event.key === 'ArrowDown') {
            currentIndex = (currentIndex + rowLength) % keys.length;
        } else if (event.key === 'ArrowUp') {
            currentIndex = (currentIndex - rowLength + keys.length) % keys.length;
        }

        focusKey(currentIndex);
    }

    // Press "Enter" or "Space" to activate focused key
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        keys[currentIndex].click();
    }
});

function simulateClick(value) {
    const keyElement = document.querySelector(`.key[data-key="${value}"]`);
    if (keyElement) {
        keyElement.click();
        keyElement.classList.add('active');
        setTimeout(() => keyElement.classList.remove('active'), 150);
    }
}
