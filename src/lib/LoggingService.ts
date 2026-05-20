/**
 * Centralized logging service
 * Replaces console.* calls with configurable logging
 * Can be disabled in production, sent to analytics, etc.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
	level: LogLevel;
	message: string;
	data?: unknown;
	timestamp: Date;
	context?: string;
}

class LoggingService {
	private enabled = true;
	private minLevel: LogLevel = 'info';
	private logHistory: LogEntry[] = [];
	private maxHistory = 100;
	private subscribers: ((entry: LogEntry) => void)[] = [];

	// Log level priority
	private levelPriority: Record<LogLevel, number> = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3
	};

	/**
	 * Enable or disable logging
	 */
	setEnabled(enabled: boolean): void {
		this.enabled = enabled;
	}

	/**
	 * Set minimum log level
	 */
	setMinLevel(level: LogLevel): void {
		this.minLevel = level;
	}

	/**
	 * Subscribe to log entries
	 */
	subscribe(callback: (entry: LogEntry) => void): () => void {
		this.subscribers.push(callback);
		return () => {
			const index = this.subscribers.indexOf(callback);
			if (index > -1) {
				this.subscribers.splice(index, 1);
			}
		};
	}

	/**
	 * Core log method
	 */
	private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
		// Check if level is enabled
		if (!this.enabled || this.levelPriority[level] < this.levelPriority[this.minLevel]) {
			return;
		}

		const entry: LogEntry = {
			level,
			message,
			data,
			timestamp: new Date(),
			context
		};

		// Add to history
		this.logHistory.push(entry);
		if (this.logHistory.length > this.maxHistory) {
			this.logHistory.shift();
		}

		// Notify subscribers
		this.subscribers.forEach((cb) => {
			try {
				cb(entry);
			} catch {
				// Ignore subscriber errors
			}
		});

		// Console output (in development)
		if (typeof window !== 'undefined' && import.meta.env?.DEV) {
			const prefix = context ? `[${context}]` : '[App]';
			const consoleMethod = level === 'debug' ? 'log' : level;

			if (data !== undefined) {
				// eslint-disable-next-line no-console
				console[consoleMethod](`${prefix} ${message}`, data);
			} else {
				// eslint-disable-next-line no-console
				console[consoleMethod](`${prefix} ${message}`);
			}
		}
	}

	/**
	 * Debug level logging
	 */
	debug(message: string, data?: unknown, context?: string): void {
		this.log('debug', message, data, context);
	}

	/**
	 * Info level logging
	 */
	info(message: string, data?: unknown, context?: string): void {
		this.log('info', message, data, context);
	}

	/**
	 * Warning level logging
	 */
	warn(message: string, data?: unknown, context?: string): void {
		this.log('warn', message, data, context);
	}

	/**
	 * Error level logging
	 */
	error(message: string, data?: unknown, context?: string): void {
		this.log('error', message, data, context);
	}

	/**
	 * Get recent log history
	 */
	getHistory(): LogEntry[] {
		return [...this.logHistory];
	}

	/**
	 * Clear log history
	 */
	clearHistory(): void {
		this.logHistory = [];
	}
}

// Export singleton instance
export const logger = new LoggingService();

// Helper functions for convenience
export const log = {
	debug: (msg: string, data?: unknown, ctx?: string) => logger.debug(msg, data, ctx),
	info: (msg: string, data?: unknown, ctx?: string) => logger.info(msg, data, ctx),
	warn: (msg: string, data?: unknown, ctx?: string) => logger.warn(msg, data, ctx),
	error: (msg: string, data?: unknown, ctx?: string) => logger.error(msg, data, ctx)
};
