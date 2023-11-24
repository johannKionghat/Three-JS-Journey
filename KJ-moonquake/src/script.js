import "./style.css";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import * as dat from "dat.gui";
import { BufferAttribute, PCFShadowMap, Sphere } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

//debug
//-----
const gui = new dat.GUI();
//textures
//--------
const textureLoader = new THREE.TextureLoader();

const etoileTexture = textureLoader.load("/textures/particles/9.png");
const moonColorTexture = textureLoader.load("/textures/moon/8k_moon.jpg");
const moonHeightTexture = textureLoader.load("/textures/moon/ldem_16_uint.jpg");
const eventTexture = textureLoader.load("textures/particles/1.png");

//cancas
//------
const canvas = document.querySelector("canvas.webgl");
//scene
//-----
const scene = new THREE.Scene();
const Rot = -Math.PI * 2;
const parameters = {
  count: 500,
  size: 0.2,
  zoom: 12,
  realistic: 11,
  moonRotX: Rot,
  moonRotY: Rot,
};
const fog = new THREE.Fog("#000", 0.1, parameters.realistic);
scene.fog = fog;
const maxRot = Math.PI * 2;
gui.add(parameters, "zoom").min(-350).max(350).step(1);
gui.add(parameters, "moonRotX").min(Rot).max(maxRot).step(0.01);
gui.add(parameters, "moonRotY").min(Rot).max(maxRot).step(0.01);

//lumieres
//--------
const ambientLight = new THREE.AmbientLight("ffff44", 1.5, 5);
ambientLight.position.set(10, 10, 0);
scene.add(ambientLight);
const pointLight = new THREE.PointLight("red", 1.5, 5);
pointLight.position.set(10, 10, 20);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//cration de l'environement de l'espace
//-------------------------------------

const espace = new THREE.Group();
scene.add(espace);
//----------------------------------------------
const etoileGeometry = new THREE.BufferGeometry();
const count = 50000;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  const rayonMoon = (Math.random() * 100000) / 1000 + 100;
  const omega = ((Math.random() - 0.5) * 1000 * Math.PI) / 180;
  const beta = ((Math.random() - 0.5) * 1000 * Math.PI) / 180;
  const hauteur = Math.sin(omega) * rayonMoon;
  //hauteur theoreme de pythagore
  const rayonParallelique = Math.pow(
    Math.pow(rayonMoon, 2) - Math.pow(hauteur, 2),
    0.5
  );
  positions[i * 3] = Math.sin(beta) * rayonParallelique;
  positions[i * 3 + 1] = hauteur;
  positions[i * 3 + 2] = Math.cos(beta) * rayonParallelique;
}
etoileGeometry.setAttribute("position", new BufferAttribute(positions, 3));
const etoileMaterial = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,
  color: "white",
  map: etoileTexture,
  transparent: true,
  depthWrite: false,
  alphaMap: etoileTexture,
});
const etoile = new THREE.Points(etoileGeometry, etoileMaterial);
//=============================================================

//===================== evenement NASA ===============

