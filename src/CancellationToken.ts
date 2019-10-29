const CANCEL = Symbol();

export type Action = () => void;

export class CancelledError extends Error {
    constructor() {
        super('The process was cancelled');
    }
}

export class CancellationToken {

    private cancelled = false;
    private actions: Action[] = [];
  
    /**
     * Will throw an exception when this token was cancelled
     * This is useful when using async/await
     */
    throwIfCancelled() {
        if(this.isCancelled()) {
            throw new CancelledError();
        }
    }
  
    /**
     * Checks whether this token was cancelled
     * This is useful when using a promise,
     * as it can be used to reject the promise
     */
    isCancelled() {
        return this.cancelled === true;
    }

    /**
     * Registers a callback to execute once this token gets cancelled
     * @param action The action
     */
    register(action: Action) {
        this.actions.push(action);
    }
  
    [CANCEL]() {
        this.cancelled = true;
        this.actions.forEach(action => action());
    }
}

export class CancellationTokenSource {

    public readonly token = new CancellationToken();
    
    /**
     * Cancel the token inside this source.
     */
    cancel() {
      this.token[CANCEL]();
    }
}