document.addEventListener("DOMContentLoaded", () => {
    const lengthForm = document.getElementById("length-form");
    const gameRows = document.querySelector(".game-rows");
    const keys = document.querySelectorAll(".key");

    let currentRow = 0;
    let currentCol = 0;
    let rows = [];
    let targetWord = "";
    let validWords = [];

    function loadValidWords(length) {
        return fetch(`/words/words_length_${length}.txt`)
            .then(response => response.text())
            .then(text => {
                validWords = text.split('\n').map(word => word.trim().toUpperCase());
                //console.log(validWords);
            })
            .catch(error => console.error('Erro ao carregar palavras:', error));
    }

    // Keyboard logic
    function setupKeyboard() {
        keys.forEach(key => {
            key.onclick = () => {
                const letter = key.textContent;

                // Delete letter
                if (key.classList.contains("key-delete")) {
                    if (currentCol > 0) {
                        currentCol--;
                        rows[currentRow][currentCol].textContent = "";
                    }
                }
                // Add word
                else if (key.classList.contains("key-enter")) {
                    // Check if its the last letter in the row
                    if (currentCol === rows[currentRow].length) {
                        const guess = rows[currentRow].map(block => block.textContent).join("");
                        if (guess == targetWord) {
                            alert("Parabéns, acertaste a palavra!");
                        }
                        if (!validWords.includes(guess)) {
                            alert("Palavra inválida, tenta outra.");
                            return;
                        }
                        else {
                            // Logic to check the letters and their positions/existence
                            for (let i = 0; i < guess.length; i++) {
                                const letter = guess[i];
                                const block = rows[currentRow][i];

                                if (letter === targetWord[i]) {
                                    block.classList.add("letter-correct");
                                }
                                else if (targetWord.includes(letter)) {
                                    block.classList.add("letter-wrong-position");
                                }
                                else {
                                    block.classList.add("letter-wrong");
                                }
                            }

                            keys.forEach(key => {
                                if (guess.includes(key.textContent) && !targetWord.includes(key.textContent)) {
                                    key.classList.add("used-incorrect-letter");
                                }
                            })
                            // Wrong word
                            if (currentRow < rows.length - 1) {
                                // If it is jump to the next line
                                currentRow++;
                                currentCol = 0;
                            } else {
                                // Ran out of rows, game over
                                alert("Fim do Jogo! a palavra era " + targetWord);
                            }
                        }

                    }
                }
                else {
                    // Add leter
                    if (currentCol < rows[currentRow].length) {
                        rows[currentRow][currentCol].textContent = letter;

                        const block = rows[currentRow][currentCol];
                        block.textContent = letter;

                        // Adds class letter-inserted to give animation
                        block.classList.add("letter-inserted");

                        // Resets class after delay
                        setTimeout(() => {
                            block.classList.remove("letter-inserted");
                        }, 300);
                        currentCol++;
                    }
                }
            };
        });
    }

    lengthForm.addEventListener("change", () => {
        gameRows.innerHTML = '';
        rows = [];
        currentRow = 0;
        currentCol = 0;
        const length = parseInt(lengthForm.value);

        // Waits to load words before executing the logic
        loadValidWords(length).then(() => {

            // Add lines and blocks for the letters
            for (let row = 0; row < length; row++) {
                const rowDiv = document.createElement('div');
                rowDiv.classList.add("row");

                const blocks = [];
                for (let i = 0; i < length; i++) {
                    const block = document.createElement("div");
                    block.classList.add("letter-block");
                    block.textContent = "";
                    rowDiv.appendChild(block);
                    blocks.push(block);
                }

                rows.push(blocks);
                gameRows.appendChild(rowDiv);
            }

            // Fetches the target word
            fetch(`/get-word/${length}`)
                .then(response => response.json())
                .then(data => {
                    targetWord = data.word;
                    //console.log("Palavra selecionada:", targetWord);
                })
                .catch(error => console.error('Erro ao buscar palavra:', error));

            // Runs the keyboard logic
            setupKeyboard();
        });
    });
});
