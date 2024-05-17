import formidable from 'formidable'

export const FormidableError = formidable.errors.FormidableError

export const parseForm = async (): Promise<{
  fields: formidable.Fields
  files: formidable.Files
}> => {
  return new Promise((resolve) => {
    resolve({
      files: {},
      fields: {},
    })
  })
}
