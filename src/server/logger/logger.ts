/* eslint-disable no-console */
import { DateTime } from 'luxon';

import type { ILogger } from '@/types/logger';

import { logColors } from './colors';

export class Logger implements ILogger {
  constructor(private readonly context: string) {
    this.context = context;
  }

  private static logMessage(
    type: 'log' | 'debug' | 'info' | 'error',
    context: string,
    messages: unknown[],
    colorFn: (s: string) => string
  ): void {
    if (
      process.env.NODE_ENV !== 'production' ||
      type === 'log' ||
      type === 'info' ||
      type === 'error'
    ) {
      const prefix = colorFn(
        `[${type.toUpperCase()} - ${DateTime.now().toLocaleString(
          DateTime.DATETIME_FULL
        )} - ${logColors.yellow(context)}]:`
      );
      console.log(prefix, ...messages);
    }
  }

  public log(...messages: unknown[]): void {
    Logger.logMessage('log', this.context, messages, logColors.green);
  }

  public debug(...messages: unknown[]): void {
    Logger.logMessage('debug', this.context, messages, logColors.orange);
  }

  public error(...messages: unknown[]): void {
    Logger.logMessage('error', this.context, messages, logColors.red);
  }

  public info(...messages: unknown[]): void {
    Logger.logMessage('info', this.context, messages, logColors.cyan);
  }

  public static log(context: string, ...messages: unknown[]): void {
    this.logMessage('log', context, messages, logColors.green);
  }

  public static debug(context: string, ...messages: unknown[]): void {
    this.logMessage('debug', context, messages, logColors.orange);
  }

  public static error(context: string, ...messages: unknown[]): void {
    this.logMessage('error', context, messages, logColors.red);
  }

  public static info(context: string, ...messages: unknown[]): void {
    this.logMessage('info', context, messages, logColors.cyan);
  }
}

export const logger = new Logger('Logger');
