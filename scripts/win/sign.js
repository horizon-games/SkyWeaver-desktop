exports.default = async function (configuration) {
  // do not include passwords or other sensitive data in the file
  // rather create environment variables with sensitive data
  const CERTIFICATE_NAME = process.env.WINDOWS_SIGN_CERTIFICATE_NAME;
  const TOKEN_PASSWORD = process.env.WINDOWS_SIGN_TOKEN_PASSWORD;

  require("child_process").execSync(
    `your command here ${CERTIFICATE_NAME} ${TOKEN_PASSWORD}`,
    {
      stdio: "inherit"
    }
  );
};
