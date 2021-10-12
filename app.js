// import * as THREE from "../node_modules/three/build/three.module.js";
import * as THREE from "three";
import Images from './images';

import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";

function lerp(start, end, t) {
    return start * (1-t) + end * t;
}

//* Mouse Coordinates
let targetX = 0;
let targetY = 0;

//* Load image textures
const textureOne = new THREE.TextureLoader().load(Images.imageOne);
const textureTwo = new THREE.TextureLoader().load(Images.imageTwo);
const textureThree = new THREE.TextureLoader().load(Images.imageThree);
const textureFour = new THREE.TextureLoader().load(Images.imageFour);

class Webgl {
    constructor() {
        this.container = document.querySelector('main');
        this.links = [...document.querySelectorAll('li')];
        this.scene = new THREE.Scene();
        this.perspective = 1000;
        this.sizes = new THREE.Vector2(0,0);
        this.offset = new THREE.Vector2(0,0);
        this.uniforms = {
            uTexture: {
                value: textureOne,
            },
            uAlpha: {
                value: 0.0
            },
            uOffset: {
                value: new THREE.Vector2(0.0,0.0)
            }
        }
        this.links.forEach((link, index) => {
            link.addEventListener('mouseenter', () => {
                switch(index) {
                    case 0: 
                        this.uniforms.uTexture.value = textureOne;
                        break;
                    case 1:
                        this.uniforms.uTexture.value = textureTwo;
                        break;
                    case 2:
                        this.uniforms.uTexture.value = textureThree;
                        break;
                    case 3:
                        this.uniforms.uTexture.value = textureFour;
                        break;     
                }
            })
        })

        this.addEventListeners(document.querySelector('ul'));
        this.setUpCamera();
        this.onMousemove();
        this.createMesh();
        this.render();
    }

    get viewport() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;

        return {
            width, height, aspectRatio
        }
    }

    onMousemove() {
        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.targetY;
        })
    }

    addEventListeners(element) {
        element.addEventListener('mouseenter', () => {
            this.linksHover = true;
        })
        element.addEventListener('mouseleave', () => {
            this.linksHover = false;
        })
    }

    setUpCamera() {

        //* Readjust the dimensions on window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        let fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 0.1, 1000);
        this.camera.position.set(0, 0, this.perspective);

        //* Renderer
        this.renderer = new THREE.WebGL1Renderer({antialias: true, alpha: true});
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    onWindowResize() {
        this.camera.aspect = this.viewport.aspectRatio;
        this.camera.fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.camera.updateProjectionMatrix();
    }

    createMesh() {
        this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
        // this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.sizes.set(250, 350);
        this.mesh.scale.set(this.sizes.x, this.sizes.y);
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.scene.add(this.mesh);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}

new Webgl();