/**
 * Gets the local audio stream of the current caller
 * @param callbacks - an object to set the success/error behavior
 * @returns {void}
 */

export const getLocalStream = async () => {
  try {
    const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

    if (window) {
      window.localStream = mediaStream
      window.localAudio.srcObject = mediaStream
      window.localAudio.autoplay = true

      const video = document.querySelector('video')
      if (video) {
        video.srcObject = mediaStream
        video.onloadedmetadata = () => {
          video.play()
        }
      }
    }
  } catch (err) {
    console.error(`Error when getting the user media: ${err}`)
  }
}
