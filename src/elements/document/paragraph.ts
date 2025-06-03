import { documentChildren } from "../../mixins/children";
import {
  createHTMLElementWrapperConstructor,
  HTMLElementController,
} from "./domBase";

export class DocumentParagraphWrapper extends documentChildren(
  createHTMLElementWrapperConstructor("p")
) {}

export type DocumentParagraphController = HTMLElementController<
  "p",
  DocumentParagraphWrapper
>;
