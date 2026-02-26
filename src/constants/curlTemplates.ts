import { ZT_AUTH_HEADER } from '../api/ztApi';

export type CurlTemplateKey =
  | 'curl-status'
  | 'curl-list-nets'
  | 'curl-create-net'
  | 'curl-get-net'
  | 'curl-config-net'
  | 'curl-list-mem'
  | 'curl-auth-mem'
  | 'curl-del-mem';

export type CurlVariableKey = 'host' | 'token' | 'nwid' | 'nodeId' | 'memId';
export type CurlValueResolver = (key: CurlVariableKey) => string;

type CurlTemplateRenderer = (resolve: CurlValueResolver) => string;

export const curlTpls: Readonly<Record<CurlTemplateKey, CurlTemplateRenderer>> = {
  'curl-status': (cv) => `# ── Get controller status & Node ID ─────────────
$ curl "${cv('host')}/status" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"`,

  'curl-list-nets': (cv) => `# ── List all managed networks ────────────────────
$ curl "${cv('host')}/controller/network" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"`,

  'curl-create-net': (cv) => `# ── Create a new network (auto-generates ID) ─────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nodeId')}______" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"ipAssignmentPools":[{"ipRangeStart":"192.168.192.1","ipRangeEnd":"192.168.192.254"}],"routes":[{"target":"192.168.192.0/24","via":null}],"v4AssignMode":{"zt":true},"private":true,"name":"my-network"}'`,

  'curl-get-net': (cv) => `# ── Get network details ──────────────────────────
$ curl "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"`,

  'curl-config-net': (cv) => `# ── Update network configuration ─────────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"name":"updated-name","private":true,"multicastLimit":32}'

# ── Delete network ────────────────────────────────
$ curl -X DELETE \\
  "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"`,

  'curl-list-mem': (cv) => `# ── List network members ─────────────────────────
$ curl "${cv('host')}/controller/network/${cv('nwid')}/member" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"

# ── Get specific member ───────────────────────────
$ curl "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"`,

  'curl-auth-mem': (cv) => `# ── Authorize a member ───────────────────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"authorized":true}'

# ── Deauthorize a member ──────────────────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"authorized":false}'`,

  'curl-del-mem': (cv) => `# ⚠ Deauthorize FIRST, then delete ───────────────
$ curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"authorized":false}'

$ curl -X DELETE \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"`,
};
