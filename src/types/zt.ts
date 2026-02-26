export interface ZtNetwork {
  id: string;
  name?: string;
  status?: string;
  [key: string]: unknown;
}

export interface ZtIpAssignmentPool {
  ipRangeStart: string;
  ipRangeEnd: string;
}

export interface ZtRoute {
  target: string;
  via?: string;
}

export interface ApiErrorBody {
  message?: string;
  error?: string;
}
