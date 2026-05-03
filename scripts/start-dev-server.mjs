/**
 * Kills any process holding port 4173, then starts `vite dev --port=4173`.
 * Used by playwright.config.ts webServer.command so stale dev servers never
 * block a fresh test run.
 */
import { execSync, spawn } from 'child_process';

const PORT = 4173;

function killPort(port)
{
    try
    {
        if (process.platform === 'win32')
        {
            const out = execSync('netstat -ano', { encoding: 'utf8' });
            const pids = new Set();
            for (const line of out.split('\n'))
            {
                if (line.includes(`:${port}`) && line.includes('LISTENING'))
                {
                    const pid = line.trim().split(/\s+/).at(-1);
                    if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
                }
            }
            for (const pid of pids)
            {
                try { execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' }); } catch { }
            }
        } else
        {
            try { execSync(`fuser -k ${port}/tcp`); } catch { }
        }
    } catch
    {
        // port was already free — ignore
    }
}

killPort(PORT);

// Give the OS time to release the port binding
await new Promise((r) => setTimeout(r, 800));

const child = spawn('npx', ['vite', 'dev', `--port=${PORT}`, '--host=127.0.0.1'], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
});

child.on('error', (err) =>
{
    console.error('[start-dev-server] Failed to start vite:', err.message);
    process.exit(1);
});

child.on('exit', (code) => process.exit(code ?? 0));
