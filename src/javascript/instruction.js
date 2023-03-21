const toggleInstructionIcon = document.querySelector(".instruction__icon");
const hideInstructionIcon = document.querySelector(".fa-chevron-up");
const instruction = document.querySelector(".instruction");

toggleInstructionIcon.addEventListener("click", toggleInstruction);

function toggleInstruction() {
  if (instruction.dataset.shown === "false") {
    instruction.dataset.shown = "true";
    instruction.style.transform = "translate(0, 0)";

    toggleInstructionIcon.style.transform = "rotate(180deg)";
  } else if (instruction.dataset.shown === "true") {
    instruction.dataset.shown = "false";
    instruction.style.transform = "translate(0, -85%)";

    toggleInstructionIcon.style.transform = "rotate(0deg)";
  }
}
