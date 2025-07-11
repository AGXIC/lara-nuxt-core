import Psd from '@webtoon/psd'
import imageCompression, {
  type Options as CompressionOptions,
} from 'browser-image-compression'

export const isPSDFile = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const uint8Array = new Uint8Array(arrayBuffer.slice(0, 4)) // Read the first 4 bytes

      // Check if the file signature matches "8BPS" (38 42 50 53 in hex)
      const signature = Array.from(uint8Array)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(' ')
        .toUpperCase()

      resolve(signature === '38 42 50 53')
    }

    reader.readAsArrayBuffer(file)
  })
}

export const convertPsdToWebp = async (file: File): Promise<File> => {
  const result = await file.arrayBuffer()
  const psdFile = Psd.parse(result)

  // Create a canvas and render the PSD composite image
  const canvasElement = document.createElement('canvas')
  const context = canvasElement.getContext('2d')
  const compositeBuffer = await psdFile.composite()
  const imageData = new ImageData(
    // @ts-expect-error
    compositeBuffer,
    psdFile.width,
    psdFile.height,
  )

  // Set the canvas dimensions to the PSD file dimensions
  canvasElement.width = psdFile.width
  canvasElement.height = psdFile.height
  context?.putImageData(imageData, 0, 0)

  // Resize the canvas to fit within 400x400 pixels while maintaining aspect ratio
  const maxWidth = 400
  const maxHeight = 400
  let width = psdFile.width
  let height = psdFile.height

  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height

    if (width > height) {
      width = maxWidth
      height = width / aspectRatio
    } else {
      height = maxHeight
      width = height * aspectRatio
    }
  }

  // Create a new canvas for the resized image
  const resizedCanvas = document.createElement('canvas')
  resizedCanvas.width = width
  resizedCanvas.height = height
  const resizedContext = resizedCanvas.getContext('2d')

  // Draw the original canvas onto the resized canvas
  resizedContext?.drawImage(canvasElement, 0, 0, width, height)

  // Convert the resized canvas to a WebP image
  return new Promise((resolve) => {
    resizedCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(
            new File([blob], file.name.replace(/\.psd$/, '.webp'), {
              type: 'image/webp',
            }),
          )
        }
      },
      'image/webp',
      0.8, // Quality (0 to 1)
    )
  })
}

export const compressIfImageBeforeUpload = async (
  file: File,
): Promise<File> => {
  if (file.type.startsWith('image/')) {
    try {
      // Image compression options
      const options: CompressionOptions = {
        maxSizeMB: 0.02,
        maxWidthOrHeight: 400,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8,
      }

      // Compress the image
      const compressedFile = await imageCompression(file, options)

      // Create a new File object from the compressed blob
      return new File([compressedFile], file.name, {
        type: compressedFile.type,
      })
    } catch (error) {
      console.error('Error optimizing image:', error)
      return file // Return the original file if compression fails
    }
  } else {
    return file
  }
}
