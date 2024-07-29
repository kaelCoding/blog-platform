export function domToNode(domNode) {
    if (domNode.nodeType == domNode.TEXT_NODE) {
        return domNode.data;
    }
    if (domNode.nodeType != domNode.ELEMENT_NODE) {
        return false;
    }
    var nodeElement = {};
    nodeElement.tag = domNode.tagName.toLowerCase();
    for (var i = 0; i < domNode.attributes.length; i++) {
        var attr = domNode.attributes[i];
        if (attr.name == "href" || attr.name == "src") {
        if (!nodeElement.attrs) {
            nodeElement.attrs = {};
        }
        nodeElement.attrs[attr.name] = attr.value;
        }
    }
    if (domNode.childNodes.length > 0) {
        nodeElement.children = [];
        for (var i = 0; i < domNode.childNodes.length; i++) {
        var child = domNode.childNodes[i];
        nodeElement.children.push(domToNode(child));
        }
    }
    return nodeElement;
}

export function nodeToDom(node) {
    if (typeof node === "string" || node instanceof String) {
        return document.createTextNode(node);
    }
    if (node.tag) {
        var domNode = document.createElement(node.tag);
        if (node.attrs) {
        for (var name in node.attrs) {
            var value = node.attrs[name];
            domNode.setAttribute(name, value);
        }
        }
    } else {
        var domNode = document.createDocumentFragment();
    }
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        domNode.appendChild(nodeToDom(child));
        }
    }
    return domNode;
}