#!/bin/bash
apt-get install -y wget git curl
apt install -y ffmpeg
mkdir /temp
cd /temp
wget --no-check-certificate https://nodejs.org/dist/v8.2.1/node-v8.2.1-linux-x64.tar.xz
cd /usr
tar --strip-components 1 -xJf /temp/node-v8.2.1-linux-x64.tar.xz
node -v
npm -v
ffmpeg
cp -r /vagrant /vagrant_data/
cd /vagrant_data/vagrant
npm install discord.js discord.js-commando node-opus ytdl-core ytdl-getinfo youtube-playlist-info common-tags --save
node .