import { camelToKebabCase } from "../utlities/camelToKebab";

export class CustomHTMLElement extends HTMLElement {
  static observedAttributes: string[] = [];
  static tag: string;

  constructor(...args: any[]) {
    super();

    const element = this;

    this.#eventsProxy = new Proxy({} as EventListenerMap, {
      get(_, eventName: keyof HTMLElementEventMap) {
        return element.#eventListeners.get(eventName);
      },
      set(_, eventName: keyof HTMLElementEventMap, listener) {
        const currentListener = element.#eventListeners.get(eventName);

        if (currentListener === listener) return true;

        if (currentListener !== undefined) {
          element.removeEventListener(eventName, currentListener);
        }

        element.addEventListener(eventName, listener);

        element.#eventListeners.set(eventName, listener);

        return true;
      },
    });
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {}

  /**
   * @private
   */
  createChild<E extends typeof CustomHTMLElement>(
    ElementClass: E,
    options?: Options<InstanceType<E>>
  ) {
    const element = createCustomElement(ElementClass, options);

    this.appendChild(element);

    return element;
  }

  #eventListeners = new Map<keyof HTMLElementEventMap, EventListener>();

  #eventsProxy: EventListenerMap;

  get events() {
    return this.#eventsProxy as EventListenerMap;
  }

  set events(map) {
    Object.assign(this.#eventsProxy, map);
  }

  /**
   * Interface for adding event listeners with alternative syntax. For example,
   * element.addEventListener("click", listener) becomes
   * element.listen.click(listener).
   */
  get listen(): EventListenerMap {
    return this.#eventsProxy;
  }

  /**
   * @private
   */

  registerChange<P extends keyof Writeable<this>>(
    propertyName: P,
    newValue: this[P]
  ) {
    const attributeName = camelToKebabCase(propertyName as string);

    const currentAttributeValue = this.getAttribute(attributeName);

    const stringValue = String(newValue);

    if (currentAttributeValue === stringValue) return;

    if (newValue === null) this.removeAttribute(attributeName);
    else this.setAttribute(attributeName, stringValue);
  }
}

export function createCustomElement<E extends typeof CustomHTMLElement>(
  ElementClass: E,
  options?: Options<InstanceType<E>>
) {
  const element = document.createElement(ElementClass.tag) as InstanceType<E>;

  Object.assign(element, options);

  return element;
}
