const display = document.getElementById("display");

let currentInput = "";
let previousInput = "";
let operator = null;
let resetDisplay = false;


// Display update
function updateDisplay(value) {
    display.textContent = value || "0";
}


// Number buttons
document.querySelectorAll("[data-number]").forEach(button => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;

        if (resetDisplay) {
            currentInput = "";
            resetDisplay = false;
        }

        // Prevent multiple decimal points
        if (number === "." && currentInput.includes(".")) {
            return;
        }

        // Prevent unnecessary leading zeros
        if (currentInput === "0" && number !== ".") {
            currentInput = "";
        }

        currentInput += number;

        updateDisplay(currentInput);
    });

});


// Operator buttons
document.querySelectorAll("[data-operator]").forEach(button => {

    button.addEventListener("click", () => {

        const selectedOperator = button.dataset.operator;

        if (currentInput === "" && previousInput === "") {
            return;
        }

        // Operator chaining
        if (previousInput !== "" && currentInput !== "" && operator !== null) {
            calculate();
        }

        if (currentInput !== "") {
            previousInput = currentInput;
        }

        operator = selectedOperator;
        resetDisplay = true;
    });

});


// Equals button
document.querySelector('[data-action="equals"]')
    .addEventListener("click", () => {

        if (
            previousInput === "" ||
            currentInput === "" ||
            operator === null
        ) {
            return;
        }

        calculate();
    });


// Clear button
document.querySelector('[data-action="clear"]')
    .addEventListener("click", () => {

        currentInput = "";
        previousInput = "";
        operator = null;
        resetDisplay = false;

        updateDisplay("0");
    });


// Delete button
document.querySelector('[data-action="delete"]')
    .addEventListener("click", () => {

        if (currentInput !== "") {

            currentInput = currentInput.slice(0, -1);

            updateDisplay(currentInput);
        }
    });


// Calculation function
function calculate() {

    const firstNumber = parseFloat(previousInput);
    const secondNumber = parseFloat(currentInput);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {
                display.textContent = "Cannot divide by 0";

                currentInput = "";
                previousInput = "";
                operator = null;

                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    // Avoid long decimal results
    result = Number(result.toFixed(10));

    currentInput = result.toString();

    previousInput = "";
    operator = null;
    resetDisplay = true;

    updateDisplay(currentInput);
}


// Keyboard support
document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        const button = document.querySelector(
            `[data-number="${key}"]`
        );

        if (button) {
            button.click();
        }
    }

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        const button = document.querySelector(
            `[data-operator="${key}"]`
        );

        if (button) {
            button.click();
        }
    }

    if (key === "Enter" || key === "=") {
        document.querySelector(
            '[data-action="equals"]'
        ).click();
    }

    if (key === "Escape") {
        document.querySelector(
            '[data-action="clear"]'
        ).click();
    }

    if (key === "Backspace") {
        document.querySelector(
            '[data-action="delete"]'
        ).click();
    }

});