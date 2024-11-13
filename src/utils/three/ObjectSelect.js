import * as THREE from "three";

class ObjectSelect {
    constructor(scene, canvas, camera, filter) {
        this.scene = scene;
        this.canvas = canvas;
        this.camera = camera;
        this.filter = filter;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(1, 1);
        this.beforeMouse = new THREE.Vector2(0, 0);
        this.callback;
    }

    setEvent(callback) {
        this.callback = callback;
        this.canvas.addEventListener("mousedown", (e) =>
            this.mouseDownEvent(e)
        );
        this.canvas.addEventListener("mouseup", (e) =>
            this.mouseUpEvent(e, callback)
        );
    }

    clearEvent() {
        this.canvas.removeEventListener("mousedown", (e) =>
            this.mouseDownEvent(e)
        );
        this.canvas.removeEventListener("mouseup", (e) =>
            this.mouseUpEvent(e, this.callback)
        );

        this.scene = null;
        this.canvas = null;
        this.camera = null;
        this.raycaster = null;
        this.mouse = null;
        this.beforeMouse = null;
        this.callback = null;
    }

    mouseDownEvent(e) {
        this.beforeMouse.x = e.clientX;
        this.beforeMouse.y = e.clientY;
    }

    mouseUpEvent(e, callback) {
        if (
            Math.abs(e.clientX - this.beforeMouse.x) < 2 &&
            Math.abs(e.clientY - this.beforeMouse.y) < 2
        ) {
            const cw =
                this.canvas.offsetWidth ??
                this.canvas.width ??
                this.canvas.innerWidth ??
                window.innerWidth;
            const ch =
                this.canvas.offsetHeight ??
                this.canvas.height ??
                this.canvas.innerHeight ??
                window.innerHeight;
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / cw) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / ch) * 2 + 1;
            if (callback) callback(this.getObject());
        }
    }

    getObject() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const array = [];
        this.scene.traverse((item) => {
            if (item.isMesh) {
                if (this.filter) {
                    if (item[this.filter]) array.push(item);
                } else array.push(item);
            }
        });
        const intersects = this.raycaster.intersectObjects(array);
        return intersects.length > 0 ? intersects[0].object : undefined;
    }
}

export default ObjectSelect;
