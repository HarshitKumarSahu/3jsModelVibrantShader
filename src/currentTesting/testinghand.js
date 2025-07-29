// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import CustomShaderMaterial from "three-custom-shader-material/vanilla";
// import { GLTFLoader, ThreeMFLoader } from "three/examples/jsm/Addons.js";
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import * as dat from 'dat.gui';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import fragment from "../../shaders/currentTesting/fragment.glsl";
// import vertex from "../../shaders/currentTesting/vertex.glsl";
// import gsap from "gsap";
// import modelSrc from "../../public/models/ManAminate.glb";
// import texture01 from "../../public/textures/new.webp";

// class Sketch {
//     constructor(options) {
//         this.scene = new THREE.Scene();
//         this.container = options.dom;
//         this.width = this.container.offsetWidth;
//         this.height = this.container.offsetHeight;

//         this.renderer = new THREE.WebGLRenderer({
//             alpha: true,
//             antialias: true,
//         });
//         this.renderer.setPixelRatio(window.devicePixelRatio);
//         this.renderer.setSize(this.width, this.height);
//         this.renderer.physicallyCorrectLights = true;
//         this.renderer.outputEncoding = THREE.sRGBEncoding;

//         this.container.appendChild(this.renderer.domElement);

//         this.camera = new THREE.PerspectiveCamera(
//             70,
//             this.width / this.height,
//             0.001,
//             1000
//         );
//         this.camera.position.set(0, 0, 3.5);
//         this.controls = new OrbitControls(this.camera, this.renderer.domElement);

//         this.time = 0;
//         this.isPlaying = true;
//         this.head = null;
//         this.bones = {};

//         this.target = new THREE.Object3D();
//         this.mouse = new THREE.Vector2(0, 0);
//         this.intersectionPoints = new THREE.Vector3();
//         this.plainNormal = new THREE.Vector3();
//         this.mousePlain = new THREE.Plane();
//         this.rayCaster = new THREE.Raycaster();

//         this.loader = new GLTFLoader();
//         this.dracoLoader = new DRACOLoader();
//         this.dracoLoader.setDecoderPath('./draco/');
//         this.loader.setDRACOLoader(this.dracoLoader);

//         // MediaPipe FaceMesh setup
//         this.videoElement = document.createElement('video');
//         // this.videoElement.style.display = 'none';
//         this.videoElement.style.transform = 'scaleX(-1)'; // Unmirror the video feed
//         document.body.appendChild(this.videoElement);
//         this.faceMesh = new FaceMesh({
//             locateFile: (file) => `/mediapipe/face_mesh/${file}`,
//         });
//         this.faceMesh.setOptions({
//             maxNumFaces: 1,
//             refineLandmarks: true,
//             minDetectionConfidence: 0.5,
//             minTrackingConfidence: 0.5,
//         });
//         this.faceMesh.onResults(this.onFaceMeshResults.bind(this));
//         this.cameraUtils = new Camera(this.videoElement, {
//             onFrame: async () => {
//                 await this.faceMesh.send({ image: this.videoElement });
//             },
//             width: 320,
//             height: 240,
//             facingMode: 'user', // Front-facing camera
//         });
//         this.headRotation = { yaw: 0, pitch: 0, roll: 0 };
//         this.smoothedHeadRotation = { yaw: 0, pitch: 0, roll: 0 };

//         this.addObjects();
//         this.addModel();
//         this.setupGUI();
//         this.resize();
//         this.render();
//         this.setupResize();
//         this.setupMouse();
//         // this.startWebcam();
//     }

//     async startWebcam() {
//         try {
//             await this.cameraUtils.start();
//         } catch (error) {
//             console.error('Error starting webcam:', error);
//         }
//     }

//     onFaceMeshResults(results) {
//         if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//             const landmarks = results.multiFaceLandmarks[0];
//             const noseTip = landmarks[1];
//             const chin = landmarks[152];
//             const leftEye = landmarks[33];
//             const rightEye = landmarks[263];
//             const leftMouth = landmarks[61];
//             const rightMouth = landmarks[291];

//             console.log('Landmarks:', { noseTip, chin, leftEye, rightEye });

//             const modelPoints = [
//                 [0.0, 0.0, 0.0], // Nose tip
//                 [0.0, -6.0, -2.0], // Chin
//                 [-4.0, 2.0, -2.0], // Left eye outer
//                 [4.0, 2.0, -2.0], // Right eye outer
//                 [-2.0, -2.0, -1.0], // Left mouth
//                 [2.0, -2.0, -1.0], // Right mouth
//             ];

