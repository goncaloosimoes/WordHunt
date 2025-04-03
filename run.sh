#!/bin/bash
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
	# install linux packages
	sudo apt get npm
elif [[ "$OSTYPE" == "darwin"* ]]; then
        # install macOS packages
	brew install node
	brew install npm

npm install
node js/server.js & sleep 2
python3 browser.py
