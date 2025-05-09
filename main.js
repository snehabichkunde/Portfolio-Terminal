let terminal = document.getElementById("main");

terminal.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();

    let lines = terminal.value.split("\n");
    let input = lines[lines.length - 1].trim();
    let [command, ...args] = input.split(" ");

    let output = "";
    if(input==""){
        terminal.value += "\n";
        return;
    }

    switch (command) {
      case "help":
        output = `
Available Commands:
-------------------
help         - Show available commands
clear        - Clear the terminal screen
ls           - List directories (about, projects, games...)
cd <dir>     - Change directory
cd ..        - Go back
get github   - Open GitHub profile
get linkedin - Open LinkedIn profile
play <game>  - Play a game (snake, tictactoe, etc.)
theme <name> - Switch theme (dark, light, glass)
calc <expr>  - Calculate expression (e.g. 2+3*4)
`;
        break;

      case "clear":
        terminal.value = "";
        return; 

      default:
        output = `zsh: command not found: ${command}`;
    }

    terminal.value += "\n" + output + "\n";
  }
});
