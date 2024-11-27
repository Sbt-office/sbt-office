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

    this.mouseDownHandle = this.mouseDownEvent.bind(this);
    this.mouseUpHandle = this.mouseUpEvent.bind(this);
  }

  setEvent(callback) {
    this.callback = callback;
    this.canvas.addEventListener("mousedown", this.mouseDownHandle);
    this.canvas.addEventListener("mouseup", this.mouseUpHandle);
  }

  clearEvent(onlyEvent = false) {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandle);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandle);
    this.callback = null;

    if (!onlyEvent) {
      this.scene = null;
      this.canvas = null;
      this.camera = null;
      this.raycaster = null;
      this.mouse = null;
      this.beforeMouse = null;
    }
  }

  mouseDownEvent(e) {
    this.beforeMouse.x = e.clientX;
    this.beforeMouse.y = e.clientY;
  }

  mouseUpEvent(e) {
    if (Math.abs(e.clientX - this.beforeMouse.x) < 2 && Math.abs(e.clientY - this.beforeMouse.y) < 2) {
      const cw = this.canvas.offsetWidth ?? this.canvas.width ?? this.canvas.innerWidth ?? window.innerWidth;
      const ch = this.canvas.offsetHeight ?? this.canvas.height ?? this.canvas.innerHeight ?? window.innerHeight;
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / cw) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / ch) * 2 + 1;
      if (this.callback) this.callback(this.getObject());
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
