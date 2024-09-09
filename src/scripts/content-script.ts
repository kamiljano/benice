import debounce from 'debounce';

console.debug('Be nice extension active');

const textareas = document.querySelectorAll('textarea');

const publishTextChange = (ev: Event) => {
  console.log('aaaaaaaaaa', ev);
  chrome.runtime.sendMessage({ type: 'text-change', text: (ev.target as HTMLTextAreaElement).value });
};

textareas.forEach((textarea) => {
  textarea.onkeyup = debounce(publishTextChange, 500);
  // const rect = textarea.getBoundingClientRect();
  // console.log(
  //   `Textarea ${index + 1}: Top=${rect.top}, Left=${rect.left}, Bottom=${rect.bottom}, Right=${rect.right}`,
  // );
});
