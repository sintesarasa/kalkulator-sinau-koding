// Ambil elemen-elemen yang diperlukan dari DOM
const screen = document.querySelector(".kalkulator-screen");
const buttons = document.querySelectorAll("button");
const allClearButton = document.querySelector(".all-clear");
const equalSignButton = document.querySelector(".equal-sign");

// Variabel untuk menyimpan state kalkulator
let currentNumber = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Fungsi update tampilan layar
function updateScreen() {
	screen.value = currentNumber;
	adjustFontSize();
}

// Event listener untuk semua tombol angka
document.querySelectorAll(".number").forEach((button) => {
	button.addEventListener("click", () => {
		const number = button.textContent;

		if (waitingForSecondOperand) {
			currentNumber = number;
			waitingForSecondOperand = false;
		} else {
			if (currentNumber === "0" && number !== "0") {
				currentNumber = number;
			} else {
				currentNumber += number;
			}
		}

		updateScreen();
	});
});

// Event listener untuk titik desimal
document.querySelector(".decimal").addEventListener("click", () => {
	if (!currentNumber.includes(".")) {
		currentNumber += ".";
		updateScreen();
	}
});

// Event listener untuk tombol AC (All Clear)
allClearButton.addEventListener("click", () => {
	currentNumber = "0";
	firstOperand = null;
	operator = null;
	waitingForSecondOperand = false;
	updateScreen();
});

// Event listener untuk operator
document.querySelectorAll(".operator").forEach((button) => {
	button.addEventListener("click", () => {
		const newOperator = button.textContent;

		// Konversi simbol operator ke bentuk yang bisa diproses
		const operatorMap = {
			"×": "*",
			"÷": "/",
			"+": "+",
			"-": "-",
		};

		const actualOperator = operatorMap[newOperator];

		if (firstOperand === null) {
			firstOperand = parseFloat(currentNumber);
		} else if (!waitingForSecondOperand) {
			const result = calculate(
				firstOperand,
				parseFloat(currentNumber),
				operator
			);
			currentNumber = String(result);
			updateScreen();
			firstOperand = result;
		}

		operator = actualOperator;
		waitingForSecondOperand = true;
	});
});

// Event listener untuk tombol sama dengan (=)
equalSignButton.addEventListener("click", () => {
	if (operator && firstOperand !== null) {
		console.log("First Operand:", firstOperand);
		console.log("Second Operand:", parseFloat(currentNumber));
		console.log("Operator:", operator);

		const result = calculate(
			firstOperand,
			parseFloat(currentNumber),
			operator
		);

		console.log("Result:", result);

		// Jika hasilnya adalah string (error), tampilkan pesan error
		if (typeof result === "string") {
			currentNumber = result;
		} else {
			currentNumber = String(result);
		}

		updateScreen();
		firstOperand = result;
		operator = null;
		waitingForSecondOperand = true;
	}
});

// Fungsi perhitungan dasar
function calculate(first, second, operator) {
	switch (operator) {
		case "+":
			return first + second;
		case "-":
			return first - second;
		case "*":
			return first * second;
		case "/":
			if (second === 0) {
				return "Error: Tidak bisa dibagi dengan 0"; // Pesan error
			}
			return first / second;
		default:
			return second;
	}
}

function adjustFontSize() {
	const maxFontSize = 3.5; // Ukuran font maksimum
	const minFontSize = 1.5; // Ukuran font minimum
	const screenWidth = screen.clientWidth; // Lebar layar kalkulator
	const textLength = screen.value.length; // Panjang teks saat ini

	// Menghitung ukuran font berdasarkan panjang teks dan lebar layar
	let newFontSize = maxFontSize;

	if (textLength > 10) {
		newFontSize = Math.max(
			minFontSize,
			maxFontSize - (textLength - 10) * 0.2
		);
	}

	// Menyesuaikan ukuran font berdasarkan lebar layar
	if (screenWidth < 300) {
		newFontSize = Math.max(minFontSize, newFontSize - 0.5);
	}

	screen.style.fontSize = `${newFontSize}em`; // Mengatur ukuran font
}
