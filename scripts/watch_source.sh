#!/bin/bash
echo "-----------------------------------------------------------"
echo "| Watch JS and SASS file changes and rebuild related code |"
echo "-----------------------------------------------------------"

WATCH_TYPE=$1

if [ "$1" == "--help" ]
then
	echo "Usage: $0 [watch_type]"
	echo watch_type: \"prod\" \(default value\), or \"debug\"
else
	if [ -z "$WATCH_TYPE" ]
	then
		WATCH_TYPE=prod
	fi 

	# Config
	grunt watch:js_$WATCH_TYPE &
	grunt watch:compass_$WATCH_TYPE &
fi