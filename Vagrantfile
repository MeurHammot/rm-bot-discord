# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.define "server" do |server|
    server.vm.box = "wholebits/ubuntu16.10-64"
    server.vm.network "public_network", ip: "192.168.33.10"
    server.vm.synced_folder "../data", "/vagrant_data"
    server.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
    end
    server.vm.provision "shell", path: "ubuntu-bot.sh"
  end
end
