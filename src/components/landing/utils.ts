import type { PointerEvent } from "react";

export function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--pointer-x", `${(event.clientX - box.left) / box.width * 100}%`);
  event.currentTarget.style.setProperty("--pointer-y", `${(event.clientY - box.top) / box.height * 100}%`);
  event.currentTarget.style.setProperty("--rx", `${-(event.clientY - box.top - box.height / 2) / box.height * 14}deg`);
  event.currentTarget.style.setProperty("--ry", `${(event.clientX - box.left - box.width / 2) / box.width * 14}deg`);
}
export function resetTilt(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--rx", "0deg");
  event.currentTarget.style.setProperty("--ry", "0deg");
}

