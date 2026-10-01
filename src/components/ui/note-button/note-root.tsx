"use client";

import * as React from "react";

export type NotePlacement =
  | "auto"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface NoteRootProps {
  children: React.ReactNode;
  storageKey?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  placement?: NotePlacement;
  width?: number;
  height?: number;
  breakpoint?: number;
  showLineNumbers?: boolean;
}

export interface NoteContextValue {
  open: boolean;
  requestClose: () => void;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  storageKey: string;
  placement: NotePlacement;
  width: number;
  height: number;
  breakpoint: number;
  showLineNumbers: boolean;
  panelId: string;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  registerTrigger: (element: HTMLButtonElement | null) => void;
}

const NoteContext = React.createContext<NoteContextValue | null>(null);

export function useNoteContext() {
  const context = React.useContext(NoteContext);
  if (!context) {
    throw new Error("Note components must be rendered inside Note.Root.");
  }
  return context;
}

export function NoteRoot({
  children,
  storageKey = "peel-note:v1",
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  value: controlledValue,
  onValueChange,
  placement = "auto",
  width = 380,
  height = 340,
  breakpoint = 640,
  showLineNumbers = true,
}: NoteRootProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [internalValue, setInternalValue] = React.useState("");
  const [loadedStorageKey, setLoadedStorageKey] = React.useState<string | null>(
    null
  );
  const isOpenControlled = controlledOpen !== undefined;
  const isValueControlled = controlledValue !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;
  const value = isValueControlled ? controlledValue : internalValue;
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const valueRef = React.useRef(value);
  const writeTimerRef = React.useRef<number | null>(null);
  const panelId = React.useId();

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  React.useEffect(() => {
    let storedValue: string | null = null;
    try {
      storedValue = window.localStorage.getItem(storageKey);
    } catch (error) {
      console.error("Unable to read the saved note from local storage.", error);
    }

    if (!isValueControlled && storedValue !== null) {
      // Restoring client-only storage is the reason this effect updates state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalValue(storedValue);
    }
    setLoadedStorageKey(storageKey);
  }, [isValueControlled, storageKey]);

  const writeValue = React.useCallback(
    (nextValue: string) => {
      try {
        window.localStorage.setItem(storageKey, nextValue);
      } catch (error) {
        console.error("Unable to save the note to local storage.", error);
      }
    },
    [storageKey]
  );

  React.useEffect(() => {
    if (loadedStorageKey !== storageKey) return;

    if (writeTimerRef.current !== null) {
      window.clearTimeout(writeTimerRef.current);
    }
    writeTimerRef.current = window.setTimeout(() => {
      writeValue(value);
      writeTimerRef.current = null;
    }, 250);

    return () => {
      if (writeTimerRef.current !== null) {
        window.clearTimeout(writeTimerRef.current);
        writeTimerRef.current = null;
      }
    };
  }, [loadedStorageKey, storageKey, value, writeValue]);

  React.useEffect(() => {
    const saveImmediately = () => {
      if (writeTimerRef.current !== null) {
        window.clearTimeout(writeTimerRef.current);
        writeTimerRef.current = null;
      }
      writeValue(valueRef.current);
    };
    window.addEventListener("pagehide", saveImmediately);
    return () => window.removeEventListener("pagehide", saveImmediately);
  }, [writeValue]);

  React.useEffect(
    () => () => {
      if (writeTimerRef.current !== null) {
        window.clearTimeout(writeTimerRef.current);
        writeValue(valueRef.current);
        writeTimerRef.current = null;
      }
    },
    [writeValue]
  );

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === open) return;
      if (!isOpenControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange, open]
  );

  const requestClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (!isValueControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [isValueControlled, onValueChange]
  );

  const registerTrigger = React.useCallback(
    (element: HTMLButtonElement | null) => {
      triggerRef.current = element;
    },
    []
  );

  const contextValue = React.useMemo<NoteContextValue>(
    () => ({
      open,
      requestClose,
      setOpen,
      value,
      setValue,
      storageKey,
      placement,
      width,
      height,
      breakpoint,
      showLineNumbers,
      panelId,
      triggerRef,
      registerTrigger,
    }),
    [
      open,
      requestClose,
      setOpen,
      value,
      setValue,
      storageKey,
      placement,
      width,
      height,
      breakpoint,
      showLineNumbers,
      panelId,
      registerTrigger,
    ]
  );

  return (
    <NoteContext.Provider value={contextValue}>
      {children}
    </NoteContext.Provider>
  );
}
