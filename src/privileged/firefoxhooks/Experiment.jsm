this.Experiment = {
  async setup() {
    // Called the first time the study is setup - so only once.
  },

  async init(studyInfo) {
    // Called every time the add-on is loaded.
    if (studyInfo.isFirstRun) {
      this.setup();
    }
    await this.setupStrings();
  },

  async cleanup() {
    // Called when the add-on is being removed for any reason.
  },

  stringBundle: null,
  async setupStrings() {
    let response;
    try {
      response = await fetch(gExtension.getURL(`locales/${AppConstants.INSTALL_LOCALE}/strings.properties`));
    } catch (e) {
      Cu.reportError("Couldn't load string bundle for runtime locale, falling back to en-US...");
      try {
        response = await fetch(gExtension.getURL(`locales/en-US/strings.properties`));
      } catch (e2) {
        Cu.reportError(e2);
      }
    }
    if (!response) {
      return;
    }

    let buffer = await response.arrayBuffer();
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const dataURI = `data:text/plain;base64,${btoa(binary)}`;

    this.stringBundle = Services.strings.createBundle(dataURI);
  },

  getString(aKey) {
    return this.stringBundle.GetStringFromName(aKey);
  },

  getFormattedString(aKey, args) {
    return this.stringBundle.formatStringFromName(aKey, args, args.length);
  },

  async sendTelemetry(payload) {
    await FirefoxHooks.notifyEventListeners(payload);
  },
};
