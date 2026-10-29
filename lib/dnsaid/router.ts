export interface Request {
  body: any;
  query: Record<string, string>;
}

export interface Response {
  status(code: number): Response;
  json(data: unknown): Response;
}

type Handler = (req: Request, res: Response) => unknown;

interface CapturedResponse extends Response {
  statusCode: number;
  payload: unknown;
}

function createResponse(): CapturedResponse {
  const res: CapturedResponse = {
    statusCode: 200,
    payload: null,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.payload = data;
      return res;
    },
  };
  return res;
}

export function createRouter() {
  const routes = new Map<string, Handler>();
  const key = (method: string, path: string) => `${method.toUpperCase()} ${path}`;

  return {
    get(path: string, handler: Handler) {
      routes.set(key('GET', path), handler);
    },
    post(path: string, handler: Handler) {
      routes.set(key('POST', path), handler);
    },
    async handle(method: string, path: string, req: Request) {
      const handler = routes.get(key(method, path));
      if (!handler) return { statusCode: 404, payload: { error: 'Not found' } };
      const res = createResponse();
      await handler(req, res);
      return { statusCode: res.statusCode, payload: res.payload };
    },
  };
}
