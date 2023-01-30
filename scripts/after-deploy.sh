#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo npm install

sudo pm2 delete 0
sudo pm2 start dist
