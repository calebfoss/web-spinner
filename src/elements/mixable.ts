import { createCustomElement } from "..";
import { camelToKebabCase } from "../utlities/camelToKebab";

export class CustomHTMLElement extends HTMLElement {
  static observedAttributes: string[] = [];
  static tag: string;

  constructor(...args: any[]) {
    super();
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

    this.setAttribute(attributeName, stringValue);
  }
}
