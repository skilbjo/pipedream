const sftpPipedreamApp = require('https://github.com/skilbjo/pipedream/components/sftp/sftp.app.js'); // TODO s/skilbjo/PipedreamHQ/

module.exports = {
  name: 'New File in Remote Directory',
  description: 'Emits new file event when a new file is detected in comparison with a prior checkpoint',
  version: '0.0.1',
  props: {
    db: '$.service.db',
    sftpPipedreamApp,
    timer: {
      type: '$.interface.timer',
      default: {
        intervalSeconds: 60 * 5,
      },
    }
  },
  async run(event) {
    const sftp = await src.methods.getClient();

    const filesNow = sftpPipedreamApp.list(sftp, '/upload');
    const newFiles = sftpPipedreamApp.filesAddedSinceLastCheckpoint(sftpPipedreamApp.getDbFiles, filesNow);

    sftpPipedreamApp.checkpoint(filesNow);

    newFiles.forEach(file => {
      this.$emit(file);
    })
  }
}
