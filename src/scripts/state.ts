import findTextAreas from './find-text-areas';
import Icon, { IconState } from './icon';

interface Validation {
  textArea: {
    element: HTMLTextAreaElement;
    resizeObserver: ResizeObserver;
  };
  icon: Icon;
}

interface State {
  validations: Validation[];
}

const _state: State = {
  validations: [],
};

const updateAllIconPositions = () =>
  _state.validations.forEach((v) => v.icon.updatePosition());

export const state = Object.freeze({
  validations: Object.freeze({
    add(value: Validation) {
      if (!state.validations.has(value.textArea.element)) {
        _state.validations = [..._state.validations, value];
      }
    },
    for(textArea: HTMLTextAreaElement) {
      const validation = _state.validations.find(
        (v) => v.textArea.element === textArea,
      );

      if (!validation) {
        throw new Error('Validation not found');
      }

      return {
        setState(state: IconState, tooltipMessage?: string): void {
          validation.icon.setState(state, tooltipMessage);
        },
      };
    },
    has(textArea: HTMLTextAreaElement) {
      return _state.validations.some((v) => v.textArea.element === textArea);
    },
    remove(textArea: Node) {
      const textAreas = findTextAreas(textArea);
      _state.validations = _state.validations.filter((v) => {
        return !textAreas.some((t) => {
          if (t === v.textArea.element) {
            v.textArea.resizeObserver.disconnect();
            v.icon.remove();
            return true;
          }
          return false;
        });
      });
      updateAllIconPositions();
    },
  }),
  updateAllIconPositions,
}) satisfies Record<keyof State, any>;
