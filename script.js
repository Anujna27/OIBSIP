const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentValue = "";
let previousValue = "";
let currentOperator = null;
let shouldResetDisplay = false;


// Display the current number

function updateDisplay() {
    // Show 0 only when the calculator is completely empty
    if (currentValue === "" && previousValue === "" && currentOperator === null) {
        currentDisplay.textContent = "0";
    } else {
        currentDisplay.textContent = currentValue;
    }

    if (previousValue && currentOperator) {
        previousDisplay.textContent = `${previousValue} ${getOperatorSymbol(currentOperator)}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// Convert operator symbols for display
function getOperatorSymbol(operator) {
    switch (operator) {
        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        default:
            return "";
    }
}


// Add numbers and decimal point
function appendNumber(number) {

    if (shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    // Prevent multiple decimal points
    if (number === "." && currentValue.includes(".")) {
        return;
    }

    // Start decimal numbers as 0.x
    if (number === "." && currentValue === "") {
        currentValue = "0";
    }

    currentValue += number;

    updateDisplay();
}


// Choose an operator
function chooseOperator(operator) {

    if (currentValue === "" && previousValue === "") {
        return;
    }

    // If an operator is already selected,
    // calculate the previous operation first.
    if (previousValue !== "" && currentValue !== "") {
        calculate();
    }

    previousValue = currentValue;
    currentValue = "";
    currentOperator = operator;

    updateDisplay();
}


// Perform the calculation
function calculate() {

    if (
        previousValue === "" ||
        currentValue === "" ||
        currentOperator === null
    ) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (currentOperator) {

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
                currentValue = "Error: Cannot divide by 0";
                previousValue = "";
                currentOperator = null;
                shouldResetDisplay = true;

                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    currentValue = String(
        Number(result.toFixed(10))
    );

    previousValue = "";
    currentOperator = null;
    shouldResetDisplay = true;

    updateDisplay();
}


// Clear everything
function clearCalculator() {

    currentValue = "";
    previousValue = "";
    currentOperator = null;
    shouldResetDisplay = false;

    updateDisplay();
}


// Delete the last character
function deleteLastCharacter() {

    if (shouldResetDisplay) {
        return;
    }

    currentValue = currentValue.slice(0, -1);

    updateDisplay();
}


// Handle number buttons
numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


// Handle operator buttons
operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperator(button.dataset.operator);

    });

});


// Handle action buttons
actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        switch (button.dataset.action) {

            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteLastCharacter();
                break;

            case "equals":
                calculate();
                break;

            default:
                break;
        }

    });

});


// Initial display
updateDisplay();