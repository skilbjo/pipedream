const fs = require('fs');
const ssh2SftpClient = require('ssh2-sftp-client'); // src: https://github.com/theophilusx/ssh2-sftp-client/blob/master/src/index.js

let sftp = new ssh2SftpClient;

const dst = '/upload';
const sampleFile = 'example-file';

async function loadSampleData() {
  const src = 'dev-resources/test';

  return sftp.uploadDir(src, dst);
};

const setUp = async function(config) {
  await sftp.connect(config);

  return loadSampleData();
};

const tearDown = async function(fileLocal) {
  try {
    fs.unlinkSync(fileLocal);
  } catch {
    // no-op
  }

  await sftp.delete(`${dst}/${sampleFile}`);

  return sftp.end();
};

module.exports = {
  setUp: setUp,
  tearDown: tearDown
}
