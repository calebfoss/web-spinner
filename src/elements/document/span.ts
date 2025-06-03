import { documentChildren } from "../../mixins/children";
import {
  createHTMLElementWrapperConstructor,
  HTMLElementController,
} from "./domBase";

export class DocumentSpanWrapper extends documentChildren(
  createHTMLElementWrapperConstructor("span")
) {}

export type DocumentSpanController = HTMLElementController<
  "span",
  DocumentSpanWrapper
>;
