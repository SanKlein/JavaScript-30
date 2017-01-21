const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  console.log(navigator.mediaDevices)
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      console.log(localMediaStream)
      video.src = window.URL.createObjectURL(localMediaStream)
      video.play()
    })
    .catch(err => {
      console.error('OH NO!!!', err)
    })
}

function paintToCanavas() {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    let pixels = ctx.getImageData(0, 0, width, height)
    //pixels = redEffect(pixels)
    pixels = rgbSplit(pixels)
    ctx.globalAlpha = 0.1
    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

function takePhoto() {
  snap.currentTime = 0
  snap.play()

  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download', 'handsome')
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`
  strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixel.data[i + 0] + 100 // red
    pixels.data[i + 1] = pixel.data[i + 1] - 50 // green
    pixels.data[i + 2] = pixel.data[i + 2] * 0.5 // blue
  }
  return pixels
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 550] = pixel.data[i + 0] // red
    pixels.data[i + 100] = pixel.data[i + 1] // green
    pixels.data[i - 550] = pixel.data[i + 2] // blue
  }
  return pixels
}

function greenScreen(pixels) {
  const levels = {}

  [...document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value
  })]
  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0]
    green = pixels.data[i + 1]
    blue = pixels.data[i + 2]
    alpha = pixels.data[i + 3]

    if (red >= levels.rmin && green >= levels.gmin && blue >= levels.bmin && red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax) {
      pixels.data[i + 3] = 0
    }
  }
  return pixels
}

getVideo()

video.addEventListener('canplay', paintToCanavas)
