# 3D Printer and Forklift Simulation

This interactive 3D simulation demonstrates a basic manufacturing and logistics system using Three.js. It includes a **3D printer**, **forklift**, **shelve**, and multiple **camera views**. You can interact with the simulation using keyboard controls and a GUI menu.

---

## 📦 Features

### 🖨️ 3D Printer

* The printer head **ascends gradually** as the model is generated layer by layer.
* Models are created using **Bezier or Catmull-Rom curves**.
* Supports two types of surface generation:

  * **Revolution surface**
  * **Sweep (extrusion) surface**
* The base mesh is generated incrementally and aligned with an invisible Three.js plane.

### 🚜 Forklift

* Operated with the keyboard.
* Can **pick up** and **drop objects** when close enough.
* Carried objects become part of the forklift group and move with it.
* Fork height is adjustable.
* **Wheels rotate** during movement and steering.
* Two more cars are available, Forklift and Zonda

### 🗄️ Shelves

* By default contains **2 levels** with **8 positions**, each with a small intermediary platform.
* Objects can be placed on shelves using a proximity-based system.

### 🎥 Cameras

Multiple cameras offer different perspectives:

| Key | Camera Type                                |
| --- | ------------------------------------------ |
| `1` | Orbital – general overview of the scene    |
| `2` | Orbital – focused on the 3D printer        |
| `3` | Orbital – focused on the shelf             |
| `4` | Driver View – first-person forklift camera |
| `5` | Follow Camera – behind the vehicle         |
| `6` | Side Camera – lateral vehicle follow view  |

---

## 🎮 Controls

### Vehicle Movement

| Key | Action                     |
| --- | -------------------------- |
| `W` | Move forward               |
| `S` | Move backward              |
| `A` | Rotate left                |
| `D` | Rotate right               |
| `Q` | Raise fork (forklift only) |
| `E` | Lower fork (forklift only) |
| `G` | Grab or release object     |

### Vehicle Switching

| Key | Action             |
| --- | ------------------ |
| `F` | Switch to Forklift |
| `Z` | Switch to Zonda    |

### Camera Zoom

| Key | Action             |
| --- | ------------------ |
| `O` | Zoom in (orbital)  |
| `P` | Zoom out (orbital) |
| `K` | Special zoom in    |
| `L` | Special zoom out   |

---

## ⚙️ GUI Menu Options

The scene includes a graphical menu to configure the 3D model generation:

* **Surface Type**

  * Revolution
  * Sweep (extrusion)
* **2D Shape for Revolution**

  * Options: A1, A2, A3, A4
* **2D Shape for Sweep**

  * Options: B1, B2, B3, B4
* **Twist Angle**

  * Applies rotational twisting to the model during generation.
* **Total Height**

  * Height of the printed element, must be less than the shelf height.
* **Total Width**

  * Width of the printer element.
* **Gen Steps**

  * Controls the number of segments in the surface generation.
* **Curve Steps**

  * Sets the number of samples used when drawing the curve.

---

## 🛠️ Dependencies

* [Three.js](https://threejs.org/)

---

## Improvements

* Use Delanauy triangulation with random points on the lid for the caps
Una triangulación de Delaunay es una forma específica de dividir un conjunto de puntos en triángulos que cumple con una propiedad clave: la circunferencia circunscrita de cada triángulo no debe contener ningún otro punto del conjunto dentro de ella. En otras palabras, la triangulación de Delaunay busca minimizar el número de ángulos muy agudos o obtusos en la red de triángulos

* Also voromoi: Un diagrama de Voronoi, también conocido como teselación de Dirichlet o polígonos de Thiessen, es una herramienta matemática que divide un plano en regiones basadas en la cercanía a un conjunto de puntos. Cada región, o celda de Voronoi, contiene todos los puntos del plano que están más cerca de su punto central que de cualquier otro punto del conjunto

* Add how to run to readme

* Add textures

* Add lights
