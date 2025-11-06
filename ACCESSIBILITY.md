# Accessibility Guidelines

Any UI code you write or modify should be fully accessible by default. This ensures that the UI application provides an equitable and functional experience for all users, including those with visual, auditory, motor, and cognitive disabilities. Accessibility is not an add-on, it is a core tenet of your development process. Every UI component you generate, every UI feature you implement, and every line of UI code you write must adhere to the **Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** standards. This is a non-negotiable, top-priority requirement.

== General Accessibility Principles
You must integrate these core principles into every aspect of your code generation. They represent a foundational checklist, but you are expected to apply your full expertise to identify and fix any accessibility issue that violates the broader WCAG 2.2 AA standard, even if it is not on this list.

1.1. Use Semantic HTML First
The foundation of an accessible web is using HTML elements for their intended purpose.
- Landmarks: Use <header>, <footer>, <nav>, <main>, and <section> to give the page a logical structure that screen readers can navigate.
- Headings: Structure content with a clear and sequential heading hierarchy (<h1> to <h6>). Never skip heading levels (e.g., jumping from an <h1> to an <h3>).
- Interactive Elements: Always use <button> for actions (e.g., submitting a form, opening a modal). Always use <a href="..."> for navigation to another page or resource. Do not use <div> or <span> with onClick handlers for buttons or links.

1.2. Provide Text Alternatives for All Non-Text Content
If it's not text, it needs a text alternative.
- Informative Images: All <img> tags that convey information must have a descriptive alt attribute.
- Decorative Images: If an image is purely decorative, provide an empty alt="" attribute to hide it from screen readers.
- Icon-Only Buttons: A button with only an icon must use an aria-label to describe its function.

1.3. Use ARIA Sparingly and Correctly
Semantic HTML is always preferred. Only use ARIA (Accessible Rich Internet Applications) attributes when native HTML is insufficient for complex, dynamic components.
- Roles: Define the purpose of a component with a role (e.g., role="dialog").
- State: Use aria-\* attributes to communicate the current state of a component (e.g., aria-expanded="true", aria-selected="false").

1.4. Ensure 100% Keyboard Navigability
All interactive elements must be reachable and operable using only the keyboard.
- Focus Order: The tab order of elements must be logical and predictable, following the visual flow of the page.
- Visible Focus: Every focusable element must have a highly visible focus indicator (e.g., using the CSS `outline` property) that has a strong contrast against the background.
- Custom Widgets: If you create custom components like dropdowns or modals, ensure they trap focus appropriately and can be closed with the Escape key.

1.5. Build Accessible Forms
Forms are a common point of failure. Get them right every time.
- Labels: Every <input>, <textarea>, and <select> must have an associated <label>. Use the htmlFor attribute on the label, linking it to the id of the input. Placeholders are not a substitute for labels.
- Error Handling: Identify errors clearly. Associate error messages with their respective input fields using aria-describedby. When an error occurs, programmatically move focus to the first invalid field.

1.6. Guarantee Sufficient Color Contrast
Text and important UI elements must be easily distinguishable from their background.
- WCAG AA Ratio:
  - Normal Text: Must have a contrast ratio of at least 4.5:1.
  - Large Text (24px+ or 18.66px+ bold): Must have a contrast ratio of at least 3:1.
- Practical Application: Be cautious with light gray text on white or light backgrounds, as this combination frequently fails contrast requirements. Always test color combinations with a contrast checker.

1.7. Do Not Rely on Color Alone
Color cannot be the only method used to convey information or indicate an action.
- Links: A link within a paragraph should have a non-color indicator, like an underline, in addition to a different color.
- Status Messages: When indicating success or an error, supplement color (e.g., a green or red border) with an icon and explicit text.

