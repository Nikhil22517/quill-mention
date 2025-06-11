import React, { useEffect, useRef } from "react";
import Quill, { Delta } from "quill";
import MentionInput from "./QuillMention";
import "./App.css";
import Tiptap from "./TiptapMention";

const App = () => {
  const quillRef = useRef<Quill>(null);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    quill.setContents(new Delta());

    quill.updateContents(
      new Delta()
        .insert("Hi Team,\n")
        .insert("Hope you all are doing well.\n")
        .insert("Please see the reports for scorecard week 11 which is ")
    );

    quill.insertEmbed(quill.getLength(), "non-editable", "FantasticPlus");

    quill.updateContents(new Delta().insert("."));
  }, []);

  const handleEnter = () => {
    console.log(quillRef.current?.getLength());

    const editor = quillRef.current?.editor;
    if (!editor) return;
    const content = editor.delta;

    const formattedText = content.ops
      ?.map((op) => {
        console.log(op, "op");

        if (typeof op.insert === "string") {
          return op.insert;
        }

        const mention = op.insert as { mention?: { id: string } };
        if (mention.mention?.id) {
          return `<@${mention.mention.id}>`;
        }

        return "";
      })
      .join("")
      .replace(/\n$/, "");

    console.log(
      formattedText,
      formattedText.length,
      "Formatted text to send to backend"
    );
  };

  const handlePaste = (event: ClipboardEvent) => {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    Array.from(clipboardData.items).forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          console.log("Pasted file:", file);

          if (file.type.startsWith("image/")) {
            handleImagePaste(file);
          } else {
            handleOtherFilePaste(file);
          }

          event.preventDefault();
        }
      }
    });
  };

  // ✅ Handle pasted images
  const handleImagePaste = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result.toString();
        const range = quillRef.current?.getSelection();
        quillRef.current?.insertEmbed(
          range?.index ?? quillRef.current?.getLength(),
          "image",
          imageUrl
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOtherFilePaste = (file: File) => {
    alert(`You pasted a file: ${file.name} (${file.type})`);
    // You can upload the file, extract text, or display a link
  };

  useEffect(() => {
    if (!quillRef.current) return;

    const quillRoot = quillRef.current.root;

    const pasteHandler = (e: ClipboardEvent) => handlePaste(e);

    quillRoot.addEventListener("paste", pasteHandler);

    quillRef.current?.keyboard.bindings?.["Enter"].unshift({
      key: "Enter",
      handler(range, curContext, binding) {
        const mentionModule = quillRef.current?.getModule("mention") as any;
        if (mentionModule?.isOpen && mentionModule.itemIndex >= 0) {
          mentionModule.selectItem(mentionModule.itemIndex);
        } else {
          handleEnter();
        }
      },
    });

    return () => {
      quillRoot.removeEventListener("paste", pasteHandler);
    };
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h2>Flexible Mention Input</h2>
      <MentionInput
        quillRef={quillRef}
        placeholder="Type @ for names, # for departments..."
        mentionCharacters={["@", "#", "$"]}
        dataSources={{
          "@": [
            { id: "1", value: "Alice", color: "red" },
            { id: "2", value: "Bob", color: "blue" },
          ],
          "#": [
            { id: "1", value: "Development", color: "red" },
            { id: "2", value: "Marketing", color: "blue" },
          ],
          $: [
            { id: "1", value: "USD", color: "red" },
            { id: "2", value: "EUR", color: "blue" },
          ],
        }}
        editorStyle={{
          border: "2px solid #007BFF",
          borderRadius: "8px",
        }}
        enable={false}
      />

      <Tiptap />
    </div>
  );
};

export default App;
