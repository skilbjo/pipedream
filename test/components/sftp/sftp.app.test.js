const fs = require('fs');
const os = require('os');

const f = require('./fixtures/fixtures');
const src = require('./../../../components/sftp/sftp.app');

const sftpHost = os.platform() === 'darwin' ? '192.168.99.100' : 'localhost'

const sftpConfig = {
  host: sftpHost,
  port: 2222,
  username: 'dev',
  password: 'pass'
};

const fileLocal = './example-file'


describe('schema shape validation', () => {
  beforeEach(async () => {
    await f.setUp(sftpConfig);
  });

  afterEach(async () => {
    await f.tearDown(fileLocal);
  });

  it('will list files of the sftp server', async () => {
    const expected = ['example-file'];

    const sftp = await src.methods.getClient(sftpConfig);
    const actual = await src.methods.list(sftp, '/upload');

    expect(actual).toStrictEqual(expected);
  });

  it('can download files locally', async () => {
    const fileRemote = '/upload/example-file';
    const expected = 'hello world';

    expect(fs.existsSync(fileLocal)).toBe(false);

    const sftp = await src.methods.getClient(sftpConfig);
    await src.methods.get(sftp, fileRemote, fileLocal);

    expect(fs.existsSync(fileLocal)).toBe(true);
    const actual = fs.readFileSync(fileLocal, 'utf-8').trim()

    expect(actual).toEqual(expected);
  });

  it('will return the new files since last checkpoint', async () => {
    dbFiles = [];
    const expected = ['example-file'];

    const sftp = await src.methods.getClient(sftpConfig);
    const nowFiles = await src.methods.list(sftp, '/upload');

    const actual = src.methods.filesAddedSinceLastCheckpoint(dbFiles, nowFiles);

    expect(actual).toEqual(expected);
  });
});
