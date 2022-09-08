#!/bin/sh
find . -maxdepth 1 -name '*.obj' -type f -exec obj2gltf -i {"$file"} -o ./tmp/{"${file}"}.gltf \; > results.out
cd tmp
for file in *.gltf; do
    mv -- "$file" "${file%%.*}.gltf"
done