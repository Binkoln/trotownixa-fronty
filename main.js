import * as BABYLON from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import * as GUI from '@babylonjs/gui/2D';
import '@babylonjs/loaders/STL';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas);

const createScene = async function() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.1, 0.2, 0.2);
  scene.createDefaultCameraOrLight(true,false,true);
  scene.activeCamera.position = new BABYLON.Vector3(50, 50, 50); 

  let stlName = 'cake.stl';
  
const loadMesh = () => {   
    BABYLON.SceneLoader.ImportMesh(
      '',
      '/assets/', 
      stlName, 
      scene
    );
  }

const removeMesh = () => {
    scene.getMeshByName('stlmesh').dispose()
}
  
//buttons
let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
//advancedTexture.parseFromURLAsync("guiTexture.json");
let loadedGUI = await advancedTexture.parseFromSnippetAsync("7ID8B3#13");

const loadBtn = advancedTexture.getControlByName('loadBtn');
const clearBtn = advancedTexture.getControlByName('clearBtn');

//events
loadBtn.onPointerClickObservable.add(loadMesh);
clearBtn.onPointerClickObservable.add(removeMesh);

//Inspector.Show(scene, {});

return scene;
}

const scene = await createScene();

engine.runRenderLoop(function(){
  scene.render();
});


window.addEventListener('resize',function(){
  engine.resize();
});