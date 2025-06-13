const terminalPortfolio = (() => {
  // === DOM ELEMENTS ===
  const terminal = document.getElementById("main");
  const mobileCommandBar = document.getElementById('mobile-command-bar');

  // === STATE ===
  let commandHistory = [];
  let historyIndex = -1;
  let currentInputBuffer = "";

  // === CONTENT ===
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
      },
      { 
        "name": "Portfolio Terminal", 
        "description": "An interactive terminal-based portfolio to showcase my skills and projects. You're using it right now!",
        "tech": "JavaScript, HTML, CSS", 
        "github": "https://github.com/snehabichkunde/Portfolio_Terminal" 
      },
      { 
        "name": "Snake Game", 
        "description": "A classic Snake game built in C. The snake moves, eats apples to grow, and the game ends on collision.",
        "tech": "C, SDL2", 
        "github": "https://github.com/your-username/your-snake-game-repo" 
      }
    ]`,
  };
  
  // === HELPER FUNCTIONS ===
  function getPrompt() { return `<span class="prompt">Sneha Bichkunde:~/portfolio$ </span>`; }
  function scrollToBottom() { terminal.scrollTop = terminal.scrollHeight; }
  
  function focusInput() {
    if (window.innerWidth <= 600) return;
    const desktopInput = document.querySelector("#desktop-prompt .input");
    if (desktopInput) {
      desktopInput.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(desktopInput);
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
    if (project.link) output += `<a href="${project.link}" class="link" target="_blank">Live Demo</a>`;
    if (project.github) output += `<a href="${project.github}" class="link" target="_blank">GitHub</a>`;
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
      if (link) output += `<a href="${link}" class="library-link" target="_blank">[Visit]</a>`;
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
  
  // === COMMANDS OBJECT (FULL VERSION RESTORED) ===
  const commands = {
    help: () => `
<span class="header">Available Commands</span>
<span class="suggest">About Me & Work</span>
- <span class="command">about-me</span>: Display information about me
- <span class="command">my-projects</span>: Display my personal projects
- <span class="command">technical-skills</span>: Show my technical skills
- <span class="command">coursework</span>: List relevant university coursework
<span class="command">getcv</span>: Download my CV
<span class="suggest">Profiles</span>
- <span class="command">getgithub</span>: Open my GitHub profile
- <span class="command">getlinkedin</span>: Open my LinkedIn profile
- <span class="command">coding-profiles</span>: Show my coding profiles
<span class="suggest">Utilities</span>
- <span class="command">help</span>: Display this help message
- <span class="command">history</span>: Show command history
- <span class="command">clear</span>: Clear the terminal
- <span class="command">themes</span>: Change the terminal theme
<span class="note">On desktop, use ↑↓ arrows for history & Tab for auto-complete.</span>
`,
    clear: () => {
      terminal.innerHTML = "";
      return null;
    },
    history: () => {
      if (commandHistory.length === 0) return `<span class="message">No command history yet.</span>`;
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
      const resumeUrl = "/resume_sneha_bichkunde.pdf"; // Make sure this path is correct
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
        return `<span class="message">Downloading CV...</span>`;
      } catch (error) {
        return `<span class="error">Error: Could not download CV. File may not exist at path.</span>`;
      }
    },
    getlinkedin: () => { window.open("https://www.linkedin.com/in/sneha-bichkunde-aba203269/", "_blank"); return `<span class="message">Opening LinkedIn profile...</span>`; },
    getgithub: () => { window.open("https://github.com/snehabichkunde", "_blank"); return `<span class="message">Opening GitHub profile...</span>`; },
    themes: (args) => {
      const validThemes = ["dark", "light", "matrix", "hello_kitty"];
      if (!args[0]) { return `<span class="message">Available themes: ${validThemes.join(", ")}</span><br><span class="message">Usage: themes <theme-name></span>`; }
      const theme = args[0];
      if (validThemes.includes(theme)) {
        document.body.className = `theme-${theme}`;
        localStorage.setItem("theme", theme);
        window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }));
        return `<span class="message">Theme switched to ${theme}</span>`;
      }
      return `<span class="error">Invalid theme.</span>`;
    }
  };
  
  // === CORE LOGIC ===

  // Restored Welcome Message function
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

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = welcomeMessage.trim();

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
      for(const attr of node.attributes) el.setAttribute(attr.name, attr.value);
      parentEl.appendChild(el);
      for (const child of node.childNodes) await typeNode(child, el);
    }
  }

  for (const node of tempDiv.childNodes) await typeNode(node, container);
  if (!isTyping) container.innerHTML = welcomeMessage.trim();
  
  document.removeEventListener('keydown', skipAnimation);
  document.removeEventListener('click', skipAnimation);

  // --- THIS IS THE CHANGED PART ---
  // Instead of running a command, we just add the first empty prompt for the user.
  appendNewDesktopPrompt();
  scrollToBottom();
  focusInput();
}
  function typeOutput(output) {
    const outputDiv = document.createElement("div");
    outputDiv.className = "output";
    outputDiv.innerHTML = output.replace(/\n/g, "<br>");
    terminal.appendChild(outputDiv);
  }
  
  function appendNewDesktopPrompt() {
    if (window.innerWidth <= 600) return;
    const newPrompt = document.createElement("div");
    newPrompt.className = "prompt-line";
    newPrompt.id = "desktop-prompt";
    newPrompt.innerHTML = `${getPrompt()}<span class="input" contenteditable="true" spellcheck="false"></span>`;
    terminal.appendChild(newPrompt);
  }

  // Refactored unified command execution logic
  async function executeCommand(commandStr) {
    const trimmedCmd = commandStr.trim();

    const currentPrompt = document.getElementById("desktop-prompt");
    if (currentPrompt) { // Deactivate and log the desktop command
        currentPrompt.removeAttribute("id");
        currentPrompt.querySelector('.input').textContent = trimmedCmd;
        currentPrompt.querySelector('.input').contentEditable = "false";
    } else { // Log mobile or initial command
        const logLine = document.createElement('div');
        logLine.className = 'prompt-line';
        logLine.innerHTML = `${getPrompt()}<span class="executed-cmd">${trimmedCmd}</span>`;
        terminal.appendChild(logLine);
    }
    
    if (trimmedCmd) {
      commandHistory.push(trimmedCmd);
      historyIndex = commandHistory.length;
      currentInputBuffer = "";
    }
    
    const [command, ...args] = trimmedCmd.split(" ");
    let output;

    if (command && commands[command]) {
      output = await Promise.resolve(commands[command](args));
    } else if (command) {
      output = `<span class="error">${command}: command not found</span>${suggestCommand(command)}`;
    }
    
    if (output !== null) typeOutput(output);
    appendNewDesktopPrompt();
    scrollToBottom();
    focusInput();
  }
  
  // === MOBILE-SPECIFIC FUNCTIONS ===
  function handleDesktopRecommendation() {
    if (window.innerWidth > 600) return;
    const banner = document.createElement('div');
    banner.className = 'desktop-rec-banner';
    banner.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
      <p>For the full interactive experience, please view on a desktop.</p>
      <button class="close-banner-btn">×</button>
    `;
    terminal.prepend(banner);
    banner.querySelector('.close-banner-btn').onclick = () => {
      banner.style.display = 'none';
    };
  }

