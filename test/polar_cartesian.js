const test = require('ava')
const {
    degToRad,
    radToDeg,
    sphericalToCartesian,
    cartesianToSpherical,
} = require('../')

test('Basic', (t) => {
    const angleh = 10
    const anglev = 10
    const horizontal = degToRad(angleh)
    const vertical = degToRad(anglev)
    const cartesian = sphericalToCartesian({ horizontal, vertical })
    const spherical = cartesianToSpherical(cartesian)
    t.is(Math.round(radToDeg(spherical.horizontal)), angleh)
    t.is(Math.round(radToDeg(spherical.vertical)), anglev)
    t.is(Math.round(spherical.distance), 1)
})

test('Basic 2', (t) => {
    const angleh = 181
    const anglev = 180
    const distance = 100
    const horizontal = degToRad(angleh)
    const vertical = degToRad(anglev)
    const cartesian = sphericalToCartesian({ horizontal, vertical, distance })
    const spherical = cartesianToSpherical(cartesian)
    t.is(Math.round(radToDeg(spherical.horizontal)), -179)
    t.is(Math.round(radToDeg(spherical.vertical)), anglev)
    t.is(Math.round(spherical.distance), distance)
})
