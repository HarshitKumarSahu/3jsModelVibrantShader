// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import CustomShaderMaterial from "three-custom-shader-material/vanilla";

// import { GLTFLoader, ThreeMFLoader } from "three/examples/jsm/Addons.js";
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// import fragment from "../../shaders/currentTesting/fragment.glsl";
// import vertex from "../../shaders/currentTesting/vertex.glsl";

// import gsap from "gsap";

// import * as dat from 'dat.gui';

// import modelSrc from "../../public/models/ManAminate.glb" 
// // import modelSrc from "../../public/models/Man7.glb"
// import texture01 from "../../public/textures/new.webp"
// // import texture01 from "../../public/textures/ok.jpeg"
// // import texture01 from "../../public/textures/texture01.jpg"

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
//         this.renderer.setClearColor("#111", 1);
//         this.renderer.physicallyCorrectLights = true;
//         this.renderer.outputEncoding = THREE.sRGBEncoding;

//         this.container.appendChild(this.renderer.domElement);

//         this.camera = new THREE.PerspectiveCamera(
//         70,
//         this.width / this.height,
//         0.001,
//         1000
//         );
//         this.camera.position.set(0, 0, 3.5);
//         this.controls = new OrbitControls(this.camera, this.renderer.domElement);

//         this.time = 0;
//         this.isPlaying = true;
//         this.head = null;
//         this.bones = {};

//         this.target = new THREE.Object3D()
        
//         this.mouse = new THREE.Vector2(0, 0); // Initialize mouse position
//         this.intersectionPoints = new THREE.Vector3()
//         this.plainNormal = new THREE.Vector3()
//         this.mousePlain = new THREE.Plane()
//         this.rayCaster = new THREE.Raycaster();

//         this.loader = new GLTFLoader();
//         this.dracoLoader = new DRACOLoader();
//         this.dracoLoader.setDecoderPath('./draco/');
//         this.loader.setDRACOLoader(this.dracoLoader);

//         this.addObjects();
//         this.addModel();
//         this.setupGUI(); // Initialize dat.GUI
//         this.resize();
//         this.render();
//         this.setupResize();
//         this.setupMouse();
//     }

//     setupMouse() {
//         window.addEventListener('mousemove', (event) => {
//             this.mouse.x = (event.clientX / this.width) * 2 - 1;
//             this.mouse.y = -(event.clientY / this.height) * 2 + 1;
//             this.plainNormal.copy(this.camera.position).normalize()
//             this.mousePlain.setFromNormalAndCoplanarPoint(this.plainNormal, this.scene.position)
//             this.rayCaster.setFromCamera(this.mouse, this.camera)
//             this.rayCaster.ray.intersectPlane(this.mousePlain, this.intersectionPoints)

//             this.target.position.set(this.intersectionPoints.x * 0.2, this.intersectionPoints.y * 0.2, 2)

//             this.material1.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
//         });
//     }

//     addObjects() {
//         this.material1 = new THREE.ShaderMaterial({
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
//             skinning: true, // Ensure skinning is enabled
//         });

//         this.geometry = new THREE.PlaneGeometry(1, 1);
//         this.standardMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        
//         this.plain = new THREE.Mesh(this.geometry, this.material);
//         // this.scene.add(this.plain);

//         // const ambientLight = new THREE.AmbientLight(0x404040);
//         // this.scene.add(ambientLight);
//         // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//         // directionalLight.position.set(0, 1, 1);
//         // this.scene.add(directionalLight);
//     }

//     setupGUI() {
//         this.gui = new dat.GUI();
//         this.gui.closed = false; // Ensure GUI is open by default

//         // Define rotation controls for each bone
//         const bonesToControl = [
//             'upper_armL', 'forearmL', 'handL',
//             'upper_armR', 'forearmR', 'handR',
//             'thighL', 'shinL',
//             'thighR', 'shinR'
//         ];

