// utils/memoryMonitor.js
const logger = require('../config/logger');

class MemoryMonitor {
    constructor() {
        this.lastMemory = null;
        this.monitorInterval = null;
        this.threshold = 1536; // MB threshold
    }

    formatBytes(bytes) {
        return Math.round(bytes / 1024 / 1024 * 100) / 100;
    }

    getMemoryUsage() {
        const usage = process.memoryUsage();
        return {
            rss: this.formatBytes(usage.rss),          // Resident Set Size
            heapTotal: this.formatBytes(usage.heapTotal),
            heapUsed: this.formatBytes(usage.heapUsed),
            external: this.formatBytes(usage.external),
            arrayBuffers: this.formatBytes(usage.arrayBuffers || 0)
        };
    }

    logMemoryUsage() {
        const current = this.getMemoryUsage();

        logger.info(`Memory Usage: 
      RSS: ${current.rss}MB
      Heap Used: ${current.heapUsed}MB / ${current.heapTotal}MB
      External: ${current.external}MB
      Array Buffers: ${current.arrayBuffers}MB`);

        // Check for memory leaks
        if (this.lastMemory) {
            const heapGrowth = current.heapUsed - this.lastMemory.heapUsed;
            if (heapGrowth > 100) { // More than 100MB growth
                logger.warn(`⚠️ Large heap growth detected: +${heapGrowth}MB`);
            }
        }

        // Check threshold
        if (current.heapUsed > this.threshold) {
            logger.error(`🚨 Memory threshold exceeded: ${current.heapUsed}MB > ${this.threshold}MB`);
            this.triggerGarbageCollection();
        }

        this.lastMemory = current;
        return current;
    }

    triggerGarbageCollection() {
        if (global.gc) {
            logger.info('🧹 Triggering garbage collection...');
            global.gc();
            const afterGC = this.getMemoryUsage();
            logger.info(`Memory after GC: ${afterGC.heapUsed}MB`);
        } else {
            logger.warn('Garbage collection not available. Start with --expose-gc flag');
        }
    }

    startMonitoring(intervalMs = 30000) {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }

        this.monitorInterval = setInterval(() => {
            this.logMemoryUsage();
        }, intervalMs);

        logger.info(`📊 Memory monitoring started (${intervalMs / 1000}s intervals)`);
    }

    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
            logger.info('📊 Memory monitoring stopped');
        }
    }

    // Express middleware to track memory per request
    middleware() {
        return (req, res, next) => {
            const startMemory = this.getMemoryUsage();

            res.on('finish', () => {
                const endMemory = this.getMemoryUsage();
                const memoryDiff = endMemory.heapUsed - startMemory.heapUsed;

                if (memoryDiff > 10) { // More than 10MB per request
                    logger.warn(`Memory spike in ${req.method} ${req.path}: +${memoryDiff}MB`);
                }
            });

            next();
        };
    }
}

const memoryMonitor = new MemoryMonitor();

// Handle process events
process.on('SIGINT', () => {
    memoryMonitor.stopMonitoring();
});

process.on('SIGTERM', () => {
    memoryMonitor.stopMonitoring();
});

module.exports = memoryMonitor;