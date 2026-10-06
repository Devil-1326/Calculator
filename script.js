// ==========================================
// CALC // Calculator Engine
// ==========================================

// Display elements
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

// Buttons
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");


// ==========================================
// CALCULATOR STATE
// ==========================================

let currentInput = "0";
let previousInput = null;
let currentOperator = null;

let waitingForNewNumber = false;
let expression = "";


// ==========================================
// UPDATE DISPLAY
// ==========================================

function updateDisplay() {

    resultDisplay.textContent = currentInput;

    expressionDisplay.textContent =
        expression || "0";
}


// ==========================================
// NUMBER INPUT
// ==========================================

function inputNumber(number) {

    // If an operation was just completed,
    // start entering a completely new number.
    if (waitingForNewNumber) {

        currentInput = number;

        waitingForNewNumber = false;

    } else {

        // Prevent multiple leading zeros
        if (currentInput === "0" && number !== ".") {
            currentInput = number;
        }

        // Prevent multiple decimal points
        else if (number === "." && currentInput.includes(".")) {
            return;
        }

        else {
            currentInput += number;
        }
    }

    updateDisplay();
}


// ==========================================
// OPERATOR INPUT
// ==========================================

function inputOperator(operator) {

    const inputValue = parseFloat(currentInput);

    // Invalid number
    if (Number.isNaN(inputValue)) {
        return;
    }

    // If an operator already exists and the user
    // enters another number, calculate first.
    if (
        currentOperator &&
        previousInput !== null &&
        !waitingForNewNumber
    ) {

        const result = calculate(
            previousInput,
            inputValue,
            currentOperator
        );

        if (result === null) {
            return;
        }

        currentInput = String(result);
        previousInput = result;
    }

    else {
        previousInput = inputValue;
    }

    currentOperator = operator;

    waitingForNewNumber = true;

    expression =
        `${formatNumber(previousInput)} ${displayOperator(operator)}`;

    updateDisplay();
}


// ==========================================
// CALCULATION ENGINE
// ==========================================

function calculate(first, second, operator) {

    let result;

    switch (operator) {

        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":

            if (second === 0) {
                showError("DIVISION BY ZERO");
                return null;
            }

            result = first / second;
            break;

        case "%":
            result = first % second;
            break;

        default:
            return second;
    }

    return roundResult(result);
}


// ==========================================
// EQUALS
// ==========================================

function calculateResult() {

    if (
        currentOperator === null ||
        previousInput === null
    ) {
        return;
    }

    const secondInput = parseFloat(currentInput);

    if (Number.isNaN(secondInput)) {
        return;
    }

    const firstInput = previousInput;

    const result = calculate(
        firstInput,
        secondInput,
        currentOperator
    );

    if (result === null) {
        return;
    }

    expression =
        `${formatNumber(firstInput)} ` +
        `${displayOperator(currentOperator)} ` +
        `${formatNumber(secondInput)} =`;

    currentInput = String(result);

    previousInput = null;
    currentOperator = null;

    waitingForNewNumber = true;

    updateDisplay();
}


// ==========================================
// CLEAR
// ==========================================

function clearCalculator() {

    currentInput = "0";
    previousInput = null;
    currentOperator = null;

    waitingForNewNumber = false;

    expression = "";

    updateDisplay();
}


// ==========================================
// BACKSPACE
// ==========================================

function backspace() {

    if (waitingForNewNumber) {
        return;
    }

    if (
        currentInput.length <= 1 ||
        currentInput === "Error"
    ) {

        currentInput = "0";

    } else {

        currentInput =
            currentInput.slice(0, -1);
    }

    updateDisplay();
}


// ==========================================
// ERROR HANDLING
// ==========================================

function showError(message) {

    currentInput = message;

    expression = "SYSTEM ERROR";

    previousInput = null;
    currentOperator = null;

    waitingForNewNumber = true;

    updateDisplay();

    // Automatically reset after 1.5 seconds
    setTimeout(() => {

        clearCalculator();

    }, 1500);
}


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function displayOperator(operator) {

    const operators = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return operators[operator] || operator;
}


function formatNumber(number) {

    return Number(number).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 10
        }
    );
}


function roundResult(number) {

    // Prevent floating-point weirdness such as
    // 0.1 + 0.2 = 0.30000000000000004

    return Number(
        Number(number).toPrecision(12)
    );
}


// ==========================================
// BUTTON EVENTS
// ==========================================

// Number buttons
numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const number =
            button.dataset.number;

        inputNumber(number);

    });

});


// Operator buttons
operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const operator =
            button.dataset.operator;

        inputOperator(operator);

    });

});


// Function buttons
actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action =
            button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "backspace") {
            backspace();
        }

        if (action === "calculate") {
            calculateResult();
        }

    });

});


// ==========================================
// KEYBOARD SUPPORT
// ==========================================

document.addEventListener("keydown", event => {

    const key = event.key;

    // Numbers and decimal
    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        inputNumber(key);

        return;
    }


    // Operators
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {

        inputOperator(key);

        return;
    }


    // Enter / =
    if (
        key === "Enter" ||
        key === "="
    ) {

        calculateResult();

        return;
    }


    // Backspace
    if (key === "Backspace") {

        backspace();

        return;
    }


    // Escape / Delete
    if (
        key === "Escape" ||
        key === "Delete"
    ) {

        clearCalculator();

        return;
    }

});


// ==========================================
// INITIAL DISPLAY
// ==========================================

updateDisplay();