//         // Create a folder for each limb
//         bonesToControl.forEach(boneName => {
//             if (this.bones[boneName]) {
//                 const folder = this.gui.addFolder(boneName);
//                 const controls = {
//                     rotationX: 0,
//                     rotationY: 0,
//                     rotationZ: 0
//                 };
//                 folder.add(controls, 'rotationX', -Math.PI, Math.PI, 0.01).name('Rotation X').onChange(value => {
//                     this.bones[boneName].rotation.x = value;
//                 });
//                 folder.add(controls, 'rotationY', -Math.PI, Math.PI, 0.01).name('Rotation Y').onChange(value => {
//                     this.bones[boneName].rotation.y = value;
//                 });
//                 folder.add(controls, 'rotationZ', -Math.PI, Math.PI, 0.01).name('Rotation Z').onChange(value => {
//                     this.bones[boneName].rotation.z = value;
//                 });
//             }
//         });
//     }

//     addModel() {
//         this.loader.load(
//             modelSrc, 
//             (gltf) => {
//                 this.model = gltf.scene;
//                 this.scene.add(this.model);
//                 this.model.traverse(o => {
//                     if (o.isMesh && o.isSkinnedMesh) {
//                         o.material = this.material1; // Apply custom shader material
//                         o.material.needsUpdate = true; // Ensure material updates
//                         if (o.isBone) {
//                             this.bones[o.name] = o;
//                         }
//                     }
//                     console.log(o.name, o.type);
//                 });
//                 this.head = this.model.getObjectByName('spine006') ||
//                             // this.model.getObjectByName('spine006') ||
//                             // this.model.children.find(obj => obj.name.toLowerCase().includes('spine006'));
//                 this.head.rotation.set(0, 0, 0);
//                 this.head.scale.set(1, 1, 1);
//                 this.head.updateMatrixWorld();
//                 // console.log(this.head); 
//                 // const boneIndex = this.model.getObjectByName('Man').skeleton.bones.indexOf(this.head);
//                 // console.log("Bone index:", boneIndex);
//                 // console.log("Bone weight influence:", this.model.getObjectByName('Man').geometry.attributes.skinWeight);


//                 // if (!this.head) {
//                 //     console.warn('Head not found in model. Check model hierarchy for correct name.');
//                 // }
//                 // if(this.head) {
//                 //     alert("okay head found")
//                 // }
                
//                 this.model.scale.set(2,2,2)
//                 this.model.position.set(0, -1, 0)
//                 // this.model.scale.set(5,5,5)
//                 // this.model.position.set(0, -5.5, 0)
//                 // this.model.position.set(0, -15.5, 0)

//                 this.setupGUI();




//                 // const rArm = this.model.getObjectByName('shoulderR');
//                 // const rForeArm = this.model.getObjectByName('forearmR');
//                 // rArm.rotation.x = 0;
//                 // rArm.rotation.y = 0;
//                 // rArm.rotation.z = 0;
//                 // rForeArm.rotation.x = 0.3;

//                 // const rHandThumb1 = this.model.getObjectByName('thumb01R');
//                 // const rHandThumb2 = this.model.getObjectByName('thumb02R');
//                 // const rHandThumb3 = this.model.getObjectByName('thumb03R');
//                 // rHandThumb1.rotation.x = -0.2;
//                 // rHandThumb2.rotation.x = 0.3;
//                 // rHandThumb3.rotation.x = 0.3;

//                 // const rHandIndex1 = model.getObjectByName('RightHandIndex1_36');
//                 // const rHandIndex2 = model.getObjectByName('RightHandIndex2_35');
//                 // const rHandIndex3 = model.getObjectByName('RightHandIndex3_34');
//                 // rHandIndex1.rotation.x = 0.2;
//                 // rHandIndex2.rotation.x = 0.3;
//                 // rHandIndex3.rotation.x = 0.3;

//                 // const rHandMiddle1 = model.getObjectByName('RightHandMiddle1_40');
//                 // const rHandMiddle2 = model.getObjectByName('RightHandMiddle2_39');
//                 // const rHandMiddle3 = model.getObjectByName('RightHandMiddle3_38');
//                 // rHandMiddle1.rotation.x = 0.2;
//                 // rHandMiddle2.rotation.x = 0.3;
//                 // rHandMiddle3.rotation.x = 0.3;

