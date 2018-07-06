ChromeUtils.defineModuleGetter(this, "Services",
                               "resource://gre/modules/Services.jsm");
ChromeUtils.defineModuleGetter(this, "ExtensionCommon",
                               "resource://gre/modules/ExtensionCommon.jsm");

this.firefoxhooks = class extends ExtensionAPI {
  getAPI(context) {
    let FirefoxHooksContainer = {};
    Services.scriptloader.loadSubScript(
      context.extension.getURL("privileged/firefoxhooks/FirefoxHooks.jsm"),
      FirefoxHooksContainer);

    return {
      firefoxhooks: {
        async setup() {
          FirefoxHooksContainer.FirefoxHooks.init(context.extension);
        },

        onEvent: new ExtensionCommon.EventManager(
          context,
          "firefoxhooks.onEvent",
          (fire) => {
            let listener = (payload) => {
              fire.async(payload);
            };

            FirefoxHooksContainer.FirefoxHooks.addEventListener(listener);

            return () => {
              FirefoxHooksContainer.FirefoxHooks.removeEventListener(listener);
            };
          }).api(),
      },
    };
  }
};
