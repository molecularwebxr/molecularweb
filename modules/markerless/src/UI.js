import Object from './Object.js';
import './Main.js';

document.getElementById("choose2_config_option_" + localStorage.getItem("maxNumHands")).setAttribute("selected", "");
document.getElementById("choose1_config_option_" + localStorage.getItem("rotationSpeed")).setAttribute("selected", "");

document.getElementById("apply").addEventListener("click", () => {
    const numHands = document.getElementById("choose2_config").value;
    localStorage.setItem("maxNumHands", numHands);

    const rotSpeed = document.getElementById("choose1_config").value;
    localStorage.setItem("rotationSpeed", rotSpeed);

    window.location.reload();
});

const config = document.getElementsByClassName("config");
config[1].classList.add("hidden");

const modules = ["symmetryElements", "molecularOrbitals"];

modules.forEach(mod => {
    document.getElementById("select1_" + mod).onchange = (x) => {
        document.getElementById("select2_" + mod + "_" + x.currentTarget.value).classList.remove("hidden");
        const z = document.getElementsByClassName("choose2_" + mod);
        for(let i = 0; i < z.length; i++)
        {
            if(z[i].getAttribute("id") !== ("select2_" + mod + "_" + x.currentTarget.value))
            {
                z[i].classList.add("hidden");
            }
        }
    };  
});

document.getElementsByClassName("molecularShapes")[1].classList.add("hidden");
document.getElementsByClassName("atomicOrbitals")[1].classList.add("hidden");
document.getElementsByClassName("molecularOrbitals")[1].classList.add("hidden");
document.getElementsByClassName("symmetryElements")[1].classList.add("hidden");
document.getElementsByClassName("atomicStructures_of_biomolecules")[1].classList.add("hidden");
document.getElementsByClassName("macromolecularAssemblies")[1].classList.add("hidden");

function change(arg, c)
{
    if(arg === 0)
    {
        document.getElementsByClassName(c)[1].classList.add("hidden");
    } else if(arg === 1)
    {
        document.getElementsByClassName(c)[1].classList.remove("hidden");
    }
}

const buttons = document.getElementsByClassName("button");
for(let i = 0; i < buttons.length; i++)
{
    buttons[i].addEventListener("click", (e) => {
        for(let j = 0; j < buttons.length; j++)
        {
            buttons[j].setAttribute("disabled", "");
            buttons[j].classList.add('hidden');
        } 
        switch(e.currentTarget.getAttribute("c"))
        {
            case 'molecularShapes':
            case 'atomicOrbitals':
            case 'molecularOrbitals':
            case 'symmetryElements':
            case 'atomicStructures_of_biomolecules':
            case 'macromolecularAssemblies':
            case 'config':
                change(1, e.currentTarget.getAttribute("c"));
                break;
        }   
    });
}

const backs = document.getElementsByClassName("back");
for(let i = 0; i < backs.length; i++)
{
    backs[i].addEventListener("click", (e) => {
        change(0, e.currentTarget.getAttribute("c"));
        for(let j = 0; j < backs.length; j++)
        {
            buttons[j].classList.remove("hidden");
            buttons[j].removeAttribute("disabled");
        }
    });
}

