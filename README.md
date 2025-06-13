# Interactive Portfolio Terminal

Welcome to my portfolio, reimagined as a fully interactive, web-based terminal! This project is a creative and personal showcase of my skills in front-end development, user experience design, and my passion for the command-line interface.

**[View the Live Demo!](https://snehabichkunde.github.io/Portfolio_Terminal/)**

| Desktop View (Dark Theme) | Desktop View (Matrix Theme) | Mobile "Click-Only" UI |
| :-----------------------: | :---------------------------: | :--------------------: |
| <img width="1440" alt="Desktop Dark Theme" src="https://github.com/user-attachments/assets/97a5bc27-cd5b-4815-a432-04ff9bd9bd23" /> | <img width="1435" alt="Desktop Matrix Theme" src="https://github.com/user-attachments/assets/eda2cb74-197f-4df4-b20f-1b220e0eca2e" /> | <img width="400" alt="Mobile UI Screenshot" src="https://github.com/user-attachments/assets/788aac87-8b57-4930-856d-61e2829f165c" /> |

## 🚀 Features

This is not just a static page; it's a feature-rich terminal application built from scratch with pure JavaScript, HTML, and CSS.

*   **Dual-Interface Design**: A responsive layout that provides a unique, optimized experience for both desktop and mobile users.
    *   **Desktop**: A classic, type-able terminal with command history (`↑`/`↓` arrows) and smart Tab auto-completion.
    *   **Mobile**: A streamlined, "click-only" interface with a persistent, scrollable command bar, designed for easy touch interaction without needing a keyboard.
*   **Dynamic Command Processing**: A robust command parser handles commands, arguments, and displays formatted output for projects, skills, and personal information.
*   **Theming Engine**: Users can switch between multiple color schemes (`dark`, `light`, 'matrix', `hello_kitty`) using the `themes` command. The selected theme is saved to `localStorage` for a persistent experience.
*   **Content-Driven**: All portfolio data (projects, skills, about me) is stored in a structured `content` object, making it easy to update without touching the core application logic.
*   **Animated Introduction**: A typewriter effect for the welcome message provides a polished and engaging introduction for first-time visitors.
*   **Pure JavaScript**: No external frameworks (like React, Vue, or Angular) were used for the core terminal logic, demonstrating a strong understanding of the DOM, event handling, and asynchronous JavaScript.

## 🛠️ Technologies Used

*   **Frontend**: `HTML5`, `CSS3` (with CSS Variables for theming), `JavaScript (ES6+)`
*   **Fonts**: `JetBrains Mono` from Google Fonts for an authentic monospace aesthetic.
*   **Background Animation**: `p5.js` is used to drive the "boids flocking" particle animation, which also reacts to theme changes.

## ✨ Getting Started

Simply open the [live demo link](https://snehabichkunde.github.io/Portfolio_Terminal/).

*   **On Desktop**: You can type commands directly. Try these to start:
    *   `help` - Shows a list of all available commands.
    *   `about-me` - Learn a little more about me.
    *   `my-projects` - Displays a list of my key projects with descriptions and links.
    *   `themes light` - Try switching to a different theme!

*   **On Mobile**: The interface is click-only. Use the command chips at the bottom of the screen to navigate the portfolio.

## 💡 Code Highlights & Architecture

This project was a fantastic opportunity to implement several key software engineering concepts.

### Separation of Concerns
The project is structured logically:
- **`index.html`**: The static structure, including the layouts for both desktop and mobile views.
- **`style.css`**: All styling, theming, and responsiveness. The use of CSS Variables for colors allows for a clean and highly maintainable theming system.
- **`main.js`**: The core application logic, containing the command parser, state management, and all DOM manipulation.
- **`flocking.js`**: The self-contained `p5.js` animation logic.

### Adaptive User Experience
A primary focus was creating a distinct yet equally functional experience for different platforms. The application uses JavaScript and CSS media queries to dynamically render a completely different UI based on screen size. The mobile view is not just a scaled-down desktop site; it is a fundamentally different interface designed for touch, demonstrating a deep consideration for user experience (UX).

### Centralized Command Logic (`executeCommand` function)
The heart of the application is a single `executeCommand` function. All user inputs—whether from typing on a desktop keyboard, tapping a command chip on mobile, or the initial startup command—are funneled through this centralized function. It is responsible for:
1.  Parsing the command string.
2.  Looking up the command in the `commands` object.
3.  Executing the corresponding function (which can be synchronous or `async`).
4.  Gracefully handling errors for unknown commands.
5.  Rendering the output to the terminal log.
6.  Preparing the next active prompt for desktop users.

This centralized design makes the system predictable, scalable, and easy to debug.

## ✍️ Author

*   **Sneha Bichkunde** - [GitHub](https://github.com/snehabichkunde) | [LinkedIn](https://www.linkedin.com/in/sneha-bichkunde-aba203269/)