module.exports = {
  type: "app",
  app: "sftp",
  props: {
    db: "$.service.db"
  },
  methods: {
    config: {
      host: null,
      port: null,
      username: null,
      password: null,
    },
    async getClient(deps) {
      const ssh2SftpClient = require('ssh2-sftp-client'); // src: https://github.com/theophilusx/ssh2-sftp-client/blob/master/src/index.js
      const sftp = new ssh2SftpClient();

      // dependency injection for integration tests
      if (deps) {
        this.config.host = deps.host;
        this.config.port = deps.port;
        this.config.username = deps.username;
        this.config.password = deps.password;
      }

      // production - how auth is set
      if (this.$auth && this.$auth.host) {
        this.config.host = this.$auth.host;
        this.config.port = this.$auth.port;
        this.config.username = this.$auth.username;
        this.config.password = this.$auth.password;
      }

      await sftp.connect(this.config);

      return sftp;
    },
    async cwd() {
      const sftp = await this.getClient();

      return sftp.cwd();
    },
    async list(sftp, remoteDir) {
      const listOfFilesOrDirs = await sftp.list(remoteDir)

      return listOfFilesOrDirs.map(fileOrDir => {
        return fileOrDir.name;
      });
    },
    checkpoint(files) {
      return this.db.set('files',files); // TODO @dylan, is this an async call?
    },
    getDbFiles() {
      return this.db.get('files'); // TODO @dylan, is this an async call?
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
