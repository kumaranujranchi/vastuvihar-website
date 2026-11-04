'use client';

import { useEffect, useId, useRef, useState } from 'react';

const TYPEAHEAD_RESET_MS = 500;

/**
 * Styled dropdown backed by a native <select>. The select stays the form field,
 * so animations/project-filter.js reads it as before, and it is what visitors
 * use until the page hydrates (or if JavaScript is unavailable).
 */
export default function FilterDropdown({ name, label, options, defaultValue = '' }) {
  const id = useId();
  const rootRef = useRef(null);
  const selectRef = useRef(null);
  const listRef = useRef(null);
  const typed = useRef({ text: '', at: 0 });

  const [ready, setReady] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openUp, setOpenUp] = useState(false);

  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const lastIndex = options.length - 1;

  useEffect(() => {
    // Pick up anything chosen before hydration or restored by the browser.
    setValue(selectRef.current.value);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  function openMenu(index = selectedIndex) {
    const { top, bottom } = rootRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - bottom;
    setOpenUp(spaceBelow < listRef.current.offsetHeight + 8 && top > spaceBelow);
    setActiveIndex(index);
    setOpen(true);
  }

  function choose(index) {
    setOpen(false);
    const next = options[index].value;
    if (next === value) return;
    setValue(next);
    selectRef.current.value = next;
    selectRef.current.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function typeAhead(event) {
    const { text, at } = typed.current;
    const query = (event.timeStamp - at < TYPEAHEAD_RESET_MS ? text : '') + event.key.toLowerCase();
    typed.current = { text: query, at: event.timeStamp };
    const match = options.findIndex((option) => option.label.toLowerCase().startsWith(query));
    if (match === -1) return;
    if (open) setActiveIndex(match);
    else openMenu(match);
  }

  function handleKeyDown(event) {
    const { key } = event;
    if (key === 'Tab') return; // Blur closes the menu.

    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
      event.preventDefault();
      openMenu();
    } else if (open && key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, lastIndex));
    } else if (open && key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (open && key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (open && key === 'End') {
      event.preventDefault();
      setActiveIndex(lastIndex);
    } else if (open && (key === 'Enter' || key === ' ')) {
      event.preventDefault();
      choose(activeIndex);
    } else if (open && key === 'Escape') {
      setOpen(false);
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      typeAhead(event);
    }
  }

  return (
    <div
      ref={rootRef}
      className="vv-filter"
      data-ready={ready || undefined}
      data-open={open || undefined}
      data-filled={value !== '' || undefined}
      data-up={openUp || undefined}
    >
      <span className="vv-filter__label" id={`${id}-label`}>{label}</span>

      <select
        ref={selectRef}
        name={name}
        aria-label={label}
        defaultValue={defaultValue}
        onChange={(event) => setValue(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      {ready && (
        <>
          <button
            type="button"
            className="vv-filter__trigger"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-labelledby={`${id}-label ${id}-value`}
            aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
            onClick={() => (open ? setOpen(false) : openMenu())}
            onKeyDown={handleKeyDown}
            onBlur={() => setOpen(false)}
          >
            <span className="vv-filter__value" id={`${id}-value`}>{options[selectedIndex].label}</span>
            <svg className="vv-filter__chevron" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 6l5 5 5-5" />
            </svg>
          </button>

          <ul
            ref={listRef}
            className="vv-filter__menu"
            id={`${id}-list`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            // Keep focus on the trigger so clicks here don't count as a blur.
            onMouseDown={(event) => event.preventDefault()}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                className="vv-filter__option"
                role="option"
                aria-selected={index === selectedIndex}
                data-active={(open && index === activeIndex) || undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                <svg className="vv-filter__check" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8.5l3.5 3.5L13 4.5" />
                </svg>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
