const result = document.querySelector('.result');
const buttons = document.querySelectorAll('.buttons button');

let currentNumber = "";
let firstOperator = null;
let operator = null;
let restart = false;

function updateResult(originClear = false) {
    result.innerText = originClear
        ? "0"
        : currentNumber.replace(".", ",");
}

function clearCalculator() {
    currentNumber = "";
    firstOperator = null;
    operator = null;
    restart = false;

    updateResult(true);
}

function addDigit(digit) {
    if (digit === "," && currentNumber.includes(",")) {
        return;
    }

    if (restart) {
        currentNumber = digit;
        restart = false;
    } else {
        currentNumber += digit;
    }

    updateResult();
}

function setOperator(newOperator) {

    if (
        firstOperator !== null &&
        operator !== null &&
        currentNumber !== ""
    ) {
        calculate();
    }

    if (currentNumber !== "") {
        firstOperator = parseFloat(
            currentNumber.replace(",", ".")
        );

        currentNumber = "";
    }

    operator = newOperator;
}

function calculate() {

    if (
        firstOperator === null ||
        operator === null ||
        currentNumber === ""
    ) {
        return;
    }

    const secondOperand = parseFloat(
        currentNumber.replace(",", ".")
    );

    if (isNaN(secondOperand)) {
        return;
    }

    let resultValue;

    switch (operator) {

        case "+":
            resultValue = firstOperator + secondOperand;
            break;

        case "-":
            resultValue = firstOperator - secondOperand;
            break;

        case "x":
            resultValue = firstOperator * secondOperand;
            break;

        case "÷":

            if (secondOperand === 0) {
                currentNumber = "Erro";
                updateResult();
                return;
            }

            resultValue = firstOperator / secondOperand;
            break;

        default:
            return;
    }

    if (resultValue.toString().includes(".")) {

        const decimals =
            resultValue.toString().split(".")[1].length;

        if (decimals > 5) {
            currentNumber = parseFloat(
                resultValue.toFixed(5)
            ).toString();
        } else {
            currentNumber = resultValue.toString();
        }

    } else {
        currentNumber = resultValue.toString();
    }

    firstOperator = resultValue;
    operator = null;
    restart = true;

    updateResult();
}

function setPercentage() {

    if (currentNumber === "") return;

    let percentageValue =
        parseFloat(currentNumber.replace(",", ".")) / 100;

    if (["+", "-"].includes(operator)) {
        percentageValue =
            percentageValue * (firstOperator || 1);
    }

    currentNumber = percentageValue.toString();

    updateResult();
}

function toggleSignal() {

    if (currentNumber === "") return;

    currentNumber = (
        parseFloat(currentNumber.replace(",", ".")) * -1
    ).toString();

    updateResult();
}

buttons.forEach((button) => {

    button.addEventListener('click', () => {

        const buttonText = button.innerText;

        if (/^[0-9,]+$/.test(buttonText)) {

            addDigit(buttonText);

        } else if (
            ["+", "-", "x", "÷"].includes(buttonText)
        ) {

            setOperator(buttonText);

        } else if (buttonText === "=") {

            calculate();

        } else if (buttonText === "C") {

            clearCalculator();

        } else if (buttonText === "±") {

            toggleSignal();

        } else if (buttonText === "%") {

            setPercentage();
        }
    });
});

updateResult(true);