//             const imagePoints = [
//                 [(noseTip.x - 0.5) * 2, -(noseTip.y - 0.5) * 2],
//                 [(chin.x - 0.5) * 2, -(chin.y - 0.5) * 2],
//                 [(leftEye.x - 0.5) * 2, -(leftEye.y - 0.5) * 2],
//                 [(rightEye.x - 0.5) * 2, -(rightEye.y - 0.5) * 2],
//                 [(leftMouth.x - 0.5) * 2, -(leftMouth.y - 0.5) * 2],
//                 [(rightMouth.x - 0.5) * 2, -(rightMouth.y - 0.5) * 2],
//             ];

//             const dx = rightEye.x - leftEye.x;
//             const dy = rightEye.y - leftEye.y;
//             const yaw = -Math.atan2(dx, 0.5); // Negate to correct for unmirrored feed
//             const pitch = Math.atan2(chin.y - noseTip.y, 0.5) * -0.5;
//             const roll = Math.atan2(dy, dx) * 0.5;

//             const alpha = 0.2;
//             this.smoothedHeadRotation.yaw = (1 - alpha) * this.smoothedHeadRotation.yaw + alpha * yaw;
//             this.smoothedHeadRotation.pitch = (1 - alpha) * this.smoothedHeadRotation.pitch + alpha * pitch;
//             this.smoothedHeadRotation.roll = (1 - alpha) * this.smoothedHeadRotation.roll + alpha * roll;

//             console.log('Smoothed Head Rotation:', this.smoothedHeadRotation);
//         } else {
//             this.smoothedHeadRotation = { yaw: 0, pitch: 0, roll: 0 };
//         }
//     }

//     setupGUI() {
//         this.gui = new dat.GUI();
//         this.gui.closed = false;

//         const bonesToControl = [
//             'shoulderL',
//             'upper_armL',
//             'forearmL',
//             'handL',
//             'palm01L',
//             'f_index01L',
//             'f_index02L',
//             'f_index03L',
//             'thumb01L',
//             'thumb02L',
//             'thumb03L',
//             'palm02L',
//             'f_middle01L',
//             'f_middle02L',
//             'f_middle03L',
//             'palm03L',
//             'f_ring01L',
//             'f_ring02L',
//             'f_ring03L',
//             'palm04L',
//             'f_pinky01L',
//             'f_pinky02L',
//             'f_pinky03L',
//         ];

//         // bonesToControl.forEach(boneName => {
//         //     if (this.bones[boneName]) {
//         //         const folder = this.gui.addFolder(boneName);
//         //         const controls = {
//         //             rotationX: 0,
//         //             rotationY: 0,
//         //             rotationZ: 0
//         //         };
//         //         folder.add(controls, 'rotationX', -Math.PI, Math.PI, 0.01).name('Rotation X').onChange(value => {
//         //             this.bones[boneName].rotation.x = value;
//         //         });
//         //         folder.add(controls, 'rotationY', -Math.PI, Math.PI, 0.01).name('Rotation Y').onChange(value => {
//         //             this.bones[boneName].rotation.y = value;
//         //         });
//         //         folder.add(controls, 'rotationZ', -Math.PI, Math.PI, 0.01).name('Rotation Z').onChange(value => {
//         //             this.bones[boneName].rotation.z = value;
//         //         });
//         //     }
//         // });


//             const folder = this.gui.addFolder("shoulderL");
//             folder.closed = false;
//             const controls = {
//                 rotationX: 0,
//                 rotationY: 0,
//                 rotationZ: 0
//             };
//             folder.add(controls, 'rotationX', -Math.PI, Math.PI, 0.00001).name('Rotation X').onChange(value => {
//                 this.bones["shoulderL"].rotation.x = value;
//             });
//             folder.add(controls, 'rotationY', -Math.PI, Math.PI, 0.00001).name('Rotation Y').onChange(value => {
//                 this.bones["shoulderL"].rotation.y = value;
//             });
//             folder.add(controls, 'rotationZ', -Math.PI, Math.PI, 0.00001).name('Rotation Z').onChange(value => {
//                 this.bones["shoulderL"].rotation.z = value;
//             });

//             const folder1 = this.gui.addFolder('upper_armL');
//             folder1.closed = false;
//             const controls1 = {
//                 rotationX: 0,
//                 rotationY: 0,
//                 rotationZ: 0
//             };
//             folder1.add(controls1, 'rotationX', -Math.PI, Math.PI, 0.00001).name('Rotation X').onChange(value => {
//                 this.bones['upper_armL'].rotation.x = value;
//             });
//             folder1.add(controls1, 'rotationY', -Math.PI, Math.PI, 0.00001).name('Rotation Y').onChange(value => {
//                 this.bones['upper_armL'].rotation.y = value;
//             });
//             folder1.add(controls1, 'rotationZ', -Math.PI, Math.PI, 0.00001).name('Rotation Z').onChange(value => {
//                 this.bones['upper_armL'].rotation.z = value;
//             });
            
