document.addEventListener("DOMContentLoaded", () => {
    const lengthForm = document.getElementById("length-form");
    const gameRows = document.querySelector(".game-rows");
    const keys = document.querySelectorAll(".key");
    const message = document.querySelector(".message");

    let currentRow = 0;
    let currentCol = 0;
    let rows = [];
    let targetWord = "";
    let validWords = new Set();
    let gameReady = false;
    let gameOver = false;

    const validLengths = new Set([5, 6, 7, 8]);

    async function loadValidWords(length) {
        const response = await fetch(`/words/words_length_${length}.txt`);
        if (!response.ok) {
            throw new Error("Erro ao carregar palavras");
        }

        const text = await response.text();
        validWords = new Set(
            text
                .split("\n")
                .map(word => word.trim().toUpperCase())
                .filter(Boolean)
        );
    }

    async function loadTargetWord(length) {
        const response = await fetch(`/api/get-word/${length}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar palavra");
        }

        const data = await response.json();
        targetWord = data.word.toUpperCase();
    }

    function setMessage(text, type = "") {
        message.textContent = text;
        message.className = `message ${type}`.trim();
    }

    function resetKeyboardState() {
        keys.forEach(key => {
            key.classList.remove("used-incorrect-letter");
        });
    }

    function createBoard(length) {
        gameRows.innerHTML = "";
        rows = [];

        for (let row = 0; row < length; row++) {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("row");

            const blocks = [];
            for (let i = 0; i < length; i++) {
                const block = document.createElement("div");
                block.classList.add("letter-block");
                rowDiv.appendChild(block);
                blocks.push(block);
            }

            rows.push(blocks);
            gameRows.appendChild(rowDiv);
        }
    }

    function evaluateGuess(guess) {
        const result = Array(guess.length).fill("wrong");
        const remainingLetters = {};

        for (let i = 0; i < targetWord.length; i++) {
            if (guess[i] === targetWord[i]) {
                result[i] = "correct";
            } else {
                remainingLetters[targetWord[i]] = (remainingLetters[targetWord[i]] || 0) + 1;
            }
        }

        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            if (result[i] !== "correct" && remainingLetters[letter] > 0) {
                result[i] = "wrong-position";
                remainingLetters[letter]--;
            }
        }

        return result;
    }

    function paintGuess(guess, result) {
        result.forEach((status, index) => {
            const block = rows[currentRow][index];
            block.classList.add(`letter-${status}`);
        });

        keys.forEach(key => {
            const letter = key.textContent;
            if (guess.includes(letter) && !targetWord.includes(letter)) {
                key.classList.add("used-incorrect-letter");
            }
        });
    }

    function deleteLetter() {
        if (currentCol > 0) {
            currentCol--;
            rows[currentRow][currentCol].textContent = "";
        }
    }

    function addLetter(letter) {
        if (!/^[A-Z]$/.test(letter) || currentCol >= rows[currentRow].length) {
            return;
        }

        const block = rows[currentRow][currentCol];
        block.textContent = letter;
        block.classList.add("letter-inserted");

        setTimeout(() => {
            block.classList.remove("letter-inserted");
        }, 300);

        currentCol++;
    }

    function submitGuess() {
        if (currentCol !== rows[currentRow].length) {
            setMessage("A palavra ainda não está completa.", "message-warning");
            return;
        }

        const guess = rows[currentRow].map(block => block.textContent).join("");

        if (!validWords.has(guess)) {
            setMessage("Palavra inválida, tenta outra.", "message-error");
            return;
        }

        const result = evaluateGuess(guess);
        paintGuess(guess, result);

        if (guess === targetWord) {
            gameOver = true;
            setMessage("Parabéns, acertaste a palavra!", "message-success");
            return;
        }

        if (currentRow < rows.length - 1) {
            currentRow++;
            currentCol = 0;
            setMessage("");
            return;
        }

        gameOver = true;
        setMessage(`Fim do jogo! A palavra era ${targetWord}.`, "message-error");
    }

    function handleInput(value) {
        if (!gameReady || gameOver || !rows[currentRow]) {
            return;
        }

        if (value === "Backspace" || value === "⌫") {
            deleteLetter();
        } else if (value === "Enter" || value === "⏎") {
            submitGuess();
        } else {
            addLetter(value.toUpperCase());
        }
    }

    function setupKeyboard() {
        keys.forEach(key => {
            key.addEventListener("click", () => handleInput(key.textContent));
        });
    }

    function setupPhysicalKeyboard() {
        document.addEventListener("keydown", event => {
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            handleInput(event.key);
        });
    }

    lengthForm.addEventListener("change", async () => {
        const length = Number(lengthForm.value);

        if (!validLengths.has(length)) {
            gameRows.innerHTML = "";
            rows = [];
            gameReady = false;
            setMessage("");
            return;
        }

        currentRow = 0;
        currentCol = 0;
        gameReady = false;
        gameOver = false;
        targetWord = "";
        validWords = new Set();
        resetKeyboardState();
        createBoard(length);
        setMessage("A carregar palavras...");

        try {
            await Promise.all([loadValidWords(length), loadTargetWord(length)]);
            gameReady = true;
            setMessage("");
        } catch (error) {
            console.error(error);
            gameRows.innerHTML = "";
            rows = [];
            setMessage("Não foi possível carregar o jogo.", "message-error");
        }
    });

    setupKeyboard();
    setupPhysicalKeyboard();
});
