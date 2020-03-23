const RAD2DEG = 180 / Math.PI
const DEG2RAD = Math.PI / 180

export function changePosition({ x, z, camera, controls }) {
    const diffX = controls.target.x - x
    const diffZ = controls.target.z - z
    controls.target.setX(x)
    controls.target.setZ(z)
    camera.position.setX(camera.position.x - diffX)
    camera.position.setZ(camera.position.z - diffZ)
}

export function changeRotation({
    camera,
    controls,
    angleV = controls.getPolarAngle() * RAD2DEG,
    angleH = controls.getAzimuthalAngle() * RAD2DEG,
    distance = camera.position.distanceTo(controls.target)
}) {
    const point = polarToCartesian(angleV, angleH, distance)
    camera.position.set(
        point.x + controls.target.x,
        point.y + controls.target.y,
        point.z + controls.target.z
    )
    controls.update()
}

// https://discourse.threejs.org/t/how-to-limit-pan-in-orbitcontrols-for-orthographiccamera/9061/7
export function createLimitPan({ camera, controls, THREE }) {
    const v = new THREE.Vector3()
    const minPan = new THREE.Vector3()
    const maxPan = new THREE.Vector3()
    return ({
        maxX = Infinity,
        minX = -Infinity,
        maxY = Infinity,
        minY = -Infinity,
        maxZ = Infinity,
        minZ = -Infinity
    }) => {
        minPan.set(minX, minY, minZ)
        maxPan.set(maxX, maxY, maxZ)
        v.copy(controls.target)
        controls.target.clamp(minPan, maxPan)
        v.sub(controls.target)
        camera.position.sub(v)
    }

    // // State
    // let positionX
    // let positionZ
    // let phi
    // let theta
    // return ({
    //     maxX = Infinity,
    //     minX = -Infinity,
    //     maxZ = Infinity,
    //     minZ = -Infinity
    // }) => {
    //     const x = controls.target.x
    //     const z = controls.target.z
    //     let shallWeUpdateAngle = false
    //     if (x < minX || x > maxX) {
    //         controls.target.setX(x < minX ? minX : maxX)
    //         camera.position.setX(positionX)
    //         shallWeUpdateAngle = true
    //     }
    //     if (z < minZ || z > maxZ) {
    //         controls.target.setZ(z < minZ ? minZ : maxZ)
    //         camera.position.setZ(positionZ)
    //         shallWeUpdateAngle = true
    //     }
    //     if (shallWeUpdateAngle) {
    //         const distance = camera.position.distanceTo(controls.target)
    //         camera.position.set(
    //             distance * Math.sin(phi) * Math.sin(theta) + controls.target.x,
    //             distance * Math.cos(phi) + controls.target.y,
    //             distance * Math.sin(phi) * Math.cos(theta) + controls.target.z
    //         )
    //     }
    //     // Updating state
    //     positionX = camera.position.x
    //     positionZ = camera.position.z
    //     phi = controls.getPolarAngle()
    //     theta = controls.getAzimuthalAngle()
    // }
}

// https://gist.github.com/jhermsmeier/72626d5fd79c5875248fd2c1e8162489
export function polarToCartesian(angleV, angleH, radius) {
    const phi = angleV * DEG2RAD
    const theta = angleH * DEG2RAD
    return {
        x: radius * Math.sin(phi) * Math.sin(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.cos(theta)
    }
}

// https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
export function worldToScreen({
    x,
    y,
    z,
    camera,
    canvasWidth,
    canvasHeight,
    THREE
}) {
    const vector = new THREE.Vector3(x, y, z)
    const widthHalf = canvasWidth / 2
    const heightHalf = canvasHeight / 2

    vector.project(camera)
    const newX = vector.x * widthHalf + widthHalf
    const newY = -(vector.y * heightHalf) + heightHalf

    return { x: newX, y: newY }
}

// https://stackoverflow.com/questions/34660063/threejs-converting-from-screen-2d-coordinate-to-world-3d-coordinate-on-the-cane
export function screenToWorld({
    x,
    y,
    camera,
    canvasWidth,
    canvasHeight,
    objects,
    THREE
}) {
    const mouse = new THREE.Vector3(
        (x / canvasWidth) * 2 - 1, //x
        -(y / canvasHeight) * 2 + 1, //y
        0.5
    )

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objects)

    return intersects
}
