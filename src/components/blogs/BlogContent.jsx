export default function BlogContent({ blog }) {
  const lines = blog.content.split("\n").map((l) => l.trim()).filter(Boolean);

  // Group lines into blocks: heading | bullet-group | paragraph
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("##")) {
      blocks.push({ type: "heading", text: line.replace("##", "").trim() });
      i++;
    } else if (line.startsWith("-")) {
      // Collect ALL consecutive bullet lines into one <ul>
      const items = [];
      while (i < lines.length && lines[i].startsWith("-")) {
        items.push(lines[i].replace(/^-\s*/, ""));
        i++;
      }
      blocks.push({ type: "bullets", items });
    } else {
      blocks.push({ type: "paragraph", text: line });
      i++;
    }
  }

  return (
    <div className="text-sm md:text-base leading-relaxed text-gray-700 space-y-3">
      {blocks.map((block, index) => {

        if (block.type === "heading") {
          return (
            <h2
              key={index}
              className="text-[18px] font-[inter] font-[600] text-slate-800 mt-2 mb-1 border-l-4 border-[#3a7d44] pl-3"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "bullets") {
  return (
    <ul key={index} className="space-y-2 ml-1 mt-2">
      {block.items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm md:text-base text-gray-700 font-[inter] leading-relaxed">
          <span className="mt-[4px] text-[#3a7d44] text-base shrink-0">✦</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

        return (
          <p key={index} className="text-sm md:text-base text-gray-700 font-[inter] leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}