1.8. Enable Text Resizing and Content Reflow
Users must be able to zoom the page up to 200% without the layout breaking or requiring horizontal scrolling to read text.
- Use Relative Units: Use relative units like `rem` for `font-size` to respect user-defined font settings. Use relative units for spacing (margin, padding) where possible.
- Avoid Fixed Heights: Do not set fixed heights on elements containing text (e.g., h-12). Instead, use min-h-12 to allow the container to expand vertically if the text size increases.

== Code Examples (Inaccessible vs. Accessible)
Use the "Accessible" patterns in all generated code.

Example 1 (The Interactive Button):
Inaccessible code snippet (Non-semantic <div>):

```javascript
// This is not a button. It is not focusable or operable via keyboard.
<div className="px-4 py-2 bg-blue-500 text-white" onClick={submitForm}>
  Submit
</div>
```

Accessible code snippet (Semantic <button>):

```javascript
// This is a proper button. It is focusable, keyboard-operable, and semantic.
<button
  className="px-4 py-2 bg-blue-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  onClick={submitForm}
>
  Submit
</button>
```

Example 2 (The Icon-Only Button):
Inaccessible code snippet (No Text Alternative):

```javascript
// A screen reader cannot determine the function of this button.
<button className="p-2">
  <svg>...</svg> {/* Close Icon */}
</button>
```

Accessible code snippet (With aria-label):

```javascript
// The aria-label provides a descriptive name for screen reader users.
<button
  aria-label="Close"
  className="p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
>
  <svg>...</svg> {/* Close Icon */}
</button>
```

Example 3 (The Form Input Field)
Inaccessible code snippet (No Label):

```javascript
// There is no programmatic label associated with this input.
<input type="email" placeholder="Email address" className="border p-2" />
```

Accessible code snippet (with <label>):

```javascript
// The <label> is correctly associated with the input via htmlFor and id.
<div>
  <label htmlFor="user-email" className="text-sm font-medium">
    Email address
  </label>
  <input id="user-email" type="email" className="mt-1 border p-2 w-full" />
</div>
```

Example 4 (Color Contrast and Status):
Inaccessible code snippet (Low Contrast, Color-Only Cue):

```javascript
// This alert has low-contrast text and uses color as the only indicator of its meaning.
<div className="p-4 bg-yellow-100 text-yellow-500 rounded">
  Warning: Your trial is about to expire.
</div>
```

Accessible code snippet(High Contrast, Icon + Text):

```javascript
// High-contrast text and a prepended icon make the message clear to everyone.
<div className="flex items-center p-4 bg-yellow-100 text-yellow-800 rounded">
  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
    {/* Warning Icon SVG */}
  </svg>
  <p>
    <strong>Warning:</strong> Your trial is about to expire.
  </p>
</div>
```

Example 5 (A Clickable Card):
Inaccessible code snippet (Generic div with onClick):

```javascript
// This card is not keyboard focusable or announced correctly by screen readers.
<div
  onClick={() => router.push("/details/1")}
  className="p-4 border rounded shadow hover:bg-gray-50"
>
  <h3 className="text-lg font-bold">Project Alpha</h3>
  <p className="text-sm text-gray-600">Click to view details.</p>
</div>
```

Accessible code snippet (Semantic Link with a clear action-oriented description):

```javascript
// The entire card is wrapped in a link, making it a single, clear focus stop.
// The improved sr-only text creates a more natural announcement for screen reader users.
<a
  href="/details/1"
  className="block p-4 border rounded shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <h3 className="text-lg font-bold">Project Alpha</h3>
  <p className="text-sm text-gray-600">Status: In Progress</p>
  <span className="sr-only">. View details for Project Alpha.</span>
</a>
```

Example 6 (An Informative Image):
Inaccessible code snippet (Missing alt attribute):

```javascript
// Missing alt attribute leaves screen reader users with no information.
<img src="/analytics-chart.png" />
```

Accessible code snippet (Descriptive alt attribute):

```javascript
// The alt text clearly describes the content and purpose of the image.
<img
  src="/analytics-chart.png"
  alt="A bar chart showing a 25% increase in user engagement for the month of May."
/>
```
