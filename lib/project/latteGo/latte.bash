#!/bin/bash
filename=$(cd "$(dirname "$0")"; pwd);
export GOPATH=$filename
export GOROOT=/Users/zhouguodong/Documents/Tools/go1.8
export PATH=$GOROOT/bin:$PATH


gofmt -w src
#cd test
#go test ./latte    -v
go install main