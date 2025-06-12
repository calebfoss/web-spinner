# Web Spinner's Design

<ol type="I">
    <li>

## Priorities

<ol type="1">
    <li>
        <h3>Accessibility</h3>
        <p>
            Improve accessibility for people with disabilities in the content created with Web Spinner as well as Web Spinner itself and its associated content.
        </p>
        <ol type="a">
            <li>Help Web Spinner creations to follow web accessibility guidelines by default.</li>
            <li>Provide tools that help Web Spinner creators follow accessibility guidelines with their custom content.</li>
            <li>Follow accessibility guidelines in documentation.</li>
            <li>Facilitate web accessibility education through documentation, tutorials, and examples.</li>
        </ol>
    </li>
    <li>

### Beginner Friendliness

<p>
    Flatten the learning curve for programming beginners. Help learners bridge to more advanced tools.
</p>
<ol type="a">
    <li>
        Strive for consistency
        <ol type="i">
            <li>
                Reduce inconsistencies between web tools. For example, provide a consistent interface for rendering both to a 2D Canvas and SVG.
            </li>
            <li>
                Minimize complexity in the Web Spinner API.
            </li>
            <li>
                Prepare learners for more advanced tools (such as user interface frameworks) by using related design ideas.
            </li>
        </ol>
    </li>
    <li>
        Emulate natural language
        <ol type="i">
            <li>
                Support natural language diversity with API and documentation translations.
            </li>
            <li>Avoid abbreviations.</li>
            <li>
                Avoid unnecessary jargon. Prefer more common, less programming-specific terms.
            </li>
            <li>
                Use clear naming. Concisely describe the purpose of the property/method/etc. while minimizing the prerequisites required to understand.
            </li>
        </ol>
    </li>
    <li>
        Reduce need for math and control flow
        <ol type="i">
            <li>
                Support more declarative-style programming, emphasizing the end result over the process to create it.
            </li>
            <li>
                Provide tools that simplify calculations for common processes, such as matrix transformations and collision detection.
            </li>
        </ol>
    </li>
    <li>
        Provide strong documentation. See <a href="./documentation.md" target=_blank>contributor document on writing documentation</a> for specifics.
    </li>
    <li>
        Help avoid errors, debug, and troubleshoot
        <ol type="i">
            <li>
                Use custom element attributes to report live property values.
            </li>
            <li>
                Handle errors with beginner-friendly messages that support learning.
            </li>
        </ol>
    </li>
</ol>

</li>
</ol>

</li>
<li>

## Structure

### Elements

Web Spinner expands the concept of a [document element](https://developer.mozilla.org/en-US/docs/Web/API/Element) to represent content created through imperative APIs, such as the [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). Additionally, WS expands the properties of existing elements in support of the project's [priorities](#priorities). It does so by defining [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) as well as wrapping existing elements.

Each WS project begins by creating a root element.

```js
import { createRoot } from "web-spinner";

const root = createRoot();
```

Methods on an element provide a way to create child elements. These create the corresponding HTML element, append it as a child to the method ownder, and return a [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) for the child element, which wraps it with additional properties.

```js
const exampleParagraph = root.paragraph()`This is the text content of the paragraph`;
```

Using [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates), the proxy may be followed with a template string. This transforms the string into child nodes for the element. String text is passed into the [Text constructor](https://developer.mozilla.org/en-US/docs/Web/API/Text/Text), and the returned node is appended as a child to the element. Embedded expressions are handled based on their evaluated value:

- primitive values are converted to strings and appended as text nodes
- nodes are appended as children as is
- state objects are appended as text nodes that automatically update when the state value is modified

</li>

</ol>
