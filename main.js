const terminalPortfolio = (() => {
  const terminal = document.getElementById("main");
  let currentPath = "/home/sneha/";
  let commandHistory = [];
  let historyIndex = -1;
  let projectLinks = { liveLink: null, githubLink: null }; // Store links for click handling

  const fileSystem = {
    "/": ["home", "bin", "README.md"],
    "/home": ["sneha"],
    "/home/sneha/": [
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
    "/bin": ["help", "ls", "cd", "clear", "pwd", "whoami", "echo", "man", "history"],
    "/home/sneha/games": ["snake", "tictactoe", "flappybird", "bubblecrash"],
    "/home/sneha/projects": ["digital_diary", "my_shell", "boids_flocking"],
    "/home/sneha/projects/digital_diary": [],
    "/home/sneha/projects/my_shell": [],
    "/home/sneha/projects/boids_flocking": [],
    "/home/sneha/technical_skills": [],
    "/home/sneha/soft_skills": [],
    "/home/sneha/hobbies": [],
    "/home/sneha/interests": [],
    "/home/sneha/coding_profiles": [],
    "/home/sneha/coursework": [],
    "/home/sneha/getgithub": [],
    "/home/sneha/getlinkedin": [],
    "/home/sneha/getcv": [],
    "/home/sneha/themes": ["dark", "light", "glass"]
  };

  const fileContent = {
    "/README.md": `
# Sneha Bichkunde's Portfolio Terminal
Welcome to my interactive portfolio! Navigate using commands like:
- \`ls\` to list contents
- \`cd <dir>\` to explore directories
- \`help\` for a list of commands
Enjoy exploring!
    `,
    "/home/sneha/about": `
{
  "name": "Sneha Bichkunde",
  "email": "bichkundesneha@gmail.com",
  "city": "Nanded",
  "education_summary": "B.Tech in Information Technology (8.3 GPA), SGGS Nanded",
  "fun_fact": "Why click when you can cd your way to anything?"
}
    `,
    "/home/sneha/hobbies": `
{
  "reading": ["Drama", "Philosophy", "Travel Journals"],
  "sports": ["Cycling", "Badminton"],
  "programming": ["Data Structures & Algorithms", "C++", "System Design"]
}
    `,
    "/home/sneha/interests": `
{
  "interests": ["Backend Development", "System Programming", "Distributed Systems"]
}
    `,
    "/home/sneha/technical_skills": `
{
  "languages": ["C", "C++", "JavaScript"],
  "tools": ["Git", "GitHub", "Docker", "VS Code", "Bash", "GDB", "Makefile"],
  "frameworks": ["Node.js", "Express.js", "React.js", "Socket.io"],
  "databases": ["MongoDB", "MySQL"]
}
    `,
    "/home/sneha/soft_skills": `
{
  "soft_skills": ["Problem-solving", "Teamwork", "Communication", "Time Management"]
}
    `,
    "/home/sneha/coursework": `
{
  "coursework": ["Operating Systems", "Data Structures & Algorithms", "DBMS", "Computer Networks"]
}
    `,
    "/home/sneha/projects": `
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
  ]
}
    `,
    "/home/sneha/projects/digital_diary": `
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
    "/home/sneha/projects/my_shell": `
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
    "/home/sneha/projects/boids_flocking": `
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
    "/home/sneha/coding_profiles": `
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
    "/home/sneha/getgithub": `
{
  "redirect": "https://github.com/snehabichkunde",
  "message": "Redirecting to GitHub profile..."
}
    `,
    "/home/sneha/getlinkedin": `
{
  "redirect": "https://www.linkedin.com/in/sneha-bichkunde-aba203269/",
  "message": "Redirecting to LinkedIn profile..."
}
    `,
    "/home/sneha/getcv": `
{
  "message": "CV functionality coming soon!"
}
    `,
    "/home/sneha/games": `
{
  "message": "Games functionality coming soon!",
  "available_games": ["snake", "tictactoe", "flappybird", "bubblecrash"]
}
    `,
    "/home/sneha/games/snake": `
{
  "message": "Snake game coming soon!"
}
    `,
    "/home/sneha/games/tictactoe": `
{
  "message": "Tic-Tac-Toe game coming soon!"
}
    `,
    "/home/sneha/games/flappybird": `
{
  "message": "Flappy Bird game coming soon!"
}
    `,
    "/home/sneha/games/bubblecrash": `
{
  "message": "Bubble Crash game coming soon!"
}
    `,
    "/home/sneha/themes": `
{
  "available_themes": ["dark", "light", "glass"],
  "description": "Use 'theme <name>' to switch themes."
}
    `,
    "/home/sneha/themes/dark": `
{
  "name": "Dark",
  "description": "A dark theme with soft green text and a sleek, modern look.",
  "command": "theme dark"
}
    `,
    "/home/sneha/themes/light": `
{
  "name": "Light",
  "description": "A bright theme with dark text, ideal for daytime use.",
  "command": "theme light"
}
    `,
    "/home/sneha/themes/glass": `
{
  "name": "Glass",
  "description": "A frosted-glass effect with light text for a futuristic vibe.",
  "command": "theme glass"
}
    `
  };

  function getPrompt() {
    const pathDisplay = currentPath === "/home/sneha/" ? "~" : currentPath.replace(/^\/|\/$/g, "");
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
    terminal.value += `\n${output}\n${getPrompt()}`;
    scrollToBottom();
    callback();
  }

  function typeWelcomeMessage() {
    terminal.value = `${welcomeMessage}\n${getPrompt()}`;
    scrollToBottom();
    terminal.setSelectionRange(terminal.value.length, terminal.value.length);
  }

  function formatProject(project) {
    let output = `${project.name}\n`;
    output += `  Description: ${project.description}\n`;
    output += `  Tech: ${project.tech.join(", ")}\n`;
    output += `  Details:\n${project.details.map(detail => `    - ${detail}`).join("\n")}\n`;
    if (project.live_link) {
      output += `  Live Demo\n`;
    }
    if (project.github) {
      output += `  GitHub\n`;
    }
    return { text: output.trim(), liveLink: project.live_link?.url, githubLink: project.github?.url };
  }

  function parseExpression(expr) {
    try {
      expr = expr.replace(/\s+/g, "");
      if (!/^[0-9+\-*/().]+$/.test(expr)) {
        throw new Error("Invalid characters");
      }

      function evaluate(tokens) {
        while (tokens.includes("(")) {
          let start = tokens.lastIndexOf("(");
          let end = tokens.indexOf(")", start);
          if (start === -1 || end === -1) throw new Error("Mismatched parentheses");
          let subResult = evaluate(tokens.slice(start + 1, end));
          tokens.splice(start, end - start + 1, subResult.toString());
        }

        for (let op of ["*", "/"]) {
          while (tokens.includes(op)) {
            let i = tokens.indexOf(op);
            let a = parseFloat(tokens[i - 1]);
            let b = parseFloat(tokens[i + 1]);
            if (isNaN(a) || isNaN(b)) throw new Error("Invalid number");
            let result = op === "*" ? a * b : a / b;
            tokens.splice(i - 1, 3, result.toString());
          }
        }

        while (tokens.includes("+") || tokens.includes("-")) {
          let i = tokens.indexOf("+") !== -1 ? tokens.indexOf("+") : tokens.indexOf("-");
          let a = parseFloat(tokens[i - 1]);
          let b = parseFloat(tokens[i + 1]);
          if (isNaN(a) || isNaN(b)) throw new Error("Invalid number");
          let result = tokens[i] === "+" ? a + b : a - b;
          tokens.splice(i - 1, 3, result.toString());
        }

        let result = parseFloat(tokens[0]);
        if (isNaN(result)) throw new Error("Invalid expression");
        return result;
      }

      let tokens = [];
      let num = "";
      for (let i = 0; i < expr.length; i++) {
        let char = expr[i];
        if (/[0-9.]/.test(char)) {
          num += char;
        } else if (/[+\-*/()]/.test(char)) {
          if (num) tokens.push(num);
          tokens.push(char);
          num = "";
        } else {
          throw new Error("Invalid character");
        }
      }
      if (num) tokens.push(num);

      return evaluate(tokens);
    } catch (e) {
      return `calc: ${e.message || "Invalid expression"}`;
    }
  }

  function suggestCommand(input) {
    const commandsList = Object.keys(commands);
    const suggestion = commandsList.find(cmd => {
      let diff = 0;
      for (let i = 0; i < Math.min(input.length, cmd.length); i++) {
        if (input[i] !== cmd[i]) diff++;
      }
      diff += Math.abs(input.length - cmd.length);
      return diff <= 2;
    });
    return suggestion ? `\nDid you mean '${suggestion}'?` : "";
  }

  const commands = {
    help: () => `
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
pwd          - Print working directory
whoami       - Show current user
echo         - Display text or variables
man          - Show command manual
history      - Show command history
fortune      - Get a random quote
stats        - Show command usage statistics
    `,
    clear: () => {
      terminal.value = `${getPrompt()}`;
      scrollToBottom();
      projectLinks = { liveLink: null, githubLink: null }; // Reset links
      return null;
    },
    ls: () => fileSystem[currentPath]?.join(" ") || "dir: No such directory.",
    cd: (args) => {
      let output = "";
      projectLinks = { liveLink: null, githubLink: null }; // Reset links

      if (!args[0] || args[0] === "~") {
        currentPath = "/home/sneha/";
      } else if (args[0].startsWith("/")) {
        const targetPath = args[0] === "/" ? "/" : args[0] + "/";
        if (fileSystem[targetPath]) {
          currentPath = targetPath;
        } else {
          return `cd: ${args[0]}: No such directory.`;
        }
      } else if (args[0] === "..") {
        if (currentPath !== "/") {
          currentPath = currentPath.split("/").slice(0, -2).join("/") + "/" || "/";
        } else {
          return "Already at root.";
        }
      } else {
        const targetPath = currentPath === "/" ? `/${args[0]}` : `${currentPath}${args[0]}`;
        const dirPath = `${targetPath}/`;
        if (fileSystem[dirPath]) {
          currentPath = dirPath;
        } else if (fileContent[targetPath]) {
          if (targetPath === "/home/sneha/projects") {
            const projects = JSON.parse(fileContent[targetPath]).projects;
            output = projects.map(proj => formatProject(proj).text).join("\n\n");
          } else {
            const content = JSON.parse(fileContent[targetPath].trim());
            if (content.redirect) {
              window.open(content.redirect, "_blank");
              output = content.message;
            } else if (content.name && content.description) {
              const formatted = formatProject(content);
              output = formatted.text;
              projectLinks.liveLink = formatted.liveLink;
              projectLinks.githubLink = formatted.githubLink;
            } else {
              output = JSON.stringify(content, null, 2);
            }
          }
        } else {
          return `cd: ${args[0]}: No such file or directory.`;
        }
      }
      return output;
    },
    getgithub: () => {
      window.open("https://github.com/snehabichkunde", "_blank");
      return fileContent["/home/sneha/getgithub"].trim();
    },
    getlinkedin: () => {
      window.open("https://www.linkedin.com/in/sneha-bichkunde-aba203269/", "_blank");
      return fileContent["/home/sneha/getlinkedin"].trim();
    },
    getcv: () => fileContent["/home/sneha/getcv"].trim(),
    play: (args) => {
      if (fileSystem["/home/sneha/games"]?.includes(args[0])) {
        return fileContent[`/home/sneha/games/${args[0]}`]?.trim() || `Launching ${args[0]}... (Game not implemented yet)`;
      }
      return `play: ${args[0] || ""}: Game not found.`;
    },
    theme: (args) => {
      if (["dark", "light", "glass"].includes(args[0])) {
        document.body.className = `theme-${args[0]}`;
        localStorage.setItem("theme", args[0]);
        window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: args[0] } }));
        return `Theme switched to ${args[0]}`;
      }
      return `theme: ${args[0] || ""}: Invalid theme. Use dark, light, or glass.`;
    },
    calc: (args) => parseExpression(args.join("")),
    pwd: () => currentPath,
    whoami: () => "sneha",
    echo: (args) => args[0] === "$USER" ? "sneha" : args.join(" "),
    man: (args) => {
      if (args[0] && Object.keys(commands).includes(args[0])) {
        return `man ${args[0]}: Displays help for the ${args[0]} command.\nSee 'help' for details.`;
      }
      return `man: ${args[0] || ""}: No manual entry found.`;
    },
    history: () => commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join("\n") || "No command history.",
    fortune: () => {
      const fortunes = [
        "You will write a killer portfolio app!",
        "A bug is just a feature in disguise.",
        "Keep coding, the universe is watching."
      ];
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    },
    stats: () => {
      const usage = JSON.parse(localStorage.getItem("commandUsage") || "{}");
      return Object.entries(usage)
        .map(([cmd, count]) => `${cmd}: ${count} time${count === 1 ? "" : "s"}`)
        .join("\n") || "No command usage recorded.";
    }
  };

  const aliases = {
    ll: "ls",
    cls: "clear"
  };

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

  terminal.addEventListener("click", (e) => {
    if (!projectLinks.liveLink && !projectLinks.githubLink) return;

    const lines = terminal.value.split("\n");
    const cursorPos = terminal.selectionStart;
    let currentLine = 0;
    let posInLine = cursorPos;

    // Find the line where the cursor is
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for newline
      if (posInLine < lineLength) {
        currentLine = i;
        break;
      }
      posInLine -= lineLength;
    }

    const lineText = lines[currentLine].trim();
    if (lineText === "Live Demo" && projectLinks.liveLink) {
      e.preventDefault();
      window.open(projectLinks.liveLink, "_blank");
    } else if (lineText === "GitHub" && projectLinks.githubLink) {
      e.preventDefault();
      window.open(projectLinks.githubLink, "_blank");
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
      if (!args[0]) {
        const commandsList = Object.keys(commands);
        const matches = commandsList.filter(cmd => cmd.startsWith(command));
        if (matches.length === 1) {
          replaceCurrentLine(`${matches[0]} `);
        }
      } else if (command === "cd") {
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

      if (input !== "") {
        commandHistory.push(input);
        if (commandHistory.length > 100) commandHistory.shift();
        const usage = JSON.parse(localStorage.getItem("commandUsage") || "{}");
        usage[command] = (usage[command] || 0) + 1;
        localStorage.setItem("commandUsage", JSON.stringify(usage));
      }
      historyIndex = -1;

      if (input === "") {
        terminal.value += `\n${prompt}`;
        scrollToBottom();
        return;
      }

      if (aliases[command]) {
        command = aliases[command];
      }

      if (input.includes("|")) {
        output = "bash: Pipelines are not supported in this portfolio terminal.";
      } else if (input.includes(">")) {
        const [cmd, file] = input.split(">");
        output = `bash: Output redirected to ${file.trim()} (not implemented).`;
      } else {
        if (commands[command]) {
          output = commands[command](args);
        } else {
          output = `bash: ${command}: command not found${suggestCommand(command)}`;
          if (["sudo", "apt", "yum"].includes(command)) {
            output += "\nThis is a portfolio terminal, not a real system!";
          }
        }
      }

      if (output !== null) {
        typeOutput(output, () => {
          terminal.setSelectionRange(terminal.value.length, terminal.value.length);
        });
      }
    }
  });

  return {
    init: () => {
      terminal.value = "";
      const savedTheme = localStorage.getItem("theme") || "dark";
      document.body.className = `theme-${savedTheme}`;
      typeWelcomeMessage();
      terminal.focus();
    }
  };
})();

terminalPortfolio.init();