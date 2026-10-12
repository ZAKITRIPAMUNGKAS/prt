import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent = ({
  content,
  className,
}: MarkdownContentProps) => {
  if (!content) return null;

  // Split lines into blocks
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = (index: number) => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        elements.push(
          <p
            key={`p-${index}`}
            className="text-text-muted font-light leading-relaxed mb-4 text-[15px]"
          >
            {text}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph(index);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph(index);
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-xl font-medium mt-8 mb-3 text-foreground tracking-tight"
        >
          {trimmed.replace("### ", "")}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flushParagraph(index);
      elements.push(
        <h2
          key={`h2-${index}`}
          className="text-2xl font-semibold mt-10 mb-4 text-foreground tracking-tight"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      flushParagraph(index);
      elements.push(
        <h1
          key={`h1-${index}`}
          className="text-3xl font-bold mt-10 mb-4 text-foreground tracking-tight"
        >
          {trimmed.replace("# ", "")}
        </h1>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph(index);
      elements.push(
        <li
          key={`li-${index}`}
          className="ml-5 list-disc text-text-muted font-light leading-relaxed mb-1 text-[15px]"
        >
          {trimmed.replace(/^[-*]\s+/, "")}
        </li>
      );
    } else {
      currentParagraph.push(trimmed);
    }
  });

  flushParagraph(lines.length);

  return <div className={cn("space-y-1", className)}>{elements}</div>;
};
