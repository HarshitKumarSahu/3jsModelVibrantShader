// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";
// import fragment from "../shaders/fragment1.glsl";
// import vertex from "../shaders/vertex1.glsl";
// import gsap from "gsap";

// import modelSrc from "../public/models/hand.glb"
// import texture01 from "../public/textures/texture01.jpg"

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
//         this.camera.position.set(0, 0, 2);
//         this.controls = new OrbitControls(this.camera, this.renderer.domElement);

//         this.time = 0;
//         this.isPlaying = true;
//         this.mouse = 0;

//         this.addObjects();
//         this.addModel()
//         this.resize();
//         this.render();
//         this.setupResize();
//     }

//     addPost() {
//       this.composer = new EffectComposer(this.renderer);
//       this. composer.addPass(new RenderPass(this.scene, this.camera));
//       this.customPass = new ShaderPass( PostProcessing );
//       this.customPass.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
//       this.customPass.uniforms[ "resolution" ].value.multiplyScalar(window.devicePixelRatio); 
//       this.composer.addPass(this.customPass)
//     }

//     addObjects() {
//         this.material = new THREE.ShaderMaterial({
//             extensions: {
//                 derivatives: "#extension GL_OES_standard_derivatives : enable",
//             },
//             side: THREE.DoubleSide,
//             uniforms: {
//                 time: { type: "f", value: 0 },
//                 resolution: { type: "v4", value: new THREE.Vector4() },
//                 uvRate1: { value: new THREE.Vector2(1, 1) },
//                 uTexture : {
//                     value: new THREE.TextureLoader().load(texture01)
//                 }
//             },
//             vertexShader: vertex,
//             fragmentShader: fragment,
//         });

//         this.geometry = new THREE.PlaneGeometry(1, 1);
        
//         this.plain = new THREE.Mesh(this.geometry, this.material);
//         // this.scene.add(this.plain);
//     }

//     addModel() {
//         this.loader = new GLTFLoader()
//         this.loader.load(
//             modelSrc, 
//             (gltf) => {
//                 this.model = gltf.scene;
//                 this.scene.add(this.model);
//                 // this.model.rotation.set(0,Math.PI/1.5,0)
//                 // console.log(gltf)

//                 this.model.traverse(o => {
//                     if(o.isMesh) {
//                         o.material = this.material
//                     }
//                 })
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
//         // this.composer.setSize(this.width, this.height);
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
//         this.renderer.render(this.scene, this.camera);
//         requestAnimationFrame(this.render.bind(this));
//     }
// }

// new Sketch({
//     dom: document.querySelector(".canvas"),
// });















// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import fragment from "../shaders/fragment.glsl";
// import vertex from "../shaders/vertex.glsl";
// import gsap from "gsap";
// import modelSrc from "../public/models/ManAminate.glb";
// import texture01 from "../public/textures/new.webp";

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
//             70,
//             this.width / this.height,
//             0.001,
//             1000
//         );
//         this.camera.position.set(0, 0, 10); // Ensure model is visible

//         this.time = 0;
//         this.isPlaying = true;
//         this.head = null;
//         this.mouse = new THREE.Vector2(0, 0);
//         this.target = new THREE.Object3D();
//         this.plainNormal = new THREE.Vector3();
//         this.mousePlain = new THREE.Plane();
//         this.rayCaster = new THREE.Raycaster();

//         this.loader = new GLTFLoader();
//         this.dracoLoader = new DRACOLoader();
//         this.dracoLoader.setDecoderPath('./draco/');
//         this.loader.setDRACOLoader(this.dracoLoader);

//         this.addObjects();
//         this.addModel();
//         this.resize();
//         this.render();
//         this.setupResize();
//         this.setupMouse();
//     }

//     setupMouse() {
//         window.addEventListener('mousemove', (event) => {
//             this.mouse.x = (event.clientX / this.width) * 2 - 1;
//             this.mouse.y = -(event.clientY / this.height) * 2 + 1;
//             this.plainNormal.copy(this.camera.position).normalize();
//             // Adjust plane to model’s position, accounting for scale
//             this.mousePlain.setFromNormalAndCoplanarPoint(this.plainNormal, new THREE.Vector3(0, -5.5, 0));
//             this.rayCaster.setFromCamera(this.mouse, this.camera);
//             this.rayCaster.ray.intersectPlane(this.mousePlain, this.target.position);
//             // Scale target position to match model’s scale (5x)
//             this.target.position.multiplyScalar(5); // Adjust for model scale
//             console.log('Target position:', this.target.position);
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
//                 uTexture: {
//                     value: new THREE.TextureLoader().load(texture01)
//                 }
//             },
//             vertexShader: vertex,
//             fragmentShader: fragment,
//         });

