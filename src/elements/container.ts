import { createHTMLElementWrapperConstructor } from "./domBase";

const DivWrapperConstructor = createHTMLElementWrapperConstructor("div");

export class HTMLContainerWrapper extends DivWrapperConstructor {}
