"use strict";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Patch to at least let users know that
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  alert(
    "This site is not optimized for mobile devices. Please use a desktop computer for the best experience."
  );
}

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.outputEncoding = THREE.sRGBEncoding;

  // reset and start/stop buttons
  const startStopButton = document.querySelector("#startStop");
  const resetButton = document.querySelector("#reset");
  let isAnimating = true;

  startStopButton.addEventListener("click", () => {
    isAnimating = !isAnimating;
  });

  resetButton.addEventListener("click", () => {
    // Call the main method, which resets everything.
    main();
  });

  //Pause rotation
  var mouseDown = 0;
  canvas.onmousedown = function () {
    ++mouseDown;

    if (event.x > 300 && event.x < 700 && event.y > 100 && event.y < 420){
      alert(event.x);
      alert(event.y);
      //window.location = "https://lauracharria.notion.site/Welcome-to-Lala-s-Portfolio-69ada19a1a2c416586c63101d9477350";
    }
  };
  canvas.onmouseup = function () {
    --mouseDown;
  };

  const fov = 45;
  const aspect = 2;
  const near = 0.05;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 0);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(5, 5, 5);
  controls.update();

  const scene = new THREE.Scene();
  const loader2 = new THREE.TextureLoader();
loader2.load('./sunset.jpg' , function(texture)
            {
             scene.background = texture;
            });

  {
    const skyColor = 0xffffff;
    const groundColor = 0xffffff;
    const intensity = 0.8;
    const light1 = new THREE.PointLight(skyColor, intensity);
    light1.position.set(10, 10, 10);

    const light2 = new THREE.PointLight(groundColor, intensity);
    light2.position.set(10, -10, -10);

    scene.add(light1);
    scene.add(light2);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 1, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  {
    const gltfLoader = new GLTFLoader();

    // !!!HERE YOU CAN REPLACE THE MODEL WITH YOUR OWN!!!
    gltfLoader.load("lala_bucket.gltf", (gltf) => {
      const root = gltf.scene;
      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    });
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (mouseDown == 0 && isAnimating) {
      scene.rotateZ(-0.005);
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