//         // Fallback standard material for debugging
//         this.standardMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

//         this.geometry = new THREE.PlaneGeometry(1, 1);
//         this.plain = new THREE.Mesh(this.geometry, this.material);
//         // this.scene.add(this.plain);

//         // Add lights
//         const ambientLight = new THREE.AmbientLight(0x404040);
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
//                 // Disable animations to prevent conflicts
//                 gltf.animations = [];
//                 this.model.traverse(o => {
//                     if (o.isMesh) {
//                         // Use standard material for debugging
//                         o.material = this.standardMaterial;
//                         // o.material = this.material; // Switch back to shader later
//                     }
//                     console.log(o.name, o.type);
//                 });
//                 // Try spine006 or fallback to another bone
//                 this.head = this.model.getObjectByName('spine006');
//                 if (!this.head) {
//                     console.warn('spine006 not found. Trying spine005...');
//                     this.head = this.model.getObjectByName('spine005');
//                 }
//                 if (!this.head) {
//                     console.warn('Head bone not found in model.');
//                 } else {
//                     console.log('Head found:', this.head);
//                 }
//                 this.model.scale.set(5, 5, 5);
//                 this.model.position.set(0, -5.5, 0);
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
//         if (this.head) {
//             // Use quaternion for precise bone rotation
//             const quaternion = new THREE.Quaternion();
//             quaternion.setFromEuler(new THREE.Euler(
//                 -this.mouse.y * Math.PI * 0.2, // Pitch, reduced sensitivity
//                 this.mouse.x * Math.PI * 0.125, // Yaw
//                 0, // Roll (optional)
//                 'YXZ' // Adjust order if needed
//             ));
//             this.head.quaternion.copy(quaternion);
//             // Alternative: lookAt (uncomment to test)
//             // const targetPos = new THREE.Vector3(this.target.position.x, this.target.position.y, this.head.position.z);
//             // this.head.lookAt(targetPos);
//             console.log('Head quaternion:', this.head.quaternion);
//         }
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

// import fragment from "../shaders/fragment1.glsl";
// import vertex from "../shaders/vertex1.glsl";

// import gsap from "gsap";

// // import modelSrc from "../public/models/ManAminate.glb" 
// import modelSrc from "../public/models/ManAminate.glb"
// import texture01 from "../public/textures/new.webp"
// // import texture01 from "../public/textures/ok.jpeg"
// // import texture01 from "../public/textures/texture01.jpg"

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


//             this.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
//         });
//     }

//     addObjects() {
//         this.material = new THREE.ShaderMaterial({
//             // extensions: {
//             //     derivatives: "#extension GL_OES_standard_derivatives : enable",
//             // },
//             // side: THREE.DoubleSide,
//             uniforms: {
//                 time: { value: 0 },
//                 mouse: { value: new THREE.Vector2(0, 0) }, 
//                 resolution: { value: new THREE.Vector4() },
//                 uvRate1: { value: new THREE.Vector2(1, 1) },
//                 uTexture: {
//                     value: new THREE.TextureLoader().load(texture01)
//                 }
//             },
//             vertexShader: vertex,
//             fragmentShader: fragment,
//         });
        

//         this.geometry = new THREE.PlaneGeometry(1, 1);
        
//         this.standardMaterial = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(texture01) });
//         // this.plain = new THREE.Mesh(this.geometry, this.material);
//         // this.scene.add(this.plain);


//         const ambientLight = new THREE.AmbientLight(0x404040);
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
//                     if(o.isMesh) {
//                         o.material = this.material
//                         // o.material = this.standardMaterial
        
//                     }
//                 })
//                 this.head = this.model.getObjectByName('spine006') ||
//                             this.model.getObjectByName('spine006') ||
//                             this.model.children.find(obj => obj.name.toLowerCase().includes('spine006'));
//                 // if (!this.head) {
//                 //     console.warn('Head not found in model. Check model hierarchy for correct name.');
//                 // }
//                 // if(this.head) {
//                 //     alert("okay head found")
//                 // }
//                 this.model.scale.set(5,5,5)
//                 this.model.position.set(0, -5.5, 0)
//                 // this.model.position.set(0, -15.5, 0)
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
//             this.head.lookAt(this.target.position);
//         }


//         this.time += 0.01;
//         this.material.uniforms.time.value = this.time;
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

import fragment from "../shaders/fragment1.glsl";
import vertex from "../shaders/vertex1.glsl";

import gsap from "gsap";

