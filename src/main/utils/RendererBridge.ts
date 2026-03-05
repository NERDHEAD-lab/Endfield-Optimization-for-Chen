import { BrowserWindow } from "electron";

interface QueuedEvent {
  channel: string;
  args: unknown[];
  timestamp: number;
}

class RendererBridge {
  private static instance: RendererBridge;
  private queue: QueuedEvent[] = [];
  private isReady: boolean = false;
  private mainWindow: BrowserWindow | null = null;
  private queueTimeout: NodeJS.Timeout | null = null;
  private readonly QUEUE_TTL = 30000; // 30 seconds TTL for queued events

  private constructor() {}

  public static getInstance(): RendererBridge {
    if (!RendererBridge.instance) {
      RendererBridge.instance = new RendererBridge();
    }
    return RendererBridge.instance;
  }

  public setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
  }

  /**
   * Called when the Renderer process sends 'UI_READY' signal.
   * Flushes any queued events.
   */
  public setReady() {
    if (this.isReady) return; // Already ready

    console.log(
      `[RendererBridge] UI is ready. Flushing ${this.queue.length} events.`,
    );
    this.isReady = true;
    this.flushQueue();

    // Clear any cleanup timeouts
    if (this.queueTimeout) {
      clearTimeout(this.queueTimeout);
      this.queueTimeout = null;
    }
  }

  /**
   * Sends an event to the Renderer process via IPC.
   * If Renderer is not ready, queues the event.
   */
  public send(channel: string, ...args: unknown[]) {
    // Check if window exists and is valid
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      console.warn(
        `[RendererBridge] Cannot send '${channel}': MainWindow is missing or destroyed.`,
      );
      return;
    }

    if (this.isReady) {
      // Direct send if ready
      try {
        this.mainWindow.webContents.send(channel, ...args);
      } catch (error) {
        console.error(`[RendererBridge] Failed to send '${channel}':`, error);
      }
    } else {
      // Queue if not ready
      console.log(`[RendererBridge] UI not ready. Queuing event: ${channel}`);
      this.queue.push({
        channel,
        args,
        timestamp: Date.now(),
      });

      // Start cleanup timer if not running
      if (!this.queueTimeout) {
        this.startQueueCleanup();
      }
    }
  }

  private flushQueue() {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return;

    // Process queue in order
    while (this.queue.length > 0) {
      const event = this.queue.shift(); // FIFO
      if (event) {
        try {
          this.mainWindow.webContents.send(event.channel, ...event.args);
        } catch (error) {
          console.error(
            `[RendererBridge] Failed to flush queued event '${event.channel}':`,
            error,
          );
        }
      }
    }
  }

  private startQueueCleanup() {
    this.queueTimeout = setTimeout(() => {
      // Remove stale events
      const now = Date.now();
      const validEvents = this.queue.filter(
        (e) => now - e.timestamp < this.QUEUE_TTL,
      );

      if (validEvents.length < this.queue.length) {
        console.warn(
          `[RendererBridge] Dropped ${this.queue.length - validEvents.length} stale events.`,
        );
        this.queue = validEvents;
      }

      this.queueTimeout = null;
      if (this.queue.length > 0) this.startQueueCleanup();
    }, 5000); // Check every 5 seconds
  }
}

export const rendererBridge = RendererBridge.getInstance();
