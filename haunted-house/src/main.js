import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { Sky } from 'three/addons/objects/Sky.js';
import './style.css';

const canvas = document.getElementById('canva');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const gui = new GUI();
const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();


const alphaFloorTexture = textureLoader.load('/static/floor/alpha.webp');
const floorColorTexture = textureLoader.load('/static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp');
const floorARMTexture = textureLoader.load('/static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp');
const floorNormalTexture = textureLoader.load('/static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp');
const floorDisplacementTexture = textureLoader.load('/static/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp');

floorColorTexture.colorSpace = THREE.SRGBColorSpace;


floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: alphaFloorTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        // wireframe: true
        displacementScale: 0.3,
        displacementBias: -0.2
    })
);

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floor displacement scale');
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floor displacement bias');


floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);

const house = new THREE.Group();
scene.add(house);

const wallARMTexture = textureLoader.load('/static/wall/brick_4_1k/brick_4_arm_1k.webp');
const wallColorTexture = textureLoader.load('/static/wall/brick_4_1k/brick_4_diff_1k.webp');
const wallNormalTexture = textureLoader.load('/static/wall/brick_4_1k/brick_4_nor_gl_1k.webp');

wallColorTexture.colorSpace = THREE.SRGBColorSpace;


const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
    })
);

walls.position.y = 2.5 / 2;
house.add(walls);


const roofColorTexture = textureLoader.load('/static/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp');
const roofARMTexture = textureLoader.load('/static/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp');
const roofNormalTexture = textureLoader.load('/static/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp');

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
);
roof.position.y = 2.5 + .75;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);


const doorAlphaTexture = textureLoader.load('/static/door/alpha.webp');
const doorColorTexture = textureLoader.load('/static/door/color.webp');
const doorAmbientOcclusionTexture = textureLoader.load('/static/door/ambientOcclusion.webp');
const doorRoughnessTexture = textureLoader.load('/static/door/roughness.webp');
const doorMetalnessTexture = textureLoader.load('/static/door/metalness.webp');
const doorHeightTexture = textureLoader.load('/static/door/height.webp');
const doorNormalTexture = textureLoader.load('/static/door/normal.webp');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        // color: '#f00',
        alphaMap: doorAlphaTexture,
        transparent: true,
        map: doorColorTexture,
        aoMap: doorAmbientOcclusionTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        // wireframe: true
    })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

const bushColorTexture = textureLoader.load('/static/bush/forest_leaves_03_1k/forest_leaves_03_diff_1k.webp');
const bushARMTexture = textureLoader.load('/static/bush/forest_leaves_03_1k/forest_leaves_03_arm_1k.webp');
const bushNormalTexture = textureLoader.load('/static/bush/forest_leaves_03_1k/forest_leaves_03_nor_gl_1k.webp');

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccff00',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(- 0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(- 1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);


const graveColorTexture = textureLoader.load('/static/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp');
const graveARMTexture = textureLoader.load('/static/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp');
const graveNormalTexture = textureLoader.load('/static/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp');

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);


const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 50; i++) {
    const _grave = new THREE.Mesh(graveGeometry, graveMaterial);

    let angle = Math.random() * Math.PI * 2;
    let radius = 3.5 + Math.random() * 4;
    let x = Math.sin(angle) * radius;
    let z = Math.cos(angle) * radius;

    _grave.position.x = x;
    _grave.position.z = z;
    _grave.position.y = Math.random() * 0.4;

    _grave.rotation.x = (Math.random() - 0.5) * 0.4;
    _grave.rotation.y = (Math.random() - 0.5) * 0.4;
    _grave.rotation.z = (Math.random() - 0.5) * 0.4;

    // _grave.castShadow = true;
    graves.add(_grave);
}





const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

const pointLight = new THREE.PointLight('#ff7d46', 5);
pointLight.position.set(0, 2.2, 2.5);
house.add(pointLight);

gui.add(pointLight, 'intensity').min(0).max(10).step(0.001).name('door light intensity');

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost1, ghost2, ghost3);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;

graves.children.forEach(grave => {
    grave.castShadow = true;
    grave.receiveShadow = true;
});

floor.receiveShadow = true;

directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = - 8;
directionalLight.shadow.camera.left = - 8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

// scene.fog = new THREE.Fog('#262837', 1, 15);
scene.fog = new THREE.FogExp2('#02343f', 0.1);

// const clock = new THREE.Clock();
const timer = new Timer();
const loop = () => {
    timer.update();
    const elapsedTime = timer.getElapsed();

    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime) * Math.sin(elapsedTime * 2.4) * Math.sin(elapsedTime * 0.8);

    const ghost2Angle = - elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 1.5) * Math.sin(elapsedTime * 1.5);

    const ghost3Angle = - elapsedTime * 0.18;
    ghost3.position.x = Math.cos(ghost3Angle) * 6;
    ghost3.position.z = Math.sin(ghost3Angle) * 6;
    ghost3.position.y = Math.sin(elapsedTime * 0.5) * Math.sin(elapsedTime * 2);

    pointLight.intensity -= Math.random() * 4;
    if (pointLight.intensity < 0) pointLight.intensity = 5;
    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(loop);
}
loop();