// NEW, UPDATED VERSION
function populateMobileCommands(menu = 'main') {
  if (!mobileCommandBar || window.innerWidth > 600) return;
  mobileCommandBar.innerHTML = '';

  let commandsToShow;

  if (menu === 'themes') {
    commandsToShow = ['dark', 'light', 'matrix', 'hello_kitty', 'back'];
  } else {
    // --- NEW LOGIC: Define a priority order ---
    const priorityOrder = [
        'about-me', 
        'my-projects', 
        'technical-skills',
        'getcv',
        'help', 
        'themes',
        'clear'
    ];
    
    // Get all other commands that are not in the priority list
    const otherCommands = Object.keys(commands).filter(cmd => !priorityOrder.includes(cmd));
    
    // Combine the lists: priority first, then the rest
    commandsToShow = [...priorityOrder, ...otherCommands];
  }

  commandsToShow.forEach(cmd => {
    const chip = document.createElement('button');
    chip.className = 'command-chip';
    chip.textContent = cmd.replace(/-/g, ' ');

    // Event Logic (remains the same)
    if (cmd === 'back') {
      chip.classList.add('back-chip');
      chip.onclick = () => populateMobileCommands('main');
    } else if (cmd === 'themes' && menu === 'main') {
      chip.onclick = () => populateMobileCommands('themes');
    } else if (menu === 'themes') {
      chip.onclick = () => {
        executeCommand(`themes ${cmd}`);
        populateMobileCommands('main');
      };
    } else {
      chip.onclick = () => executeCommand(cmd);
    }
    
    mobileCommandBar.appendChild(chip);
  });
}

  // === EVENT LISTENERS ===
  function setupEventListeners() {
    terminal.addEventListener("keydown", async (e) => {
        if (window.innerWidth <= 600) return;
        const desktopInput = document.querySelector("#desktop-prompt .input");
        if (!desktopInput) return;
        
        if (e.key === "Enter") {
            e.preventDefault();
            await executeCommand(desktopInput.textContent);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex > 0) {
                if(historyIndex === commandHistory.length) currentInputBuffer = desktopInput.textContent;
                historyIndex--;
                desktopInput.textContent = commandHistory[historyIndex] || "";
                focusInput();
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                desktopInput.textContent = commandHistory[historyIndex] || "";
            } else {
                historyIndex = commandHistory.length;
                desktopInput.textContent = currentInputBuffer;
            }
            focusInput();
        } else if (e.key === "Tab") {
            e.preventDefault();
            const inputText = desktopInput.textContent.trim();
            if (!inputText) return;
            const matches = Object.keys(commands).filter(cmd => cmd.startsWith(inputText));
            if (matches.length === 1) {
              desktopInput.textContent = matches[0] + " ";
              focusInput();
            } else if (matches.length > 1) {
                const commonPrefix = findLongestCommonPrefix(matches);
                if(desktopInput.textContent === commonPrefix) {
                    typeOutput(`<div class="suggest">${matches.join("  ")}</div>`);
                    scrollToBottom();
                }
                desktopInput.textContent = commonPrefix;
                focusInput();
            }
        }
    });
    
    document.addEventListener('click', (e) => {
      if (e.target.closest('.terminal-wrapper') && !e.target.closest('a') && !e.target.closest('button')) {
        focusInput();
      }
    });
  }

  // === INITIALIZATION ===
  return {
    init: async () => {
      terminal.innerHTML = "";
      const savedTheme = localStorage.getItem("theme") || "dark";
      document.body.className = `theme-${savedTheme}`;
      
      handleDesktopRecommendation();
      populateMobileCommands();
      setupEventListeners();
      
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
  while (i < first.length && first[i] === last[i]) i++;
  return first.substring(0, i);
}

document.addEventListener('DOMContentLoaded', () => {
  terminalPortfolio.init();
});