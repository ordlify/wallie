/**
 * Continuously checks if the unisat extension and all related unisat APIs are ready, timing out after 2 seconds.
 *
 * @returns true if extension is ready, false otherwise
 */
export declare function waitForUnisatExtensionReady(): Promise<boolean>;
