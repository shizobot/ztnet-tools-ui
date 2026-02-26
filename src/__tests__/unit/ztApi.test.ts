import { afterEach, describe, expect, it, vi } from "vitest";

import {
  LEGACY_AUTH_HEADER,
  ZT_AUTH_HEADER,
  ztDelete,
  ztGet,
  ztPost,
} from "../../api/ztApi";

type FetchMock = ReturnType<typeof vi.fn>;

const createJsonResponse = (payload: unknown): Response =>
  ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: vi.fn().mockResolvedValue(payload),
  }) as unknown as Response;

describe("ztApi auth headers", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("builds auth headers for ztGet", async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse({ ok: true }));
    globalThis.fetch = fetchMock as typeof fetch;

    await ztGet<{ ok: boolean }>({
      path: "/status",
      config: { host: "http://localhost:9993", token: "token-1" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("GET");
    expect(init.headers).toMatchObject({
      [ZT_AUTH_HEADER]: "token-1",
      [LEGACY_AUTH_HEADER]: "bearer token-1",
    });
  });

  it("builds auth headers for ztPost", async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse({ created: true }));
    globalThis.fetch = fetchMock as typeof fetch;

    await ztPost<{ created: boolean }, { name: string }>({
      path: "/controller/network/example",
      config: { host: "http://localhost:9993", token: "token-2" },
      body: { name: "example" },
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      [ZT_AUTH_HEADER]: "token-2",
      [LEGACY_AUTH_HEADER]: "bearer token-2",
      "Content-Type": "application/json",
    });
    expect(init.body).toBe(JSON.stringify({ name: "example" }));
  });

  it("builds auth headers for ztDelete", async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockResolvedValue(createJsonResponse({ removed: true }));
    globalThis.fetch = fetchMock as typeof fetch;

    await ztDelete<{ removed: boolean }>({
      path: "/controller/network/example",
      config: { host: "http://localhost:9993", token: "token-3" },
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("DELETE");
    expect(init.headers).toMatchObject({
      [ZT_AUTH_HEADER]: "token-3",
      [LEGACY_AUTH_HEADER]: "bearer token-3",
    });
  });
});