//             const folder2 = this.gui.addFolder('forearmL');
//             folder2.closed = false;
//             const controls2 = {
//                 rotationX: 0,
//                 rotationY: 0,
//                 rotationZ: 0
//             };
//             folder2.add(controls2, 'rotationX', -Math.PI, Math.PI, 0.00001).name('Rotation X').onChange(value => {
//                 this.bones['forearmL'].rotation.x = value;
//             });
//             folder2.add(controls2, 'rotationY', -Math.PI, Math.PI, 0.00001).name('Rotation Y').onChange(value => {
//                 this.bones['forearmL'].rotation.y = value;
//             });
//             folder2.add(controls2, 'rotationZ', -Math.PI, Math.PI, 0.00001).name('Rotation Z').onChange(value => {
//                 this.bones['forearmL'].rotation.z = value;
//             });
            
//             const folder3 = this.gui.addFolder('handL');
//             folder3.closed = false;
//             const controls3 = {
//                 rotationX: 0,
//                 rotationY: 0,
//                 rotationZ: 0
//             };
//             folder3.add(controls3, 'rotationX', -Math.PI, Math.PI, 0.00001).name('Rotation X').onChange(value => {
//                 this.bones['handL'].rotation.x = value;
//             });
//             folder3.add(controls3, 'rotationY', -Math.PI, Math.PI, 0.00001).name('Rotation Y').onChange(value => {
//                 this.bones['handL'].rotation.y = value;
//             });
//             folder3.add(controls3, 'rotationZ', -Math.PI, Math.PI, 0.00001).name('Rotation Z').onChange(value => {
//                 this.bones['handL'].rotation.z = value;
//             });


//     }

//     setupMouse() {
//         window.addEventListener('mousemove', (event) => {
//             this.mouse.x = (event.clientX / this.width) * 2 - 1;
//             this.mouse.y = -(event.clientY / this.height) * 2 + 1;
//             this.plainNormal.copy(this.camera.position).normalize();
//             this.mousePlain.setFromNormalAndCoplanarPoint(this.plainNormal, this.scene.position);
//             this.rayCaster.setFromCamera(this.mouse, this.camera);
//             this.rayCaster.ray.intersectPlane(this.mousePlain, this.intersectionPoints);

//             this.target.position.set(this.intersectionPoints.x * 0.2, this.intersectionPoints.y * 0.2, 2);
//             this.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
//         });
//     }

//     addObjects() {
//         this.material = new THREE.ShaderMaterial({
//             extensions: {
//                 derivatives: "#extension GL_OES_standard_derivatives : enable",
//             },
//             side: THREE.DoubleSide,
//             uniforms: {
//                 time: { value: 0 },
//                 mouse: { value: new THREE.Vector2(0, 0) },
//                 resolution: { value: new THREE.Vector4() },
//                 uvRate1: { value: new THREE.Vector2(1, 1) },
//                 uTexture: { value: new THREE.TextureLoader().load(texture01) },
//             },
//             vertexShader: vertex,
//             fragmentShader: fragment,
//             skinning: true,
//         });

//         this.geometry = new THREE.PlaneGeometry(1, 1);
//         this.standardMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

//         this.plain = new THREE.Mesh(this.geometry, this.material);
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//         this.scene.add(ambientLight);
//         const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//         directionalLight.position.set(0, 1, 1);
//         this.scene.add(directionalLight);
//     }

//     addModel() {
//         this.loader.load(
//             modelSrc,
//             (gltf) => {
//                 this.model = gltf.scene;
//                 this.scene.add(this.model);
//                 // this.model.traverse(o => {
//                 //     if (o.isMesh && o.isSkinnedMesh) {
//                 //         o.material = this.material;
//                 //         o.material.needsUpdate = true;
//                 //         if (o.geometry && o.geometry.center) {
//                 //             o.geometry.center();
//                 //             // alert('center')
//                 //         }
//                 //     }
//                 //     if (o.isBone) {
//                 //         this.bones[o.name] = o;
//                 //         this.bones[o.position] = o.position;
//                 //         this.bones[o.rotation] = o.rotation;
//                 //     }
//                 //     // console.log(o.name, o.type,);
//                 //     // console.log(o.name, "x :" + o.position.x, "y :" + o.position.y, "z :" + o.position.z)
//                 //     console.log(o.name, "x :" + o.rotation.x, "y :" + o.rotation.y, "z :" + o.rotation.z)
//                 // });
//                 this.model.traverse(o => {
//                     if (o.isMesh && o.isSkinnedMesh) {
//                         o.material = this.material;
//                         o.material.needsUpdate = true;
//                         if (o.geometry && o.geometry.center) {
//                             o.geometry.center();
//                             // alert('center')
//                         }
//                     }
//                     if (o.isBone) {
//                         this.bones[o.name] = o;
//                         this.bones[o.position] = o.position;
//                         this.bones[o.rotation] = o.rotation;
                
