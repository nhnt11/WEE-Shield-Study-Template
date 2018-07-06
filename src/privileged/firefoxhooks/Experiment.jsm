this.Experiment = {
  setup() {
    // Called the first time the study is setup - so only once.
  },

  init(studyInfo) {
    // Called every time the add-on is loaded.
    if (studyInfo.isFirstRun) {
      this.setup();
    }
  },

  cleanup() {
    // Called when the add-on is being removed for any reason.
  },

  sendTelemetry(payload) {
    FirefoxHooks.notifyEventListeners(payload);
  },
};
