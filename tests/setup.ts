import "@testing-library/jest-dom/vitest";
import * as matchers from "vitest-axe/matchers";
import { expect, vi } from "vitest";

expect.extend(matchers);

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

// Controllable matchMedia mock
let isReducedMotion = false;
type ChangeListener = (event: MediaQueryListEvent | { matches: boolean; media: string }) => void;

interface TrackedQuery {
  mql: MediaQueryList;
  media: string;
  listeners: Set<ChangeListener>;
}

const trackedQueries = new Set<TrackedQuery>();

export function setReducedMotion(reduce: boolean) {
  isReducedMotion = reduce;
  for (const item of trackedQueries) {
    let matches = false;
    if (item.media.includes("no-preference")) {
      matches = !isReducedMotion;
    } else if (item.media.includes("reduce")) {
      matches = isReducedMotion;
    }
    if (item.mql.matches !== matches) {
      (item.mql as { matches: boolean }).matches = matches;
      const event = {
        matches,
        media: item.media,
      } as MediaQueryListEvent;
      if (typeof item.mql.onchange === "function") {
        item.mql.onchange(event);
      }
      for (const listener of item.listeners) {
        listener(event);
      }
    }
  }
}

// Attach helper to global scope for convenience
(globalThis as unknown as { setReducedMotion: typeof setReducedMotion }).setReducedMotion = setReducedMotion;

function createMatchMediaMock() {
  return function matchMedia(query: string): MediaQueryList {
    let matches = false;
    if (query.includes("no-preference")) {
      matches = !isReducedMotion;
    } else if (query.includes("reduce")) {
      matches = isReducedMotion;
    }

    const listeners = new Set<ChangeListener>();

    const mql: MediaQueryList = {
      matches,
      media: query,
      onchange: null,
      addListener: (cb: ChangeListener) => {
        listeners.add(cb);
      },
      removeListener: (cb: ChangeListener) => {
        listeners.delete(cb);
      },
      addEventListener: (type: string, cb: EventListenerOrEventListenerObject) => {
        if (type === "change" && typeof cb === "function") {
          listeners.add(cb as ChangeListener);
        }
      },
      removeEventListener: (type: string, cb: EventListenerOrEventListenerObject) => {
        if (type === "change" && typeof cb === "function") {
          listeners.delete(cb as ChangeListener);
        }
      },
      dispatchEvent: (event: Event) => {
        if (typeof mql.onchange === "function") {
          mql.onchange(event as unknown as MediaQueryListEvent);
        }
        for (const cb of listeners) {
          cb(event as unknown as MediaQueryListEvent);
        }
        return true;
      },
    };

    trackedQueries.add({ mql, media: query, listeners });
    return mql;
  };
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: createMatchMediaMock(),
});

// ResizeObserver and IntersectionObserver stubs
class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

class IntersectionObserverStub {
  root = null;
  rootMargin = "";
  thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

globalThis.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

if (!window.scrollTo) {
  window.scrollTo = vi.fn();
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
