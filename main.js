const terminalPortfolio = (() => {
  const terminal = document.getElementById("main");
  let commandHistory = [];
  let historyIndex = -1;
  let currentInputBuffer = "";

  const content = {
    about: `{"name":"Sneha Bichkunde","email":"bichkundesneha@gmail.com","city":"Nanded","education":"B.Tech in Information Technology (8.3 GPA), SGGS Nanded","fun_fact":"I love exploring systems through terminal commands!"}`,
    hobbies: `{"reading":"Drama, Philosophy, Travel Journals","sports":"Cycling, Badminton","programming":"Data Structures & Algorithms, C++, System Design"}`,
    interests: `{"interests":"Backend Development, System Programming, Distributed Systems"}`,
    technical_skills: `{"languages":"C, C++, JavaScript","tools":"Git, GitHub, Docker, VS Code, Bash, GDB, Makefile","frameworks":"Node.js, Express.js, React.js, Socket.io","databases":"MongoDB, MySQL","soft_skills":"Problem-solving, Teamwork, Communication, Time Management"}`,
    coding_profiles: `{"GeeksforGeeks":"Active contributor with 500+ problems solved in Data Structures and Algorithms, https://www.geeksforgeeks.org/user/bichkund5ad6/","LeetCode":"Solved 100+ problems, focusing on algorithms and system design challenges, https://leetcode.com/u/SnehaBichkunde/"}`,
    coursework: `{"coursework":"Operating Systems, Data Structures & Algorithms, DBMS, Computer Networks"}`,
    projects: `[
      { "name": "Digital Diary", "description": "A full-stack diary app to securely store and manage personal stories.", "tech": "React.js, Node.js, MongoDB, JWT", "link": "https://digital-diary-sneha.netlify.app/", "github": "https://github.com/snehabichkunde/DigitalDiary" },
      { "name": "my_shell", "description": "A POSIX-compliant shell in C to enhance terminal interaction.", "tech": "C, ncurses", "github": "https://github.com/snehabichkunde/c-shell" },
      { "name": "Boids Flocking", "description": "A flocking simulation in p5.js to model bird-like behavior.", "tech": "p5.js, JavaScript", "link": "https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/", "github": "https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree" }
    ]`,
  };

  function getPrompt() {
    return `<span class="prompt">Sneha Bichkunde:~/portfolio$ </span>`;
  }

  async function typeWelcomeMessage() {
    const welcomeMessage = `
<div class="message">Initializing session for user: guest...</div>
<div class="message">Connection established.</div>
<div class="header">Welcome to Sneha Bichkunde's digital space.</div>
<div class="suggest">Run <span class="command">help</span> to see available documentation.</div>
`;
    const TYPING_SPEED_MS = 30;
    let isTyping = true;

    const skipAnimation = () => { isTyping = false; };
    document.addEventListener('keydown', skipAnimation, { once: true });
    document.addEventListener('click', skipAnimation, { once: true });

    const container = document.createElement("div");
    container.className = "output";
    terminal.appendChild(container);

    async function typeNode(node, parentEl) {
      if (!isTyping) return;
      if (node.nodeType === Node.TEXT_NODE) {
        for (const char of node.textContent) {
          if (!isTyping) break;
          parentEl.innerHTML += char;
          await new Promise(r => setTimeout(r, TYPING_SPEED_MS));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = document.createElement(node.nodeName);
        for(const attr of node.attributes) {
            el.setAttribute(attr.name, attr.value);
        }
        parentEl.appendChild(el);
        for (const child of node.childNodes) {
          await typeNode(child, el);
        }
      }
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = welcomeMessage.trim();

    for (const node of tempDiv.childNodes) {
      await typeNode(node, container);
      if (!isTyping) break;
    }

    if (!isTyping) {
      container.innerHTML = welcomeMessage.trim();
    }

    document.removeEventListener('keydown', skipAnimation);
    document.removeEventListener('click', skipAnimation);

    terminal.appendChild(createPrompt());
    scrollToBottom();
    focusInput();
  }

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
    let output = `<div class="library-container"><span class="library-title">${title}</span><br>`;
    Object.keys(obj).forEach((key) => {
      let value = obj[key];
      let link = null;
      if (typeof value === "string" && value.includes("http")) {
        const parts = value.split(", ");
        value = parts[0];
        link = parts[1];
      }
      output += `<div class="library-item"><span class="library-key">${key.replace(/_/g, " ")}:</span>`;
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
    const suggestion = Object.keys(commands).find(cmd => {
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
    "about-me": () => formatLibrarySection(JSON.parse(content.about), "About Me"),
    hobbies: () => formatLibrarySection(JSON.parse(content.hobbies), "Hobbies"),
    interests: () => formatLibrarySection(JSON.parse(content.interests), "Interests"),
    "technical-skills": () => formatLibrarySection(JSON.parse(content.technical_skills), "Technical Skills"),
    "coding-profiles": () => formatLibrarySection(JSON.parse(content.coding_profiles), "Coding Profiles"),
    coursework: () => formatLibrarySection(JSON.parse(content.coursework), "Coursework"),
    "my-projects": () => JSON.parse(content.projects).map(formatProject).join(""),
    getcv: async () => {
      const resumeUrl = "/Portfolio_Terminal/resume_sneha_bichkunde.pdf";
      try {
        const response = await fetch(resumeUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "resume_sneha_bichkunde.pdf";
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        return `<span class="message">Downloading CV... Check your downloads!</span>`;
      } catch (error) {
        console.error("Download error:", error);
        return `<span class="error">Error: Could not download CV. File might be missing or inaccessible.</span>`;
      }
    },
    getlinkedin: () => {
      window.open("https://www.linkedin.com/in/sneha-bichkunde-aba203269/", "_blank");
      return `<span class="message">Opening LinkedIn profile...</span>`;
    },
    getgithub: () => {
      window.open("https://github.com/snehabichkunde", "_blank");
      return `<span class="message">Opening GitHub profile...</span>`;
    },
    themes: (args) => {
  const validThemes = ["dark", "light", "matrix", "hello_kitty"];
  if (!args[0]) {
    return `<span class="message">Available themes: ${validThemes.join(", ")}</span><br><span class="message">Usage: themes <theme-name></span>`;
  }
  const theme = args[0];
  if (validThemes.includes(theme)) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem("theme", theme);
    // This is the crucial line that was missing. It notifies other scripts of the change.
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }));
    return `<span class="message">Theme switched to ${theme}</span>`;
  }
  return `<span class="error">Invalid theme. Available themes: ${validThemes.join(", ")}</span>`;
  }
  };

  terminal.addEventListener("click", focusInput);

  terminal.addEventListener("keydown", async (e) => {
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
      currentInputBuffer = "";

      if (inputText === "") {
        terminal.appendChild(createPrompt());
        scrollToBottom();
        return;
      }

      if (commands[command]) {
        const result = commands[command](args);
        output = result instanceof Promise ? await result : result;
      } else {
        output = `<span class="error">${command}: command not found</span>${suggestCommand(command)}`;
      }

      if (output !== null) {
        typeOutput(output, focusInput);
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex === -1) {
        currentInputBuffer = input.textContent;
        historyIndex = commandHistory.length - 1;
      } else if (historyIndex > 0) {
        historyIndex--;
      }
      if (commandHistory[historyIndex] !== undefined) {
        input.textContent = commandHistory[historyIndex];
      }
      focusInput();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.textContent = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        input.textContent = currentInputBuffer;
      }
      focusInput();
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const inputText = input.textContent.trim();
      if (!inputText) return;

      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(inputText));

      if (matches.length === 1) {
        input.textContent = matches[0] + " ";
      } else if (matches.length > 1) {
        const commonPrefix = findLongestCommonPrefix(matches);
        if (input.textContent === commonPrefix) {
          typeOutput(`<div class="suggest">${matches.join("  ")}</div>`, () => {
            input.textContent = commonPrefix;
            focusInput();
          });
        } else {
          input.textContent = commonPrefix;
        }
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
    init: async () => {
      terminal.innerHTML = "";
      const savedTheme = localStorage.getItem("theme") || "dark";
      document.body.className = `theme-${savedTheme}`;
      await typeWelcomeMessage();
    }
  };
})();

function findLongestCommonPrefix(strs) {
  if (!strs || strs.length === 0) return "";
  strs.sort();
  const first = strs[0];
  const last = strs[strs.length - 1];
  let i = 0;
  while (i < first.length && first[i] === last[i]) {
    i++;
  }
  return first.substring(0, i);
}

terminalPortfolio.init();