//                         // Apply rotation to hands for standing position
//                         // if (o.name === 'upper_armL') {
//                         //     o.rotation.x = THREE.MathUtils.degToRad(53.89);
//                         //     o.rotation.y = THREE.MathUtils.degToRad(26.62); 
//                         //     o.rotation.z = THREE.MathUtils.degToRad(-128.72);

//                         //     o.position.set(-0.058, 0.469, -0.043)
//                         // }
//                         // if (o.name === 'forearmL') {
//                         //     o.rotation.x = THREE.MathUtils.degToRad(105.60);
//                         //     o.rotation.y = THREE.MathUtils.degToRad(36.73); 
//                         //     o.rotation.z = THREE.MathUtils.degToRad(-31.64);
//                         //     o.position.set(-0.018, 0.460, -0.005)
//                         // }
//                         // if (o.name === 'upper_armR') {
//                         //     o.rotation.x = 0;
//                         //     o.rotation.y = 0; // Mirror rotation
//                         //     o.rotation.z = 0;
//                         // }
//                         // if (o.name === 'forearmR') {
//                         //     o.rotation.x = 0;
//                         //     o.rotation.y = 0;
//                         //     o.rotation.z = 0;
//                         // }
//                     }
//                     // console.log(o.name, o.type,);
//                     // console.log(o.name, "x :" + o.position.x, "y :" + o.position.y, "z :" + o.position.z)
//                     console.log(o.name, "x :" + o.rotation.x, "y :" + o.rotation.y, "z :" + o.rotation.z)
//                 });
//                 this.head = this.bones['spine006'];
//                 if (!this.head) {
//                     console.warn('spine006 not found. Check bone hierarchy.');
//                 }
//                 this.model.scale.set(1,1,1);
//                 // this.model.position.set(0, -5.5, 0);
//                 this.setupGUI();
//             },
//             undefined,
//             (error) => {
//                 console.error('Error loading model:', error);
//             }
//         );
//     }

//     setupResize() {
//         window.addEventListener("resize", this.resize.bind(this));
//     }

//     resize() {
//         this.width = this.container.offsetWidth;
//         this.height = this.container.offsetHeight;
//         this.renderer.setSize(this.width, this.height);
//         this.camera.aspect = this.width / this.height;
//         this.camera.updateProjectionMatrix();
//     }

//     stop() {
//         this.isPlaying = false;
//     }

//     play() {
//         if (!this.isPlaying) {
//             this.render();
//             this.isPlaying = true;
//         }
//     }

//     render() {
//         if (!this.isPlaying) return;

//         // camera
//         // if (this.head) {
//         //     const targetQuaternion = new THREE.Quaternion();
//         //     targetQuaternion.setFromEuler(
//         //         new THREE.Euler(
//         //             this.smoothedHeadRotation.pitch,
//         //             this.smoothedHeadRotation.yaw,
//         //             this.smoothedHeadRotation.roll,
//         //             'YXZ'
//         //         )
//         //     );

//         //     // Optional: Apply offset for model rest pose (uncomment if needed)
//         //     // const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
//         //     // targetQuaternion.multiply(offset);

//         //     this.head.quaternion.slerp(targetQuaternion, 0.2);
//         // }

//         //mouse
//         // if (this.head) {
//         //     const targetWorldPos = new THREE.Vector3();
//         //     this.target.getWorldPosition(targetWorldPos);
            
//         //     const headWorldPos = new THREE.Vector3();
//         //     this.head.getWorldPosition(headWorldPos);
            
//         //     const direction = new THREE.Vector3().subVectors(targetWorldPos, headWorldPos).normalize();
            
//         //     const quaternion = new THREE.Quaternion().setFromUnitVectors(
//         //         new THREE.Vector3(0, 0, 1), // Forward vector in model space
//         //         direction
//         //     );
            
