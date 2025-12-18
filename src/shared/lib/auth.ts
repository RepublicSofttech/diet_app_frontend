export const AUTH_TOKEN_KEY = "auth_at";

export function logout() {
  // remove token
  localStorage.removeItem(AUTH_TOKEN_KEY);

  // optional: remove refresh token
  localStorage.removeItem("auth_rt");

  // hard reload → app re-evaluates auth
 
}
