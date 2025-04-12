const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to kill processes using port 5000
function killProcessOnPort(port) {
  return new Promise((resolve, reject) => {
    console.log(`Killing processes on port ${port}...`);
    
    // For Windows
    exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`No processes found on port ${port}`);
        resolve();
        return;
      }
      
      const lines = stdout.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) {
        console.log(`No processes found on port ${port}`);
        resolve();
        return;
      }
      
      // Extract PIDs
      const pids = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        return parts[parts.length - 1];
      });
      
      // Kill each process
      let killed = 0;
      pids.forEach(pid => {
        exec(`taskkill /F /PID ${pid}`, (error) => {
          if (error) {
            console.error(`Failed to kill process ${pid}: ${error.message}`);
          } else {
            console.log(`Killed process ${pid}`);
            killed++;
          }
          
          if (killed === pids.length) {
            console.log(`All processes on port ${port} have been killed`);
            resolve();
          }
        });
      });
    });
  });
}

// Function to check if server is running
function checkServerRunning(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`Server is running on port ${port}`);
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log(`Server is not running on port ${port}: ${err.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

// Function to start the server
function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting server...');
    
    // Check if .env file exists and has the correct API key
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('your_actual_deepseek_api_key_here')) {
        console.log('WARNING: You need to replace the placeholder API key in .env with your actual DeepSeek API key');
      }
    }
    
    const server = exec('npm run dev', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`Server stderr: ${stderr}`);
      }
      
      console.log(`Server stdout: ${stdout}`);
    });
    
    // Wait for server to start
    setTimeout(async () => {
      const isRunning = await checkServerRunning(5000);
      if (isRunning) {
        resolve(server);
      } else {
        console.log('Server failed to start, retrying...');
        server.kill();
        resolve(null);
      }
    }, 5000);
  });
}

// Main function
async function main() {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Attempt ${attempts} of ${maxAttempts}`);
    
    // Kill any processes on port 5000
    await killProcessOnPort(5000);
    
    // Start the server
    const server = await startServer();
    
    if (server) {
      console.log('Server started successfully!');
      console.log('Press Ctrl+C to stop the server');
      
      // Keep the script running
      process.stdin.resume();
      return;
    }
    
    console.log(`Attempt ${attempts} failed, waiting before retrying...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log(`Failed to start server after ${maxAttempts} attempts`);
  process.exit(1);
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 