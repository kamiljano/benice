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

export default class Icon {
  static createFor(textArea: HTMLTextAreaElement, props: StateIcons): Icon {
    const icon = document.createElement('img');
    icon.src = props.defaultIconUrl;
    icon.style.position = 'absolute';
    icon.style.width = '30px';
    icon.style.height = '30px';
    icon.style.cursor = 'pointer';

    textArea.parentNode?.appendChild(icon);

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
    });
    this.updatePosition();
  }

  updatePosition() {
    const rect = this.parent.getBoundingClientRect();
    this.icon.style.top = `${rect.top + 5}px`;
    this.icon.style.left = `${rect.left + rect.width + 5}px`;
  }

  setState(state: IconState, tooltipMessage?: string): void {
    this.tooltip.setContent(tooltipMessage || DEFAULT_TOOLTIP);

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
}