//         //     this.head.quaternion.slerp(quaternion, 0.075); // Smooth blend
//         // }

//         this.time += 0.01;
//         this.material.uniforms.time.value = this.time;
//         this.material.uniforms.cameraPosition = { value: this.camera.position };
//         this.renderer.render(this.scene, this.camera);
//         this.controls.update();
//         requestAnimationFrame(this.render.bind(this));
//     }
// }

// new Sketch({
//     dom: document.querySelector(".canvas"),
// });




// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import CustomShaderMaterial from "three-custom-shader-material/vanilla";
// import { GLTFLoader, ThreeMFLoader } from "three/examples/jsm/Addons.js";
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import * as dat from 'dat.gui';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';
// import fragment from "../../shaders/currentTesting/fragment.glsl";
// import vertex from "../../shaders/currentTesting/vertex.glsl";
// import gsap from "gsap";
// import modelSrc from "../../public/models/ManAminate.glb";
// import texture01 from "../../public/textures/new.webp";

// class Sketch {
//     constructor(options) {
//         this.scene = new THREE.Scene();
//         this.container = options.dom;
//         this.width = this.container.offsetWidth;
//         this.height = this.container.offsetHeight;

//         this.renderer = new THREE.WebGLRenderer({
//             alpha: true,
//             antialias: true,
//         });
//         this.renderer.setPixelRatio(window.devicePixelRatio);
//         this.renderer.setSize(this.width, this.height);
//         this.renderer.physicallyCorrectLights = true;
//         this.renderer.outputEncoding = THREE.sRGBEncoding;

//         this.container.appendChild(this.renderer.domElement);

//         this.camera = new THREE.PerspectiveCamera(
//             70,
//             this.width / this.height,
//             0.001,
//             1000
//         );
//         this.camera.position.set(0, 0, 3.5);
//         this.controls = new OrbitControls(this.camera, this.renderer.domElement);

//         this.time = 0;
//         this.isPlaying = true;
//         this.head = null;
//         this.bones = {};

//         this.target = new THREE.Object3D();
//         this.mouse = new THREE.Vector2(0, 0);
//         this.intersectionPoints = new THREE.Vector3();
//         this.plainNormal = new THREE.Vector3();
//         this.mousePlain = new THREE.Plane();
//         this.rayCaster = new THREE.Raycaster();

//         this.loader = new GLTFLoader();
//         this.dracoLoader = new DRACOLoader();
//         this.dracoLoader.setDecoderPath('./draco/');
//         this.loader.setDRACOLoader(this.dracoLoader);

//         // MediaPipe FaceMesh setup
//         this.videoElement = document.createElement('video');
//         this.videoElement.style.transform = 'scaleX(-1)';
//         document.body.appendChild(this.videoElement);
//         this.faceMesh = new FaceMesh({
//             locateFile: (file) => `/mediapipe/face_mesh/${file}`,
//         });
//         this.faceMesh.setOptions({
//             maxNumFaces: 1,
//             refineLandmarks: true,
//             minDetectionConfidence: 0.5,
//             minTrackingConfidence: 0.5,
//         });
//         this.faceMesh.onResults(this.onFaceMeshResults.bind(this));
//         this.cameraUtils = new Camera(this.videoElement, {
//             onFrame: async () => {
//                 await this.faceMesh.send({ image: this.videoElement });
//             },
//             width: 320,
//             height: 240,
//             facingMode: 'user',
//         });
//         this.headRotation = { yaw: 0, pitch: 0, roll: 0 };
//         this.smoothedHeadRotation = { yaw: 0, pitch: 0, roll: 0 };

//         this.addObjects();
//         this.addModel();
//         this.setupGUI();
//         this.resize();
//         this.render();
//         this.setupResize();
//         this.setupMouse();
//     }

//     async startWebcam() {
//         try {
//             await this.cameraUtils.start();
//         } catch (error) {
//             console.error('Error starting webcam:', error);
//         }
//     }

//     onFaceMeshResults(results) {
//         if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//             const landmarks = results.multiFaceLandmarks[0];
//             const noseTip = landmarks[1];
//             const chin = landmarks[152];
//             const leftEye = landmarks[33];
//             const rightEye = landmarks[263];
//             const leftMouth = landmarks[61];
//             const rightMouth = landmarks[291];

//             const dx = rightEye.x - leftEye.x;
//             const dy = rightEye.y - leftEye.y;
//             const yaw = -Math.atan2(dx, 0.5);
//             const pitch = Math.atan2(chin.y - noseTip.y, 0.5) * -0.5;
//             const roll = Math.atan2(dy, dx) * 0.5;

