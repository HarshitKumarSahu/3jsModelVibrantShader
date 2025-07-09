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





import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import gsap from "gsap";

// import modelSrc from "../public/models/hand.glb" 
import modelSrc from "../public/models/man.glb"
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
        this.camera.position.set(0, 0, 2);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.time = 0;
        this.isPlaying = true;
        this.mouse = new THREE.Vector2(0, 0); // Initialize mouse position

        this.addObjects();
        this.addModel();
        this.resize();
        this.render();
        this.setupResize();
        this.setupMouse(); // Add mouse event listener
    }

    setupMouse() {
        window.addEventListener('mousemove', (event) => {
            // Normalize mouse coordinates to [-1, 1]
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;
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
                mouse: { value: new THREE.Vector2(0, 0) }, // Add mouse uniform
                resolution: { value: new THREE.Vector4() },
                uvRate1: { value: new THREE.Vector2(1, 1) },
                uTexture: {
                    value: new THREE.TextureLoader().load(texture01)
                }
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.geometry = new THREE.PlaneGeometry(1, 1);
        
        this.plain = new THREE.Mesh(this.geometry, this.material);
        // this.scene.add(this.plain);
    }

    addModel() {
        this.loader = new GLTFLoader()
        this.loader.load(
            modelSrc, 
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                this.model.traverse(o => {
                    if(o.isMesh) {
                        o.material = this.material
                    }
                })
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
        this.time += 0.01;
        this.material.uniforms.time.value = this.time;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch({
    dom: document.querySelector(".canvas"),
});