import modelSrc from "../public/models/ManAminate.glb" 
// import modelSrc from "../public/models/Man7.glb"
import texture01 from "../public/textures/new.webp"
// import texture01 from "../public/textures/ok.jpeg"
// import texture01 from "../public/textures/texture01.jpg"

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
        this.renderer.setClearColor("#111", 1);
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
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.time = 0;
        this.isPlaying = true;
        this.head = null;

        this.target = new THREE.Object3D()
        
        this.mouse = new THREE.Vector2(0, 0); // Initialize mouse position
        this.intersectionPoints = new THREE.Vector3()
        this.plainNormal = new THREE.Vector3()
        this.mousePlain = new THREE.Plane()
        this.rayCaster = new THREE.Raycaster();

        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('./draco/');
        this.loader.setDRACOLoader(this.dracoLoader);

        this.addObjects();
        this.addModel();
        this.resize();
        this.render();
        this.setupResize();
        this.setupMouse();
    }

    setupMouse() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;
            this.plainNormal.copy(this.camera.position).normalize()
            this.mousePlain.setFromNormalAndCoplanarPoint(this.plainNormal, this.scene.position)
            this.rayCaster.setFromCamera(this.mouse, this.camera)
            this.rayCaster.ray.intersectPlane(this.mousePlain, this.intersectionPoints)


            this.target.position.set(this.intersectionPoints.x * 0.2, this.intersectionPoints.y * 0.2, 2)


            this.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
        });
    }

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            // skinning: true,
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0, 0) }, 
                resolution: { value: new THREE.Vector4() },
                uvRate1: { value: new THREE.Vector2(1, 1) },
                uTexture: {
                    value: new THREE.TextureLoader().load(texture01)
                },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            skinning: true
        });
        

        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.standardMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        
        this.plain = new THREE.Mesh(this.geometry, this.material);
        // this.scene.add(this.plain);

        const ambientLight = new THREE.AmbientLight(0x404040);
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
                // this.model.traverse(o => {
                //     if(o.isMesh && o.isSkinnedMesh) {
                //         o.material = this.material
                //         // o.material = this.standardMaterial
                //         // o.material.needsUpdate = true;
                //     }
                //     console.log(o.name, o.type);
                // })
                this.model.traverse(o => {
                    if (o.isMesh && o.isSkinnedMesh) {
                        o.material = this.material; // Apply custom shader material
                        o.material.needsUpdate = true; // Ensure material updates
                    }
                    console.log(o.name, o.type);
                });
                this.head = this.model.getObjectByName('spine006') ||
                            // this.model.getObjectByName('spine006') ||
                            // this.model.children.find(obj => obj.name.toLowerCase().includes('spine006'));
                this.head.rotation.set(0, 0, 0);
                this.head.scale.set(1, 1, 1);
                this.head.updateMatrixWorld();
                console.log(this.head); 
                const boneIndex = this.model.getObjectByName('Man').skeleton.bones.indexOf(this.head);
                console.log("Bone index:", boneIndex);
                console.log("Bone weight influence:", this.model.getObjectByName('Man').geometry.attributes.skinWeight);


                // if (!this.head) {
                //     console.warn('Head not found in model. Check model hierarchy for correct name.');
                // }
                // if(this.head) {
                //     alert("okay head found")
                // }
                this.model.scale.set(5,5,5)
                this.model.position.set(0, -5.5, 0)
                // this.model.position.set(0, -15.5, 0)
            }, 
            undefined, 
            (error) => {
                console.error('Error loading model:', error);
            });
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

        // if (this.head) {
            // this.head.lookAt(this.target.position);
            // console.log("Head rotation:", this.head.rotation);


        //smooth    
        if (this.head) {
            const targetWorldPos = new THREE.Vector3();
            this.target.getWorldPosition(targetWorldPos);
            
            const headWorldPos = new THREE.Vector3();
            this.head.getWorldPosition(headWorldPos);
            
            const direction = new THREE.Vector3().subVectors(targetWorldPos, headWorldPos).normalize();
                
            const quaternion = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, 1), // Forward vector in model space
                direction
            );
            
            this.head.quaternion.slerp(quaternion, 0.2); // smooth blend
        }

            // console.log("Head object:", this.head);
            // console.log("Head transform:", {
            //   position: this.head.position,
            //   rotation: this.head.rotation,
            //   quaternion: this.head.quaternion,
            //   scale: this.head.scale,
            // });
        // }


        this.time += 0.01;
        // if(this.head) {
        //     this.head.rotation.y += 0.01
        // }
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.cameraPosition = { value: this.camera.position };
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch({
    dom: document.querySelector(".canvas"),
});