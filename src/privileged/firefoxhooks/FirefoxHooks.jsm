ChromeUtils.defineModuleGetter(this, "AddonManager",
                               "resource://gre/modules/AddonManager.jsm");

this.FirefoxHooks = {
  extension: null,

  init(aExtension) {
    this.extension = aExtension;

    AddonManager.addAddonListener(this);
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

  notifyEventListeners(payload) {
    if (typeof payload !== "object") {
      payload = { payload };
    }

    for (let cb of this.eventListeners) {
      cb(payload);
    }
  },
};
