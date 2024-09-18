import tippy, { Instance } from 'tippy.js';

const DEFAULT_TOOLTIP = 'Change the text to valide it';

export interface StateIcons {
  goodTextIconUrl: string;
  badTextIconUrl: string;
  validationErrorIconUrl: string;
  validatingIconUrl: string;
  defaultIconUrl: string;
}

export type IconState = 'good' | 'bad' | 'error' | 'loading';

const isElementZeroSize = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.width === 0 || rect.height === 0;
};

const isElementVisible = (element: HTMLElement): boolean => {
  return (
    element.style.visibility !== 'hidden' &&
    element.style.display !== 'none' &&
    !isElementZeroSize(element)
  );
};

const isEditable = (element: HTMLElement): boolean => {
  const attr = element.getAttribute('readonly');
  return !attr || attr !== 'true';
};

const isElementRecursivelyVisible = (element: HTMLElement): boolean => {
  if (!isElementVisible(element) && isEditable(element)) {
    return false;
  }
  if (element.parentElement) {
    return isElementRecursivelyVisible(element.parentElement);
  }
  return true;
};

export default class Icon {
  static createFor(textArea: HTMLTextAreaElement, props: StateIcons): Icon {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';

    const icon = document.createElement('img');
    icon.src = props.defaultIconUrl;
    icon.style.cursor = 'pointer';
    icon.style.width = '30px';
    icon.style.height = '30px';

    if (textArea.id) {
      icon.setAttribute('data-for', textArea.id);
    }

    wrapper.appendChild(icon);
    document.body.appendChild(wrapper);

    return new Icon(textArea, icon, wrapper, props);
  }

  private readonly tooltip: Instance;

  private constructor(
    private readonly parent: HTMLTextAreaElement,
    private readonly icon: HTMLImageElement,
    private readonly wrapper: HTMLDivElement,
    private readonly props: StateIcons,
  ) {
    this.tooltip = tippy(wrapper, {
      placement: 'left',
      arrow: true,
      animation: 'perspective',
      content: DEFAULT_TOOLTIP,
      trigger: 'click',
      allowHTML: true,
      interactive: true,
    });
    this.updatePosition();
  }

  private isParentVisible() {
    return isElementRecursivelyVisible(this.parent);
  }

  updatePosition() {
    if (!this.isParentVisible()) {
      this.wrapper.style.display = 'none';
      return;
    }
    this.wrapper.style.display = 'block';
    const rect = this.parent.getBoundingClientRect();

    this.wrapper.style.top = `${rect.top + 5}px`;
    this.wrapper.style.left = `${rect.left + rect.width + 5}px`;
  }

  private buildBadTooltipMessage(correctedText: string) {
    const content = document.createElement('div');
    content.style.all = 'unset';
    content.style.textAlign = 'center';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.alignItems = 'center';

    const text = document.createElement('div');
    text.style.border = '1px solid #ccc';
    text.style.padding = '0.5em';
    text.style.fontFamily = 'Arial, Helvetica, sans-serif';
    text.innerHTML = correctedText;

    const button = document.createElement('button');
    button.textContent = 'Replace';
    button.type = 'button';
    button.style.marginTop = '10px';
    button.style.zIndex = '9999';
    button.style.cursor = 'pointer';
    button.className = 'benice-button';
    button.onclick = () => {
      this.parent.value = correctedText;
      this.tooltip.hide();
      this.setState('good');
    };

    content.appendChild(text);
    content.appendChild(button);
    return content;
  }

  setState(state: IconState, tooltipMessage?: string): void {
    if (state === 'bad' && tooltipMessage) {
      this.tooltip.setContent(this.buildBadTooltipMessage(tooltipMessage));
    } else {
      this.tooltip.setContent(tooltipMessage || DEFAULT_TOOLTIP);
    }

    if (state === 'good') {
      this.icon.src = this.props.goodTextIconUrl;
    } else if (state === 'bad') {
      this.icon.src = this.props.badTextIconUrl;
    } else if (state === 'loading') {
      this.icon.src = this.props.validatingIconUrl;
    } else if (state === 'error') {
      this.icon.src = this.props.validationErrorIconUrl;
    } else {
      throw new Error(`Invalid icon state: ${state}`);
    }
  }

  remove() {
    this.tooltip.destroy();
    document.body.removeChild(this.wrapper);
  }
}
