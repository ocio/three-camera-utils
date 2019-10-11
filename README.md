## Install

`npm i @ocio/three-camera-utils`

## Example

```js
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import {
    changeRotation,
    changePosition,
    createLimitPan,
} from '@ocio/three-camera-utils'

const camera = new THREE.PerspectiveCamera(
    fov: 10,
    window.innerWidth / window.innerHeight,
    near: 1,
    far: 9999
)
const controls = new OrbitControls(camera, renderer.domElement);

// changeRotation
changeRotation({ angleV: 45, angleH: 45, distance:100, controls, camera });

// changePosition
changePosition({ x: 0, z: 0, camera, controls })

// limitPan
const limitPan = createLimitPan({ camera, controls });
controls.addEventListener("change", e => {
  limitPan({ maxX: 25, maxZ: 25 });
});
```

## Demo

https://codesandbox.io/s/funny-bhabha-kjyfw
