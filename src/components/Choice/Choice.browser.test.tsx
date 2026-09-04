import { describe, it, expect, vi } from "vitest";
import { useRef, useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Checkbox, Radio, RadioGroup, Switch } from "./Choice";
import { Select } from "../Select/Select";
import { Slider } from "../Slider/Slider";

describe("Checkbox", () => {
  it("is a real checkbox with an accessible name", () => {
    render(<Checkbox label="Send logs" />);
    const box = screen.getByRole("checkbox", { name: "Send logs" }) as HTMLInputElement;
    expect(box.type).toBe("checkbox");
  });

  it("toggles when the label text is clicked", async () => {
    render(<Checkbox label="Send logs" />);
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    expect(box.checked).toBe(false);
    await userEvent.click(screen.getByText("Send logs"));
    expect(box.checked).toBe(true);
  });

  it("toggles with the keyboard", async () => {
    render(<Checkbox label="Send logs" />);
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    box.focus();
    await userEvent.keyboard(" ");
    expect(box.checked).toBe(true);
  });

  it("associates a description without polluting the name", () => {
    render(<Checkbox label="Dispatch" description="One a month." />);
    const box = screen.getByRole("checkbox");
    // Inside the <label> the description would be folded into the name.
    expect(box).toHaveAccessibleName("Dispatch");
    expect(box).toHaveAccessibleDescription("One a month.");
    const describedBy = box.getAttribute("aria-describedby");
    expect(document.getElementById(describedBy!)?.textContent).toBe("One a month.");
  });

  it("supports the indeterminate state", () => {
    function Partial() {
      const ref = useRef<HTMLInputElement>(null);
      useEffect(() => {
        if (ref.current) ref.current.indeterminate = true;
      }, []);
      return <Checkbox ref={ref} label="Some" />;
    }
    render(<Partial />);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
  });

  it("does not toggle when disabled", async () => {
    render(<Checkbox label="Nope" disabled />);
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    await userEvent.click(screen.getByText("Nope"), { force: true });
    expect(box.checked).toBe(false);
  });

  it("works without a visible label", () => {
    render(<Checkbox aria-label="Hidden" />);
    expect(screen.getByRole("checkbox")).toHaveAccessibleName("Hidden");
  });
});

describe("RadioGroup", () => {
  it("gives every option the group name", () => {
    render(
      <RadioGroup name="orbit" label="Orbit">
        <Radio value="low" label="Low" />
        <Radio value="geo" label="Geo" />
      </RadioGroup>,
    );
    for (const r of screen.getAllByRole("radio")) {
      expect((r as HTMLInputElement).name).toBe("orbit");
    }
  });

  it("exposes a labelled radiogroup", () => {
    render(
      <RadioGroup name="orbit" label="Orbit">
        <Radio value="low" label="Low" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Orbit" })).toBeTruthy();
  });

  it("allows only one selection", async () => {
    render(
      <RadioGroup name="orbit">
        <Radio value="low" label="Low" />
        <Radio value="geo" label="Geo" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await userEvent.click(screen.getByText("Low"));
    expect(radios[0].checked).toBe(true);
    await userEvent.click(screen.getByText("Geo"));
    expect(radios[1].checked).toBe(true);
    expect(radios[0].checked).toBe(false);
  });

  it("moves between options with arrow keys", async () => {
    // Native radio behaviour, which a custom widget would have to reimplement.
    render(
      <RadioGroup name="orbit">
        <Radio value="low" label="Low" defaultChecked />
        <Radio value="geo" label="Geo" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    radios[0].focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(radios[1].checked).toBe(true);
  });

  it("keeps an explicit name on a child", () => {
    render(
      <RadioGroup name="group">
        <Radio value="a" label="A" name="override" />
      </RadioGroup>,
    );
    expect((screen.getByRole("radio") as HTMLInputElement).name).toBe("override");
  });
});

describe("Switch", () => {
  it("is announced as a switch, not a checkbox", () => {
    render(<Switch label="Sound" />);
    expect(screen.getByRole("switch", { name: "Sound" })).toBeTruthy();
  });

  it("toggles by click and by keyboard", async () => {
    render(<Switch label="Sound" />);
    const el = screen.getByRole("switch") as HTMLInputElement;
    await userEvent.click(screen.getByText("Sound"));
    expect(el.checked).toBe(true);
    el.focus();
    await userEvent.keyboard(" ");
    expect(el.checked).toBe(false);
  });

  it("keeps the input focusable even though the track is what you see", () => {
    render(<Switch label="Sound" />);
    const el = screen.getByRole("switch") as HTMLInputElement;
    el.focus();
    expect(document.activeElement).toBe(el);
  });

  it("moves the thumb when checked", async () => {
    render(<Switch label="Sound" />);
    const thumb = document.querySelector(".lumen-switch-thumb") as HTMLElement;
    const before = thumb.getBoundingClientRect().left;
    await userEvent.click(screen.getByText("Sound"));
    await new Promise((r) => setTimeout(r, 400));
    expect(thumb.getBoundingClientRect().left).toBeGreaterThan(before);
  });
});

describe("Select", () => {
  it("is a native select", () => {
    render(
      <Select aria-label="Body">
        <option value="mars">Mars</option>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "Body" }).tagName).toBe("SELECT");
  });

  it("shows a disabled placeholder and starts empty", () => {
    render(
      <Select aria-label="Body" placeholder="Choose">
        <option value="mars">Mars</option>
      </Select>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("");
    const placeholder = screen.getByRole("option", { name: "Choose" }) as HTMLOptionElement;
    expect(placeholder.disabled).toBe(true);
  });

  it("does not override an explicit defaultValue", () => {
    render(
      <Select aria-label="Body" placeholder="Choose" defaultValue="mars">
        <option value="mars">Mars</option>
      </Select>,
    );
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("mars");
  });

  it("reports changes", async () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="Body" onChange={onChange}>
        <option value="mars">Mars</option>
        <option value="europa">Europa</option>
      </Select>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    await userEvent.selectOptions(select, "europa");
    expect(select.value).toBe("europa");
    expect(onChange).toHaveBeenCalled();
  });
});

describe("Slider", () => {
  it("is a native range with slider semantics", () => {
    render(<Slider aria-label="Thrust" defaultValue={40} />);
    const el = screen.getByRole("slider", { name: "Thrust" }) as HTMLInputElement;
    expect(el.type).toBe("range");
    expect(el.value).toBe("40");
  });

  it("responds to arrow keys", async () => {
    render(<Slider aria-label="Thrust" defaultValue={40} />);
    const el = screen.getByRole("slider") as HTMLInputElement;
    el.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(Number(el.value)).toBeGreaterThan(40);
  });

  it("honours min, max and step", async () => {
    render(<Slider aria-label="Thrust" min={0} max={10} step={5} defaultValue={0} />);
    const el = screen.getByRole("slider") as HTMLInputElement;
    el.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(el.value).toBe("5");
  });

  it("ignores input when disabled", async () => {
    render(<Slider aria-label="Thrust" defaultValue={40} disabled />);
    const el = screen.getByRole("slider") as HTMLInputElement;
    el.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(el.value).toBe("40");
  });
});