const moon = new THREE.Mesh(
  new THREE.SphereBufferGeometry(6400 / 1000, 68, 68),
  new THREE.MeshPhysicalMaterial({
    map: moonColorTexture,
    alphaMap: moonHeightTexture,
    normalMap: moonColorTexture,
    roughnessMap: moonColorTexture,
    roughness: 1,
    metalnessMap: moonHeightTexture,
    metalness: 1,
    displacementMap: moonColorTexture,
    displacementScale: 0.1,
  })
);
moon.castShadow = true;
moon.receiveShadow = true;
const smDatas = [
  {
    Year: "1971",
    Day: "107",
    H: "7",
    M: "0",
    S: "55",
    Lat: "48",
    Long: "35",
    Magnitude: "2.8",
    Comments: "",
  },
  {
    Year: "1971",
    Day: "140",
    H: "17",
    M: "25",
    S: "10",
    Lat: "42",
    Long: "-24",
    Magnitude: "2",
    Comments: "",
  },
  {
    Year: "1971",
    Day: "192",
    H: "13",
    M: "24",
    S: "45",
    Lat: "43",
    Long: "-47",
    Magnitude: "1.9",
    Comments: "Or lat -42 long -60",
  },
  {
    Year: "1972",
    Day: "2",
    H: "22",
    M: "29",
    S: "40",
    Lat: "54",
    Long: "101",
    Magnitude: "1.9",
    Comments: "",
  },
  {
    Year: "1972",
    Day: "261",
    H: "14",
    M: "35",
    S: "55",
    Lat: "12",
    Long: "46",
    Magnitude: "1",
    Comments: "",
  },
  {
    Year: "1972",
    Day: "341",
    H: "23",
    M: "8",
    S: "20",
    Lat: "51",
    Long: "45",
    Magnitude: "1.4",
    Comments: "",
  },
  {
    Year: "1972",
    Day: "344",
    H: "3",
    M: "50",
    S: "15",
    Lat: "-20",
    Long: "-80",
    Magnitude: "1.2",
    Comments: "",
  },
  {
    Year: "1973",
    Day: "39",
    H: "22",
    M: "52",
    S: "10",
    Lat: "33",
    Long: "35",
    Magnitude: "0.8",
    Comments: "",
  },
  {
    Year: "1973",
    Day: "72",
    H: "7",
    M: "56",
    S: "30",
    Lat: "-84",
    Long: "-134",
    Magnitude: "3.2",
    Comments: "",
  },
  {
    Year: "1973",
    Day: "171",
    H: "20",
    M: "22",
    S: "0",
    Lat: "-1",
    Long: "-71",
    Magnitude: "2.2",
    Comments: "",
  },
  {
    Year: "1973",
    Day: "274",
    H: "3",
    M: "58",
    S: "0",
    Lat: "-37",
    Long: "-29",
    Magnitude: "1.1",
    Comments: "",
  },
  {
    Year: "1974",
    Day: "54",
    H: "21",
    M: "16",
    S: "50",
    Lat: "36",
    Long: "-16",
    Magnitude: "0.7",
    Comments: "",
  },
  {
    Year: "1974",
    Day: "86",
    H: "9",
    M: "11",
    S: "0",
    Lat: "-48",
    Long: "-106",
    Magnitude: "1.6",
    Comments: "",
  },
  {
    Year: "1974",
    Day: "109",
    H: "13",
    M: "35",
    S: "15",
    Lat: "-37",
    Long: "42",
    Magnitude: "0.9",
    Comments: "",
  },
  {
    Year: "1974",
    Day: "149",
    H: "20",
    M: "42",
    S: "15",
    Lat: "",
    Long: "",
    Magnitude: "0.6",
    Comments: "30 degrees from station 16 on east side of station",
  },
  {
    Year: "1974",
    Day: "192",
    H: "0",
    M: "46",
    S: "30",
    Lat: "21",
    Long: "88",
    Magnitude: "2.7",
    Comments: "",
  },
  {
    Year: "1975",
    Day: "3",
    H: "1",
    M: "42",
    S: "0",
    Lat: "29",
    Long: "-98",
    Magnitude: "3.2",
    Comments: "",
  },
  {
    Year: "1975",
    Day: "12",
    H: "3",
    M: "14",
    S: "10",
    Lat: "75",
    Long: "40",
    Magnitude: "1.7",
    Comments: "",
  },
  {
    Year: "1975",
    Day: "13",
    H: "0",
    M: "26",
    S: "20",
    Lat: "-2",
    Long: "-51",
    Magnitude: "1.1",
    Comments: "",
  },
  {
    Year: "1975",
    Day: "44",
    H: "22",
    M: "3",
    S: "50",
    Lat: "-19",
    Long: "-26",
    Magnitude: "1.4",
    Comments: "",
  },
  {
    Year: "1975",
    Day: "127",
    H: "6",
    M: "37",
    S: "5",
    Lat: "-49",
    Long: "-45",
    Magnitude: "1.3",
    Comments: "",
  },
  {
    Year: "1975",
    Day: "147",
    H: "23",
    M: "29",
    S: "0",
    Lat: "3",
    Long: "-58",
    Magnitude: "1.4",
    Comments: "",
  },
  {
    Year: "1975",
    Day: "314",
    H: "7",
    M: "52",
    S: "55",
    Lat: "-8",
    Long: "64",
    Magnitude: "1.8",
    Comments: "",
  },
  {
    Year: "1976",
    Day: "4",
    H: "11",
    M: "18",
    S: "55",
    Lat: "50",
    Long: "30",
    Magnitude: "1.8",
    Comments: "",
  },
  {
    Year: "1976",
    Day: "12",
    H: "8",
    M: "18",
    S: "5",
    Lat: "38",
    Long: "44",
    Magnitude: "1.1",
    Comments: "",
  },
  {
    Year: "1976",
    Day: "66",
    H: "10",
    M: "12",
    S: "40",
    Lat: "50",
    Long: "-20",
    Magnitude: "2.3",
    Comments: "",
  },
  {
    Year: "1976",
    Day: "68",
    H: "14",
    M: "42",
    S: "10",
    Lat: "-19",
    Long: "-12",
    Magnitude: "1.8",
    Comments: "",
  },
  {
    Year: "1976",
    Day: "137",
    H: "12",
    M: "32",
    S: "40",
    Lat: "77",
    Long: "-10",
    Magnitude: "1.5",
    Comments: "",
  },
];
const dmDatas = [
  {
    A: "1",
    Side: "N",
    Lat: "-15.7",
    Lat_err: "2.4",
    Long: "-36.6",
    Long_err: "4.6",
    Depth: "867",
    Depth_err: "29",
    Assumed: "N",
  },
  {
    A: "3",
    Side: "N",
    Lat: "-2.9",
    Lat_err: "1.7",
    Long: "-50.3",
    Long_err: "6.3",
    Depth: "946",
    Depth_err: "22",
    Assumed: "N",
  },
  {
    A: "5",
    Side: "N",
    Lat: "1.1",
    Lat_err: "94.2",
    Long: "-44.7",
    Long_err: "16.4",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "6",
    Side: "N",
    Lat: "43.5",
    Lat_err: "2.9",
    Long: "55.5",
    Long_err: "9.5",
    Depth: "844",
    Depth_err: "33",
    Assumed: "N",
  },
  {
    A: "7",
    Side: "N",
    Lat: "25",
    Lat_err: "1.7",
    Long: "53.2",
    Long_err: "8",
    Depth: "893",
    Depth_err: "27",
    Assumed: "N",
  },
  {
    A: "8",
    Side: "N",
    Lat: "-23.7",
    Lat_err: "4.8",
    Long: "-35.5",
    Long_err: "6.5",
    Depth: "1086",
    Depth_err: "37",
    Assumed: "N",
  },
  {
    A: "9",
    Side: "N",
    Lat: "-6",
    Lat_err: "2.4",
    Long: "-19.7",
    Long_err: "3.6",
    Depth: "1037",
    Depth_err: "68",
    Assumed: "N",
  },
  {
    A: "10",
    Side: "N",
    Lat: "-35.7",
    Lat_err: "4.9",
    Long: "-40.3",
    Long_err: "6.7",
    Depth: "988",
    Depth_err: "21",
    Assumed: "N",
  },
  {
    A: "11",
    Side: "N",
    Lat: "9.2",
    Lat_err: "1.5",
    Long: "17.5",
    Long_err: "4.9",
    Depth: "1187",
    Depth_err: "87",
    Assumed: "N",
  },
  {
    A: "13",
    Side: "N",
    Lat: "-19.1",
    Lat_err: "3",
    Long: "-41.7",
    Long_err: "5.6",
    Depth: "973",
    Depth_err: "23",
    Assumed: "N",
  },
  {
    A: "14",
    Side: "N",
    Lat: "-29.6",
    Lat_err: "9.3",
    Long: "-44.4",
    Long_err: "7.8",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "15",
    Side: "N",
    Lat: "0.7",
    Lat_err: "0.7",
    Long: "-3.9",
    Long_err: "0.6",
    Depth: "747",
    Depth_err: "62",
    Assumed: "N",
  },
  {
    A: "16",
    Side: "N",
    Lat: "7.5",
    Lat_err: "0.8",
    Long: "6.3",
    Long_err: "1.5",
    Depth: "1019",
    Depth_err: "78",
    Assumed: "N",
  },
  {
    A: "17",
    Side: "N",
    Lat: "25.5",
    Lat_err: "2.3",
    Long: "-21.9",
    Long_err: "2.8",
    Depth: "807",
    Depth_err: "40",
    Assumed: "N",
  },
  {
    A: "18",
    Side: "N",
    Lat: "23.3",
    Lat_err: "2.4",
    Long: "32.7",
    Long_err: "5.5",
    Depth: "925",
    Depth_err: "44",
    Assumed: "N",
  },
  {
    A: "19",
    Side: "N",
    Lat: "27.7",
    Lat_err: "3",
    Long: "34.4",
    Long_err: "6.4",
    Depth: "974",
    Depth_err: "42",
    Assumed: "N",
  },
  {
    A: "20",
    Side: "N",
    Lat: "23.7",
    Lat_err: "2.5",
    Long: "-31.4",
    Long_err: "5.3",
    Depth: "945",
    Depth_err: "50",
    Assumed: "N",
  },
  {
    A: "21",
    Side: "N",
    Lat: "-18.2",
    Lat_err: "3",
    Long: "-50.8",
    Long_err: "7.2",
    Depth: "1037",
    Depth_err: "20",
    Assumed: "N",
  },
  {
    A: "22",
    Side: "N",
    Lat: "21.6",
    Lat_err: "1.8",
    Long: "43.6",
    Long_err: "5.9",
    Depth: "788",
    Depth_err: "29",
    Assumed: "N",
  },
  {
    A: "25",
    Side: "N",
    Lat: "35.1",
    Lat_err: "2.2",
    Long: "59.8",
    Long_err: "9.9",
    Depth: "924",
    Depth_err: "28",
    Assumed: "N",
  },
  {
    A: "26",
    Side: "N",
    Lat: "14.3",
    Lat_err: "2.6",
    Long: "5.2",
    Long_err: "2",
    Depth: "1122",
    Depth_err: "90",
    Assumed: "N",
  },
  {
    A: "27",
    Side: "N",
    Lat: "23",
    Lat_err: "3.3",
    Long: "20.4",
    Long_err: "4.7",
    Depth: "1085",
    Depth_err: "64",
    Assumed: "N",
  },
  {
    A: "28",
    Side: "N",
    Lat: "8.1",
    Lat_err: "1.3",
    Long: "10.3",
    Long_err: "2.6",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "29",
    Side: "F",
    Lat: "53.4",
    Lat_err: "15.2",
    Long: "60.9",
    Long_err: "66.1",
    Depth: "1077",
    Depth_err: "32",
    Assumed: "N",
  },
  {
    A: "30",
    Side: "N",
    Lat: "12.7",
    Lat_err: "1.2",
    Long: "-35.7",
    Long_err: "4.8",
    Depth: "931",
    Depth_err: "39",
    Assumed: "N",
  },
  {
    A: "32",
    Side: "N",
    Lat: "25",
    Lat_err: "2.7",
    Long: "43.6",
    Long_err: "7.3",
    Depth: "944",
    Depth_err: "38",
    Assumed: "N",
  },
  {
    A: "33",
    Side: "F",
    Lat: "5.1",
    Lat_err: "2.6",
    Long: "115.8",
    Long_err: "9.3",
    Depth: "877",
    Depth_err: "112",
    Assumed: "N",
  },
  {
    A: "34",
    Side: "N",
    Lat: "6.8",
    Lat_err: "0.7",
    Long: "-7.2",
    Long_err: "1.3",
    Depth: "971",
    Depth_err: "77",
    Assumed: "N",
  },
  {
    A: "35",
    Side: "N",
    Lat: "5",
    Lat_err: "1.5",
    Long: "36.1",
    Long_err: "11.4",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "36",
    Side: "N",
    Lat: "27.5",
    Lat_err: "4.7",
    Long: "-4.6",
    Long_err: "1.9",
    Depth: "1058",
    Depth_err: "74",
    Assumed: "N",
  },
  {
    A: "37",
    Side: "N",
    Lat: "22.5",
    Lat_err: "5.5",
    Long: "29.7",
    Long_err: "10.7",
    Depth: "1343",
    Depth_err: "82",
    Assumed: "N",
  },
  {
    A: "38",
    Side: "N",
    Lat: "7.8",
    Lat_err: "1.3",
    Long: "43.3",
    Long_err: "7",
    Depth: "1031",
    Depth_err: "37",
    Assumed: "N",
  },
  {
    A: "39",
    Side: "N",
    Lat: "-21.9",
    Lat_err: "21.1",
    Long: "-12.7",
    Long_err: "5.1",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "40",
    Side: "N",
    Lat: "-1.3",
    Lat_err: "1.2",
    Long: "-10.3",
    Long_err: "1.5",
    Depth: "867",
    Depth_err: "66",
    Assumed: "N",
  },
  {
    A: "41",
    Side: "N",
    Lat: "13.8",
    Lat_err: "1.3",
    Long: "-29.2",
    Long_err: "3.9",
    Depth: "847",
    Depth_err: "45",
    Assumed: "N",
  },
  {
    A: "42",
    Side: "N",
    Lat: "22.2",
    Lat_err: "1.5",
    Long: "-50.7",
    Long_err: "6.8",
    Depth: "907",
    Depth_err: "28",
    Assumed: "N",
  },
  {
    A: "44",
    Side: "N",
    Lat: "50.2",
    Lat_err: "2.9",
    Long: "60.2",
    Long_err: "12",
    Depth: "908",
    Depth_err: "37",
    Assumed: "N",
  },
  {
    A: "49",
    Side: "N",
    Lat: "8.6",
    Lat_err: "4.6",
    Long: "-50.8",
    Long_err: "5.6",
    Depth: "952",
    Depth_err: "93",
    Assumed: "N",
  },
  {
    A: "50",
    Side: "N",
    Lat: "8.7",
    Lat_err: "1",
    Long: "-53.4",
    Long_err: "5",
    Depth: "828",
    Depth_err: "27",
    Assumed: "N",
  },
  {
    A: "51",
    Side: "N",
    Lat: "12.3",
    Lat_err: "1.4",
    Long: "37.7",
    Long_err: "8",
    Depth: "1125",
    Depth_err: "56",
    Assumed: "N",
  },
  {
    A: "53",
    Side: "N",
    Lat: "-10.1",
    Lat_err: "39.9",
    Long: "-39.2",
    Long_err: "8.1",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "54",
    Side: "N",
    Lat: "13.1",
    Lat_err: "30.1",
    Long: "-52.4",
    Long_err: "10.8",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "56",
    Side: "N",
    Lat: "1.1",
    Lat_err: "1.6",
    Long: "-20.6",
    Long_err: "5",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "59",
    Side: "N",
    Lat: "-9.5",
    Lat_err: "17.6",
    Long: "-53.6",
    Long_err: "5.9",
    Depth: "750",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "60",
    Side: "N",
    Lat: "24.1",
    Lat_err: "9.5",
    Long: "-52.2",
    Long_err: "8",
    Depth: "750",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "64",
    Side: "N",
    Lat: "30.1",
    Lat_err: "2.9",
    Long: "53.2",
    Long_err: "9.8",
    Depth: "975",
    Depth_err: "24",
    Assumed: "N",
  },
  {
    A: "65",
    Side: "N",
    Lat: "46.6",
    Lat_err: "3.9",
    Long: "42.3",
    Long_err: "8.2",
    Depth: "861",
    Depth_err: "25",
    Assumed: "N",
  },
  {
    A: "70",
    Side: "N",
    Lat: "34.8",
    Lat_err: "2.1",
    Long: "63",
    Long_err: "11.3",
    Depth: "1014",
    Depth_err: "26",
    Assumed: "N",
  },
  {
    A: "71",
    Side: "N",
    Lat: "-20.9",
    Lat_err: "22.1",
    Long: "-16.8",
    Long_err: "6.3",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "73",
    Side: "N",
    Lat: "21.1",
    Lat_err: "1.7",
    Long: "-44",
    Long_err: "5.6",
    Depth: "908",
    Depth_err: "28",
    Assumed: "N",
  },
  {
    A: "74",
    Side: "N",
    Lat: "34.7",
    Lat_err: "2.5",
    Long: "60.1",
    Long_err: "10.6",
    Depth: "1043",
    Depth_err: "30",
    Assumed: "N",
  },
  {
    A: "77",
    Side: "N",
    Lat: "24.6",
    Lat_err: "8.4",
    Long: "-23.4",
    Long_err: "11.1",
    Depth: "1419",
    Depth_err: "96",
    Assumed: "N",
  },
  {
    A: "82",
    Side: "N",
    Lat: "27.5",
    Lat_err: "9.9",
    Long: "34.3",
    Long_err: "20.6",
    Depth: "919",
    Depth_err: "160",
    Assumed: "N",
  },
  {
    A: "86",
    Side: "N",
    Lat: "-40.9",
    Lat_err: "7.5",
    Long: "-40.6",
    Long_err: "8.4",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "96",
    Side: "N",
    Lat: "6.2",
    Lat_err: "0.6",
    Long: "11.9",
    Long_err: "1.8",
    Depth: "794",
    Depth_err: "64",
    Assumed: "N",
  },
  {
    A: "97",
    Side: "N",
    Lat: "-8.4",
    Lat_err: "2.9",
    Long: "17.9",
    Long_err: "3.8",
    Depth: "989",
    Depth_err: "71",
    Assumed: "N",
  },
  {
    A: "99",
    Side: "N",
    Lat: "10",
    Lat_err: "1.1",
    Long: "22.8",
    Long_err: "4.2",
    Depth: "989",
    Depth_err: "69",
    Assumed: "N",
  },
  {
    A: "100",
    Side: "N",
    Lat: "-2",
    Lat_err: "4.2",
    Long: "32.2",
    Long_err: "17.1",
    Depth: "920",
    Depth_err: "184",
    Assumed: "N",
  },
  {
    A: "107",
    Side: "N",
    Lat: "41",
    Lat_err: "2.5",
    Long: "53.4",
    Long_err: "7.7",
    Depth: "893",
    Depth_err: "34",
    Assumed: "N",
  },
  {
    A: "114",
    Side: "N",
    Lat: "15.5",
    Lat_err: "1.2",
    Long: "55.6",
    Long_err: "7.5",
    Depth: "755",
    Depth_err: "44",
    Assumed: "N",
  },
  {
    A: "201",
    Side: "N",
    Lat: "-40.6",
    Lat_err: "14.8",
    Long: "-3.8",
    Long_err: "1.6",
    Depth: "862",
    Depth_err: "88",
    Assumed: "N",
  },
  {
    A: "202",
    Side: "N",
    Lat: "1",
    Lat_err: "1.7",
    Long: "2.8",
    Long_err: "1.5",
    Depth: "919",
    Depth_err: "170",
    Assumed: "N",
  },
  {
    A: "203",
    Side: "N",
    Lat: "0.5",
    Lat_err: "2",
    Long: "47.3",
    Long_err: "11.8",
    Depth: "1243",
    Depth_err: "50",
    Assumed: "N",
  },
  {
    A: "204",
    Side: "N",
    Lat: "-28.4",
    Lat_err: "8.9",
    Long: "-66.6",
    Long_err: "9.2",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "209",
    Side: "N",
    Lat: "-26.5",
    Lat_err: "12",
    Long: "-35.1",
    Long_err: "7.2",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "212",
    Side: "N",
    Lat: "12.8",
    Lat_err: "1.4",
    Long: "-36.2",
    Long_err: "5.6",
    Depth: "963",
    Depth_err: "45",
    Assumed: "N",
  },
  {
    A: "216",
    Side: "N",
    Lat: "-13.7",
    Lat_err: "3.9",
    Long: "-21.6",
    Long_err: "4.5",
    Depth: "764",
    Depth_err: "81",
    Assumed: "N",
  },
  {
    A: "218",
    Side: "F",
    Lat: "-2.4",
    Lat_err: "4.4",
    Long: "-73.3",
    Long_err: "32.3",
    Depth: "878",
    Depth_err: "107",
    Assumed: "N",
  },
  {
    A: "223",
    Side: "N",
    Lat: "36.1",
    Lat_err: "12.2",
    Long: "-2.4",
    Long_err: "1.3",
    Depth: "863",
    Depth_err: "145",
    Assumed: "N",
  },
  {
    A: "224",
    Side: "N",
    Lat: "-50.7",
    Lat_err: "7.9",
    Long: "-21.4",
    Long_err: "5.5",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "230",
    Side: "N",
    Lat: "6.3",
    Lat_err: "0.9",
    Long: "22.1",
    Long_err: "9.7",
    Depth: "855",
    Depth_err: "188",
    Assumed: "N",
  },
  {
    A: "231",
    Side: "N",
    Lat: "34.3",
    Lat_err: "12",
    Long: "45",
    Long_err: "29.9",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "233",
    Side: "N",
    Lat: "24.1",
    Lat_err: "5.1",
    Long: "26.1",
    Long_err: "8.2",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "234",
    Side: "N",
    Lat: "36.8",
    Lat_err: "4.5",
    Long: "21.2",
    Long_err: "4.5",
    Depth: "1006",
    Depth_err: "41",
    Assumed: "N",
  },
  {
    A: "236",
    Side: "N",
    Lat: "-7.8",
    Lat_err: "3.5",
    Long: "5.4",
    Long_err: "1.7",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "237",
    Side: "N",
    Lat: "12.2",
    Lat_err: "1.9",
    Long: "3.5",
    Long_err: "1.5",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "238",
    Side: "N",
    Lat: "26.3",
    Lat_err: "8.7",
    Long: "20",
    Long_err: "9.8",
    Depth: "831",
    Depth_err: "169",
    Assumed: "N",
  },
  {
    A: "239",
    Side: "N",
    Lat: "26.7",
    Lat_err: "5.6",
    Long: "5.2",
    Long_err: "2.1",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "241",
    Side: "F",
    Lat: "-69.4",
    Lat_err: "4.4",
    Long: "75.4",
    Long_err: "24.6",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "242",
    Side: "N",
    Lat: "58.6",
    Lat_err: "4.6",
    Long: "54.2",
    Long_err: "15.5",
    Depth: "1025",
    Depth_err: "31",
    Assumed: "N",
  },
  {
    A: "243",
    Side: "N",
    Lat: "7",
    Lat_err: "1.3",
    Long: "8.3",
    Long_err: "4.1",
    Depth: "1019",
    Depth_err: "191",
    Assumed: "N",
  },
  {
    A: "244",
    Side: "F",
    Lat: "34.6",
    Lat_err: "20.9",
    Long: "56.1",
    Long_err: "81",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "245",
    Side: "F",
    Lat: "8.6",
    Lat_err: "4.9",
    Long: "73",
    Long_err: "69.5",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "246",
    Side: "N",
    Lat: "19.4",
    Lat_err: "2.7",
    Long: "24.3",
    Long_err: "5.1",
    Depth: "959",
    Depth_err: "68",
    Assumed: "N",
  },
  {
    A: "248",
    Side: "N",
    Lat: "5.3",
    Lat_err: "1.1",
    Long: "3.6",
    Long_err: "1.5",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "249",
    Side: "N",
    Lat: "-3.4",
    Lat_err: "2.5",
    Long: "12.5",
    Long_err: "3.1",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "250",
    Side: "N",
    Lat: "-3.6",
    Lat_err: "2.8",
    Long: "21.5",
    Long_err: "5.7",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "251",
    Side: "N",
    Lat: "-46.5",
    Lat_err: "8.3",
    Long: "38.9",
    Long_err: "9.3",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "255",
    Side: "N",
    Lat: "1.4",
    Lat_err: "1.6",
    Long: "15",
    Long_err: "3.7",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "257",
    Side: "N",
    Lat: "35",
    Lat_err: "6.2",
    Long: "19.1",
    Long_err: "5.5",
    Depth: "1063",
    Depth_err: "63",
    Assumed: "N",
  },
  {
    A: "258",
    Side: "N",
    Lat: "-7.1",
    Lat_err: "3.5",
    Long: "15.3",
    Long_err: "4",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "259",
    Side: "N",
    Lat: "3.4",
    Lat_err: "0.6",
    Long: "2",
    Long_err: "0.7",
    Depth: "559",
    Depth_err: "97",
    Assumed: "N",
  },
  {
    A: "260",
    Side: "N",
    Lat: "-1.7",
    Lat_err: "2.3",
    Long: "18",
    Long_err: "4.5",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "267",
    Side: "N",
    Lat: "-7.6",
    Lat_err: "5",
    Long: "36.7",
    Long_err: "13.2",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "271",
    Side: "N",
    Lat: "53.8",
    Lat_err: "6.8",
    Long: "35.2",
    Long_err: "19.2",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "272",
    Side: "N",
    Lat: "-50",
    Lat_err: "7.5",
    Long: "53.2",
    Long_err: "12.2",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "276",
    Side: "N",
    Lat: "-3.7",
    Lat_err: "3.6",
    Long: "-33.9",
    Long_err: "12.4",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "279",
    Side: "N",
    Lat: "4.4",
    Lat_err: "1.2",
    Long: "-4.7",
    Long_err: "1.8",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "280",
    Side: "N",
    Lat: "2.4",
    Lat_err: "2.7",
    Long: "46.1",
    Long_err: "20.2",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "281",
    Side: "N",
    Lat: "-53.2",
    Lat_err: "4.6",
    Long: "-54.4",
    Long_err: "11.4",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "282",
    Side: "F",
    Lat: "15.5",
    Lat_err: "2.4",
    Long: "97",
    Long_err: "12.3",
    Depth: "1141",
    Depth_err: "74",
    Assumed: "N",
  },
  {
    A: "283",
    Side: "N",
    Lat: "7.1",
    Lat_err: "1.2",
    Long: "22.5",
    Long_err: "4.7",
    Depth: "984",
    Depth_err: "76",
    Assumed: "N",
  },
  {
    A: "285",
    Side: "F",
    Lat: "42.9",
    Lat_err: "3.7",
    Long: "110.9",
    Long_err: "14.2",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "286",
    Side: "N",
    Lat: "54.2",
    Lat_err: "6.5",
    Long: "56.5",
    Long_err: "14",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "287",
    Side: "N",
    Lat: "24.8",
    Lat_err: "5.7",
    Long: "35.7",
    Long_err: "13.5",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
  {
    A: "290",
    Side: "N",
    Lat: "10.6",
    Lat_err: "1.6",
    Long: "6.4",
    Long_err: "1.9",
    Depth: "933",
    Depth_err: "109",
    Assumed: "Y",
  },
];
const aiDatas = [
  {
    AI: "12 LM",
    Lat: "-3.94",
    Long: "-21.2",
    Y: "69",
    JD: "324",
    Hour: "22",
    Min: "17",
    Sec: "17.7",
  },
  {
    AI: "13 S-IVB",
    Lat: "-2.75",
    Long: "-27.86",
    Y: "70",
    JD: "105",
    Hour: "1",
    Min: "9",
    Sec: "41",
  },
  {
    AI: "14 S-IVB",
    Lat: "-8.09",
    Long: "-26.02",
    Y: "71",
    JD: "35",
    Hour: "7",
    Min: "40",
    Sec: "55.4",
  },
  {
    AI: "14 LM",
    Lat: "-3.42",
    Long: "-19.67",
    Y: "71",
    JD: "38",
    Hour: "0",
    Min: "45",
    Sec: "26.7",
  },
  {
    AI: "15 S-IVB",
    Lat: "-1.51",
    Long: "-11.81",
    Y: "71",
    JD: "210",
    Hour: "20",
    Min: "58",
    Sec: "42.9",
  },
  {
    AI: "15 LM",
    Lat: "26.36",
    Long: "0.25",
    Y: "71",
    JD: "215",
    Hour: "3",
    Min: "3",
    Sec: "37",
  },
  {
    AI: "17 S-IVB",
    Lat: "-4.21",
    Long: "-12.31",
    Y: "72",
    JD: "345",
    Hour: "20",
    Min: "32",
    Sec: "42.3",
  },
  {
    AI: "17 LM",
    Lat: "19.99",
    Long: "30.51",
    Y: "72",
    JD: "350",
    Hour: "6",
    Min: "50",
    Sec: "20.8",
  },
];

const groupMoonEvent = new THREE.Group();
const groupEvent = new THREE.Group();
groupMoonEvent.add(moon, groupEvent);
const eventGenerator = () => {
  smDatas.forEach((element) => {
    const smGeometry = new THREE.SphereBufferGeometry(0.05, 15, 15);
    const smMaterial = new THREE.MeshBasicMaterial({
      color: "#ff0050",
    });
    const smEvent = new THREE.Mesh(smGeometry, smMaterial);
    groupEvent.add(smEvent);

    const Long = null;
    const Lat = null;
    let coord = { x: 0, y: 0, z: 0 };
    function location(Lat, Long) {
      const rayonMoon = 6450 / 1000;
      const omega = (Lat * Math.PI) / 180;
      const beta = (Long * Math.PI) / 180;
      const hauteur = Math.sin(omega) * rayonMoon;
      //hauteur theoreme de pythagore
      const rayonParallelique = Math.pow(
        Math.pow(rayonMoon, 2) - Math.pow(hauteur, 2),
        0.5
      );
      coord.x = Math.sin(beta) * rayonParallelique;
      coord.y = hauteur;
      coord.z = Math.cos(beta) * rayonParallelique;
      return new THREE.Vector3(coord.x, coord.y, coord.z);
    }
    coord = location(element.Lat, element.Long);
    smEvent.position.set(coord.x, coord.y, coord.z);
  });

  dmDatas.forEach((element) => {
    const eventGeometry = new THREE.SphereBufferGeometry(0.05, 15, 15);
    const eventMaterial = new THREE.MeshBasicMaterial({
      color: "yellow",
    });
    const event = new THREE.Mesh(eventGeometry, eventMaterial);
    groupEvent.add(event);

    const Long = null;
    const Lat = null;
    let coord = { x: 0, y: 0, z: 0 };
    function location(Lat, Long) {
      const rayonMoon = 6450 / 1000;
      const omega = (Lat * Math.PI) / 180;
      const beta = (Long * Math.PI) / 180;
      const hauteur = Math.sin(omega) * rayonMoon;
      //hauteur theoreme de pythagore
      const rayonParallelique = Math.pow(
        Math.pow(rayonMoon, 2) - Math.pow(hauteur, 2),
        0.5
      );
      coord.x = Math.sin(beta) * rayonParallelique;
      coord.y = hauteur;
      coord.z = Math.cos(beta) * rayonParallelique;
      return new THREE.Vector3(coord.x, coord.y, coord.z);
    }
    coord = location(element.Lat, element.Long);
    event.position.set(coord.x, coord.y, coord.z);
  });

  aiDatas.forEach((element) => {
    const eventGeometry = new THREE.SphereBufferGeometry(0.05, 15, 15);
    const eventMaterial = new THREE.MeshBasicMaterial({
      color: "blue",
    });
    const event = new THREE.Mesh(eventGeometry, eventMaterial);
    groupEvent.add(event);

    const Long = null;
    const Lat = null;
    let coord = { x: 0, y: 0, z: 0 };
    function location(Lat, Long) {
      const rayonMoon = 6450 / 1000;
      const omega = (Lat * Math.PI) / 180;
      const beta = (Long * Math.PI) / 180;
      const hauteur = Math.sin(omega) * rayonMoon;
      //hauteur theoreme de pythagore
      const rayonParallelique = Math.pow(
        Math.pow(rayonMoon, 2) - Math.pow(hauteur, 2),
        0.5
      );
      coord.x = Math.sin(beta) * rayonParallelique;
      coord.y = hauteur;
      coord.z = Math.cos(beta) * rayonParallelique;
      return new THREE.Vector3(coord.x, coord.y, coord.z);
    }
    coord = location(element.Lat, element.Long);
    event.position.set(coord.x, coord.y, coord.z);
  });
  groupEvent.rotation.y = Math.PI * 0.5;
  groupMoonEvent.rotation.y = -Math.PI * 0.5;
};
eventGenerator();
espace.add(etoile, groupMoonEvent);
// const axesHelper= new THREE.AxesHelper(10)
// scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10000000
);
camera.position.z = parameters.zoom;
scene.add(camera);

const controls = new TrackballControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
renderer.clearColor("blue");

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  etoile.rotation.y = elapsedTime * 0.005;
  groupMoonEvent.rotation.x = parameters.moonRotX;
  groupMoonEvent.rotation.y = parameters.moonRotY;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
