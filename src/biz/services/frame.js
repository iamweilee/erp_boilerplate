import { request } from 'common/utils';

export async function userInfo() {
  return request('/account/baseinfo', { method: 'GET' });
}

export async function login(data) {
  return request('/account/login', { method: 'POST', data });
}

export async function logout() {
  return request('/account/logout', { method: 'GET' });
}

export async function getDict() {
  return request('/domain/dict', { method: 'GET' });
}

export async function getRegions(id) {
  return request(`/regionlist/${id || 0}`, { method: 'GET' });
}