let counter = 1;
document.getElementById("add_symmetryElements").onclick = () => {
    const v1 = document.getElementById("select1_symmetryElements").value;
    const v2 = document.getElementById("select2_symmetryElements_" + v1).value;
    const obj = new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Symmetry/" + v1 + "/" + v1 + ".gltf", "./src/assets/Symmetry/" + v1 + "/" + v2 + "_" + v1 + ".gltf"]);
    counter++;
};
document.getElementById("add_molecularOrbitals").onclick = () => {

    let v1 = document.getElementById("select1_molecularOrbitals").value;
    if(v1 === "Water")
        v1 = "H2O";
    const v2 = document.getElementById("select2_molecularOrbitals_" + v1).value;

    if(v2 !== "HOMO" && v2 !== "LUMO")
    {
        if(v2[v2.length-2] === ' ')
        {
            const obj = new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Molecular Orbitals/" + v1 + "/" + v1 + ".gltf", "./src/assets/Molecular Orbitals/" + v1 + "/" + v1 + "_O" + v2[v2.length-1] + "azul.gltf", "./src/Molecular Orbitals/" + v1 + "/" + v1 + "_O" + v2[v2.length-1] + "rojo.gltf"]);
            obj.element.children[1].setAttribute("model-style", {op: "0.5", co: 0x0C00FF}); //azul
            obj.element.children[2].setAttribute("model-style", {op: "0.5", co: 0xFF0000}); //rojo
        }
        else
        {
            const obj = new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Molecular Orbitals/" + v1 + "/" + v1 + ".gltf", "./src/assets/Molecular Orbitals/" + v1 + "/" + v1 + "_O" + v2[v2.length-2] + v2[v2.length-1] + "azul.gltf", "./src/Molecular Orbitals/" + v1 + "/" + v1 + "_O" + v2[v2.length-2] + v2[v2.length-1] + "rojo.gltf"]);
            obj.element.children[1].setAttribute("model-style", {op: "0.5", co: 0x0C00FF}); //azul
            obj.element.children[2].setAttribute("model-style", {op: "0.5", co: 0xFF0000}); //rojo
        }
    } else
    {
        const obj = new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Molecular Orbitals/" + v1 + "/" + v1 + ".gltf", "./src/assets/Molecular Orbitals/" + v1 + "/" + v1 + "_" + v2 + "azul.gltf", "./src/Molecular Orbitals/" + v1 + "/" + v1 + "_" + v2 + "rojo.gltf"]);
        obj.element.children[1].setAttribute("model-style", {op: "0.5", co: 0x0C00FF}); //azul
        obj.element.children[2].setAttribute("model-style", {op: "0.5", co: 0xFF0000}); //rojo
    }
    counter++;
};
document.getElementById("add_atomicOrbitals").onclick = () => {
    const v = document.getElementById("select2_atomicOrbitals").value;
    const obj = new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Atomic Orbitals/" + v + ".gltf"]);
    const atom = document.createElement("a-sphere");
    atom.setAttribute("color", "grey");
    atom.setAttribute("radius", "0.2");
    obj.element.appendChild(atom);
    counter++;
}
document.getElementById("add_molecularShapes").onclick = () => {
    const v = document.getElementById("select2_molecularShapes").value;
    new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Molecular Shapes/" + v + ".gltf"]);
    counter++;
}
document.getElementById("add_macromolecularAssemblies").onclick = () => {
    const v = document.getElementById("select2_macromolecularAssemblies").value;
    switch(v)
    {
        case 'Nuclear pore complex':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Macromolecular Assemblies/npc/npc.glb"]);
            break;
        case 'Ribosome loaded with mRNA and tRNAs':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Macromolecular Assemblies/ribosome/ribosome.glb"]);
            break;
        case 'Bacteriophage on bacterial wall':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Macromolecular Assemblies/virus/viruscoloreado.glb"]);
            break;
        case 'SARS-Cov-2 spike -- human ACE2 complex':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Macromolecular Assemblies/sarscov2/spike2.glb"]);
            break;
        case 'Bacterial pilus base':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Macromolecular Assemblies/bacterial-pilus/full.glb"]);
            break;
        case 'Nucleosome':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Macromolecular Assemblies/nucleosome/nucleosome.glb"]);
            break;
        case 'SARS-CoV-2 particle':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Macromolecular Assemblies/SARS-CoV-2 particle/modelDraco.glb"]);
            break;
        case 'GPCR with inhibitor':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Macromolecular Assemblies/GPCR with inhibitor/modelDraco.glb"]);
            break;
    }
    counter++;
}
document.getElementById("add_atomicStructures_of_biomolecules").onclick = () => {
    const v = document.getElementById("select2_atomicStructures_of_biomolecules").value;
    switch(v)
    {
        case 'A-DNA':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Atomic Structures of Biomolecules/a-dna.gltf"]);
            break;
        case 'B-DNA':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Atomic Structures of Biomolecules/b-dna.gltf"]);
            break;
        case 'Z-DNA':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Atomic Structures of Biomolecules/z-dna.gltf"]);
            break;
        case 'Protein-DNA complex':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Atomic Structures of Biomolecules/prot-dna.gltf"]);
            break;
        case 'Alpha-helix':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Atomic Structures of Biomolecules/modelo-relajado-desk-wt-with-Hs--helix-sticks.gltf"]);
            break;
        case 'Beta-sheets':
            new Object("Obj_" + counter, 0, 0, -5, ["./src/assets/Atomic Structures of Biomolecules/4r80-with-Hs--sheet-sticks.gltf"]);
            break;
    }
    counter++;
}

let state = null;
document.getElementById("container").addEventListener("click", (e) => {
    if(state === null)
    {
        state = "left";
    }
    if(state === "left")
    {
        document.getElementById("menu").animate([
            // fotogramas clave
            {transform: 'translateX(100%)'}
        ], {
            // opciones de sincronización
            duration: 500,
            fill: 'forwards'
        });
        state = "right"
    } else {
        document.getElementById("menu").animate([
            // fotogramas clave
            {transform: 'translateX(0%)'}
        ], {
            // opciones de sincronización
            duration: 500,
            fill: 'forwards'
        });
        state = "left"
    }
    e.currentTarget.classList.toggle("change");
});

AFRAME.registerComponent('model-style', {
    schema: {
        op: {type: "string",  default: ""},
        co: {type: "number", default: -1}
    },
    init: function () 
    {
        this.el.addEventListener('model-loaded', this.update.bind(this));
    },
    update: function () 
    {
        let mesh = this.el.getObject3D('mesh');
        let data = this.data;
        if (!mesh) { return; }
        mesh.traverse(function (node) {
            if (node.isMesh) 
            {
                if(data.co !== -1)
                {
                    let newMaterial = new THREE.MeshStandardMaterial({
                        color: data.co,
                    });
                    node.material = newMaterial;
                    node.material.needsUpdate = true;
                }
                if(data.op !== "")
                {
                    node.material.opacity = data.op;
                    node.material.transparent = data.op < 1.0;
                    node.material.needsUpdate = true;
                }
            }
        });
    }
});