import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";
import { Link } from "../Link/Link";
import { Kbd, ShortcutBar } from "../Kbd/Kbd";
import { HudLayer, AppBar, Brand } from "../Hud/Hud";
import { Button } from "../Button/Button";

function Basic(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return (
    <Tabs defaultValue="a" {...props}>
      <TabList label="Sections">
        <Tab value="a">Overview</Tab>
        <Tab value="b">Specs</Tab>
        <Tab value="c">Crew</Tab>
      </TabList>
      <TabPanel value="a">Overview panel</TabPanel>
      <TabPanel value="b">Specs panel</TabPanel>
      <TabPanel value="c">Crew panel</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("exposes tablist, tabs and a panel", () => {
    render(<Basic />);
    expect(screen.getByRole("tablist", { name: "Sections" })).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tabpanel")).toBeTruthy();
  });

  it("marks the selected tab and shows only its panel", () => {
    render(<Basic />);
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Specs" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("Overview panel")).toBeTruthy();
    expect(screen.queryByText("Specs panel")).toBeNull();
  });

  it("links each tab to its panel both ways", () => {
    render(<Basic />);
    const tab = screen.getByRole("tab", { name: "Overview" });
    const panel = screen.getByRole("tabpanel");
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });

  it("switches on click", async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole("tab", { name: "Specs" }));
    expect(screen.getByText("Specs panel")).toBeTruthy();
    expect(screen.queryByText("Overview panel")).toBeNull();
  });

  it("keeps only the selected tab tabbable", async () => {
    // Roving tabindex: Tab should step past the strip, not through every tab.
    render(<Basic />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].tabIndex).toBe(0);
    expect(tabs[1].tabIndex).toBe(-1);

    await userEvent.click(tabs[1]);
    expect(tabs[0].tabIndex).toBe(-1);
    expect(tabs[1].tabIndex).toBe(0);
  });

  it("moves with arrow keys and wraps around", async () => {
    render(<Basic />);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();

    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(document.activeElement).toBe(tabs[1]));
    expect(screen.getByText("Specs panel")).toBeTruthy();

    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    await waitFor(() => expect(document.activeElement).toBe(tabs[2]));
  });

  it("jumps to first and last with Home and End", async () => {
    render(<Basic />);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    await userEvent.keyboard("{End}");
    await waitFor(() => expect(document.activeElement).toBe(tabs[2]));
    await userEvent.keyboard("{Home}");
    await waitFor(() => expect(document.activeElement).toBe(tabs[0]));
  });

  it("skips disabled tabs when navigating by keyboard", async () => {
    // Landing on a disabled tab strands focus and renders no panel.
    render(
      <Tabs defaultValue="a">
        <TabList label="Sections">
          <Tab value="a">A</Tab>
          <Tab value="b" disabled>
            B
          </Tab>
          <Tab value="c">C</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
      </Tabs>,
    );
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();

    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(document.activeElement).toBe(tabs[2]));
    expect(screen.getByText("Panel C")).toBeTruthy();
  });

  it("does not let End select a trailing disabled tab", async () => {
    render(
      <Tabs defaultValue="a">
        <TabList label="Sections">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
          <Tab value="z" disabled>
            Z
          </Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    screen.getAllByRole("tab")[0].focus();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Z" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
  });

  it("reports changes and honours a controlled value", async () => {
    const onValueChange = vi.fn();
    render(<Basic value="b" onValueChange={onValueChange} />);
    expect(screen.getByText("Specs panel")).toBeTruthy();

    await userEvent.click(screen.getByRole("tab", { name: "Crew" }));
    expect(onValueChange).toHaveBeenCalledWith("c");
    // Still on "b": the parent owns the value.
    expect(screen.getByText("Specs panel")).toBeTruthy();
  });

  it("can keep hidden panels mounted", () => {
    render(
      <Tabs defaultValue="a">
        <TabList label="Sections">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b" keepMounted>
          Panel B
        </TabPanel>
      </Tabs>,
    );
    const hidden = document.getElementById(
      screen.getByRole("tab", { name: "B" }).getAttribute("aria-controls")!,
    );
    expect(hidden).toBeTruthy();
    expect(hidden).toHaveAttribute("hidden");
  });

  it("throws a useful error when used outside Tabs", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Tab value="a">Orphan</Tab>)).toThrow(/must be used inside <Tabs>/);
    spy.mockRestore();
  });
});

describe("Link", () => {
  it("renders an anchor", () => {
    render(<Link href="/rules">Flight rules</Link>);
    expect(screen.getByRole("link", { name: "Flight rules" })).toHaveAttribute("href", "/rules");
  });

  it("opens external links safely", () => {
    // Without noopener the opened page can reach back via window.opener.
    render(
      <Link href="https://example.com" external>
        Archive
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("tells screen reader users the link opens a new tab", () => {
    render(
      <Link href="https://example.com" external>
        Archive
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName(/opens in a new tab/i);
  });

  it("leaves internal links alone", () => {
    render(<Link href="/rules">Rules</Link>);
    expect(screen.getByRole("link").hasAttribute("target")).toBe(false);
  });

  it("lets a caller override rel", () => {
    render(
      <Link href="https://example.com" external rel="nofollow">
        Archive
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("rel", "nofollow");
  });
});

describe("ShortcutBar", () => {
  it("renders each shortcut with real kbd elements", () => {
    render(
      <ShortcutBar
        hideOnMobile={false}
        items={[
          { keys: ["←", "→"], label: "Move" },
          { keys: ["Space"], label: "Drop" },
        ]}
      />,
    );
    const group = screen.getByRole("group", { name: "Keyboard shortcuts" });
    expect(group.querySelectorAll("kbd")).toHaveLength(3);
    expect(screen.getByText("Move")).toBeTruthy();
  });

  it("renders a standalone key cap", () => {
    render(<Kbd>Esc</Kbd>);
    expect(screen.getByText("Esc").tagName).toBe("KBD");
  });
});

describe("HudLayer", () => {
  it("ignores the pointer itself but not its controls", () => {
    render(
      <HudLayer data-testid="hud">
        <AppBar brand={<Brand>Lumen</Brand>} actions={<Button size="sm">Go</Button>} />
      </HudLayer>,
    );
    expect(getComputedStyle(screen.getByTestId("hud")).pointerEvents).toBe("none");
    expect(getComputedStyle(screen.getByRole("button", { name: "Go" })).pointerEvents).toBe("auto");
  });

  it("renders brand and actions in a banner", () => {
    render(
      <HudLayer>
        <AppBar brand={<Brand>Lumen</Brand>} actions={<Button size="sm">Go</Button>} />
      </HudLayer>,
    );
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByText("Lumen")).toBeTruthy();
  });

  it("keeps the brand glyph decorative", () => {
    render(<Brand>Lumen</Brand>);
    expect(screen.getByText("Lumen").querySelector("[aria-hidden='true']")).toBeTruthy();
  });
});