//             const alpha = 0.2;
//             this.smoothedHeadRotation.yaw = (1 - alpha) * this.smoothedHeadRotation.yaw + alpha * yaw;
//             this.smoothedHeadRotation.pitch = (1 - alpha) * this.smoothedHeadRotation.pitch + alpha * pitch;
//             this.smoothedHeadRotation.roll = (1 - alpha) * this.smoothedHeadRotation.roll + alpha * roll;
//         } else {
//             this.smoothedHeadRotation = { yaw: 0, pitch: 0, roll: 0 };
//         }
//     }

//     setupGUI() {
//         this.gui = new dat.GUI();
//         this.gui.closed = false;

//         const bonesToControl = [
//             'shoulderL', 'upper_armL', 'forearmL', 'handL',
//             'palm01L', 'f_index01L', 'f_index02L', 'f_index03L',
//             'thumb01L', 'thumb02L', 'thumb03L', 'palm02L',
//             'f_middle01L', 'f_middle02L', 'f_middle03L', 'palm03L',
//             'f_ring01L', 'f_ring02L', 'f_ring03L', 'palm04L',
//             'f_pinky01L', 'f_pinky02L', 'f_pinky03L'
//         ];

//         bonesToControl.forEach(boneName => {
//             if (this.bones[boneName]) {
//                 const folder = this.gui.addFolder(boneName);
//                 const currentRot = this.bones[boneName].rotation;
//                 const controls = {
//                     rotationX: THREE.MathUtils.radToDeg(currentRot.x),
//                     rotationY: THREE.MathUtils.radToDeg(currentRot.y),
//                     rotationZ: THREE.MathUtils.radToDeg(currentRot.z)
//                 };
//                 folder.add(controls, 'rotationX', -90, 90, 0.01).name('Rotation X').onChange(value => {
//                     this.bones[boneName].rotation.x = THREE.MathUtils.degToRad(value);
//                 });
//                 folder.add(controls, 'rotationY', -90, 90, 0.01).name('Rotation Y').onChange(value => {
//                     this.bones[boneName].rotation.y = THREE.MathUtils.degToRad(value);
//                 });
//                 folder.add(controls, 'rotationZ', -90, 90, 0.01).name('Rotation Z').onChange(value => {
//                     this.bones[boneName].rotation.z = THREE.MathUtils.degToRad(value);
//                 });
//             }
//         });
//     }

//     setupMouse() {
//         window.addEventListener('mousemove', (event) => {
//             this.mouse.x = (event.clientX / this.width) * 2 - 1;
//             this.mouse.y = -(event.clientY / this.height) * 2 + 1;
//             this.plainNormal.copy(this.camera.position).normalize();
//             this.mousePlain.setFromNormalAndCoplanarPoint(this.plainNormal, this.scene.position);
//             this.rayCaster.setFromCamera(this.mouse, this.camera);
//             this.rayCaster.ray.intersectPlane(this.mousePlain, this.intersectionPoints);

//             this.target.position.set(this.intersectionPoints.x * 0.2, this.intersectionPoints.y * 0.2, 2);
//             this.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
//         });
//     }

//     addObjects() {
//         this.material = new THREE.ShaderMaterial({
//             extensions: {
//                 derivatives: "#extension GL_OES_standard_derivatives : enable",
//             },
//             side: THREE.DoubleSide,
//             uniforms: {
//                 time: { value: 0 },
//                 mouse: { value: new THREE.Vector2(0, 0) },
//                 resolution: { value: new THREE.Vector4() },
//                 uvRate1: { value: new THREE.Vector2(1, 1) },
//                 uTexture: { value: new THREE.TextureLoader().load(texture01) },
//             },
//             vertexShader: vertex,
//             fragmentShader: fragment,
//             skinning: true,
//         });

//         this.geometry = new THREE.PlaneGeometry(1, 1);
//         this.standardMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

//         this.plain = new THREE.Mesh(this.geometry, this.material);
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//         this.scene.add(ambientLight);
//         const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//         directionalLight.position.set(0, 1, 1);
//         this.scene.add(directionalLight);
//     }

