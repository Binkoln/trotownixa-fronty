import * as BABYLON from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import * as GUI from '@babylonjs/gui/2D';
import '@babylonjs/loaders/STL';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
let jsonData, selectedMesh = null, stlName='cake.stl';

const loadMesh = () => {   
    BABYLON.SceneLoader.ImportMesh(
      '',
      '/assets/', 
      stlName, 
      scene
    );
  }

  const addLayer = async () => {
    var requestData = { "color": "0xFF00FF", "type": "box"};

    await fetch("http://localhost:8888/add/layer", {
      method: "POST",
      body: JSON.stringify(requestData)
    })
      .then((response) => response.json())
      .then((json) => {
        jsonData = json;
      })
      .catch((error) => {
        console.error('Wystąpił błąd:', error);
      });
      const jsonDataString = JSON.stringify(jsonData);
      const valuesArray = Object.values(JSON.parse(jsonDataString));
  
  const objDataURL = "data:;base64," + valuesArray;
  const object = BABYLON.SceneLoader.Append('', objDataURL, scene, undefined, undefined, undefined, ".stl");
  
  };

  const highlightMesh = (mesh) => {
    if (!mesh.material) {
      mesh.material = new BABYLON.StandardMaterial('highlightMaterial', scene);
    }

    // Zmiana koloru 
    mesh.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
  }

  const handleMouseClickOnMesh = (event) => {

    const pickResult = scene.pick(event.clientX, event.clientY);
      if (pickResult && pickResult.hit) {
      // Anuluj zaznaczenie
      if (selectedMesh) {
        selectedMesh.material = new BABYLON.StandardMaterial('whiteMaterial', scene);
        selectedMesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1); // Biały kolor
        }
  
        // Zaznacz nowy mesh
        selectedMesh = pickResult.pickedMesh;
          highlightMesh(selectedMesh);
          let idMesh = scene.getMeshByUniqueId(selectedMesh.uniqueId)?.uniqueId;
          console.log('id: ' + idMesh);
            
      }
    }

  const removeMesh = () => {
      scene.getMeshByName('stlmesh').dispose()
  }
  
const createScene = async function() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.1, 0.2, 0.2);
  scene.createDefaultCameraOrLight(true,false,true);
  scene.activeCamera.position = new BABYLON.Vector3(50, 50, 50); 
  
//gui
let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
//advancedTexture.parseFromURLAsync("guiTexture.json");
let loadedGUI = await advancedTexture.parseFromSnippetAsync("7ID8B3#13");

const loadBtn = advancedTexture.getControlByName('loadBtn');
const addLayerBtn = advancedTexture.getControlByName('addLayerBtn');
const clearBtn = advancedTexture.getControlByName('clearBtn');

//events
loadBtn.onPointerClickObservable.add(loadMesh);
addLayerBtn.onPointerClickObservable.add(addLayer);
clearBtn.onPointerClickObservable.add(removeMesh);
canvas.addEventListener('click', handleMouseClickOnMesh);

// Inspector.Show(scene, {});

return scene;
}

const scene = await createScene();

engine.runRenderLoop(function(){
  scene.render();
});

window.addEventListener('resize',function(){
  engine.resize();
});
