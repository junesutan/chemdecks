import SolveCard from "../components/StudentSolveCard";

export default function SolveCardPage() {
  const sampleCard = {
    question: "Define Alloy",
    answer: "mixture",
    feedback:
      "Mixtures are not chemically combined. Steel is a mixture of iron and carbon.",
  };

  return <SolveCard card={sampleCard} onNext={() => console.log("next")} />;
}
