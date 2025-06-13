# Interactive Portfolio Terminal

An interactive, web-based terminal showcasing my projects and skills. This project features a unique, dual-interface design optimized for both desktop and mobile users.

**[➡️ View the Live Demo!](https://snehabichkunde.github.io/Portfolio_Terminal/)**

### Desktop View (Dark & Matrix Themes)
<img width="800" alt="Desktop Dark Theme" src="https://github.com/user-attachments/assets/97a5bc27-cd5b-4815-a432-04ff9bd9bd23" />
<img width="800" alt="Desktop Matrix Theme" src="https://github.com/user-attachments/assets/eda2cb74-197f-4df4-b20f-1b220e0eca2e" />

### Mobile "Click-Only" UI
<img width="350" alt="Mobile UI Screenshot" src="https://github.com/user-attachments/assets/788aac87-8b57-4930-856d-61e2829f165c" />

---

## 🚀 Key Features

*   **Dual-Interface Design**:
    *   **Desktop**: A classic, type-able terminal with command history (`↑`/`↓`) and smart Tab auto-completion.
    *   **Mobile**: A streamlined, "click-only" interface with a scrollable bar of command "chips" for easy touch navigation.
*   **Theming Engine**: Switch between multiple color schemes (`dark`, `light`, `matrix`, `hello_kitty`). Your preference is saved locally using `localStorage`.
*   **Pure JavaScript**: The core terminal logic is built from scratch without any external JS frameworks, demonstrating a strong understanding of the DOM, event handling, and async JavaScript.
*   **Content-Driven**: All portfolio data (projects, skills, personal info) is stored in a structured `content` object, making updates simple and safe.
*   **Animated Introduction**: A typewriter effect for the welcome message provides a polished and engaging introduction.

## 🛠️ Technologies Used

*   **Frontend**: `HTML5`, `CSS3` (with CSS Variables), `JavaScript (ES6+)`
*   **Background Animation**: `p5.js`

## ✨ Getting Started

Open the [live demo](https://snehabichkunde.github.io/Portfolio_Terminal/). The experience is tailored to your device.

*   **On Desktop**: You can type commands directly. Try these to start:
    *   `help` - Shows a list of all available commands.
    *   `about-me` - Learn more about me.
    *   `my-projects` - View a list of my key projects.
    *   `themes light` - Switch to a different visual theme.

*   **On Mobile**: The interface is click-only. Use the command chips at the bottom of the screen to navigate the portfolio.

## 💡 Code Highlights & Architecture

This project was a fantastic opportunity to implement several key software engineering concepts.

### Adaptive User Experience
A primary focus was creating a distinct yet equally functional experience for different platforms. The application uses JavaScript and CSS media queries to render a fundamentally different UI based on screen size. The mobile view is not just a scaled-down desktop site; it is an interface designed specifically for touch, which respects the limitations of mobile keyboards and provides a more natural user experience.

### Centralized Command Logic
The heart of the application is a single, centralized `executeCommand` function. All user inputs, whether from the desktop keyboard or mobile command chips, are funneled through this function. It is responsible for parsing commands, executing logic (synchronously or `async`), handling errors, rendering output, and preparing the next active prompt. This unified design makes the system predictable, scalable, and easy to debug.

## ✍️ Author

*   **Sneha Bichkunde** - [GitHub](https://github.com/snehabichkunde) | [LinkedIn](https://www.linkedin.com/in/sneha-bichkunde-aba203269/)