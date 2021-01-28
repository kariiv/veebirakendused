function createElement(el: string, className: string | null, parent:HTMLElement | null = null, innerHTML:string | null = null, value:string|null = null): Element {
    let element = document.createElement(el) as any;
    if (className) element.className = className
    if (innerHTML !== null && innerHTML !== undefined) element.innerHTML = innerHTML
    if (value !== null && value !== undefined) element.value = value;
    if (parent !== null && parent !== undefined) parent.appendChild(element)
    return element
}

export default createElement;