export type LeatherJsonRPCResponse<T> = {
  id: string;
  jsonrpc: string;
  result: T;
};

export type LeatherErrorResponse = {
  error: {
    code: number;
    message: string;
  };
  id: string;
  jsonrpc: string;
};

export async function leatherRequest<T>(
  arg: string,
  params?: object | string[],
): Promise<T> {
  if (typeof window !== "undefined" && window.LeatherProvider) {
    try {
      const res = (await window.LeatherProvider.request(
        arg,
        params,
      )) as LeatherJsonRPCResponse<T>;

      return res.result;
    } catch (err) {
      const leatherError = err as LeatherErrorResponse;
      const { message } = leatherError.error;

      if (leatherError.error.code === 4001) {
        throw new Error(message);
      }

      throw new Error(`Leather error: ${message}`);
    }
  } else {
    throw new Error("LeatherProvider not found");
  }
}
