import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações
const SERVICES = {
  NEXT: {
    command: 'npm',
    args: ['run', 'dev'],
    name: 'Frontend (Next.js)',
    ready: (data) => data.includes('ready started server')
  },
  TUNNEL: {
    command: 'npm',
    args: ['run', 'start:tunnel'],
    name: 'Túnel ngrok',
    ready: (data) => data.includes('online at')
  },
  BOT: {
    command: 'npm',
    args: ['run', 'start:telegram'],
    name: 'Bot Telegram',
    ready: (data) => data.includes('Bot iniciado')
  }
};

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Armazena os processos em execução
const processes = new Map();

function log(service, message, color = colors.reset) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${color}[${timestamp}] [${service}] ${message}${colors.reset}`);
}

function startService(name, config) {
  const process = spawn(config.command, config.args, {
    stdio: 'pipe',
    shell: true
  });

  processes.set(name, process);
  
  let isReady = false;

  process.stdout.on('data', (data) => {
    const output = data.toString();
    
    if (!isReady && config.ready(output)) {
      isReady = true;
      log(config.name, 'Serviço iniciado e pronto!', colors.green);
    }
    
    log(config.name, output.trim());
  });

  process.stderr.on('data', (data) => {
    log(config.name, data.toString().trim(), colors.red);
  });

  process.on('close', (code) => {
    if (code !== 0) {
      log(config.name, `Processo finalizado com código ${code}`, colors.red);
    }
    processes.delete(name);
    
    // Reinicia o serviço após 5 segundos
    setTimeout(() => {
      log(config.name, 'Reiniciando serviço...', colors.yellow);
      startService(name, config);
    }, 5000);
  });

  log(config.name, 'Iniciando serviço...', colors.cyan);
}

// Captura CTRL+C para finalização limpa
process.on('SIGINT', () => {
  log('Sistema', 'Finalizando todos os serviços...', colors.yellow);
  
  processes.forEach((process) => {
    process.kill();
  });
  
  setTimeout(() => {
    log('Sistema', 'Todos os serviços finalizados', colors.green);
    process.exit(0);
  }, 1000);
});

// Inicia todos os serviços
console.clear();
log('Sistema', 'Iniciando todos os serviços...', colors.cyan);

Object.entries(SERVICES).forEach(([name, config]) => {
  startService(name, config);
});