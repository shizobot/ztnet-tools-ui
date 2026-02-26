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
  'curl-status': (cv) => `<span class="c"># ── Get controller status & Node ID ─────────────</span>
<span class="p">$</span> <span class="cmd">curl "${cv('host')}/status" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"</span>`,

  'curl-list-nets': (
    cv,
  ) => `<span class="c"># ── List all managed networks ────────────────────</span>
<span class="p">$</span> <span class="cmd">curl "${cv('host')}/controller/network" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"</span>`,

  'curl-create-net': (
    cv,
  ) => `<span class="c"># ── Create a new network (auto-generates ID) ─────</span>
<span class="p">$</span> <span class="cmd">curl -X POST \\
  "${cv('host')}/controller/network/${cv('nodeId')}______" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"ipAssignmentPools":[{"ipRangeStart":"192.168.192.1","ipRangeEnd":"192.168.192.254"}],"routes":[{"target":"192.168.192.0/24","via":null}],"v4AssignMode":{"zt":true},"private":true,"name":"my-network"}'</span>`,

  'curl-get-net': (
    cv,
  ) => `<span class="c"># ── Get network details ──────────────────────────</span>
<span class="p">$</span> <span class="cmd">curl "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"</span>`,

  'curl-config-net': (
    cv,
  ) => `<span class="c"># ── Update network configuration ─────────────────</span>
<span class="p">$</span> <span class="cmd">curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"name":"updated-name","private":true,"multicastLimit":32}'</span>

<span class="c"># ── Delete network ────────────────────────────────</span>
<span class="p">$</span> <span class="cmd">curl -X DELETE \\
  "${cv('host')}/controller/network/${cv('nwid')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"</span>`,

  'curl-list-mem': (
    cv,
  ) => `<span class="c"># ── List network members ─────────────────────────</span>
<span class="p">$</span> <span class="cmd">curl "${cv('host')}/controller/network/${cv('nwid')}/member" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"</span>

<span class="c"># ── Get specific member ───────────────────────────</span>
<span class="p">$</span> <span class="cmd">curl "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"</span>`,

  'curl-auth-mem': (
    cv,
  ) => `<span class="c"># ── Authorize a member ───────────────────────────</span>
<span class="p">$</span> <span class="cmd">curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"authorized":true}'</span>

<span class="c"># ── Deauthorize a member ──────────────────────────</span>
<span class="p">$</span> <span class="cmd">curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"authorized":false}'</span>`,

  'curl-del-mem': (cv) => `<span class="c"># ⚠ Deauthorize FIRST, then delete ───────────────</span>
<span class="p">$</span> <span class="cmd">curl -X POST \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}" \\
  -d '{"authorized":false}'</span>

<span class="p">$</span> <span class="cmd">curl -X DELETE \\
  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\
  -H "${ZT_AUTH_HEADER}: ${cv('token')}"</span>`,
};