//                 // const rHandRing1 = model.getObjectByName('RightHandRing1_44');
//                 // const rHandRing2 = model.getObjectByName('RightHandRing2_43');
//                 // const rHandRing3 = model.getObjectByName('RightHandRing3_42');
//                 // rHandRing1.rotation.x = 0.2;
//                 // rHandRing2.rotation.x = 0.3;
//                 // rHandRing3.rotation.x = 0.3;

//                 // const rHandPinky1 = model.getObjectByName('RightHandPinky1_48');
//                 // const rHandPinky2 = model.getObjectByName('RightHandPinky2_47');
//                 // const rHandPinky3 = model.getObjectByName('RightHandPinky3_46');
//                 // rHandPinky1.rotation.x = 0.2;
//                 // rHandPinky2.rotation.x = 0.3;
//                 // rHandPinky3.rotation.x = 0.3;

//                 // const lArm = model.getObjectByName('LeftArm_27');
//                 // const lForeArm = model.getObjectByName('LeftForeArm_26');
//                 // lArm.rotation.x = 1.3;
//                 // lForeArm.rotation.x = 0.3;

//                 // const lHandThumb1 = model.getObjectByName('LeftHandThumb1_8');
//                 // const lHandThumb2 = model.getObjectByName('LeftHandThumb2_7');
//                 // const lHandThumb3 = model.getObjectByName('LeftHandThumb3_6');
//                 // lHandThumb1.rotation.x = -0.2;
//                 // lHandThumb1.rotation.z = 0.5;
//                 // lHandThumb2.rotation.x = 0.3;
//                 // lHandThumb3.rotation.x = 0.3;

//                 // const lHandIndex1 = model.getObjectByName('LeftHandIndex1_12');
//                 // const lHandIndex2 = model.getObjectByName('LeftHandIndex2_11');
//                 // const lHandIndex3 = model.getObjectByName('LeftHandIndex3_10');
//                 // lHandIndex1.rotation.x = 0.2;
//                 // lHandIndex2.rotation.x = 0.3;
//                 // lHandIndex3.rotation.x = 0.3;

//                 // const lHandMiddle1 = model.getObjectByName('LeftHandMiddle1_16');
//                 // const lHandMiddle2 = model.getObjectByName('LeftHandMiddle2_15');
//                 // const lHandMiddle3 = model.getObjectByName('LeftHandMiddle3_14');
//                 // lHandMiddle1.rotation.x = 0.2;
//                 // lHandMiddle2.rotation.x = 0.3;
//                 // lHandMiddle3.rotation.x = 0.3;

//                 // const lHandRing1 = model.getObjectByName('LeftHandRing1_20');
//                 // const lHandRing2 = model.getObjectByName('LeftHandRing2_19');
//                 // const lHandRing3 = model.getObjectByName('LeftHandRing3_18');
//                 // lHandRing1.rotation.x = 0.2;
//                 // lHandRing2.rotation.x = 0.3;
//                 // lHandRing3.rotation.x = 0.3;

//                 // const lHandPinky1 = model.getObjectByName('LeftHandPinky1_24');
//                 // const lHandPinky2 = model.getObjectByName('LeftHandPinky2_23');
//                 // const lHandPinky3 = model.getObjectByName('LeftHandPinky3_22');
//                 // lHandPinky1.rotation.x = 0.2;
//                 // lHandPinky2.rotation.x = 0.3;
//                 // lHandPinky3.rotation.x = 0.3;











//             }, 
//             undefined, 
//             (error) => {
//                 console.error('Error loading model:', error);
//             });
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

//         if (this.head) {
//             const targetWorldPos = new THREE.Vector3();
//             this.target.getWorldPosition(targetWorldPos);
            
//             const headWorldPos = new THREE.Vector3();
//             this.head.getWorldPosition(headWorldPos);
            
//             const direction = new THREE.Vector3().subVectors(targetWorldPos, headWorldPos).normalize();
            
