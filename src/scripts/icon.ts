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
    const icon = document.createElement('img');
    icon.src = props.defaultIconUrl;
    icon.style.position = 'absolute';
    icon.style.width = '30px';
    icon.style.height = '30px';
    icon.style.cursor = 'pointer';

    if (textArea.id) {
      icon.setAttribute('data-for', textArea.id);
    }

    document.body.appendChild(icon);

    return new Icon(textArea, icon, props);
  }

  private readonly tooltip: Instance;

  private constructor(
    private readonly parent: HTMLTextAreaElement,
    private readonly icon: HTMLImageElement,
    private readonly props: StateIcons,
  ) {
    this.tooltip = tippy(icon, {
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
      this.icon.style.display = 'none';
      return;
    }
    this.icon.style.display = 'block';
    const rect = this.parent.getBoundingClientRect();

    this.icon.style.top = `${rect.top + 5}px`;
    this.icon.style.left = `${rect.left + rect.width + 5}px`;
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
    document.body.removeChild(this.icon);
  }
}
