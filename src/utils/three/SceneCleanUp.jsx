const scene_cleanup = async (scene, renderer, gltf_obj) => {
  let texture_maps = [
    "map",
    "aoMap",
    "alphaMap",
    "bumpMap",
    "displacementMap",
    "envMap",
    "lightMap",
    "emissiveMap",
    "normalMap",
    "metalnessMap",
    "roughnessMap",
    "anisotropyMap",
    "clearcoatMap",
    "clearcoatNormalMap",
    "clearcoatRoughnessMap",
    "iridescenceMap",
    "iridescenceThicknessMap",
    "sheenColorMap",
    "sheenRoughnessMap",
    "specularMap",
    "specularColorMap",
    "specularIntensityMap",
    "thicknessMap",
    "transmissionMap",
  ];

  scene.remove(gltf_obj);

  renderer.clear();

  if (gltf_obj.skeleton && gltf_obj.skeleton.boneTexture) gltf_obj.skeleton.boneTexture.dispose();

  gltf_obj.traverse(function (child) {
    if (child.isMesh || child.isPoints || child.isLine) {
      if (child.skeleton && child.skeleton.boneTexture) child.skeleton.boneTexture.dispose();

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mtl) => {
            if (mtl.uniforms) {
              Object.keys(mtl.uniforms).forEach((key) => {
                if (mtl.uniforms[key].value) {
                  let kv = mtl.uniforms[key].value;

                  if (Array.isArray(kv) && kv.length > 0) {
                    kv.forEach((val) => {
                      if (val.type && val.type === 1009) val.dispose();
                    });
                  } else {
                    if (kv.type && kv.type === 1009) kv.dispose();
                  }
                }
              });
            } else {
              for (const prop in mtl) {
                texture_maps.forEach((tex_map) => {
                  if (prop === tex_map) {
                    if (mtl[prop]) mtl[prop].dispose();
                  }
                });
              }
            }

            mtl.dispose();
          });
        } else {
          if (child.material.uniforms) {
            Object.keys(child.material.uniforms).forEach((key) => {
              if (child.material.uniforms[key].value) {
                let kv = child.material.uniforms[key].value;

                if (Array.isArray(kv) && kv.length > 0) {
                  kv.forEach((val) => {
                    if (val.type && val.type === 1009) val.dispose();
                  });
                } else {
                  if (kv.type && kv.type === 1009) kv.dispose();
                }
              }
            });
          } else {
            for (const prop in child.material) {
              texture_maps.forEach((tex_map) => {
                if (prop === tex_map) {
                  if (child.material[prop]) child.material[prop].dispose();
                }
              });
            }
          }

          child.material.dispose();
        }
      }

      child.geometry.dispose();
    }
  });
};

export const clearScene = (scene, controls, renderer, animate) => {
  cancelAnimationFrame(animate);
  animate = null;

  controls.dispose();
  controls = null;

  for (let i = 0; i < scene.children.length; i++) {
    scene_cleanup(scene, renderer, scene.children[i]);
  }

  renderer.dispose();
  renderer.forceContextLoss();
  renderer = null;

  scene.environment.dispose();
  scene.environment = null;

  scene.clear();
  scene = null;
};
