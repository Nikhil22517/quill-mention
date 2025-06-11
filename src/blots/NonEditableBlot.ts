import Quill from "quill";

const Inline = Quill.import("blots/inline") as any;

class NonEditableBlot extends Inline {
  static blotName = "non-editable";
  static tagName = "span";

  static create(value: string) {
    const node = super.create();
    node.innerText = value;
    node.setAttribute("contenteditable", "false");
    node.setAttribute("data-non-editable", "true");
    node.style.userSelect = "none";
    node.style.pointerEvents = "none";
    node.style.backgroundColor = "#f0f0f0";
    node.style.padding = "2px 4px";
    return node;
  }

  static value(node: HTMLElement) {
    return node.innerText;
  }
}

export default NonEditableBlot;
