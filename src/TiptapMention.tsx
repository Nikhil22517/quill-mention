import "./styles.scss";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import suggestion from "./suggestion.js";

const content = "<p>Hello World!</p>";

const Tiptap = () => {
  return (
    <EditorProvider
      extensions={[
        StarterKit,
        Mention.configure({
          HTMLAttributes: {
            class: "mention",
          },
          suggestion,
        }),
      ]}
      content={content}
    />
  );
};

export default Tiptap;
