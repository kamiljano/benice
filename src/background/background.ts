console.log('Be Nice extension active');

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'text-change') {
    console.log('Received text change:', message.text);
  }
});
