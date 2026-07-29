import { InMemoryAttachmentRepository } from '@/test/repositories/in-memory-attachment-repository'
import { FakeUploader } from '@/test/storage/fake-uploader'
import { describe, it } from 'vitest'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
  beforeEach(() => {
    fakeUploader = new FakeUploader()
    inMemoryAttachmentsRepository = new InMemoryAttachmentRepository()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload a and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'teste.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({ fileName: 'teste.jpg' }),
    )
  })
})
