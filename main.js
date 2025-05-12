const terminalPortfolio = (() => {
  const terminal = document.getElementById("main");
  let currentPath = "/";
  let commandHistory = [];
  let historyIndex = -1;

  const fileSystem = {
    "/": [
      "about",
      "projects",
      "games",
      "interests",
      "hobbies",
      "technical_skills",
      "soft_skills",
      "coding_profiles",
      "coursework",
      "getgithub",
      "getlinkedin",
      "getcv",
      "themes"
    ],
    "/games": ["snake", "tictactoe", "flappybird", "bubblecrash"],
    "/projects": ["digital_diary", "my_shell", "boids_flocking"],
    "/projects/digital_diary": [],
    "/projects/my_shell": [],
    "/projects/boids_flocking": [],
    "/technical_skills": [],
    "/soft_skills": [],
    "/hobbies": [],
    "/interests": [],
    "/coding_profiles": [],
    "/coursework": [],
    "/getgithub": [],
    "/getlinkedin": [],
    "/getcv": [],
    "/themes": ["dark", "light", "glass"]
  };

  const fileContent = {
    "/about": `
{
  "name": "Sneha Bichkunde",
  "email": "bichkundesneha@gmail.com",
  "city": "Nanded",
  "education_summary": "B.Tech in Information Technology (8.3 GPA), SGGS Nanded",
  "fun_fact": "Why click when you can cd your way to anything?"
}
    `,
    "/hobbies": `
{
  "reading": ["Drama", "Philosophy", "Travel Journals"],
  "sports": ["Cycling", "Badminton"],
  "programming": ["Data Structures & Algorithms", "C++", "System Design"]
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
  "databases": ["MongoDB", "MySQL"]
}
    `,
    "/soft_skills": `
{
  "soft_skills": ["Problem-solving", "Teamwork", "Communication", "Time Management"]
}
    `,
    "/coursework": `
{
  "coursework": ["Operating Systems", "Data Structures & Algorithms", "DBMS", "Computer Networks"]
}
    `,
    "/projects": `
{
  "projects": [
    {
      "name": "Digital Diary",
      "description": "Developed a full-stack diary app to securely store and manage personal stories.",
      "tech": ["React.js", "Node.js", "MongoDB", "JWT"],
      "details": [
        "Built frontend with React.js and backend with Node.js/Express.js, using MongoDB for storage",
        "Implemented JWT authentication to protect user data and enable secure logins",
        "Deployed on Netlify and Render, supporting 100+ user requests with zero downtime"
      ],
      "live_link": {
        "text": "Live Demo",
        "url": "https://digital-diary-sneha.netlify.app/"
      },
      "github": {
        "text": "GitHub",
        "url": "https://github.com/snehabichkunde/DigitalDiary"
      }
    },
    {
      "name": "my_shell",
      "description": "Designed a POSIX-compliant shell in C to enhance terminal interaction.",
      "tech": ["C", "ncurses"],
      "details": [
        "Developed an interactive REPL with ncurses, improving navigation and feedback",
        "Integrated command history and process management for efficient workflows"
      ],
      "github": {
        "text": "GitHub",
        "url": "https://github.com/snehabichkunde/c-shell"
      }
    },
    {
      "name": "Boids Flocking",
      "description": "Created a flocking simulation in p5.js to model bird-like behavior efficiently.",
      "tech": ["p5.js", "JavaScript"],
      "details": [
        "Optimized neighbor detection with a Quadtree, reducing complexity from O(n^2) to O(n log n)",
        "Enhanced real-time performance for smooth rendering of 100+ boids"
      ],
      "live_link": {
        "text": "Live Demo",
        "url": "https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/"
      },
      "github": {
        "text": "GitHub",
        "url": "https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree"
      }
    }
  ],
  "table_format": "| Name | Description | Tech | Links |\n|------|-------------|------|-------|\n| Digital Diary | Full-stack diary app to securely store stories | React.js, Node.js, MongoDB, JWT | [Live Demo](https://digital-diary-sneha.netlify.app/), [GitHub](https://github.com/snehabichkunde/DigitalDiary) |\n| my_shell | POSIX-compliant shell in C | C, ncurses | [GitHub](https://github.com/snehabichkunde/c-shell) |\n| Boids Flocking | Flocking simulation with Quadtree optimization | p5.js, JavaScript | [Live Demo](https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/), [GitHub](https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree) |"
}
    `,
    "/projects/digital_diary": `
{
  "name": "Digital Diary",
  "description": "Developed a full-stack diary app to securely store and manage personal stories.",
  "tech": ["React.js", "Node.js", "MongoDB", "JWT"],
  "details": [
    "Built frontend with React.js and backend with Node.js/Express.js, using MongoDB for storage",
    "Implemented JWT authentication to protect user data and enable secure logins",
    "Deployed on Netlify and Render, supporting 100+ user requests with zero downtime"
  ],
  "live_link": {
    "text": "Live Demo",
    "url": "https://digital-diary-sneha.netlify.app/"
  },
  "github": {
    "text": "GitHub",
    "url": "https://github.com/snehabichkunde/DigitalDiary"
  }
}
    `,
    "/projects/my_shell": `
{
  "name": "my_shell",
  "description": "Designed a POSIX-compliant shell in C to enhance terminal interaction.",
  "tech": ["C", "ncurses"],
  "details": [
    "Developed an interactive REPL with ncurses, improving navigation and feedback",
    "Integrated command history and process management for efficient workflows"
  ],
  "github": {
    "text": "GitHub",
    "url": "https://github.com/snehabichkunde/c-shell"
  }
}
    `,
    "/projects/boids_flocking": `
{
  "name": "Boids Flocking",
  "description": "Created a flocking simulation in p5.js to model bird-like behavior efficiently.",
  "tech": ["p5.js", "JavaScript"],
  "details": [
    "Optimized neighbor detection with a Quadtree, reducing complexity from O(n^2) to O(n log n)",
    "Enhanced real-time performance for smooth rendering of 100+ boids"
  ],
  "live_link": {
    "text": "Live Demo",
    "url": "https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/"
  },
  "github": {
    "text": "GitHub",
    "url": "https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree"
  }
}
    `,
    "/coding_profiles": `
{
  "profiles": [
    {
      "name": "GFG",
      "link": {
        "text": "GFG Profile",
        "url": "https://www.geeksforgeeks.org/user/bichkund5ad6/"
      }
    },
    {
      "name": "LeetCode",
      "link": {
        "text": "LeetCode Profile",
        "url": "https://leetcode.com/u/SnehaBichkunde/"
      }
    }
  ]
}
    `,
    "/getgithub": `
{
  "redirect": "https://github.com/snehabichkunde",
  "message": "Redirecting to GitHub profile..."
}
    `,
    "/getlinkedin": `
{
  "redirect": "https://www.linkedin.com/in/sneha-bichkunde-aba203269/",
  "message": "Redirecting to LinkedIn profile..."
}
    `,
    "/getcv": `
{
  "message": "CV functionality coming soon!"
}
    `,
    "/games": `
{
  "message": "Games functionality coming soon!",
  "available_games": ["snake", "tictactoe", "flappybird", "bubblecrash"]
}
    `,
    "/games/snake": `
{
  "message": "Snake game coming soon!"
}
    `,
    "/games/tictactoe": `
{
  "message": "Tic-Tac-Toe game coming soon!"
}
    `,
    "/games/flappybird": `
{
  "message": "Flappy Bird game coming soon!"
}
    `,
    "/games/bubblecrash": `
{
  "message": "Bubble Crash game coming soon!"
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
getgithub    - Open GitHub profile
getlinkedin  - Open LinkedIn profile
getcv        - View CV (coming soon)
play <game>  - Play a game (snake, tictactoe, etc.)
theme <name> - Switch theme (dark, light, glass)
calc <expr>  - Calculate expression (e.g., 2+3*4)
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
              if (fileContent[targetPath].includes('"redirect"')) {
                const content = JSON.parse(fileContent[targetPath].trim());
                window.open(content.redirect, "_blank");
              }
            } else {
              output = `cd: ${args[0]}: No such file or directory.`;
            }
          } else {
            output = `cd: Missing file or directory operand.`;
          }
          break;

        case "getgithub":
          output = fileContent["/getgithub"].trim();
          window.open("https://github.com/snehabichkunde", "_blank");
          break;

        case "getlinkedin":
          output = fileContent["/getlinkedin"].trim();
          window.open("https://www.linkedin.com/in/sneha-bichkunde-aba203269/", "_blank");
          break;

        case "getcv":
          output = fileContent["/getcv"].trim();
          break;

        case "play":
          if (fileSystem["/games"]?.includes(args[0])) {
            output = fileContent[`/games/${args[0]}`]?.trim() || `Launching ${args[0]}... (Game not implemented yet)`;
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