//             const quaternion = new THREE.Quaternion().setFromUnitVectors(
//                 new THREE.Vector3(0, 0, 1), // Forward vector in model space
//                 direction
//             );
            
//             this.head.quaternion.slerp(quaternion, 0.075); // Smooth blend
//         }

//         this.time += 0.01;
//         this.material1.uniforms.time.value = this.time;
//         this.material1.uniforms.cameraPosition = { value: this.camera.position };
//         this.renderer.render(this.scene, this.camera);
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

// import * as dat from 'dat.gui'; // Import dat.GUI
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';

// import fragment from "../../shaders/currentTesting/fragment.glsl";
// import vertex from "../../shaders/currentTesting/vertex.glsl";
// // import fragment from "../../shaders/fragment1.glsl";
// // import vertex from "../../shaders/vertex1.glsl";

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
//         // this.renderer.setClearColor("#111", 1);
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

//         this.time = 0;
//         this.isPlaying = true;
//         this.head = null;
//         this.bones = {}; // Store references to limb bones

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
//         this.controls = new OrbitControls(this.camera, this.renderer.domElement);

//         this.videoElement = document.querySelector("video");
//         // this.videoElement.style.display = 'none';
//         document.body.appendChild(this.videoElement);

//         this.faceMesh = new FaceMesh({
//             locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`, // Adjust path based on your public directory
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
//             width: 640,
//             height: 480,
//         });

//         this.headRotation = { yaw: 0, pitch: 0, roll: 0 };

//         // this.mediaPipe()
//         this.addObjects();
//         this.addModel();
//         // this.setupGUI(); // Initialize dat.GUI
//         this.resize();
//         this.render();
//         this.setupResize();
//         this.setupMouse();
//         this.startWebcam();
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
//             // Key landmarks for pose estimation (based on MediaPipe indices)
//             const noseTip = landmarks[1]; // Nose tip
//             const chin = landmarks[152]; // Chin
//             const leftEye = landmarks[33]; // Left eye outer corner
//             const rightEye = landmarks[263]; // Right eye outer corner
//             const leftMouth = landmarks[61]; // Left mouth corner
//             const rightMouth = landmarks[291]; // Right mouth corner

//             // Approximate 3D reference model (in centimeters, centered at nose)
//             const modelPoints =[
//                 [0.0, 0.0, 0.0], // Nose tip
//                 [0.0, -6.0, -2.0], // Chin
//                 [-4.0, 2.0, -2.0], // Left eye outer
//                 [4.0, 2.0, -2.0], // Right eye outer
//                 [-2.0, -2.0, -1.0], // Left mouth
//                 [2.0, -2.0, -1.0], // Right mouth
//             ];

//             // Image points (normalized to [-1, 1])
//             const imagePoints = [
//                 [(noseTip.x - 0.5) * 2, -(noseTip.y - 0.5) * 2],
//                 [(chin.x - 0.5) * 2, -(chin.y - 0.5) * 2],
//                 [(leftEye.x - 0.5) * 2, -(leftEye.y - 0.5) * 2],
//                 [(rightEye.x - 0.5) * 2, -(rightEye.y - 0.5) * 2],
//                 [(leftMouth.x - 0.5) * 2, -(leftMouth.y - 0.5) * 2],
//                 [(rightMouth.x - 0.5) * 2, -(rightMouth.y - 0.5) * 2],
//             ];

//             // Approximate head pose (simplified, without solvePnP)
//             const dx = rightEye.x - leftEye.x;
//             const dy = rightEye.y - leftEye.y;
//             this.headRotation.yaw = Math.atan2(dx, 0.5) * -1; // Yaw (left-right)
//             this.headRotation.pitch = Math.atan2(chin.y - noseTip.y, 0.5); // Pitch (up-down)
//             this.headRotation.roll = Math.atan2(dy, dx); // Roll (tilt)
//         } else {
//             this.headRotation = { yaw: 0, pitch: 0, roll: 0 }; // Reset if no face
//         }
//     }


//     setupGUI() {
//         this.gui = new dat.GUI();
//         this.gui.closed = false; // Ensure GUI is open by default

