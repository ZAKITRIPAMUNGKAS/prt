import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.unmock("react");

import { createElement } from "react";
import { InitialLoader } from "@/components/initial-loader";

describe("InitialLoader", () => {
  it("menampilkan sapaan portfolio pada saat pertama dirender", () => {
    const markup = renderToStaticMarkup(createElement(InitialLoader));

    expect(markup).toContain("Hi, namaku");
    expect(markup).toContain("Zaki Tri Pamungkas");
    expect(markup).toContain("Salam kenal ya...");
  });
});
