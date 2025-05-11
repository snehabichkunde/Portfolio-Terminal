const terminalPortfolio = (() => {
  const terminal = document.getElementById("main");
  let currentPath = "/";
  let commandHistory = [];
  let historyIndex = -1;

  const fileSystem = {
    "/": ["about", "projects", "games", "interests", "hobbies", "themes", "calculator", "technical_skills", "resume"],
    "/games": ["snake", "tictactoe", "flappybird", "bubblecrash"],
    "/projects": ["digital_diary", "my_shell", "boids_flocking"],
    "/projects/digital_diary": [],
    "/projects/my_shell": [],
    "/projects/boids_flocking": [],
    "/technical_skills": [],
    "/hobbies": [],
    "/interests": [],
    "/themes": ["dark", "light", "glass"],
  };

  const fileContent = {
    "/about": `
{
  "name": "Sneha Bichkunde",
  "student_at": "SGGS, Nanded",
  "role": "SDE",
  "location": "Nanded",
  "email": "bichkundesneha@gmail.com",
  "fun_fact": "I automate everything, even my coffee brewing! 😄"
}
    `,
    "/hobbies": `
{
  "hobbies": ["reading", "writing poetry", "building websites"]
}
    `,
    "/interests": `
{
  "interests": ["Backend Development", "System Programming", "Distributed Systems"]
}
    `,
    "/technical_skills": `
{
  "languages": ["C", "C++", "JavaScript"],
  "tools": ["Git", "GitHub", "Docker", "VS Code", "Bash", "GDB", "Makefile"],
  "frameworks": ["Node.js", "Express.js", "React.js", "Socket.io"],
  "databases": ["MongoDB", "MySQL"],
  "soft_skills": ["Problem-solving", "Teamwork", "Communication", "Time Management"],
  "coursework": ["Operating Systems", "Data Structures & Algorithms", "DBMS", "Computer Networks"]
}
    `,
    "/projects": `
{
  "projects": [
    {
      "name": "Digital Diary",
      "description": "Full-stack app for secure personal stories.",
      "tech": ["React.js", "Node.js", "MongoDB", "JWT"],
      "live_link": "https://digital-diary-sneha.netlify.app/",
      "github": "https://github.com/snehabichkunde/DigitalDiary"
    },
    {
      "name": "my_shell",
      "description": "POSIX-compliant shell in C for enhanced terminal interaction.",
      "tech": ["C", "ncurses"],
      "github": "https://github.com/snehabichkunde/c-shell"
    },
    {
      "name": "Boids Flocking",
      "description": "Flocking simulation in p5.js with Quadtree optimization.",
      "tech": ["p5.js", "JavaScript"],
      "live_link": "https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/",
      "github": "https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree"
    }
  ]
}
    `,
    "/projects/digital_diary": `
{
  "name": "Digital Diary",
  "description": "Full-stack app for secure personal stories.",
  "tech": ["React.js", "Node.js", "MongoDB", "JWT"],
  "details": [
    "Built with React.js frontend and Node.js/Express.js backend",
    "Used JWT for secure authentication",
    "Deployed on Netlify and Render"
  ],
  "live_link": "https://digital-diary-sneha.netlify.app/",
  "github": "https://github.com/snehabichkunde/DigitalDiary"
}
    `,
    "/projects/my_shell": `
{
  "name": "my_shell",
  "description": "POSIX-compliant shell in C for enhanced terminal interaction.",
  "tech": ["C", "ncurses"],
  "details": [
    "Interactive REPL with ncurses",
    "Supports command history and process management"
  ],
  "github": "https://github.com/snehabichkunde/c-shell"
}
    `,
    "/projects/boids_flocking": `
{
  "name": "Boids Flocking",
  "description": "Flocking simulation in p5.js with Quadtree optimization.",
  "tech": ["p5.js", "JavaScript"],
  "details": [
    "Optimized with Quadtree (O(n log n))",
    "Real-time rendering of 100+ boids"
  ],
  "live_link": "https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/",
  "github": "https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree"
}
    `,
    "/resume": `
{
  "message": "Opening resume..."
}
    `,
    "/themes": `
{
  "available_themes": ["dark", "light", "glass"],
  "description": "Use 'theme <name>' to switch themes."
}
    `,
    "/themes/dark": `
{
  "name": "Dark",
  "description": "A dark theme with soft green text and a sleek, modern look.",
  "command": "theme dark"
}
    `,
    "/themes/light": `
{
  "name": "Light",
  "description": "A bright theme with dark text, ideal for daytime use.",
  "command": "theme light"
}
    `,
    "/themes/glass": `
{
  "name": "Glass",
  "description": "A frosted-glass effect with light text for a futuristic vibe.",
  "command": "theme glass"
}
    `
  };

  function getPrompt() {
    const pathDisplay = currentPath === "/" ? "~" : currentPath.replace(/^\/|\/$/g, "");
    return `sneha@portfolio:${pathDisplay}$ `;
  }

  const welcomeMessage = `
Welcome to Sneha Bichkunde's Portfolio Terminal
---------------------------------------------
Type 'help' to see available commands.
Current directory: ${currentPath}
`;

  function scrollToBottom() {
    terminal.scrollTop = terminal.scrollHeight;
  }

  function replaceCurrentLine(text) {
    const lines = terminal.value.split("\n");
    lines[lines.length - 1] = `${getPrompt()}${text}`;
    terminal.value = lines.join("\n");
    scrollToBottom();
    terminal.setSelectionRange(terminal.value.length, terminal.value.length);
  }

  function typeOutput(output, callback) {
    let i = 0;
    terminal.value += "\n";
    const interval = setInterval(() => {
      terminal.value += output[i] || "";
      scrollToBottom();
      i++;
      if (i >= output.length) {
        clearInterval(interval);
        terminal.value += `\n${getPrompt()}`;
        scrollToBottom();
        callback();
      }
    }, 10);
  }

  function typeWelcomeMessage() {
    let i = 0;
    const interval = setInterval(() => {
      terminal.value += welcomeMessage[i] || "";
      scrollToBottom();
      i++;
      if (i >= welcomeMessage.length) {
        clearInterval(interval);
        terminal.value += `\n${getPrompt()}`;
        scrollToBottom();
        terminal.setSelectionRange(terminal.value.length, terminal.value.length);
      }
    }, 20);
  }

  terminal.addEventListener("input", () => {
    const prompt = getPrompt();
    const lines = terminal.value.split("\n");
    const lastLine = lines[lines.length - 1];
    if (!lastLine.startsWith(prompt)) {
      lines[lines.length - 1] = prompt + lastLine.slice(prompt.length);
      terminal.value = lines.join("\n");
      terminal.setSelectionRange(terminal.value.length, terminal.value.length);
    }
  });

  terminal.addEventListener("keydown", (e) => {
    const lines = terminal.value.split("\n");
    const lastLine = lines[lines.length - 1];
    const prompt = getPrompt();
    const inputStart = terminal.value.lastIndexOf(prompt) + prompt.length;

    if (terminal.selectionStart < inputStart && e.key !== "Enter" && e.key !== "Tab") {
      e.preventDefault();
      terminal.setSelectionRange(terminal.value.length, terminal.value.length);
      return;
    }

    if (e.key === "ArrowUp" && !e.ctrlKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        replaceCurrentLine(commandHistory[historyIndex]);
      } else if (commandHistory.length > 0 && historyIndex === -1) {
        historyIndex = commandHistory.length - 1;
        replaceCurrentLine(commandHistory[historyIndex]);
      }
    }

    if (e.key === "ArrowDown" && !e.ctrlKey) {
      e.preventDefault();
      if (historyIndex >= 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        replaceCurrentLine(commandHistory[historyIndex]);
      } else {
        replaceCurrentLine("");
        historyIndex = -1;
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const input = lastLine.replace(prompt, "").trim();
      const [command, ...args] = input.split(" ");
      if (command === "cd" && args[0]) {
        const matches = fileSystem[currentPath]?.filter(item => item.startsWith(args[0])) || [];
        if (matches.length === 1) {
          replaceCurrentLine(`cd ${matches[0]}`);
        }
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      let input = lastLine.replace(prompt, "").trim();
      let [command, ...args] = input.split(" ");
      let output = "";

      if (input !== "") commandHistory.push(input);
      historyIndex = -1;

      if (input === "") {
        terminal.value += `\n${prompt}`;
        scrollToBottom();
        return;
      }

      switch (command) {
        case "help":
          output = `
Available Commands:
-------------------
help         - Show available commands
clear        - Clear the terminal screen
ls           - List directories and files
cd <dir>     - Change directory or view file content
cd ..        - Go back
get github   - Open GitHub profile
get linkedin - Open LinkedIn profile
play <game>  - Play a game (snake, tictactoe, etc.)
theme <name> - Switch theme (dark, light, glass)
calc <expr>  - Calculate expression (e.g., 2+3*4)
resume       - View resume
          `;
          break;

        case "clear":
          terminal.value = `${prompt}`;
          scrollToBottom();
          return;

        case "ls":
          output = fileSystem[currentPath]?.join("  ") || "dir: No such directory.";
          break;

        case "cd":
          if (args[0] === "..") {
            if (currentPath !== "/") {
              currentPath = currentPath.split("/").slice(0, -2).join("/") + "/" || "/";
              output = fileContent[currentPath] ? fileContent[currentPath].trim() : "";
            } else {
              output = "Already at root.";
            }
          } else if (args[0]) {
            const targetPath = currentPath === "/" ? `/${args[0]}` : `${currentPath}${args[0]}`;
            const dirPath = `${targetPath}/`;
            if (fileSystem[dirPath]) {
              currentPath = dirPath;
              output = fileContent[currentPath] ? fileContent[currentPath].trim() : "";
            } else if (fileContent[targetPath]) {
              output = fileContent[targetPath].trim();
            } else {
              output = `cd: ${args[0]}: No such file or directory.`;
            }
          } else {
            output = `cd: Missing file or directory operand.`;
          }
          break;

        case "get":
          if (args[0] === "github") {
            output = "Opening GitHub...";
            window.open("https://github.com/snehabichkunde", "_blank");
          } else if (args[0] === "linkedin") {
            output = "Opening LinkedIn...";
            window.open("https://www.linkedin.com/in/sneha-bichkunde-aba203269/", "_blank");
          } else {
            output = `get: ${args[0] || ""}: Invalid option.`;
          }
          break;

        case "play":
          if (fileSystem["/games"]?.includes(args[0])) {
            output = `Launching ${args[0]}... (Game not implemented yet)`;
          } else {
            output = `play: ${args[0] || ""}: Game not found.`;
          }
          break;

        case "theme":
          if (["dark", "light", "glass"].includes(args[0])) {
            document.body.className = `theme-${args[0]}`;
            output = `Theme switched to ${args[0]}`;
            window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: args[0] } }));
          } else {
            output = `theme: ${args[0] || ""}: Invalid theme. Use dark, light, or glass.`;
          }
          break;

        case "calc":
          try {
            const result = eval(args.join(" "));
            output = `${result}`;
          } catch {
            output = `calc: Invalid expression.`;
          }
          break;

        case "resume":
          output = "Opening resume...";
          window.open("https://example.com/sneha_resume.pdf", "_blank");
          break;

        default:
          output = `bash: ${command}: command not found`;
      }

      typeOutput(output, () => {
        terminal.setSelectionRange(terminal.value.length, terminal.value.length);
      });
    }
  });

  return {
    init: () => {
      terminal.value = "";
      typeWelcomeMessage();
      terminal.focus();
    }
  };
})();

terminalPortfolio.init();