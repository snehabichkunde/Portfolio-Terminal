const terminal = document.getElementById("main");

const fileSystem = {
  "/": ["about", "projects", "games", "interests", "hobbies", "themes", "calculator", "technical_skills"],
  "/games": ["snake", "tictactoe", "flappybird", "bubblecrash"],
  "/projects": ["digital_diary", "my_shell", "boids_flocking"],
  "/projects/digital_diary": [],
  "/projects/my_shell": [],
  "/projects/boids_flocking": [],
  "/technical_skills": [],
  "/hobbies": [],
  "/interests": [],
};

const fileContent = {
  "/about": `
{
  "name": "Sneha Bichkunde",
  "student_at": "SGGS, Nanded",
  "role": "SDE",
  "location": "Nanded",
  "fun_fact": "I'd rather write a script than click 10 times 😄"
}
  `,
  "/hobbies": `
{
  "hobbies": [
    "reading",
    "writing poetry",
    "building websites for my own use"
  ]
}
  `,
  "/interests": `
{
  "interests": [
    "Backend Development",
    "System Programming",
    "Distributed Systems"
  ]
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
      "description": "Developed a full-stack diary app to securely store and manage personal stories.",
      "live_link": "https://digital-diary-sneha.netlify.app/",
      "github": "https://github.com/snehabichkunde/DigitalDiary"
    },
    {
      "name": "my_shell - A POSIX-Compliant Shell",
      "description": "Designed a POSIX-compliant shell in C to enhance terminal interaction.",
      "github": "https://github.com/snehabichkunde/c-shell"
    },
    {
      "name": "Boids Flocking with Quadtree Optimization",
      "description": "Created a flocking simulation in p5.js to model bird-like behavior efficiently.",
      "live_link": "https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/",
      "github": "https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree"
    }
  ]
}
  `,
  "/projects/digital_diary": `
{
  "name": "Digital Diary",
  "description": "Developed a full-stack diary app to securely store and manage personal stories.",
  "details": [
    "Built frontend with React.js and backend with Node.js/Express.js, using MongoDB for storage",
    "Implemented JWT authentication to protect user data and enable secure logins",
    "Deployed on Netlify and Render, supporting 100+ user requests with zero downtime"
  ],
  "live_link": "https://digital-diary-sneha.netlify.app/",
  "github": "https://github.com/snehabichkunde/DigitalDiary"
}
  `,
  "/projects/my_shell": `
{
  "name": "my_shell - A POSIX-Compliant Shell",
  "description": "Designed a POSIX-compliant shell in C to enhance terminal interaction.",
  "details": [
    "Developed an interactive REPL with ncurses, improving navigation and feedback",
    "Integrated command history and process management for efficient workflows"
  ],
  "github": "https://github.com/snehabichkunde/c-shell"
}
  `,
  "/projects/boids_flocking": `
{
  "name": "Boids Flocking with Quadtree Optimization",
  "description": "Created a flocking simulation in p5.js to model bird-like behavior efficiently.",
  "details": [
    "Optimized neighbor detection with a Quadtree, reducing complexity from O(n^2) to O(n log n)",
    "Enhanced real-time performance for smooth rendering of 100+ boids"
  ],
  "live_link": "https://snehabichkunde.github.io/Flocking-Simulation-using-Quadtree/",
  "github": "https://github.com/snehabichkunde/Flocking-Simulation-using-Quadtree"
}
  `
};

let currentPath = "/";
let commandHistory = [];
let historyIndex = -1;

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

terminal.value = "";
typeWelcomeMessage();

terminal.addEventListener("keydown", function (e) {
  const lines = terminal.value.split("\n");
  const lastLine = lines[lines.length - 1];
  const prompt = getPrompt();
  const inputStart = terminal.value.lastIndexOf(prompt) + prompt.length;

  if (terminal.selectionStart < inputStart && e.key !== "Enter") {
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
ls           - List directories and files in current folder
cd <dir>     - Change directory or view file content
cd ..        - Go back
get github   - Open GitHub profile
get linkedin - Open LinkedIn profile
play <game>  - Play a game (snake, tictactoe, etc.)
theme <name> - Switch theme (dark, light, glass)
calc <expr>  - Calculate expression (e.g. 2+3*4)
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

          // Check if it's a directory
          if (fileSystem[dirPath]) {
            currentPath = dirPath;
            output = fileContent[currentPath] ? fileContent[currentPath].trim() : "";
          }
          // Check if it's a file
          else if (fileContent[targetPath]) {
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

      default:
        output = `bash: ${command}: command not found`;
    }

    terminal.value += `\n${output}\n${prompt}`;
    scrollToBottom();
  }
});

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

function typeWelcomeMessage() {
  let i = 0;
  const interval = setInterval(() => {
    terminal.value += welcomeMessage[i];
    scrollToBottom();
    i++;
    if (i >= welcomeMessage.length) {
      clearInterval(interval);
      terminal.value += `\n${getPrompt()}`;
      terminal.setSelectionRange(terminal.value.length, terminal.value.length);
      scrollToBottom();
    }
  }, 20);
}