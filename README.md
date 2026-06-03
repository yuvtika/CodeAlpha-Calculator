# ✦ CalcPro — Modern Glassmorphic Calculator ✦

CalcPro is a premium, web-based calculator designed with a modern glassmorphic interface, dynamic animated background orbs, responsive layouts, chained arithmetic calculations, and full keyboard accessibility.

---

## 🔗 Live Link
Access the live deployment of the CalcPro Calculator here:
> 🚀 **Live Demo:** **https://strong-babka-fab3a3.netlify.app/**

---

## 📸 Project Screenshots

### 1. Default State
The default view displaying the glassmorphic card interface, glowing animated background orbs, utility/numerical grids, and a keyboard support reminder.
![Default State](images/screenshot_default.png)

### 2. Calculated State
An active calculation demonstrating expression tracking, localized thousand separators, and formatted results.
![Calculated State](images/screenshot_calculated.png)

---

## ✨ Features

- **Immersive Visual Design:** Elegant dark mode background featuring three glowing, floating color orbs that move smoothly using CSS keyframe animations.
- **Glassmorphic UI Card:** Semi-transparent, blurred backdrop (`blur(40px) saturate(1.4)`) with fine border highlights and soft drop shadows.
- **Dynamic Expression Preview:** Real-time equation display showing the current left-hand operand and selected operator above the current input.
- **Robust Calculations:**
  - Chained calculations allowing you to perform operations sequentially without hitting equals (e.g., `7 + 5 + 3`).
  - Precision handling using `.toPrecision(12)` to eliminate floating-point arithmetic errors.
  - Automatic comma thousand-separators (e.g., `1,234,567.89`) for readability.
- **Smart Display Autosizing:** Text font dynamically scales down (`shrink`) when the input exceeds 12 characters to prevent visual overflow.
- **User Feedback Animations:**
  - Responsive ripple click effects centered on button presses.
  - Visual error feedback (shake animation and red display text) on invalid operations (e.g., division by zero).
- **Comprehensive Keyboard Support:** Use standard keyboard shortcuts for all operations:
  - Numbers (`0`-`9`) and decimal (`.`)
  - Arithmetic operators (`+`, `-`, `*`, `/`)
  - Percentage (`%`)
  - Evaluation (`Enter` or `=`)
  - Backspace (`Backspace`)
  - Clear (`Delete` or `Escape`)
- **Fully Responsive Layout:** Automatically scales down for tablets and smaller smartphones, retaining crisp contrast and ease-of-use.

---

## 📁 Project Structure

```text
calculator/
├── index.html          # HTML structure, accessibility tags, and keyboard hints
├── index.css           # Custom CSS variables, floating orbs, glassmorphism, ripple/shake keyframes, and media queries
├── calculator.js       # Arithmetic evaluation logic, font sizing, error states, and keyboard bindings
└── images/             # Saved screenshot assets
    ├── screenshot_default.png
    └── screenshot_calculated.png
```

---

## 🛠️ Technologies Used

- **HTML5:** Clean markup with semantic layout tags and `aria` attributes for accessibility.
- **CSS3:** Flexbox and CSS Grid layout, custom design tokens, CSS transitions, keyframe animations, and media queries.
- **JavaScript (ES6+):** Pure vanilla JavaScript utilizing an IIFE, event listeners, array mappings, and state machine controls.

---

## 🚀 How to Run Locally

To open the project locally, you can open `index.html` directly in a browser or host it on a local static server to support web performance tools.

### Option 1: Python HTTP Server (Recommended)
Open your terminal inside the calculator directory and run:
```bash
python -m http.server 8000
```
Then go to [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Node.js (npx)
Using Node.js, execute the following command:
```bash
npx http-server -p 8000
```
Then navigate to [http://localhost:8000](http://localhost:8000) in your browser.