//         // Define rotation controls for each bone
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
//             // 'upper_armR', 'forearmR', 'handR',
//             // 'thighL', 'shinL',
//             // 'thighR', 'shinR'
//         ];

//         //Create a folder for each limb
//         bonesToControl.forEach(boneName => {
//             if (this.bones[boneName]) {
//                 const folder = this.gui.addFolder(boneName);
//                 const controls = {
//                     rotationX: 0,
//                     rotationY: 0,
//                     rotationZ: 0
//                 };
//                 folder.add(controls, 'rotationX', -Math.PI, Math.PI, 0.01).name('Rotation X').onChange(value => {
//                     this.bones[boneName].rotation.x = value;
//                 });
//                 folder.add(controls, 'rotationY', -Math.PI, Math.PI, 0.01).name('Rotation Y').onChange(value => {
//                     this.bones[boneName].rotation.y = value;
//                 });
//                 folder.add(controls, 'rotationZ', -Math.PI, Math.PI, 0.01).name('Rotation Z').onChange(value => {
//                     this.bones[boneName].rotation.z = value;
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
//         // const ambientLight = new THREE.Amb Ascending
//         // this.scene.add(ambientLight);
//         // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//         // directionalLight.position.set(0, 1, 1);
//         // this.scene.add(directionalLight);
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
//                         // o.geometry.center()
//                     }
//                     // console.log(o.name, o.type);
//                     // // Store references to limb bones
//                     // if (o.isBone) {
//                     //     this.bones[o.name] = o;
//                     // }
//                 });
//                 this.head = this.bones['spine006'];
//                 this.model.scale.set(5, 5, 5);
//                 this.model.position.set(0, -5.5, 0);
//                 // this.model.scale.set(1,1,1);
//                 // this.model.position.set(0, 0, 0);
//                 // this.model.center()
//                 // Update GUI after bones are loaded
//                 // this.setupGUI();
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

//         // if (this.head) {
//         //     const targetWorldPos = new THREE.Vector3();
//         //     this.target.getWorldPosition(targetWorldPos);
            
//         //     const headWorldPos = new THREE.Vector3();
//         //     this.head.getWorldPosition(headWorldPos);
            
//         //     const direction = new THREE.Vector3().subVectors(targetWorldPos, headWorldPos).normalize();
                
//         //     const quaternion = new THREE.Quaternion().setFromUnitVectors(
//         //         new THREE.Vector3(0, 0, 1),
//         //         direction
//         //     );
            
//         //     this.head.quaternion.slerp(quaternion, 0.2);
//         // }

//         if (this.head) {
//             // Apply head pose from MediaPipe
//             this.head.rotation.set(
//                 this.headRotation.pitch, // X: Pitch (up-down)
//                 this.headRotation.yaw,   // Y: Yaw (left-right)
//                 this.headRotation.roll   // Z: Roll (tilt)
//             );
//         }

