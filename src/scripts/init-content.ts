import debounce from 'debounce';
import validateText from './validate-text';
import { state } from './state';
import Icon, { StateIcons } from './icon';
import findTextAreas from './find-text-areas';

type ContentProps = StateIcons & {
  tooltipStylesUrl: string;
  iconStylesUrl: string;
};

const addStyle = (url: string) => {
  const tooltipStyles = document.createElement('link');
  tooltipStyles.setAttribute('rel', 'stylesheet');
  tooltipStyles.setAttribute('href', url);
  document.head.appendChild(tooltipStyles);
};

export const initContent = (props: ContentProps) => {
  addStyle(props.tooltipStylesUrl);
  addStyle(props.iconStylesUrl);
  const publishTextChange = async (ev: Event) => {
    const target = ev.target as HTMLTextAreaElement;
    if (target.value.length < 3) {
      return;
    }
    try {
      state.validations.for(target).setState('loading', 'Validating text...');
      const result = await validateText(target.value);
      console.debug('[BeNice]: Validation result:', result);
      if (result.offensive) {
        state.validations.for(target).setState('bad', result.correctedText);
      } else {
        state.validations.for(target).setState('good');
      }
    } catch (err) {
      console.debug('[BeNice]: Failed to validate text:', err);
      state.validations
        .for(target)
        .setState(
          'error',
          'An unexpected error occurred during during the LLM communication',
        );
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

      const event = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
      });
      textarea.dispatchEvent(event);
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

  window.addEventListener('resize', function () {
    state.updateAllIconPositions();
  });
};
