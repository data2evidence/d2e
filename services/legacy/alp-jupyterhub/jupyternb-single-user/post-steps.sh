#! /bin/bash

sleep 5

#The below statement to set permissions for /home/jovyan/user must always be the first! 
#This is used for restoring scenario from swift to PVC's
chmod -R 775 /home/jovyan/user/
echo "Set Owner & read, write, execute permissions for group users, /home/jovyan/user/ folder"

mkdir -p /home/jovyan/user/tmp/
echo "Created a /home/jovyan/user/tmp/ folder"

mkdir -p /home/jovyan/.local/lib/
echo "Created a .local/lib folder"

mkdir -p /home/jovyan/.local/share/jupyter/kernels/
echo "Created a .local/share/jupyter/kernels/ folder"

mkdir -p /home/jovyan/.ipython
echo "Created a .ipython folder"

rm -rf /home/jovyan/user/docs
cp -vr docs/ /home/jovyan/user/
echo "Copied pyqe docs"

chmod -R 777 /home/jovyan/.local
echo "Set permissions for all users, .local folder"

chmod -R 777 /home/jovyan/.ipython
echo "Set permissions for all users, .ipython folder"