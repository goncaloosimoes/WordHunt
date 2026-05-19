#!/bin/bash
set -e

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
	# install linux packages
	if ! command -v npm >/dev/null 2>&1; then
		sudo apt update
		sudo apt install -y npm
	fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
	# install macOS packages
	if ! command -v node >/dev/null 2>&1; then
		brew install node
	fi
fi

npm install
node server.js & sleep 2
python3 browser.py
