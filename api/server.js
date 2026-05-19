const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.join(__dirname, '..');
const WORDS_DIR = path.join(ROOT_DIR, 'words');
const VALID_LENGTHS = new Set(['5', '6', '7', '8']);

app.use(express.static(ROOT_DIR));
app.use('/words', express.static(WORDS_DIR));

function sendRandomWord(req, res) {
    const length = req.params.length;

    if (!VALID_LENGTHS.has(length)) {
        return res.status(400).json({ error: 'Comprimento de palavra inválido' });
    }

    const filePath = path.join(WORDS_DIR, `words_length_${length}.txt`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o ficheiro de palavras' });
        }

        const words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        if (words.length === 0) {
            return res.status(500).json({ error: 'Lista de palavras vazia' });
        }

        const randomWord = words[Math.floor(Math.random() * words.length)];
        res.json({ word: randomWord });
    });
}

app.get('/api/get-word/:length', sendRandomWord);
app.get('/get-word/:length', sendRandomWord);

module.exports = app;