//         this.time += 0.01;
//         this.material.uniforms.time.value = this.time;
//         this.material.uniforms.cameraPosition = { value: this.camera.position };
//         this.renderer.render(this.scene, this.camera);
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
        // this.videoElement.style.display = 'none';
        this.videoElement.style.transform = 'scaleX(-1)'; // Unmirror the video feed
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
            facingMode: 'user', // Front-facing camera
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
        this.startWebcam();
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

            console.log('Landmarks:', { noseTip, chin, leftEye, rightEye });

            const modelPoints = [
                [0.0, 0.0, 0.0], // Nose tip
                [0.0, -6.0, -2.0], // Chin
                [-4.0, 2.0, -2.0], // Left eye outer
                [4.0, 2.0, -2.0], // Right eye outer
                [-2.0, -2.0, -1.0], // Left mouth
                [2.0, -2.0, -1.0], // Right mouth
            ];

            const imagePoints = [
                [(noseTip.x - 0.5) * 2, -(noseTip.y - 0.5) * 2],
                [(chin.x - 0.5) * 2, -(chin.y - 0.5) * 2],
                [(leftEye.x - 0.5) * 2, -(leftEye.y - 0.5) * 2],
                [(rightEye.x - 0.5) * 2, -(rightEye.y - 0.5) * 2],
                [(leftMouth.x - 0.5) * 2, -(leftMouth.y - 0.5) * 2],
                [(rightMouth.x - 0.5) * 2, -(rightMouth.y - 0.5) * 2],
            ];

            const dx = rightEye.x - leftEye.x;
            const dy = rightEye.y - leftEye.y;
            const yaw = -Math.atan2(dx, 0.5); // Negate to correct for unmirrored feed
            const pitch = Math.atan2(chin.y - noseTip.y, 0.5) * -0.5;
            const roll = Math.atan2(dy, dx) * 0.5;

            const alpha = 0.2;
            this.smoothedHeadRotation.yaw = (1 - alpha) * this.smoothedHeadRotation.yaw + alpha * yaw;
            this.smoothedHeadRotation.pitch = (1 - alpha) * this.smoothedHeadRotation.pitch + alpha * pitch;
            this.smoothedHeadRotation.roll = (1 - alpha) * this.smoothedHeadRotation.roll + alpha * roll;

            console.log('Smoothed Head Rotation:', this.smoothedHeadRotation);
        } else {
            this.smoothedHeadRotation = { yaw: 0, pitch: 0, roll: 0 };
        }
    }

    setupGUI() {
        this.gui = new dat.GUI();
        this.gui.closed = false;

        const bonesToControl = [
            'shoulderL',
            'upper_armL',
            'forearmL',
            'handL',
            'palm01L',
            'f_index01L',
            'f_index02L',
            'f_index03L',
            'thumb01L',
            'thumb02L',
            'thumb03L',
            'palm02L',
            'f_middle01L',
            'f_middle02L',
            'f_middle03L',
            'palm03L',
            'f_ring01L',
            'f_ring02L',
            'f_ring03L',
            'palm04L',
            'f_pinky01L',
            'f_pinky02L',
            'f_pinky03L',
        ];

        bonesToControl.forEach(boneName => {
            if (this.bones[boneName]) {
                const folder = this.gui.addFolder(boneName);
                const controls = {
                    rotationX: 0,
                    rotationY: 0,
                    rotationZ: 0
                };
                folder.add(controls, 'rotationX', -Math.PI, Math.PI, 0.01).name('Rotation X').onChange(value => {
                    this.bones[boneName].rotation.x = value;
                });
                folder.add(controls, 'rotationY', -Math.PI, Math.PI, 0.01).name('Rotation Y').onChange(value => {
                    this.bones[boneName].rotation.y = value;
                });
                folder.add(controls, 'rotationZ', -Math.PI, Math.PI, 0.01).name('Rotation Z').onChange(value => {
                    this.bones[boneName].rotation.z = value;
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
                    }
                    if (o.isBone) {
                        this.bones[o.name] = o;
                    }
                    console.log(o.name, o.type);
                });
                this.head = this.bones['spine006'];
                if (!this.head) {
                    console.warn('spine006 not found. Check bone hierarchy.');
                }
                this.model.scale.set(5, 5, 5);
                this.model.position.set(0, -5.5, 0);
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

        if (this.head) {
            const targetQuaternion = new THREE.Quaternion();
            targetQuaternion.setFromEuler(
                new THREE.Euler(
                    this.smoothedHeadRotation.pitch,
                    this.smoothedHeadRotation.yaw,
                    this.smoothedHeadRotation.roll,
                    'YXZ'
                )
            );

            // Optional: Apply offset for model rest pose (uncomment if needed)
            // const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
            // targetQuaternion.multiply(offset);

            this.head.quaternion.slerp(targetQuaternion, 0.2);
        }

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
//         // this.videoElement.style.display = 'none'; // Hide video feed
//         document.body.appendChild(this.videoElement);
//         this.videoElement.style.transform = 'scaleX(-1)'
//         this.faceMesh = new FaceMesh({
//             locateFile: (file) => `/mediapipe/face_mesh/${file}`, // Path to WASM/model files
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
//             facingMode: 'user', // Invert the camera to use the front-facing camera
//         });
//         this.headRotation = { yaw: 0, pitch: 0, roll: 0 };

//         this.addObjects();
//         this.addModel();
//         this.setupGUI(); // Re-enable GUI
//         this.resize();
//         this.render();
//         this.setupResize();
//         this.setupMouse();
//         this.startWebcam();
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
//             // this.headRotation.yaw = Math.atan2(dx, 0.5) * -1;
//             // this.headRotation.pitch = Math.atan2(chin.y - noseTip.y, 0.5);
//             // this.headRotation.roll = Math.atan2(dy, dx);

//             this.headRotation.yaw = Math.atan2(dx, 0.5) * -0.5;
//             this.headRotation.pitch = Math.atan2(chin.y - noseTip.y, 0.5) * -0.5 ;
//             this.headRotation.roll = Math.atan2(dy, dx);

//             console.log(this.headRotation.pitch)
            
//         } else {
//             this.headRotation = { yaw: 0, pitch: 0, roll: 0 };
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

//         bonesToControl.forEach(boneName => {
//             if (this.bones[boneName]) {
//                 const folder = this.gui.addFolder(boneName);
//                 const controls = {
//                     rotationX: 0,
//                     rotationY: 0,
//                     rotationZ: 0
//                 };
//                 folder.add(controls, 'rotationX', -Math.PI, Math.PI, 0.01).name('Rotation X').onChange(value => {
//                     this.bones[boneName].rotation.x = value;
//                 });
//                 folder.add(controls, 'rotationY', -Math.PI, Math.PI, 0.01).name('Rotation Y').onChange(value => {
//                     this.bones[boneName].rotation.y = value;
//                 });
//                 folder.add(controls, 'rotationZ', -Math.PI, Math.PI, 0.01).name('Rotation Z').onChange(value => {
//                     this.bones[boneName].rotation.z = value;
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
//                     }
//                     if (o.isBone) {
//                         this.bones[o.name] = o; // Store all bones
//                     }
//                     console.log(o.name, o.type); // Keep for debugging
//                 });
//                 this.head = this.bones['spine006'];
//                 if (!this.head) {
//                     console.warn('spine006 not found. Check bone hierarchy.');
//                 }
//                 this.model.scale.set(5, 5, 5);
//                 this.model.position.set(0, -5.5, 0);
//                 this.setupGUI(); // Call GUI after bones are loaded
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

//         // if (this.head) {
//         //     this.head.rotation.set(
//         //         this.headRotation.pitch, // X: Pitch (up-down)
//         //         this.headRotation.yaw,   // Y: Yaw (left-right)
//         //         this.headRotation.roll   // Z: Roll (tilt)
//         //     );
//         // }

//         if (this.head) {
//             // Create target quaternion from MediaPipe head pose
//             const targetQuaternion = new THREE.Quaternion();
//             targetQuaternion.setFromEuler(
//                 new THREE.Euler(
//                     this.headRotation.pitch, // X: Pitch (up-down)
//                     this.headRotation.yaw,   // Y: Yaw (left-right)
//                     this.headRotation.roll,  // Z: Roll (tilt)
//                     'YXZ' // Euler order to match bone orientation
//                 )
//             );

//             // Smoothly interpolate head rotation
//             this.head.quaternion.slerp(targetQuaternion, 0.2);

//             // console.log(targetQuaternion)
//         }

//         // if (this.head) {
//         //     const targetWorldPos = new THREE.Vector3();
//         //     this.target.getWorldPosition(targetWorldPos);
            
//         //     const headWorldPos = new THREE.Vector3();
//         //     this.head.getWorldPosition(headWorldPos);
            
//         //     const direction = new THREE.Vector3().subVectors(targetWorldPos, headWorldPos).normalize();
                
//         //     const quaternion = new THREE.Quaternion().setFromUnitVectors(
//         //         new THREE.Vector3(0, 0, 1),
//         //         direction
//         //     );
            
//         //     this.head.quaternion.slerp(quaternion, 0.2);

//         //     console.log( quaternion)
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
