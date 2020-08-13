const aws = require("https://github.com/PipedreamHQ/pipedream/components/aws/aws.app.js");
const axios = require("axios");

module.exports = {
  name: "DynamoDB Streams Handler",
  version: "0.0.1",
  props: {
    region: {
      label: "AWS Region",
      description: "The AWS region string where you configured your DynamDB stream",
      type: "string",
      default: "us-east-1"
    },
    aws,
    },
  },
  hooks: {
    async activate() {},
    async deactivate() {}
  },
  dedupe: '',
  async run(event) {
    this.$emit()
  }
};
