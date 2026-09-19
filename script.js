const display = document.getElementById("display");
const history = document.getElementById("history");

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForNewValue = false;

function updateDisplay() {
    display.textContent = currentValue;
}

function appendNumber(number) {
    if (currentValue === "Error") {
        clearDisplay();
    }

    if (waitingForNewValue) {
        currentValue = number;
        waitingForNewValue = false;
    } else {
        if (currentValue === "0") {
            currentValue = number;
        } else {
            currentValue += number;
        }
    }

    updateDisplay();
}

function appendDecimal() {
    if (currentValue === "Error") {
        clearDisplay();
    }

    if (waitingForNewValue) {
        currentValue = "0.";
        waitingForNewValue = false;
        updateDisplay();
        return;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (currentValue === "Error") {
        return;
    }

    const inputValue = parseFloat(currentValue);

    if (previousValue !== null && operator && !waitingForNewValue) {
        const result = performCalculation(previousValue, inputValue, operator);

        if (!Number.isFinite(result)) {
            currentValue = "Error";
            previousValue = null;
            operator = null;
            updateDisplay();
            return;
        }

        currentValue = String(result);
    }

    previousValue = parseFloat(currentValue);
    operator = selectedOperator;
    waitingForNewValue = true;

    history.textContent = `${formatNumber(previousValue)} ${getOperatorSymbol(selectedOperator)}`;
    updateDisplay();
}

function calculate() {
    if (operator === null || previousValue === null) {
        return;
    }

    const currentNumber = parseFloat(currentValue);
    const result = performCalculation(previousValue, currentNumber, operator);

    history.textContent =
        `${formatNumber(previousValue)} ${getOperatorSymbol(operator)} ${formatNumber(currentNumber)} =`;

    if (!Number.isFinite(result)) {
        currentValue = "Error";
    } else {
        currentValue = String(result);
    }

    previousValue = null;
    operator = null;
    waitingForNewValue = true;

    updateDisplay();
}

function performCalculation(first, second, selectedOperator) {
    switch (selectedOperator) {
        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":
            if (second === 0) {
                return NaN;
            }
            return first / second;

        default:
            return second;
    }
}

function clearDisplay() {
    currentValue = "0";
    previousValue = null;
    operator = null;
    waitingForNewValue = false;
    history.textContent = "";
    updateDisplay();
}

function deleteLast() {
    if (currentValue === "Error") {
        clearDisplay();
        return;
    }

    if (waitingForNewValue) {
        return;
    }

    if (currentValue.length === 1) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}

function percentage() {
    if (currentValue === "Error") {
        return;
    }

    const value = parseFloat(currentValue);

    if (previousValue !== null && operator !== null) {
        currentValue = String(previousValue * value / 100);
    } else {
        currentValue = String(value / 100);
    }

    updateDisplay();
}

function toggleSign() {
    if (currentValue === "0" || currentValue === "Error") {
        return;
    }

    currentValue = currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;

    updateDisplay();
}

function getOperatorSymbol(selectedOperator) {
    if (selectedOperator === "*") {
        return "×";
    }

    if (selectedOperator === "/") {
        return "÷";
    }

    if (selectedOperator === "-") {
        return "−";
    }

    return "+";
}

function formatNumber(number) {
    return Number(number).toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}

document.addEventListener("keydown", function(event) {

    const key = event.key;

    if (key >= "0" && key <= "9") {
        appendNumber(key);
    }

    else if (key === ".") {
        appendDecimal();
    }

    else if (key === "+") {
        chooseOperator("+");
    }

    else if (key === "-") {
        chooseOperator("-");
    }

    else if (key === "*") {
        chooseOperator("*");
    }

    else if (key === "/") {
        event.preventDefault();
        chooseOperator("/");
    }

    else if (key === "%") {
        percentage();
    }

    else if (key === "Enter" || key === "=") {
        calculate();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "Escape" || key.toLowerCase() === "c") {
        clearDisplay();
    }
});

updateDisplay();