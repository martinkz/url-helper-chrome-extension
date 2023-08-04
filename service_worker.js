chrome.runtime.onInstalled.addListener(() => {
	console.log("Service Worker Installed");
});

// Console.log is visible in the service worker's dev tools console
chrome.action.onClicked.addListener((tab) => {
	let newUrl;

	if (tab.url.startsWith("https://comp.")) {
		newUrl = tab.url.replace(/https:\/\/comp\.(.+?)\/(.*)/, "http://comp2.$1:4567/$2");
	} else if (tab.url.startsWith("http://comp2.")) {
		newUrl = tab.url.replace(/http:\/\/comp2\.(.+?):4567\/(.*)/, "https://comp.$1/$2");
	} else if (tab.url.startsWith("https://win.")) {
		newUrl = tab.url.replace(/https:\/\/win\.(.+?)\/(.*)/, "http://winlocal.$1/$2");
	} else if (tab.url.startsWith("http://winlocal.")) {
		newUrl = tab.url.replace(/http:\/\/winlocal\.(.+?)\/(.*)/, "https://win.$1/$2");
	}

	if (newUrl) {
		chrome.tabs.update(tab.id, { url: newUrl });
	}

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: contentScriptFunc,
		args: [newUrl, tab],
	});
});

// This runs only in the browser (it has no access to the chrome APIs, like chrome.tabs, etc)
// console.log is visible in the page's console
function contentScriptFunc(message, tab) {
	console.log(message);
	// console.log(tab.url);
}

// This callback WILL NOT be called for "_execute_action"
// chrome.commands.onCommand.addListener((command) => {
// 	console.log(`Command "${command}" called`);
// });
