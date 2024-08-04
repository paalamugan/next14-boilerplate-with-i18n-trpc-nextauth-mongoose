import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';

import { Logger } from '@/server/logger';

/** Callback for establishing or re-stabilizing mongo connection */
interface IOnConnectedCallback {
  (): void;
}

interface IOnSuccessCallback {
  (connection: typeof mongoose): void;
}

interface IOnErrorCallback {
  (error: Error): void;
}

/**
 * A Mongoose Connection wrapper class to
 * help with mongo connection issues.
 */
class MongoDBConnection {
  private readonly logger = new Logger(MongoDBConnection.name);

  /** URL to access mongo */
  private readonly mongoUrl: string;

  /** Callback when mongo connection is established or re-established */
  private onConnectedCallback: IOnConnectedCallback;

  /**
   * Internal flag to check if connection established for
   * first time or after a disconnection
   */
  private isConnectedBefore: boolean = false;

  /** Mongo connection options to be passed Mongoose */
  private readonly mongoConnectionOptions: ConnectOptions = {
    bufferCommands: false,
  };

  /**
   * Start mongo connection
   * @param mongoUrl MongoDB URL
   * @param onConnectedCallback callback to be called when mongo connection is successful
   */
  constructor(mongoUrl: string, onConnectedCallback?: IOnConnectedCallback) {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    this.mongoUrl = mongoUrl;
    this.onConnectedCallback = onConnectedCallback ?? (() => {});
    mongoose.connection.on('error', this.onError);
    mongoose.connection.on('disconnected', this.onDisconnected);
    mongoose.connection.on('connected', this.onConnected);
    mongoose.connection.on('reconnected', this.onReconnected);
  }

  /** Close mongo connection */
  public close(force?: boolean) {
    this.logger.info('Closing the MongoDB connection');
    // noinspection JSIgnoredPromiseFromCall
    mongoose.connection.close(force);
  }

  /** Start mongo connection */
  public connect(onSuccessCallback: IOnSuccessCallback, onErrorCallback?: IOnErrorCallback) {
    this.startConnection(onSuccessCallback, onErrorCallback);
  }

  private startConnection = (
    onSuccessCallback?: IOnSuccessCallback,
    onErrorCallback?: IOnErrorCallback
  ) => {
    this.logger.info(`Connecting to MongoDB at ${this.mongoUrl}`);
    mongoose
      .connect(this.mongoUrl, this.mongoConnectionOptions)
      .then(onSuccessCallback || (() => {}))
      .catch(onErrorCallback || (() => {}));
  };

  /**
   * Handler called when mongo connection is established
   */
  private onConnected = () => {
    this.logger.info(`Connected to MongoDB at ${this.mongoUrl}`);
    this.isConnectedBefore = true;
    this.onConnectedCallback();
  };

  /** Handler called when mongo gets re-connected to the database */
  private onReconnected = () => {
    this.logger.info('Reconnected to MongoDB');
    this.onConnectedCallback();
  };

  /** Handler called for mongo connection errors */
  private onError = () => {
    this.logger.error(`Could not connect to ${this.mongoUrl}`);
  };

  /** Handler called when mongo connection is lost */
  private onDisconnected = () => {
    if (!this.isConnectedBefore) {
      setTimeout(() => {
        this.startConnection();
      }, 2000);
      this.logger.info('Retrying mongo connection');
    }
  };
}

export { MongoDBConnection };
