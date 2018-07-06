let gEventListener = async function(payload) {
  console.log(payload);
};

async function init() {
  browser.study.onReady.addListener(async (studyInfo) => {
    browser.firefoxhooks.onEvent.addListener(gEventListener);
    browser.firefoxhooks.setup();
  });

  browser.study.onEndStudy.addListener(async (ending) => {
    for (const url of ending.urls) {
      await browser.tabs.create({ url });
    }
    browser.management.uninstallSelf();
  });

  await browser.study.setup({
    allowEnroll: true,
    activeExperimentName: browser.runtime.id,
    studyType: "shield",
    telemetry: {
      send: true,
      removeTestingFlag: false,
    },
    weightedVariations: [
      {
        name: "",
        weight: 1,
      },
    ],
    endings: {
      "user-disable": {
        baseUrls: [
          "https://qsurvey.mozilla.com/s3/Shield-Study-Example-Survey/?reason=user-disable",
        ],
      },
      expired: {
        baseUrls: [
          "https://qsurvey.mozilla.com/s3/Shield-Study-Example-Survey/?reason=expired",
        ],
      },
    },
    expire: {
      days: 14,
    },
  });
}

init();
