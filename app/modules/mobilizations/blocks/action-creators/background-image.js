import c from '../../../mobilizations/blocks/constants'

export const setBackgroundImageUploading = uploading =>
  ({ type: c.BLOCK_BACKGROUND_IMAGE_UPLOADING, uploading })

export const setBackgroundImageUploaded = image =>
  ({ type: c.BLOCK_BACKGROUND_IMAGE_UPLOADED, image })
