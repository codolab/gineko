#!/bin/bash
set -ex

pushd build
zip -r ../gineko.zip .
popd