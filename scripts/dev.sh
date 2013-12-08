#!/bin/bash
echo "------------------------------------"
echo "| Run frontend app for development |"
echo "------------------------------------"

#pushd ../../odc-hrok-api/scripts
#./server.sh &
#popd
./server.sh debug &
./watch_source.sh debug