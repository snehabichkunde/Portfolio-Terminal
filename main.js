const terminalPortfolio = (() => {
  const terminal = document.getElementById("main");
  let currentPath = "/home/sneha/";
  let commandHistory = [];
  let historyIndex = -1;

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
    return `<span class="prompt">sneha@portfolio:${pathDisplay}$ </span>`;
  }

  const welcomeMessage = `
<span class="header">Welcome to Sneha Bichkunde's Portfolio Terminal</span>
<span class="header">---------------------------------------------</span>
Type <span class="command">help</span> to see available commands.
Current directory: <span class="directory">${currentPath}</span>
`;

  function scrollToBottom() {
    terminal.scrollTop = terminal.scrollHeight;
  }

  function createPrompt() {
    const previousInput = terminal.querySelector(".input:last-child");
    if (previousInput) {
      previousInput.contentEditable = false;
      previousInput.classList.remove("input");
    }
  
    const promptDiv = document.createElement("div");
    promptDiv.className = "prompt-line";
    promptDiv.innerHTML = getPrompt();
    const inputSpan = document.createElement("span");
    inputSpan.contentEditable = true;
    inputSpan.className = "input";
    inputSpan.setAttribute("spellcheck", "false");
    promptDiv.appendChild(inputSpan);
    return promptDiv;
  }

  function typeOutput(output, callback) {
    const outputDiv = document.createElement("div");
    outputDiv.className = "output";
    outputDiv.innerHTML = output.replace(/\n/g, "<br>");
    terminal.appendChild(outputDiv);
    terminal.appendChild(createPrompt());
    scrollToBottom();
    callback();
  }

  function typeWelcomeMessage() {
    terminal.innerHTML = welcomeMessage.replace(/\n/g, "<br>");
    terminal.appendChild(createPrompt());
    scrollToBottom();
    focusInput();
  }

  function focusInput() {
    const input = terminal.querySelector(".input:last-child");
    if (input) {
      input.focus();
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(input);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function formatProject(project) {
    let output = `<span class="project-name">${project.name}</span><br>`;
    output += `  <span class="project-key">Description:</span> <span class="project-value">${project.description}</span><br>`;
    output += `  <span class="project-key">Tech:</span> <span class="project-value">${project.tech.join(", ")}</span><br>`;
    output += `  <span class="project-key">Details:</span><br>${project.details.map(detail => `    - <span class="project-value">${detail}</span>`).join("<br>")}<br>`;
    if (project.live_link) {
      output += `  <a href="${project.live_link.url}" class="link" target="_blank">Live Demo</a><br>`;
    }
    if (project.github) {
      output += `  <a href="${project.github.url}" class="link" target="_blank">GitHub</a>`;
    }
    return output.trim();
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
      return `<span class="error">calc: ${e.message || "Invalid expression"}</span>`;
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
    return suggestion ? `<br><span class="suggest">Did you mean '<span class="command">${suggestion}</span>'?</span>` : "";
  }

  const commands = {
    help: () => `
<span class="header">Available Commands:</span>
<span class="header">-------------------</span>
<span class="command">help</span>         - Show available commands
<span class="command">clear</span>        - Clear the terminal screen
<span class="command">ls</span>           - List directories and files
<span class="command">cd</span> &lt;dir&gt;     - Change directory or view file content
<span class="command">cd ..</span>        - Go back
<span class="command">getgithub</span>    - Open GitHub profile
<span class="command">getlinkedin</span>  - Open LinkedIn profile
<span class="command">getcv</span>        - View CV (coming soon)
<span class="command">play</span> &lt;game&gt;  - Play a game (snake, tictactoe, etc.)
<span class="command">theme</span> &lt;name&gt; - Switch theme (dark, light, glass)
<span class="command">calc</span> &lt;expr&gt;  - Calculate expression (e.g., 2+3*4)
<span class="command">pwd</span>          - Print working directory
<span class="command">whoami</span>       - Show current user
<span class="command">echo</span>         - Display text or variables
<span class="command">man</span>          - Show command manual
<span class="command">history</span>      - Show command history
<span class="command">fortune</span>      - Get a random quote
<span class="command">stats</span>        - Show command usage statistics
    `,
    clear: () => {
      terminal.innerHTML = "";
      terminal.appendChild(createPrompt());
      scrollToBottom();
      focusInput();
      return null;
    },
    ls: () => {
      const items = fileSystem[currentPath];
      if (!items) return `<span class="error">dir: No such directory.</span>`;
      return items
        .map(item => {
          const fullPath = currentPath === "/" ? `/${item}` : `${currentPath}${item}`;
          const isDir = fileSystem[`${fullPath}/`] || fileSystem[fullPath];
          return `<span class="${isDir ? 'directory' : 'file'}">${item}</span>`;
        })
        .join(" ");
    },
    cd: (args) => {
      let output = "";
      if (!args[0] || args[0] === "~") {
        currentPath = "/home/sneha/";
      } else if (args[0].startsWith("/")) {
        const targetPath = args[0] === "/" ? "/" : args[0] + "/";
        if (fileSystem[targetPath]) {
          currentPath = targetPath;
        } else {
          return `<span class="error">cd: ${args[0]}: No such directory.</span>`;
        }
      } else if (args[0] === "..") {
        if (currentPath !== "/") {
          currentPath = currentPath.split("/").slice(0, -2).join("/") + "/" || "/";
        } else {
          return `<span class="error">Already at root.</span>`;
        }
      } else {
        const targetPath = currentPath === "/" ? `/${args[0]}` : `${currentPath}${args[0]}`;
        const dirPath = `${targetPath}/`;
        if (fileSystem[dirPath]) {
          currentPath = dirPath;
        } else if (fileContent[targetPath]) {
          if (targetPath === "/home/sneha/projects") {
            const projects = JSON.parse(fileContent[targetPath]).projects;
            output = projects.map(formatProject).join("<br><br>");
          } else {
            const content = JSON.parse(fileContent[targetPath].trim());
            if (content.redirect) {
              window.open(content.redirect, "_blank");
              output = `<span class="message">${content.message}</span>`;
            } else if (content.name && content.description) {
              output = formatProject(content);
            } else {
              output = JSON.stringify(content, null, 2).replace(/\n/g, "<br>");
            }
          }
        } else {
          return `<span class="error">cd: ${args[0]}: No such file or directory.</span>`;
        }
      }
      return output;
    },
    getgithub: () => {
      window.open("https://github.com/snehabichkunde", "_blank");
      return `<span class="message">${fileContent["/home/sneha/getgithub"].trim()}</span>`;
    },
    getlinkedin: () => {
      window.open("https://www.linkedin.com/in/sneha-bichkunde-aba203269/", "_blank");
      return `<span class="message">${fileContent["/home/sneha/getlinkedin"].trim()}</span>`;
    },
    getcv: () => `<span class="message">${fileContent["/home/sneha/getcv"].trim()}</span>`,
    play: (args) => {
      if (fileSystem["/home/sneha/games"]?.includes(args[0])) {
        return `<span class="message">${fileContent[`/home/sneha/games/${args[0]}`]?.trim() || `Launching ${args[0]}... (Game not implemented yet)`}</span>`;
      }
      return `<span class="error">play: ${args[0] || ""}: Game not found.</span>`;
    },
    theme: (args) => {
      if (["dark", "light", "glass"].includes(args[0])) {
        document.body.className = `theme-${args[0]}`;
        localStorage.setItem("theme", args[0]);
        window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: args[0] } }));
        return `<span class="message">Theme switched to ${args[0]}</span>`;
      }
      return `<span class="error">theme: ${args[0] || ""}: Invalid theme. Use dark, light, or glass.</span>`;
    },
    calc: (args) => parseExpression(args.join("")),
    pwd: () => `<span class="directory">${currentPath}</span>`,
    whoami: () => `<span class="message">sneha</span>`,
    echo: (args) => `<span class="message">${args[0] === "$USER" ? "sneha" : args.join(" ")}</span>`,
    man: (args) => {
      if (args[0] && Object.keys(commands).includes(args[0])) {
        return `<span class="message">man ${args[0]}: Displays help for the ${args[0]} command.<br>See '<span class="command">help</span>' for details.</span>`;
      }
      return `<span class="error">man: ${args[0] || ""}: No manual entry found.</span>`;
    },
    history: () => commandHistory.map((cmd, i) => `<span class="message">${i + 1}  ${cmd}</span>`).join("<br>") || `<span class="message">No command history.</span>`,
    fortune: () => {
      const fortunes = [
        "You will write a killer portfolio app!",
        "A bug is just a feature in disguise.",
        "Keep coding, the universe is watching."
      ];
      return `<span class="message">${fortunes[Math.floor(Math.random() * fortunes.length)]}</span>`;
    },
    stats: () => {
      const usage = JSON.parse(localStorage.getItem("commandUsage") || "{}");
      return Object.entries(usage)
        .map(([cmd, count]) => `<span class="message">${cmd}: ${count} time${count === 1 ? "" : "s"}</span>`)
        .join("<br>") || `<span class="message">No command usage recorded.</span>`;
    }
  };

  const aliases = {
    ll: "ls",
    cls: "clear"
  };

  terminal.addEventListener("click", focusInput);

  terminal.addEventListener("keydown", (e) => {
    const input = terminal.querySelector(".input:last-child");
    if (!input) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const inputText = input.textContent.trim();
      let [command, ...args] = inputText.split(" ");
      let output = "";

      if (inputText !== "") {
        commandHistory.push(inputText);
        if (commandHistory.length > 100) commandHistory.shift();
        const usage = JSON.parse(localStorage.getItem("commandUsage") || "{}");
        usage[command] = (usage[command] || 0) + 1;
        localStorage.setItem("commandUsage", JSON.stringify(usage));
      }
      historyIndex = -1;

      if (inputText === "") {
        terminal.appendChild(createPrompt());
        scrollToBottom();
        focusInput();
        return;
      }

      if (aliases[command]) {
        command = aliases[command];
      }

      if (inputText.includes("|")) {
        output = `<span class="error">bash: Pipelines are not supported in this portfolio terminal.</span>`;
      } else if (inputText.includes(">")) {
        const [cmd, file] = inputText.split(">");
        output = `<span class="error">bash: Output redirected to ${file.trim()} (not implemented).</span>`;
      } else {
        if (commands[command]) {
          output = commands[command](args);
        } else {
          output = `<span class="error">bash: ${command}: command not found</span>${suggestCommand(command)}`;
          if (["sudo", "apt", "yum"].includes(command)) {
            output += `<br><span class="error">This is a portfolio terminal, not a real system!</span>`;
          }
        }
      }

      if (output !== null) {
        typeOutput(output, () => {
          focusInput();
        });
      }
    }

    if (e.key === "ArrowUp" && !e.ctrlKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.textContent = commandHistory[historyIndex];
      } else if (commandHistory.length > 0 && historyIndex === -1) {
        historyIndex = commandHistory.length - 1;
        input.textContent = commandHistory[historyIndex];
      }
      focusInput();
    }

    if (e.key === "ArrowDown" && !e.ctrlKey) {
      e.preventDefault();
      if (historyIndex >= 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.textContent = commandHistory[historyIndex];
      } else {
        input.textContent = "";
        historyIndex = -1;
      }
      focusInput();
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const inputText = input.textContent.trim();
      const [command, ...args] = inputText.split(" ");
      if (!args[0]) {
        const commandsList = Object.keys(commands);
        const matches = commandsList.filter(cmd => cmd.startsWith(command));
        if (matches.length === 1) {
          input.textContent = `${matches[0]} `;
        }
      } else if (command === "cd") {
        const matches = fileSystem[currentPath]?.filter(item => item.startsWith(args[0])) || [];
        if (matches.length === 1) {
          input.textContent = `cd ${matches[0]}`;
        }
      }
      focusInput();
    }
  });

  // Prevent pasting HTML content
  terminal.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  });

  return {
    init: () => {
      terminal.innerHTML = "";
      const savedTheme = localStorage.getItem("theme") || "dark";
      document.body.className = `theme-${savedTheme}`;
      typeWelcomeMessage();
    }
  };
})();

terminalPortfolio.init();