//     addModel() {
//         this.loader.load(
//             modelSrc,
//             (gltf) => {
//                 this.model = gltf.scene;
//                 this.scene.add(this.model);
//                 this.model.traverse(o => {
//                     if (o.isMesh && o.isSkinnedMesh) {
//                         o.material = this.material;
//                         o.material.needsUpdate = true;
//                         if (o.geometry && o.geometry.center) {
//                             o.geometry.center();
//                         }
//                     }
//                     if (o.isBone) {
//                         this.bones[o.name] = o;
//                         this.bones[o.position] = o.position;
//                         this.bones[o.rotation] = o.rotation;
//                     }
//                     console.log(o.name, "x :" + o.rotation.x, "y :" + o.rotation.y, "z :" + o.rotation.z);
//                 });
//                 this.head = this.bones['spine006'];
//                 if (!this.head) {
//                     console.warn('spine006 not found. Check bone hierarchy.');
//                 }
//                 this.model.scale.set(1, 1, 1);
//                 this.setupGUI();
//             },
//             undefined,
//             (error) => {
//                 console.error('Error loading model:', error);
//             }
//         );
//     }

//     setupResize() {
//         window.addEventListener("resize", this.resize.bind(this));
//     }

//     resize() {
//         this.width = this.container.offsetWidth;
//         this.height = this.container.offsetHeight;
//         this.renderer.setSize(this.width, this.height);
//         this.camera.aspect = this.width / this.height;
//         this.camera.updateProjectionMatrix();
//     }

//     stop() {
//         this.isPlaying = false;
//     }

//     play() {
//         if (!this.isPlaying) {
//             this.render();
//             this.isPlaying = true;
//         }
//     }

//     render() {
//         if (!this.isPlaying) return;

//         this.time += 0.01;
//         this.material.uniforms.time.value = this.time;
//         this.material.uniforms.cameraPosition = { value: this.camera.position };
//         this.renderer.render(this.scene, this.camera);
//         this.controls.update();
//         requestAnimationFrame(this.render.bind(this));
//     }
// }

// new Sketch({
//     dom: document.querySelector(".canvas"),
// });





