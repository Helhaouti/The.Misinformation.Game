/**
 * Helper function to create an HTML element with given attributes and children.
 * @param {string} tag - The HTML tag name (e.g., 'div', 'a', 'span').
 * @param {Object} attributes - A set of key-value pairs for the element's attributes (e.g., `className`, `href`, `innerHTML`).
 * @param {...(string|Node)} children - An array of child nodes or text to append to the element.
 * @returns {HTMLElement} The created HTML element.
 */
export function createElement(
    tag: string,
    attributes: object,
    ...children: (string | Node)[]
): HTMLElement {
    const element = document.createElement(tag);

    for (let key in attributes) {
        switch (key) {
            case "className":
                element.className = attributes[key];
                break;
            case "innerHTML":
                element.innerHTML = attributes[key];
                break;
            case "innerText":
                element.innerText = attributes[key];
                break;
            case "onclick":
                element.onclick = attributes[key];
                break;
            default:
                element.setAttribute(key, attributes[key]);
        }
    }

    children.forEach((child) => {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            element.appendChild(child);
        }
    });

    return element;
}
