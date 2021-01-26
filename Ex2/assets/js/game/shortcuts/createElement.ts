function createElement(el, className, parent = null, innerHTML = null, value = null): Element {
    let element = document.createElement(el);
    if (className) element.className = className
    if (innerHTML !== null && innerHTML !== undefined) element.innerHTML = innerHTML
    if (value !== null && value !== undefined) element.value = value;
    if (parent !== null && parent !== undefined) parent.appendChild(element)
    return element
}

export default createElement;