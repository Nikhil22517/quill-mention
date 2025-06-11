import React, { useEffect, useLayoutEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import Quill, { QuillOptions } from "quill";
import "quill-mention";
import "quill-mention/autoregister";
import "quill-mention/dist/quill.mention.css";
import MentionItem from "./Mention";
import NonEditableBlot from "./blots/NonEditableBlot";
const MentionBlot = Quill.import("blots/mention") as any;
Quill.register(NonEditableBlot);
class StyledMentionBlot extends MentionBlot {
  static create(data: any) {
    const node = super.create(data);
    node.innerText = `@${data.value}`;
    node.style.color = data.color || "red";
    return node;
  }

  static value(node: HTMLElement) {
    return {
      id: node.getAttribute("data-id") ?? "",
      value: node.getAttribute("data-value") ?? "",
      color: node.style.color,
    };
  }
}

StyledMentionBlot.blotName = "styled-mention";
StyledMentionBlot.tagName = "span";

Quill.register(StyledMentionBlot);

interface MentionInputProps {
  placeholder?: string;
  mentionCharacters?: string[];
  dataSources?: Record<
    string,
    { id: string; value: string; color: string; [key: string]: any }[]
  >;
  quillRef: React.RefObject<Quill | null>;
  editorStyle?: React.CSSProperties;
  additionalModules?: QuillOptions;
  enable?: boolean;
}

const MentionInput: React.FC<MentionInputProps> = ({
  placeholder = "Start typing...",
  mentionCharacters = ["@", "#"],
  dataSources = {
    "@": [],
    "#": [],
  },
  quillRef,
  editorStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    minHeight: "100px",
  },

  additionalModules = {},
  enable = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef(placeholder);
  const enableRef = useRef(enable);

  useLayoutEffect(() => {
    placeholderRef.current = placeholder;
    enableRef.current = !enable;
  }, [placeholder, enable]);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      const quillInstance = new Quill(editorRef.current, {
        placeholder: placeholderRef.current,

        modules: {
          toolbar: false,
          mention: {
            // dataAttributes: ["id", "value", "color"],
            // blotName: "styled-mention",
            mentionDenotationChars: mentionCharacters,
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            source: (
              searchTerm: string,
              renderList: Function,
              mentionChar: string
            ) => {
              const values = dataSources[mentionChar] || [];
              const matches = searchTerm
                ? values.filter((item) =>
                    item.value.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                : values;
              renderList(matches, searchTerm);
            },
            renderItem: (item: any, searchTerm: any) => {
              const container = document.createElement("div");
              const root = createRoot(container);
              root.render(<MentionItem name={item.value} />);
              return container;
            },
          },
          ...additionalModules,
        },
      });

      quillInstance.keyboard.addBinding({
        key: "Backspace",
        handler(range, curContext, binding) {
          const [blot] = quillInstance.getLeaf(range.index - 1) ?? [];

          console.log(blot, "blotblotblotblot");

          if (!blot) return true; // Allow normal deletion if no blot found

          const targetNode =
            blot.domNode.parentElement?.getAttribute("data-non-editable");
          console.log(targetNode, "targetNode");
          if (targetNode) return;

          return true; // Allow deletion of other text
        },
      });

      quillInstance.enable(enableRef.current);
      quillInstance.focus();

      quillRef.current = quillInstance;
    }
  }, [quillRef]);

  return (
    <div
      ref={editorRef}
      style={{
        ...editorStyle,
        border: enable ? "1px solid grey" : editorStyle.border,
      }}
    />
  );
};

export default MentionInput;
