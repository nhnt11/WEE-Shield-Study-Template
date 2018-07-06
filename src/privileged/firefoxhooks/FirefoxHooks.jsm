const GLOBAL = this;

this.FirefoxHooks = {
  extension: null,

  init(aExtension) {
    this.extension = aExtension;
    Services.scriptloader.loadSubScript(
      this.getURL("privileged/firefoxhooks/Globals.jsm"), GLOBAL);

    AddonManager.addAddonListener(this);
  },

  studyReady(studyInfo) {
    Services.scriptloader.loadSubScript(
      this.getURL("privileged/firefoxhooks/Experiment.jsm"), GLOBAL);
    Experiment.init(studyInfo);
  },

  onUninstalling(addon) {
    this.handleDisableOrUninstall(addon);
  },

  onDisabled(addon) {
    this.handleDisableOrUninstall(addon);
  },

  handleDisableOrUninstall(addon) {
    if (addon.id !== this.extension.id) {
      return;
    }
    Experiment.cleanup();
    AddonManager.removeAddonListener(this);
    // This is needed even for onUninstalling, because it nukes the addon
    // from UI. If we don't do this, the user has a chance to "undo".
    addon.uninstall();
  },

  getURL(aPath) {
    return this.extension.getURL(aPath);
  },

  eventListeners: new Set(),

  addEventListener(aListener) {
    this.eventListeners.add(aListener);
  },

  removeEventListener(aListener) {
    this.eventListeners.delete(aListener);
  },

  notifyEventListeners(payload) {
    if (typeof payload !== "object") {
      payload = { payload };
    }

    for (let cb of this.eventListeners) {
      cb(payload);
    }
  },
};
