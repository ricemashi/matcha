import { EventEmitter } from "events";

export default class EventEmitterHandler extends EventEmitter {
  private static instance: EventEmitterHandler;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!EventEmitterHandler.instance) {
      EventEmitterHandler.instance = new EventEmitterHandler();
    }
    return EventEmitterHandler.instance;
  }
}
