import * as BABYLON from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import * as GUI from '@babylonjs/gui/2D';
import '@babylonjs/loaders/STL';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
let jsonData, selectedMesh = null, stlName='cake.stl';

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



//okno z danymi mesha
const showModal = (meshData) => {
  const modal = document.createElement("div");
  modal.className = "modal";
  document.body.appendChild(modal);

  const scaleInfo = document.createElement("p");
  scaleInfo.innerHTML = "Skala (X,Y,Z):<br>" + meshData.scaling.x + "<br>" + meshData.scaling.y + "<br>" + meshData.scaling.z;
  modal.appendChild(scaleInfo);
  
  const rotationInfo = document.createElement("p");
  rotationInfo.innerHTML = "Rotacja (X,Y,Z):<br>" + meshData.rotation.x + "<br>" + meshData.rotation.y + "<br>" + meshData.rotation.z;
  modal.appendChild(rotationInfo);

  const positionInfo = document.createElement("p");
  positionInfo.innerHTML = "Pozycja (X,Y,Z):<br>" + meshData.position.x + "<br>" + meshData.position.y + "<br>" + meshData.position.z;
  modal.appendChild(positionInfo);

  const nameInfo = document.createElement("p");
  nameInfo.innerHTML = "Nazwa warstwy: " + meshData.name;
  modal.appendChild(nameInfo);

  
  
}
const setLayer = (meshData) =>{

  console.log('Ustawiania warstwy')
}




//laduje z pliku mesh
  const loadMesh = () => {   
    BABYLON.SceneLoader.ImportMesh(
      '',
      '/assets/', 
      stlName, 
      scene
    );
    
  }
  const highlightMesh = (mesh) => {
    if (!mesh.material) {
      mesh.material = new BABYLON.StandardMaterial('highlightMaterial', scene);
    }
  }


  
const createScene = async function() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.1, 0.2, 0.2);
  scene.createDefaultCameraOrLight(true,false,true);
  scene.activeCamera.position = new BABYLON.Vector3(50, 50, 50); 
  
//gui
const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
const loadedGUI = await advancedTexture.parseFromSnippetAsync("7ID8B3#49");

const addLayerBtn = advancedTexture.getControlByName('addLayerBtn');
const setLayerBtn = advancedTexture.getControlByName('setLayerBtn');
const addDecorationBtn = advancedTexture.getControlByName('addDecorationBtn');
const downloadBtn = advancedTexture.getControlByName('downloadBtn');
const clearBtn = advancedTexture.getControlByName('clearBtn');
const loadBtn = advancedTexture.getControlByName('loadBtn');
const colorPicker = advancedTexture.getControlByName('colorPicker')
const sliderX = advancedTexture.getControlByName('SliderX');
const sliderY = advancedTexture.getControlByName('SliderY');
const sliderZ = advancedTexture.getControlByName('SliderZ');

// wartosci min/max slidera
const minSliderValue = 0; 
const maxSliderValue = 3;
const sliders = [sliderX, sliderY, sliderZ];

sliders.forEach((slider) => {
  slider.minimum = minSliderValue;
  slider.maximum = maxSliderValue;
});
// skalowanie mesha
const updateSliders = (mesh) => {
  if (mesh) {
    sliderX.onValueChangedObservable.add((value) => {
      mesh.scaling.x = value; 
    });

    sliderY.onValueChangedObservable.add((value) => {
      mesh.scaling.y = value;
    });
    
    sliderZ.onValueChangedObservable.add((value) => {
      mesh.scaling.z = value;
    });
    }
}

const addDecoration = () =>{
  console.log('addDec');
}
// wybor mesh, pobieranie danych do modala, przekazuje zaznaczony mesh do skalowania
const handleMouseClickOnMesh = (event) => {

  const pickResult = scene.pick(event.clientX, event.clientY);
    if (pickResult && pickResult.hit) {
      const pickedMesh = pickResult.pickedMesh;
      updateSliders(pickedMesh);
      
      showModal({
        scaling: pickedMesh.scaling,
        rotation: pickedMesh.rotation,
        position: pickedMesh.position,
        name: pickedMesh.name   
      });
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

  const downloadProject = () => {
    console.log('downloadProject')
  }

  
  const removeMesh = () => {
    scene.getMeshByName('stlmesh').dispose()
}
//events
loadBtn.onPointerClickObservable.add(loadMesh);
addLayerBtn.onPointerClickObservable.add(addLayer);
clearBtn.onPointerClickObservable.add(removeMesh);
downloadBtn.onPointerClickObservable.add(downloadProject);
addDecorationBtn.onPointerClickObservable.add(addDecoration);
setLayerBtn.onPointerClickObservable.add(setLayer);
canvas.addEventListener('click', handleMouseClickOnMesh);



              
return scene;
}

const scene = await createScene();

engine.runRenderLoop(function(){
  scene.render();
});

window.addEventListener('resize',function(){
  engine.resize();
});
