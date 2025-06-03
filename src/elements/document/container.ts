import { documentChildren } from "../../mixins/children";
import {
  createHTMLElementWrapperConstructor,
  HTMLElementController,
} from "./domBase";

export class DocumentContainerWrapper extends documentChildren(
  createHTMLElementWrapperConstructor("div")
) {}

export type DocumentContainerController = HTMLElementController<
  "div",
  DocumentContainerWrapper
>;
