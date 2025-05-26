const terminalPortfolio = (() => {
  const terminal = document.getElementById("main");
  let commandHistory = [];
  let historyIndex = -1;

  const content = {
    about: `{"name":"Sneha Bichkunde","email":"bichkundesneha@gmail.com","city":"Nanded","education":"B.Tech in Information Technology (8.3 GPA), SGGS Nanded","fun_fact":"I love exploring systems through terminal commands!"}`,
    hobbies: `{"reading":"Drama, Philosophy, Travel Journals","sports":"Cycling, Badminton","programming":"Data Structures & Algorithms, C++, System Design"}`,
    interests: `{"interests":"Backend Development, System Programming, Distributed Systems"}`,
    technical_skills: `{"languages":"C, C++, JavaScript","tools":"Git, GitHub, Docker, VS Code, Bash, GDB, Makefile","frameworks":"Node.js, Express.js, React.js, Socket.io","databases":"MongoDB, MySQL","soft_skills":"Problem-solving, Teamwork, Communication, Time Management"}`,
    coding_profiles: `{"GeeksforGeeks":"Active contributor with 500+ problems solved in Data Structures and Algorithms, https://www.geeksforgeeks.org/user/bichkund5ad6/","LeetCode":"Solved 100+ problems, focusing on algorithms and system design challenges, https://leetcode.com/u/SnehaBichkunde/"}`,
    coursework: `{"coursework":"Operating Systems, Data Structures & Algorithms, DBMS, Computer Networks"}`,
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
    github: `{"url":"https://github.com/snehabichkunde","message":"Opening GitHub profile..."}`,
    linkedin: `{"url":"https://www.linkedin.com/in/sneha-bichkunde-aba203269/","message":"Opening LinkedIn profile..."}`,
    cv: `{"message":"CV functionality coming soon!"}`
  };

  function getPrompt() {
    return `<span class="prompt">Sneha Bichkunde:~/portfolio$ </span>`;
  }

  const welcomeMessage = `
<div class="header">Welcome to Sneha Bichkunde's Portfolio Terminal! 👋</div>
<div class="message">Hello! I'm Sneha, a tech enthusiast and developer.</div>
<div class="message">Explore my work and skills through this interactive terminal.</div>
<div class="suggest" style="margin-top: 10px;">Getting Started:</div>
<div class="message">- Type <span class="command">help</span> to see available commands</div>
<div class="message">- Press <span class="command">Enter</span> to run a command</div>
<div class="message">- Use <span class="command">Tab</span> to auto-complete commands</div>
<div class="message">- Use <span class="command">↑↓</span> arrows to browse command history</div>
<div class="note" style="margin-top: 10px;">Start with <span class="command">about-me</span> to learn more about me!</div>
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
    terminal.innerHTML = ""; 
    const welcomeDiv = document.createElement("div");
    welcomeDiv.className = "output";
    welcomeDiv.innerHTML = welcomeMessage.trim(); 
    terminal.appendChild(welcomeDiv);
    setTimeout(() => {
      terminal.appendChild(createPrompt());
      scrollToBottom();
      focusInput();
    }, 10);
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
    let output = `<div class="project-container">`;
    output += `<span class="project-name">${project.name}</span><br>`;
    output += `<span class="project-description">${project.description}</span><br>`;
    output += `<span class="project-tech">Tech: ${project.tech}</span><br>`;
    output += `<div class="project-links">`;
    if (project.link) {
      output += `<a href="${project.link}" class="link" target="_blank">Live Demo</a>`;
    }
    if (project.github) {
      output += `<a href="${project.github}" class="link" target="_blank">GitHub</a>`;
    }
    output += `</div></div>`;
    return output;
  }

  function formatLibrarySection(obj, title) {
    let output = `<div class="library-container">`;
    output += `<span class="library-title">${title}</span><br>`;
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      let value = obj[key];
      let link = null;
      // Check if the value contains a URL (for coding-profiles)
      if (typeof value === "string" && value.includes("http")) {
        const [description, url] = value.split(", ");
        value = description;
        link = url;
      }
      output += `<div class="library-item">`;
      output += `<span class="library-key">${key.replace(/_/g, " ")}:</span>`;
      output += `<span class="library-value">${value}</span>`;
      if (link) {
        output += `<a href="${link}" class="library-link" target="_blank">[Visit]</a>`;
      }
      output += `</div>`;
    });
    output += `</div>`;
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
<span class="header">Available Commands</span>

<span class="suggest">About Me & Work</span>
- <span class="command">about-me</span>: Display information about me
- <span class="command">my-projects</span>: Display the list of my personal projects
- <span class="command">technical-skills</span>: Display my technical and soft skills
- <span class="command">coursework</span>: Display my relevant coursework
- <span class="command">getcv</span>: Download my CV

<span class="suggest">Profiles</span>
- <span class="command">getgithub</span>: Link to my GitHub
- <span class="command">getlinkedin</span>: Link to my LinkedIn
- <span class="command">coding-profiles</span>: Display my coding profiles

<span class="suggest">Personal Interests</span>
- <span class="command">hobbies</span>: Display my hobbies
- <span class="command">interests</span>: Display my areas of interest
<span class="suggest">Utilities</span>
- <span class="command">help</span>: Display this list of commands
- <span class="command">history</span>: Show command history
- <span class="command">clear</span>: Clean the terminal
- <span class="command">themes</span>: Change the terminal theme

<span class="note">Use ↑↓ arrows to browse command history, Tab to auto-complete</span>
`,
    clear: () => {
      terminal.innerHTML = "";
      terminal.appendChild(createPrompt());
      scrollToBottom();
      focusInput();
      return null;
    },
    history: () => {
      if (commandHistory.length === 0) {
        return `<span class="message">No command history yet.</span>`;
      }
      return commandHistory.map((cmd, i) => `<span class="message">${i + 1}. ${cmd}</span>`).join("<br>");
    },
    "about-me": () => {
      const about = JSON.parse(content.about);
      return formatLibrarySection(about, "About Me");
    },
    hobbies: () => {
      const hobbies = JSON.parse(content.hobbies);
      return formatLibrarySection(hobbies, "Hobbies");
    },
    interests: () => {
      const interests = JSON.parse(content.interests);
      return formatLibrarySection(interests, "Interests");
    },
    "technical-skills": () => {
      const skills = JSON.parse(content.technical_skills);
      return formatLibrarySection(skills, "Technical Skills");
    },
    "coding-profiles": () => {
      const profiles = JSON.parse(content.coding_profiles);
      return formatLibrarySection(profiles, "Coding Profiles");
    },
    coursework: () => {
      const coursework = JSON.parse(content.coursework);
      return formatLibrarySection(coursework, "Coursework");
    },
    "my-projects": () => {
      const projects = JSON.parse(content.projects);
      return projects.map(formatProject).join("");
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