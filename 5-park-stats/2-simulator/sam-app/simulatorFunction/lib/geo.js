// Returns a geo point within a circle around a point, biased towards the center point.

const getRandomPoint = function (center, radius) {

  // Applies gamma distribution to bias towards center point (instead of random)
  const adjRadius = Math.ceil(radius * (Math.pow(Math.random(), 2)))

  let x0 = center.longitude
  let y0 = center.latitude

  // Convert Radius from meters to degrees.
  let rd = adjRadius/111300;

  let u = Math.random()
  let v = Math.random()

  let w = rd * Math.sqrt(u)
  let t = 2 * Math.PI * v
  let x = w * Math.cos(t)
  let y = w * Math.sin(t)

  let xp = x/Math.cos(y0)

  // Resulting point.
  return {'latitude': y+y0, 'longitude': xp+x0}
}

module.exports = { getRandomPoint }