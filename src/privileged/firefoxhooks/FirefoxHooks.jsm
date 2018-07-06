this.FirefoxHooks = {
  init() {
    AddonManager.addAddonListener(this);
  },

  async studyReady(studyInfo) {
    await Experiment.init(studyInfo);
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
