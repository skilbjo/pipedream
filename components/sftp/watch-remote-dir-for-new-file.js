const sftpPipedreamApp = require('https://github.com/skilbjo/pipedream/components/sftp/sftp.app.js'); // TODO s/skilbjo/PipedreamHQ/

module.exports = {
  name: "watch a remote directory for a new file",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    sftpPipedreamApp,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    }
  },
  async run(event) {
    const sftp = await src.methods.getClient({
      host: this.$auth.host,
      port: this.$auth.port,
      username: this.$auth.host,
      password: this.$auth.password
    });

    const filesNow = sftpPipedreamApp.list(sftp, '/upload');
    const newFiles = sftpPipedreamApp.filesAddedSinceLastCheckpoint(sftpPipedreamApp.getDbFiles, filesNow);

    sftpPipedreamApp.checkpoint(filesNow);

    newFiles.forEach(file => {
      this.$emit(file);
    })
  }
}
