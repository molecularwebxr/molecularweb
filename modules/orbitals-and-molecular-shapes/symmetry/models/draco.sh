#!/bin/sh
find . -maxdepth 1 -name '*.glb' -type f -exec gltf-pipeline -i {"$file"} -o ./gltf/{"${file}"}.gltf \; > results.out
cd gltf
find . -maxdepth 1 -name '*.gltf' -type f -exec gltf-pipeline -i {"$file"} -o ./draco/{"${file}"}.gltf -d \; > results.out
cd draco
for file in *.gltf; do
    mv -- "$file" "${file%%.*}.gltf"
done