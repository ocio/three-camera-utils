import * as THREE from 'three'

export function radToDeg(rad) {
    return rad * (180 / Math.PI)
}

export function degToRad(deg) {
    return deg * (Math.PI / 180)
}

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
    vertical = controls.getPolarAngle(),
    horizontal = controls.getAzimuthalAngle(),
    distance = camera.position.distanceTo(controls.target),
}) {
    const point = sphericalToCartesian({ vertical, horizontal, distance })
    camera.position.set(
        point.x + controls.target.x,
        point.y + controls.target.y,
        point.z + controls.target.z
    )
    controls.update()
}

// https://gist.github.com/jhermsmeier/72626d5fd79c5875248fd2c1e8162489
export function sphericalToCartesian({ horizontal, vertical, distance = 1 }) {
    const theta = horizontal
    const phi = vertical
    const vector = new THREE.Vector3()
    vector.setFromSphericalCoords(distance, phi, theta)
    return vector
}

export function cartesianToSpherical({ x, y, z }) {
    const sphere = new THREE.Spherical()
    sphere.setFromCartesianCoords(x, y, z)
    return {
        vertical: sphere.phi,
        horizontal: sphere.theta,
        distance: sphere.radius,
    }
}

// https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
export function worldToScreen({ x, y, z, camera, canvasWidth, canvasHeight }) {
    const vector = new THREE.Vector3(x, y, z)
    const widthHalf = canvasWidth / 2
    const heightHalf = canvasHeight / 2

    vector.project(camera)
    const newX = vector.x * widthHalf + widthHalf
    const newY = -(vector.y * heightHalf) + heightHalf

    return { x: newX, y: newY }
}

// https://stackoverflow.com/questions/34660063/threejs-converting-from-screen-2d-coordinate-to-world-3d-coordinate-on-the-cane
// https://discourse.threejs.org/t/convert-screen-2d-to-world-3d-coordiate-system-without-using-raycaster/13739/7
const worldPosition = new THREE.Vector3()
const plane = new THREE.Plane(new THREE.Vector3(0.0, 1.0, 0.0))
export function screenToWorld({ x, y, canvasWidth, canvasHeight, camera }) {
    const raycaster = new THREE.Raycaster()
    const coords = new THREE.Vector3(
        (x / canvasWidth) * 2 - 1,
        -(y / canvasHeight) * 2 + 1,
        0.5
    )
    raycaster.setFromCamera(coords, camera)
    return raycaster.ray.intersectPlane(plane, worldPosition)
}

// https://discourse.threejs.org/t/how-to-limit-pan-in-orbitcontrols-for-orthographiccamera/9061/7
export function createLimitPan({ camera, controls }) {
    const v = new THREE.Vector3()
    const minPan = new THREE.Vector3()
    const maxPan = new THREE.Vector3()
    return ({
        maxX = Infinity,
        minX = -Infinity,
        maxY = Infinity,
        minY = -Infinity,
        maxZ = Infinity,
        minZ = -Infinity,
    }) => {
        minPan.set(minX, minY, minZ)
        maxPan.set(maxX, maxY, maxZ)
        v.copy(controls.target)
        controls.target.clamp(minPan, maxPan)
        v.sub(controls.target)
        camera.position.sub(v)
    }
}
