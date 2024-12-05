const { spawn } = require('child_process');

function runPythonScript(scriptPath, args) {
  const pythonProcess = spawn('python', [scriptPath, ...args]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python output: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}

// Example usage
runPythonScript('test.py', ['arg1', 'arg2', 'arg3']);