this.FirefoxHooks = {
  init() {
    AddonManager.addAddonListener(this);
  },

  async studyReady(studyInfo) {
    await this.setupStrings();
    await Experiment.init(studyInfo);
  },

  stringBundle: null,
  async setupStrings() {
    /*
     * We can't just use Services.strings.createBundle(gExtension.getURL("bla")).
     * This is because bundles whitelist local URI schemes but don't consider
     * moz-extension:// worthy enough. ;)
     * The workaround here is to read the file manually and make a data URI
     * out of it for createBundle - this is allowed.
     */

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

  onUninstalling(addon) {
    this.handleDisableOrUninstall(addon);
  },

  onDisabled(addon) {
    this.handleDisableOrUninstall(addon);
  },

  async handleDisableOrUninstall(addon) {
    if (addon.id !== gExtension.id) {
      return;
    }
    await Experiment.cleanup();
    AddonManager.removeAddonListener(this);
    // This is needed even for onUninstalling, because it nukes the addon
    // from UI. If we don't do this, the user has a chance to "undo".
    addon.uninstall();
  },

  eventListeners: new Set(),

  addEventListener(aListener) {
    this.eventListeners.add(aListener);
  },

  removeEventListener(aListener) {
    this.eventListeners.delete(aListener);
  },

  async notifyEventListeners(payload) {
    if (typeof payload !== "object") {
      payload = { payload };
    }

    for (let cb of this.eventListeners) {
      await cb(payload);
    }
  },
};
