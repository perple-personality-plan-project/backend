#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo sudo pm2 delete 0
sudo sudo pm2 start dist
