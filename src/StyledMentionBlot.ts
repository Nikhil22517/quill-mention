import Quill from "quill";

const MentionBlot = Quill.import("blots/mention") as any;
class StyledMentionBlot extends MentionBlot {
  static render(data: any) {
    console.log(data, "datadatadata");

    const element = document.createElement("span");
    element.innerText = data.value;
    element.style.color = data.color ?? "red";
    return element;
  }
}
StyledMentionBlot.blotName = "styled-mention";

Quill.register(StyledMentionBlot);
export default StyledMentionBlot;
