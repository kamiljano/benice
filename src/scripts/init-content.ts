import debounce from 'debounce';
import validateText from './validate-text';
import { state } from './state';
import Icon, { StateIcons } from './icon';
import findTextAreas from './find-text-areas';

type ContentProps = StateIcons;

export const initContent = (props: ContentProps) => {
  const publishTextChange = async (ev: Event) => {
    const target = ev.target as HTMLTextAreaElement;
    try {
      state.validations.for(target).setState('loading');
      const result = await validateText(target.value);
      console.debug('[BeNice]: Validation result:', result);
      state.validations.for(target).setState(result.offensive ? 'bad' : 'good');
    } catch (err) {
      console.error('[BeNice]: Failed to validate text:', err);
      state.validations.for(target).setState('error');
    }
  };

  const initTextArea = (textarea: HTMLTextAreaElement) => {
    if (!state.validations.has(textarea)) {
      textarea.onkeyup = debounce(publishTextChange, 500);
      const icon = Icon.createFor(textarea, props);
      const resizeObserver = new ResizeObserver(() => {
        state.updateAllIconPositions();
      });
      resizeObserver.observe(textarea);

      state.validations.add({
        textArea: {
          element: textarea,
          resizeObserver,
        },
        icon,
      });
    }
  };

  console.debug('[BeNice]: extension active', window.location.hostname);
  const textareas = document.querySelectorAll('textarea');

  textareas.forEach(initTextArea);

  new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      mutation.removedNodes.forEach((removedNode) => {
        state.validations.remove(removedNode);
      });
      mutation.addedNodes.forEach((addedNode) => {
        findTextAreas(addedNode).forEach(initTextArea);
      });
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
};
