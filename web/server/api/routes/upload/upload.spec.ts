import { uploadAssetRequest } from './upload';

describe('uploadAssetRequest', () => {
  const baseReq = {
    filename: 'wtf.vox',
    size: 100,
    contentType: 'application/octet-stream',
  } as const;
  it('allows valid filename', () => {
    expect(uploadAssetRequest.parse({ ...baseReq, filename: 'valid.vox' })).toBeTruthy();
    expect(uploadAssetRequest.parse({ ...baseReq, filename: 'escaped%20.vox' })).toBeTruthy();
  });

  it('rejects invalid filename', () => {
    expect(() => uploadAssetRequest.parse({ ...baseReq, filename: '一not escaped' })).toThrowError();
    expect(() => uploadAssetRequest.parse({ ...baseReq, filename: '\\backslash' })).toThrowError();
    expect(() => uploadAssetRequest.parse({ ...baseReq, filename: '/slash' })).toThrowError();
  });
});
