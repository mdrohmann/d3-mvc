#!/bin/sh

python -m SimpleHTTPServer 8009 1> server.log 2> server.err &

echo "Opening a server on http://localhost:8009"
echo "Terminate with command:"
echo "  kill $!"
echo
