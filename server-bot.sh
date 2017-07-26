#!/bin/bash
yum makecache fast
yum install -y wget
yum install -y git
yum install -y curl epel-release gcc-c++
rpm --import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro
rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm
yum install -y ffmpeg
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