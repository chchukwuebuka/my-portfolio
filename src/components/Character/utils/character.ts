import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = false;
                child.receiveShadow = false;
                mesh.frustumCulled = true;
                if (mesh.material && !Array.isArray(mesh.material)) {
                  (mesh.material as THREE.ShaderMaterial).precision = 'mediump';
                  const mat = mesh.material as THREE.MeshStandardMaterial;
                  if (mat.color && !mesh.name.toLowerCase().includes('screen')) {
                    const meshName = mesh.name.toLowerCase();
                    const matName = mat.name ? mat.name.toLowerCase() : '';
                    const isHair = meshName.includes('hair') || matName.includes('hair');
                    const isClothingOrDetail = ['cloth', 'outfit', 'shoe', 'shirt', 'pant', 'eye', 'teeth', 'glass'].some(ext => meshName.includes(ext) || matName.includes(ext));
                    
                    if (isHair) {
                      mat.color.set('#0a0a0a'); // Very dark, textured black color
                      mat.roughness = 0.95; // Matte texture
                      mat.metalness = 0.05;
                    } else if (!isClothingOrDetail && !isHair) {
                      mat.color.set('#f3f3f3c4'); // User's custom body color
                    }
                  }
                }
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
