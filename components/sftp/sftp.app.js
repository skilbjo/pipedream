const ssh2SftpClient = require('ssh2-sftp-client');

module.exports = {
  type: "app",
  app: "sftp",
  props: {
    db: "$.service.db"
  },
  methods: {
    async getClient(deps) {
      const sftp = new ssh2SftpClient();

      // dependency injection for integration tests
      const config = {
        host: deps.host || this.$auth.host,
        port: deps.port || this.$auth.port,
        username: deps.username || this.$auth.username,
        password: deps.password || this.$auth.password
      }

      await sftp.connect(config);

      return sftp;
    },
    async cwd(sftp) {
      return sftp.cwd();
    },
    async list(sftp, remoteDir) {
      const listOfFilesOrDirs = await sftp.list(remoteDir)

      return listOfFilesOrDirs.map(fileOrDir => fileOrDir.name);
    },
    checkpoint(files) {
      return this.db.set('files',files);
    },
    getDbFiles() {
      return this.db.get('files');
    },
    filesAddedSinceLastCheckpoint(dbFiles, nowFiles) {
      return nowFiles.filter(file => !dbFiles.includes(file));
    },
    async get(sftp, remotePath, localPath) {
      const fs = require('fs');

      const dst = fs.createWriteStream(localPath);

      return sftp.get(remotePath, dst);
    },
    async end(sftp) {
      return sftp.end();
    }
  }
};
