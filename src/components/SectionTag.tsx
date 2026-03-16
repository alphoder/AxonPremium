export default function SectionTag({ text }: { text: string }) {
  return (
    <span className="mb-4 block text-[11px] font-medium tracking-[4px] text-primary uppercase">
      {text}
    </span>
  );
}
