# 🏆 WordHunt 📚  

WordHunt é um jogo de palavras online que desafia os jogadores a encontrar palavras escondidas numa grelha de letras aleatória. A dificuldade do jogo é decidida pelo jogador (assume-se que quanto maior for a palavra mais difícil será o jogo).

Para executar localmente o WordHunt copia e cola o seguinte excerto para o teu terminal Linux/macOS:
```bash
   git clone https://github.com/goncaloosimoes/WordHunt.git
   cd WordHunt
   chmod +x run.sh
   ./run.sh
   ```

## 🎮 Como Jogar?  
1. Clica numa letra para selecioná-la.  
2. Forma palavras conectando letras adjacentes. 
3. Se a palavra tiver o número necessário de letras e for submetida temos 2 casos:
    
    - A palavra não é aceite:
        - Neste caso a palavra não foi aceite porque não existe ou não está presente nos ficheiros. É necessário apagar a palavra e tentar de novo com uma palavra diferente.
    
    - A palavra é aceite e cada letra será avaliada:
        - A letra pertence à palavra:
            - Tem fundo verde 🟢 se estiver na posição certa.
            - Tem fundo amarelo 🟡 se estiver na posição errada.
        - A letra *não* pertence à palavra:
            - Fica com fundo vermelho 🔴 e será identificada a cinzento no teclado, **porém** não será proibida de ser usada de novo.

## 🔥 Características  
✅ **Grelha de letras aleatória** a cada nova rodada.  
✅ **Palavras escondidas** para desafiar o teu vocabulário.  
✅ **Sistema de pontuação** baseado no tamanho das palavras encontradas.  
✅ **Vários níveis de dificuldade**, para jogadores casuais e experientes.  

## 🚀 Contribui!  
Se queres ajudar a melhorar o WordHunt, contribui com código, ideias ou sugestões: 
🔗 [GitHub - WordHunt](https://github.com/goncaloosimoes/WordHunt)  
