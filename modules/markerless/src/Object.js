export default class Object
{
    static set = [];
    static i = 0;
    constructor(id, aframePosX, aframePosY, aframePosZ, src)
    {
        this.assets = document.createElement("div");
        document.getElementById("scene").appendChild(this.assets);
        
        for(let i = 0; i < src.length; i++)
        {
            const assetItem = document.createElement("a-asset-item");
            assetItem.setAttribute("id", id + "_" + i);
            assetItem.setAttribute("src", src[i]);
            this.assets.appendChild(assetItem);
        }

        this.element = document.createElement("a-entity");
        this.element.setAttribute("position", String(aframePosX) + ' ' + String(aframePosY) + ' ' + String(aframePosZ));
        document.getElementById("scene").appendChild(this.element);
        for(let i = 0; i < src.length; i++)
        {
            const child = document.createElement("a-entity");
            child.setAttribute("gltf-model", "#" + id + "_" + i);
            this.element.appendChild(child); 
        }

        this.arrayX = [0,0,0];
        this.arrayY = [0,0,0];
        this.arrayZ = [0,0,0];
        
        this.aframePos = null;
        this.currentVector = [0, 0, 0];
        this.startingVector = [0, 0, 0];
        this.box3 = new THREE.Box3();
        this.go = false

        Object.set[Object.i] = this;
        Object.i++;
    }

    static _q1 = new THREE.Quaternion();
    static rotateOnWorldAxis(object_, axis, angle)
    {
        // rotate object on axis in world space
        // axis is assumed to be normalized
        // method assumes no rotated parent
        this._q1.setFromAxisAngle( axis, angle );
        object_.quaternion.premultiply( this._q1 );
        return object_;
    }

    static conversion(handsfreePosX, handsfreePosY, handsfreePosZ)
    {
        let aframePosZ = 1/handsfreePosZ;
        let aframePosX = -( aframePosZ/2 + (-aframePosZ) * handsfreePosX );
        let aframePosY = (-aframePosZ/2 + -aframePosZ * -handsfreePosY);
        return [aframePosX, aframePosY, aframePosZ];
    }

    static average(vectorX, vectorY, vectorZ, pos) //modificar
    {
        vectorX[0] = vectorX[1];
        vectorX[1] = vectorX[2];
        vectorX[2] = pos[0];

        vectorY[0] = vectorY[1];
        vectorY[1] = vectorY[2];
        vectorY[2] = pos[1];

        vectorZ[0] = vectorZ[1];
        vectorZ[1] = vectorZ[2];
        vectorZ[2] = pos[2];

        let p = [(vectorX[0] + vectorX[1] + vectorX[2]) / 3,
        (vectorY[0] + vectorY[1] + vectorY[2]) / 3,
        (vectorZ[0] + vectorZ[1] + vectorZ[2]) / 3];
        
        return p;
    }

    delete()
    {
        let child = this.assets.lastElementChild;
        while(child)
        {
            this.assets.removeChild(child);
            child = this.assets.lastElementChild;
        }
        this.assets.remove();

        child = this.element.lastElementChild;
        while(child)
        {
            this.element.removeChild(child);
            child = this.element.lastElementChild;
        }
        this.element.remove();
    }

};