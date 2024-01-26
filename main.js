import * as BABYLON from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import * as GUI from "@babylonjs/gui/2D";
import "@babylonjs/loaders/STL";
import { StandardMaterial } from "babylonjs";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let jsonData,
  stlName = "cake.stl",
  meshParams = {};

const addLayer = async (type) => {
  let requestData = { color: "0xFF00FF", type: type };
  await fetch("http://localhost:8888/add/layer", {
    method: "POST",
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((json) => {
      jsonData = json;
    })
    .catch((error) => {
      console.error("Wystąpił błąd:", error);
    });
  const jsonDataString = JSON.stringify(jsonData);
  const valuesArray = Object.values(JSON.parse(jsonDataString));

  const objDataURL = "data:;base64," + valuesArray;
  const object = await BABYLON.SceneLoader.Append(
    "",
    objDataURL,
    scene,
    (scene) => {
      const object = scene.getMeshByName('stlmesh');
      if (object) {
        object.position.y = 20;
      } else {
        console.error("Nie znaleziono siatki o nazwie 'stl' w załadowanej scenie.");
      }
    },
    undefined,
    undefined,
    ".stl"
  );
 
  


  
 
};

// dane mesha
const getMeshData = (meshData) => {
  meshParams = {
    scale: {
      x: meshData.scaling.x,
      y: meshData.scaling.y,
      z: meshData.scaling.z,
    },
    rotation: {
      x: meshData.rotation.x,
      y: meshData.rotation.y,
      z: meshData.rotation.z,
    },
    position: {
      x: meshData.position.x,
      y: meshData.position.y,
      z: meshData.position.z,
    },
    name: meshData.name,
    color: meshData.color,
  };
};

const setLayer = (meshData) => {
  const jsonString = JSON.stringify(meshParams);
  console.log(meshParams);
  console.log(jsonString);
};

//laduje z pliku mesh
const loadMesh = () => {
  BABYLON.SceneLoader.Append(
    "/assets/",  
    "candle.stl", 
    scene,
    (scene) => {
      const object = scene.getMeshByName('stlmesh');
      if (object) {
        object.position.y = 20;
      } else {
        console.error("Nie znaleziono siatki o nazwie 'stl' w załadowanej scenie.");
      }
    }
  );
};

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.1, 0.2, 0.2);
  scene.createDefaultCameraOrLight(true, false, true);
  scene.activeCamera.position = new BABYLON.Vector3(50, 50, 50);

  const pointLight = new BABYLON.PointLight(
    "pointLight",
    new BABYLON.Vector3(-40, 100, -25),
    scene
  );
  pointLight.intensity = 1;

  // table object
  BABYLON.SceneLoader.ImportMesh(
    "",
    "assets/",
    "table.stl",
    scene,
    function (newMeshes) {
      let loadedMesh = newMeshes[0];
      loadedMesh.name="tablee";
      loadedMesh.scaling = new BABYLON.Vector3(40, 15, 40);
      loadedMesh.position = new BABYLON.Vector3(5, -13, 9);
      const material = new BABYLON.StandardMaterial("material", scene);
      material.diffuseTexture = new BABYLON.Texture(
        "assets/texture.jpg",
        scene
      );
      loadedMesh.material = material;
    }
  );

  //gui
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    "GUI",
    true,
    scene
  );
  const loadedGUI = await advancedTexture.parseFromSnippetAsync("7ID8B3#63");
  const addBoxBtn = advancedTexture.getControlByName("addBoxBtn");
  const addTorusBtn = advancedTexture.getControlByName("addTorusBtn");
  const scaleBtn = advancedTexture.getControlByName("scaleBtn");
  const moveBtn = advancedTexture.getControlByName("moveBtn");
  // const addLayerBtn = advancedTexture.getControlByName('addLayerBtn')
  const addCylinderBtn = advancedTexture.getControlByName("addCylinderBtn");
  const setLayerBtn = advancedTexture.getControlByName("setLayerBtn");
  const addDecorationBtn = advancedTexture.getControlByName("addDecorationBtn");
  const makeDec = advancedTexture.getControlByName('makeDec')
  const roundBtn = advancedTexture.getControlByName("roundBtn");
  const downloadBtn = advancedTexture.getControlByName("downloadBtn");
  const clearBtn = advancedTexture.getControlByName("clearBtn");
  const loadBtn = advancedTexture.getControlByName("loadBtn");
  const colorPicker = advancedTexture.getControlByName("colorPicker");
  const sliderX = advancedTexture.getControlByName("SliderX");
  const sliderY = advancedTexture.getControlByName("SliderY");
  const sliderZ = advancedTexture.getControlByName("SliderZ");

  // wartosci min/max slidera
  const minSliderValue = 0;
  const maxSliderValue = 3;
  const sliders = [sliderX, sliderY, sliderZ];

  sliders.forEach((slider) => {
    slider.minimum = minSliderValue;
    slider.maximum = maxSliderValue;
  });

  //skalowanie mesha
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
  };

  const addDecoration = () => {
    console.log("addDec");
  };

  const roundCorners = async() => {

    let prevId = meshParams.name;
    let requestData = { id: prevId };
    await fetch("http://localhost:8888/round/layer", {
      method: "POST",
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((json) => {
        jsonData = json;
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });
    const jsonDataString = JSON.stringify(jsonData);
    const valuesArray = Object.values(JSON.parse(jsonDataString));
  
    const objDataURL = "data:;base64," + valuesArray;
    const object = BABYLON.SceneLoader.Append(
      "",
      objDataURL,
      scene,
      (scene) => {
      scene.getMeshByName("stlmesh").position.x = meshParams.position.x;
      scene.getMeshByName("stlmesh").position.y = meshParams.position.y;
      scene.getMeshByName("stlmesh").position.z = meshParams.position.z;
      scene.getMeshByName("stlmesh").name = prevId;
    },
      undefined,
      undefined,
      ".stl"
    );
    removeMesh(prevId);
    console.log("roundcorners");
  };

  let meshId = 1000;
  const assignMeshName = (mesh) => {
    if (mesh.name === "stlmesh") {
      mesh.name = meshId;
      meshId++;
    }
  };

  const showModal = (meshData) => {
    // Utwórz modal
    const modal = document.createElement("div");
    modal.className = "modal";
    document.body.appendChild(modal);
    let i;
    // Utwórz pola tekstowe dla X, Y, Z
    for (i = 0; i < 4; i++) {
      const input = createTextField(`input${i}`, "X,Y,Z ");
      modal.appendChild(input);
    }

    const addButton = document.createElement("button");
    addButton.textContent = "Dodaj pole";
    addButton.addEventListener("click", () => {
      const newField = createTextField(
        `input${modal.children.length}`,
        "X,Y,Z "
      );
      modal.insertBefore(newField, addButton);
    });
    modal.appendChild(addButton);
    // Utwórz przycisk "Pobierz wartości"
    const getValuesButton = document.createElement("button");
    getValuesButton.textContent = "Pobierz wartości";
    getValuesButton.addEventListener("click", async () => {
      const inputValues = getModalInputValues(modal);

      let requestData = { points: JSON.parse(inputValues)['values']  };
      await fetch("http://localhost:8888/create/from/points", {
        method: "POST",
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((json) => {
          jsonData = json;
        })
        .catch((error) => {
          console.error("Wystąpił błąd:", error);
        });
      const jsonDataString = JSON.stringify(jsonData);
      const valuesArray = Object.values(JSON.parse(jsonDataString));
    
      const objDataURL = "data:;base64," + valuesArray;
      const object = BABYLON.SceneLoader.Append(
        "",
        objDataURL,
        scene,
        undefined,
        undefined,
        undefined,
        ".stl"
      );
      console.log("Wartości z inputów:", inputValues);
    });
    getValuesButton.addEventListener('click', () => closeModal(modal));
    modal.appendChild(getValuesButton);
    
  };

  const closeModal = (modal) => {
    document.body.removeChild(modal);
  };

  // Funkcja pomocnicza do tworzenia pól tekstowych
  const createTextField = (id, label) => {
    const container = document.createElement("div");

    // Utwórz etykietę
    const labelElement = document.createElement("label");
    labelElement.textContent = label;
    container.appendChild(labelElement);

    // Utwórz pole tekstowe
    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    container.appendChild(input);

    return container;
  };

  // Funkcja pomocnicza do pobierania wartości z inputów w modalu
  const getModalInputValues = (modal) => {
    const inputValues = [];
    const inputElements = modal.querySelectorAll("input[type='text']");

    inputElements.forEach((input) => {
      inputValues.push(input.value);
    });

    // Utwórz obiekt JSON z tablicą wartości
    const jsonObject = {
      values: inputValues,
    };

    // Zamień obiekt JSON na tekst JSON
    const jsonString = JSON.stringify(jsonObject);

    // Wyświetl tekst JSON w konsoli
    console.log("Wartości z inputów (JSON):", jsonString);

    return jsonString;
  };

  // wybor mesh, pobieranie danych do modala, przekazuje zaznaczony mesh do skalowania
  let pickedMesh = null,
    selectedMesh;

  const handleMouseClickOnMesh = (event) => {
    const pickResult = scene.pick(event.clientX, event.clientY);
    if (pickResult && pickResult.hit) {
      pickedMesh = pickResult.pickedMesh;
      console.log(pickedMesh.name)
      updateSliders(pickedMesh);
      assignMeshName(pickedMesh);
      // dodaj material
      if (!pickedMesh.material) {
        pickedMesh.material = new BABYLON.StandardMaterial(
          "standardMaterial",
          scene
        );
      }
      selectedMesh = pickedMesh;

      getMeshData({
        scaling: pickedMesh.scaling,
        rotation: pickedMesh.rotation,
        position: pickedMesh.position,
        name: pickedMesh.name,
        color:
          pickedMesh.material && pickedMesh.material.diffuseColor
            ? pickedMesh.material.diffuseColor
            : null,
      });

      const meshName = pickedMesh.name;
      console.log("Mesh name: " + meshName);
    }
  };

  const removeMesh = () => {
    if (pickedMesh) {
      const meshToRemove = scene.getMeshByName(pickedMesh.name);
      if (meshToRemove) {
        console.log(pickedMesh.name);
        meshToRemove.dispose();
        pickedMesh = null;
      } else {
        console.log(`Mesh "${pickedMesh.name}" nie znaleziono.`);
      }
    } else {
      console.log("Nie zaznaczono mesh.");
    }
  };

  const downloadProject = async() => {


    let requestData = {   };
    await fetch("http://localhost:8888/project/save", {
      method: "POST",
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((json) => {
        jsonData = json;
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });


    const jsonDataString = JSON.stringify(jsonData);
    const blob = new Blob([jsonDataString], { type: 'text/plain' });

    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'projectData.txt';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log("downloadProject");
    console.log(jsonDataString);
    
    
  };

  
  
  setLayerBtn.onPointerClickObservable.add(setLayer);
  // scaleBtn.onPointerClickObservable.add(scaleGizmo);
  // moveBtn.onPointerClickObservable.add(moveGizmo);
  // addLayerBtn.onPointerClickObservable.add(addLayer);
  addBoxBtn.onPointerClickObservable.add(() => addLayer("box"));
  addTorusBtn.onPointerClickObservable.add(() => addLayer("torus"));
  addCylinderBtn.onPointerClickObservable.add(() => addLayer("cylinder"));
  addDecorationBtn.onPointerClickObservable.add(loadMesh);
  makeDec.onPointerClickObservable.add(showModal)
  roundBtn.onPointerClickObservable.add(roundCorners);
  clearBtn.onPointerClickObservable.add(removeMesh);
  downloadBtn.onPointerClickObservable.add(downloadProject);

  colorPicker.onValueChangedObservable.add((value) => {
    if (selectedMesh) {
      // ustaw kolor mesha
      selectedMesh.material.diffuseColor = new BABYLON.Color3(
        value.r,
        value.g,
        value.b
      );
    }
  });
  canvas.addEventListener("click", handleMouseClickOnMesh);
  return scene;
};

const scene = await createScene();

const gizmoManager = new BABYLON.GizmoManager(scene);
gizmoManager.positionGizmoEnabled = true;
gizmoManager.rotationGizmoEnabled = false;
gizmoManager.scaleGizmoEnabled = true;
gizmoManager.updateGizmoRotationToMatchAttachedMesh = false;

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
