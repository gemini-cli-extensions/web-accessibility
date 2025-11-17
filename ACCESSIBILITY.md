# Accessibility Guidelines

Any UI code you generate or modify should be fully accessible by default. This ensures that the UI application provides an equitable and functional experience for all users, including those with visual, auditory, motor, and cognitive disabilities. Accessibility is not an add-on, it is a core tenet of your development process. Every UI component you generate, every UI feature you implement, and every line of UI code you write must adhere to the **Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** standards. This is a non-negotiable, top-priority requirement.

== General Accessibility Principles & Coding Practices
You must integrate these core principles & adhere to these defined web accessible code writing practices while generating code. They represent a foundational checklist, but you are expected to apply your full knowledge and expertise to write fully web accessible code as per the broader WCAG 2.2 AA standard, even if it is not on this list.

1. Global Structure & Semantics
  - Semantic Landmarks: You must use native HTML5 semantic elements for page structure: <header>, <nav>, <main>, <aside>, and <footer>. Use aria-label to distinguish between multiple landmarks of the same type (e.g., two <nav> regions).
  - Heading Hierarchy:
    - Maintain a strictly logical heading structure (<h1>–<h6>).
    - There must be exactly one <h1> per page/view.
    - Never skip heading levels (e.g., do not jump from <h2> to <h4>).
  - Language Attribute: Ensure the <html> tag has a correct lang attribute (e.g., lang="en"). If content switches language, use lang on the specific element.

2. Focus Management & Keyboard Operability
  - Logical Focus Order: The tab order must match the visual order and the DOM order. Do not manipulate tabindex values (e.g., tabindex="1") arbitrarily.
  - Visible Focus: Ensure all interactive elements have a high-contrast visible focus indicator. Never remove default focus outlines (outline: none) without replacing them with a high-contrast alternative. Use the :focus-visible pseudo-class to style focus rings only for keyboard users.
  - Skip Navigation: Always include a "Skip to main content" link as the very first focusable element in the DOM.
  - Keyboard Equivalence: All actions executable via mouse must be executable via keyboard.
    - Clickable Elements: You must either use a native <button> (which handles keyboard events for you) or, if you must use a custom element (non-button) for interaction, you must add role="button", tabindex="0" and manually add onKeyDown listeners for handling both Enter and Space keydown events.

3. Forms & Validation
  - Labels are Mandatory: Every form input (input, textarea, select) must have a programmatically associated label via <label for="id">, aria-label, or aria-labelledby. Placeholder text is not a label.
  - Grouping Controls: You must use <fieldset> and <legend> to group related radio buttons and checkboxes.
  - Error Handling Best Practices:
    - Identification: On validation failure, set aria-invalid="true" on the invalid input.
    - Description: Place the error message text in a separate element and link it to the input using aria-describedby="error-id".
    - Notification: Use a "Live Region" (e.g., role="alert" or aria-live="assertive") to announce errors dynamically to screen readers.
    - Summary: For multi-field forms, provide an error summary at the top of the form that links to the invalid fields.
    - Required Fields: Mark required fields with the required HTML attribute. For custom controls, use aria-required="true".

4. Images & Media
  - Alt Text Strategy:
    - Informative: Provide descriptive text conveying the image's meaning.
    - Decorative Images: If an image is purely decorative, provide an empty alt="" attribute to hide it from screen readers.
    - Complex (Charts/Graphs): Provide a short summary in alt and link to a long description (or data table) via aria-describedby.
    - Functional Images (Icons): If an image is inside a button/link and is the only content, the alt text must describe the function, not the visual (e.g., "Search", not "Magnifying glass").
  - Media Controls:
    - Video: Must include captions for dialogue and audio descriptions for visual-only context.
    - Auto-play: Avoid auto-playing audio. If used, provide a mechanism to pause or stop it immediately.

5. Visual Design & Responsive Reflow
  - Relative Units: Use relative units (rem, em, %) for font sizes and container dimensions. Avoid fixed px heights for text containers.
  - Reflow Requirement: Ensure the UI reflows without horizontal scrolling (except for maps/diagrams) at 400% zoom or on a 320px wide screen.
  - Color Contrast:
    - Text: Normal text must meet 4.5:1 contrast ratio; Large text (18pt+ or bold 14pt+) must meet 3:1.
    - UI Components: Icons, inputs borders, and focus indicators must meet 3:1 contrast against the background.
    - Color Independence: Never use color alone to convey state (e.g., "Red means error"). Always add a text label or icon.

6. Interactive Component Patterns (WAI-ARIA Specs)
When building specific widgets, you must strictly follow these ARIA patterns:
  
  6.1. Modal Dialogs:
    - Role: role="dialog", aria-modal="true".
    - Focus: Move focus to the dialog on open. Focus must not escape the modal while open. Return focus to the triggering element on close.
    - Close: Ensure Escape key closes the dialog.
  
  6.2. Tabs:
    - Container: role="tablist".
    - Buttons: role="tab", aria-selected="true/false", aria-controls="panel-id".
    - Panels: role="tabpanel", aria-labelledby="tab-id".
    - Interaction: Use Left/Right arrow keys to navigate the tab list.

  6.3. Accordions:
    - Trigger: Button with aria-expanded="true/false" and aria-controls="panel-id".
    - Content: role="region" with aria-labelledby pointing back to the trigger.

  6.4. Menus / Dropdowns:
    - Container: role="menu" or menubar.
    - Items: role="menuitem".
    - Submenus: Use aria-haspopup="true" and aria-expanded on parent items.
    - Interaction: Use Up/Down/Left/Right arrow keys for navigation within the menu.

  6.5. Carousels:
    - Container: role="region", aria-roledescription="carousel".
    - Slides: role="group", aria-roledescription="slide".
    - Controls: Must include a visible Pause/Stop button for auto-rotation.

7. Single Page Application (SPA) Specifics
  - Route Changes: When the view changes (routing), you must programmatically move focus to the new main heading (h1) or a dedicated wrapper to alert the user they have moved.
  - Title Updates: Update the document.title on every route change.
  - Live Updates: Use aria-live="polite" for non-urgent updates (search results, cart updates, loading spinners, toast notifications) and aria-live="assertive" (or role="alert") for critical errors.