import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { GLTFLoader, ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as dat from 'dat.gui';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import fragment from "../../shaders/currentTesting/fragment.glsl";
import vertex from "../../shaders/currentTesting/vertex.glsl";
import gsap from "gsap";
import modelSrc from "../../public/models/ManAminate.glb";
import texture01 from "../../public/textures/new.webp";

class Sketch {
    constructor(options) {
        this.scene = new THREE.Scene();
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            0.001,
            1000
        );
        this.camera.position.set(0, 0, 3.5);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.time = 0;
        this.isPlaying = true;
        this.head = null;
        this.bones = {};

        this.target = new THREE.Object3D();
        this.mouse = new THREE.Vector2(0, 0);
        this.intersectionPoints = new THREE.Vector3();
        this.plainNormal = new THREE.Vector3();
        this.mousePlain = new THREE.Plane();
        this.rayCaster = new THREE.Raycaster();

        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('./draco/');
        this.loader.setDRACOLoader(this.dracoLoader);

        // MediaPipe FaceMesh setup
        this.videoElement = document.createElement('video');
        this.videoElement.style.transform = 'scaleX(-1)';
        document.body.appendChild(this.videoElement);
        this.faceMesh = new FaceMesh({
            locateFile: (file) => `/mediapipe/face_mesh/${file}`,
        });
        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        this.faceMesh.onResults(this.onFaceMeshResults.bind(this));
        this.cameraUtils = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.faceMesh.send({ image: this.videoElement });
            },
            width: 320,
            height: 240,
            facingMode: 'user',
        });
        this.headRotation = { yaw: 0, pitch: 0, roll: 0 };
        this.smoothedHeadRotation = { yaw: 0, pitch: 0, roll: 0 };

        this.addObjects();
        this.addModel();
        this.setupGUI();
        this.resize();
        this.render();
        this.setupResize();
        this.setupMouse();
    }

    async startWebcam() {
        try {
            await this.cameraUtils.start();
        } catch (error) {
            console.error('Error starting webcam:', error);
        }
    }

    onFaceMeshResults(results) {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            const noseTip = landmarks[1];
            const chin = landmarks[152];
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];
            const leftMouth = landmarks[61];
            const rightMouth = landmarks[291];

            const dx = rightEye.x - leftEye.x;
            const dy = rightEye.y - leftEye.y;
            const yaw = -Math.atan2(dx, 0.5);
            const pitch = Math.atan2(chin.y - noseTip.y, 0.5) * -0.5;
            const roll = Math.atan2(dy, dx) * 0.5;

            const alpha = 0.2;
            this.smoothedHeadRotation.yaw = (1 - alpha) * this.smoothedHeadRotation.yaw + alpha * yaw;
            this.smoothedHeadRotation.pitch = (1 - alpha) * this.smoothedHeadRotation.pitch + alpha * pitch;
            this.smoothedHeadRotation.roll = (1 - alpha) * this.smoothedHeadRotation.roll + alpha * roll;
        } else {
            this.smoothedHeadRotation = { yaw: 0, pitch: 0, roll: 0 };
        }
    }

    setupGUI() {
        this.gui = new dat.GUI();
        this.gui.closed = false;

        const boneRanges = {
            'shoulderL': { x: [-50, 180], y: [-90, 90], z: [-90, 90] }, // Extension to Flexion, Internal to External
            'upper_armL': { x: [-50, 180], y: [-90, 90], z: [-90, 90] }, // Same as shoulder for simplicity
            'forearmL': { x: [-10, 150], y: [-90, 90], z: [-90, 90] }, // Extension to Flexion, Pronation/Supination
            'handL': { x: [-70, 80], y: [-30, 20], z: [-20, 30] }, // Extension to Flexion, Ulnar to Radial
            'shoulderR': { x: [-50, 180], y: [-90, 90], z: [-90, 90] },
            'upper_armR': { x: [-50, 180], y: [-90, 90], z: [-90, 90] },
            'forearmR': { x: [-10, 150], y: [-90, 90], z: [-90, 90] },
            'handR': { x: [-70, 80], y: [-30, 20], z: [-20, 30] }
        };

        const bonesToControl = ['shoulderL', 'upper_armL', 'forearmL', 'handL', 'shoulderR', 'upper_armR', 'forearmR', 'handR'];

        bonesToControl.forEach(boneName => {
            if (this.bones[boneName]) {
                const folder = this.gui.addFolder(boneName);
                const currentRot = this.bones[boneName].rotation;
                const controls = {
                    rotationX: THREE.MathUtils.radToDeg(currentRot.x),
                    rotationY: THREE.MathUtils.radToDeg(currentRot.y),
                    rotationZ: THREE.MathUtils.radToDeg(currentRot.z)
                };
                folder.add(controls, 'rotationX', boneRanges[boneName].x[0], boneRanges[boneName].x[1], 0.01).name('Rotation X').onChange(value => {
                    this.bones[boneName].rotation.x = THREE.MathUtils.degToRad(value);
                });
                folder.add(controls, 'rotationY', boneRanges[boneName].y[0], boneRanges[boneName].y[1], 0.01).name('Rotation Y').onChange(value => {
                    this.bones[boneName].rotation.y = THREE.MathUtils.degToRad(value);
                });
                folder.add(controls, 'rotationZ', boneRanges[boneName].z[0], boneRanges[boneName].z[1], 0.01).name('Rotation Z').onChange(value => {
                    this.bones[boneName].rotation.z = THREE.MathUtils.degToRad(value);
                });
            }
        });
    }

    setupMouse() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;
            this.plainNormal.copy(this.camera.position).normalize();
            this.mousePlain.setFromNormalAndCoplanarPoint(this.plainNormal, this.scene.position);
            this.rayCaster.setFromCamera(this.mouse, this.camera);
            this.rayCaster.ray.intersectPlane(this.mousePlain, this.intersectionPoints);

            this.target.position.set(this.intersectionPoints.x * 0.2, this.intersectionPoints.y * 0.2, 2);
            this.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
        });
    }

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0, 0) },
                resolution: { value: new THREE.Vector4() },
                uvRate1: { value: new THREE.Vector2(1, 1) },
                uTexture: { value: new THREE.TextureLoader().load(texture01) },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            skinning: true,
        });

        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.standardMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

        this.plain = new THREE.Mesh(this.geometry, this.material);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
    }

    addModel() {
        this.loader.load(
            modelSrc,
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                this.model.traverse(o => {
                    if (o.isMesh && o.isSkinnedMesh) {
                        o.material = this.material;
                        o.material.needsUpdate = true;
                        if (o.geometry && o.geometry.center) {
                            o.geometry.center();
                        }
                    }
                    if (o.isBone) {
                        this.bones[o.name] = o;
                        this.bones[o.position] = o.position;
                        this.bones[o.rotation] = o.rotation;
                    }
                    console.log(o.name, "x :" + o.rotation.x, "y :" + o.rotation.y, "z :" + o.rotation.z);
                });
                this.head = this.bones['spine006'];
                if (!this.head) {
                    console.warn('spine006 not found. Check bone hierarchy.');
                }
                this.model.scale.set(1, 1, 1);
                this.setupGUI();
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if (!this.isPlaying) {
            this.render();
            this.isPlaying = true;
        }
    }

    render() {
        if (!this.isPlaying) return;

        this.time += 0.01;
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.cameraPosition = { value: this.camera.position };
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch({
    dom: document.querySelector(".canvas"),
});