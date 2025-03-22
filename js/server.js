const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, '..')));

app.use('/words', express.static(path.join(__dirname, '..', 'words')));

// Choos a random word
app.get('/get-word/:length', (req, res) => {
    const length = req.params.length;
    const filePath = path.join(__dirname, '..', 'words', `words_length_${length}.txt`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o ficheiro' });
        }
        const words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        const randomWord = words[Math.floor(Math.random() * words.length)];
        res.json({ word: randomWord });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));
