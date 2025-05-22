const terminalPortfolio = (() => {
  const terminal = document.getElementById("main");
  let commandHistory = [];
  let historyIndex = -1;

  const content = {
    about: `{"name":"Sneha Bichkunde","email":"bichkundesneha@gmail.com","city":"Nanded","education":"B.Tech in Information Technology (8.3 GPA), SGGS Nanded","fun_fact":"I love exploring systems through terminal commands!"}`,
    passions: `{"reading":"Drama, Philosophy, Travel Journals","sports":"Cycling, Badminton","programming":"Data Structures & Algorithms, C++, System Design"}`,
    projects: `[
      {
        "name": "Digital Diary",
        "description": "A full-stack diary app to securely store and manage personal stories.",
        "tech": "React.js, Node.js, MongoDB, JWT",
        "link": "https://digital-diary-sneha.netlify.app/",
        "github": "https://github.com/snehabichkunde/DigitalDiary"
      },
      {
        "name": "my_shell",
        "description": "A POSIX-compliant shell in C to enhance terminal interaction.",
        "tech": "C, ncurses",
        "github": "https://github.com/snehabichkunde/c-shell"
      },
      {
        "name": "Boids Flocking",
        "description": "A flocking simulation in p5.js to model bird-like behavior.",
        "tech": "p5.js, JavaScript",
        "link": "https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/",
        "github": "https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree"
      }
    ]`,
    profiles: `[
      {
        "name": "GeeksforGeeks",
        "description": "Active contributor with 50+ problems solved in Data Structures and Algorithms.",
        "url": "https://www.geeksforgeeks.org/user/bichkund5ad6/"
      },
      {
        "name": "LeetCode",
        "description": "Solved 100+ problems, focusing on algorithms and system design challenges.",
        "url": "https://leetcode.com/u/SnehaBichkunde/"
      }
    ]`,
    github: `{"url":"https://github.com/snehabichkunde","message":"Opening GitHub profile..."}`,
    linkedin: `{"url":"https://www.linkedin.com/in/sneha-bichkunde-aba203269/","message":"Opening LinkedIn profile..."}`,
    cv: `{"message":"CV functionality coming soon!"}`
  };

  function getPrompt() {
    return `<span class="prompt">Sneha Bichkunde:~/portfolio$ </span>`;
  }

  const welcomeMessage = `
<span class="header">Welcome to Sneha Bichkunde's Portfolio!</span>
Type <span class="command">help</span> to display available commands.
To validate each command, press Enter.
You can use the Tab key to help you complete a command.
You can find old commands with the up and down arrows.
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
    output += `<span class="project-value">${project.description}</span><br>`;
    output += `<span class="project-value">Tech: ${project.tech}</span><br>`;
    if (project.link) {
      output += `<a href="${project.link}" class="link" target="_blank">Visit project</a><br>`;
    }
    if (project.github) {
      output += `<a href="${project.github}" class="link" target="_blank">GitHub</a>`;
    }
    return output.trim();
  }

  function formatProfile(profile) {
    let output = `<span class="profile-name">${profile.name}</span><br>`;
    output += `<span class="profile-value">${profile.description}</span><br>`;
    output += `<a href="${profile.url}" class="link" target="_blank">Visit profile</a>`;
    return output.trim();
  }

  function formatCustomJSON(obj) {
    const indent = "  ";
    let output = "{\n";
    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      const value = obj[key];
      const isLast = index === keys.length - 1;
      output += `${indent}"${key}": "${value}"${isLast ? "" : ","}\n`;
    });
    output += "}";
    return output;
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
- <span class="command">about-me</span>: Display information about me
- <span class="command">clear</span>: Clean the terminal
- <span class="command">getcv</span>: Download my CV
- <span class="command">getlinkedin</span>: Link to my LinkedIn
- <span class="command">getgithub</span>: Link to my GitHub
- <span class="command">help</span>: Displays the list of commands
- <span class="command">passions</span>: Displays the list of my hobbies
- <span class="command">my-projects</span>: Displays the list of my personal projects
- <span class="command">themes</span>: Change the terminal theme
You can find the old commands with the up and down arrows
    `,
    clear: () => {
      terminal.innerHTML = "";
      terminal.appendChild(createPrompt());
      scrollToBottom();
      focusInput();
      return null;
    },
    "about-me": () => {
      const about = JSON.parse(content.about);
      return formatCustomJSON(about).replace(/\n/g, "<br>");
    },
    passions: () => {
      const passions = JSON.parse(content.passions);
      return formatCustomJSON(passions).replace(/\n/g, "<br>");
    },
    "my-projects": () => {
      const projects = JSON.parse(content.projects);
      return projects.map(formatProject).join("<br><br>");
    },
    getcv: () => `<span class="message">${JSON.parse(content.cv).message}</span>`,
    getgithub: () => {
      const github = JSON.parse(content.github);
      window.open(github.url, "_blank");
      return `<span class="message">${github.message}</span>`;
    },
    getlinkedin: () => {
      const linkedin = JSON.parse(content.linkedin);
      window.open(linkedin.url, "_blank");
      return `<span class="message">${linkedin.message}</span>`;
    },
    themes: (args) => {
      if (!args[0]) {
        return `
<span class="message">Available themes: dark, light, matrix, hello_kitty</span>
<span class="message">Usage: themes <theme-name></span>
        `;
      }
      if (["dark", "light", "matrix", "hello_kitty"].includes(args[0])) {
        document.body.className = `theme-${args[0]}`;
        localStorage.setItem("theme", args[0]);
        window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: args[0] } }));
        return `<span class="message">Theme switched to ${args[0]}</span>`;
      }
      return `<span class="error">Invalid theme. Available themes: dark, light, matrix, hello_kitty</span>`;
    }
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
      }
      historyIndex = -1;

      if (inputText === "") {
        terminal.appendChild(createPrompt());
        scrollToBottom();
        focusInput();
        return;
      }

      if (commands[command]) {
        output = commands[command](args);
      } else {
        output = `<span class="error">${command}: command not found</span>${suggestCommand(command)}`;
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
      const commandsList = Object.keys(commands);
      const matches = commandsList.filter(cmd => cmd.startsWith(command));
      if (matches.length === 1) {
        input.textContent = matches[0] + (args.length ? " " + args.join(" ") : " ");
      }
      focusInput();
    }
  });

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