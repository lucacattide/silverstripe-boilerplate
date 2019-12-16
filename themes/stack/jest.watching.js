/**
 * @description Watching test class
 * Enable hooks on Jest running
 * @author Luca Cattide
 * @date 2019-06-20
 * @class TestWatchPlugin
 */
class TestWatchPlugin {
  /**
   * @description Add hooks to Jest lifecycle events
   * @author Luca Cattide
   * @date 2019-06-27
   * @param {*} jestHooks
   * @memberof TestWatchPlugin
   */
  apply(jestHooks) {
    // Defines if a test must be executed or not
    /* jestHooks.shouldRunTestSuite((testPath) => {
      return Promise.resolve(testPath.includes('fetch'));
    }); */
    // On test complete pass the result
    jestHooks.onTestRunComplete((results) => {
      this._hasSnapshotFailure = results.snapshot.failure;
    });
    // On every Filesystem change
    jestHooks.onFileChange(({
      projects,
    }) => {
      this._projects = projects;
    });
  }

  /**
   * @description Get the prompt information for interactive plugins
   * @author Luca Cattide
   * @date 2019-06-27
   * @param {*} globalConfig
   * @return {*}
   * @memberof TestWatchPlugin
   */
  getUsageInfo(globalConfig) {
    // Edit the user menu
    return {
      key: 'd',
      prompt: 'Data fetching test',
    };
  }

  /**
   * @description Executed when the key from `getUsageInfo` is input
   * @author Luca Cattide
   * @date 2019-06-27
   * @param {*} globalConfig
   * @param {*} updateConfigAndRun
   * @memberof TestWatchPlugin
   */
  run(globalConfig, updateConfigAndRun) {
    // Executes the setted actions
    // Pass as parameters the configuration and a test trigger
  }
}

// Module export
module.exports = TestWatchPlugin;
