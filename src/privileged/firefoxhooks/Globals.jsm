/*
 * This file is loaded first into the shared scope.
 * Everything is designed to be imported into the same
 * scope, so imports can clash and consts (like namespaces)
 * can't be redeclared, so stick it all in this file.
 *
 * This allows working around ChromeUtils.import not working
 * for packgaged (zip) files.
 */

ChromeUtils.defineModuleGetter(this, "AddonManager",
                               "resource://gre/modules/AddonManager.jsm");
