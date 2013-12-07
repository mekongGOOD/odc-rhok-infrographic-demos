#!/bin/bash
echo "------------------"
echo "| Run server app |"
echo "------------------"

RUN_MODE=$1

if [ "$1" == "--help" ]
then
	echo "Usage: $0 [run_mode]"
	echo run_mode: \"prod\" \(default value\), or \"debug\"
else
	if [ -z "$RUN_MODE" ]
	then
		RUN_MODE=prod
	fi 

	echo "$RUN_MODE mode"

	if [ "$RUN_MODE" == "prod" ]
	then
		grunt build run &
	fi

	if [ "$RUN_MODE" == "debug" ]
	then
		grunt build:debug run -v &
	fi
fi