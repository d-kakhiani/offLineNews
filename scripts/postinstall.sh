npm install -g polymer-cli
cd frontend
npm install
mv ./config/config.prod.js ./config/config.js
polymer build
mv ./build/* ../ -f
cd ..
