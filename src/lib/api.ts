/**
 * Thin fetch wrapper for the frontend.
 * All requests are same-origin and include cookies automatically.
 */
async function req(path: string, opts: RequestInit = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: "same-origin"
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

export const api = {
  // Auth
  register: (b: any) => req("/api/auth/register", { method: "POST", body: JSON.stringify(b) }),
  login:    (b: any) => req("/api/auth/login",    { method: "POST", body: JSON.stringify(b) }),
  logout:   ()       => req("/api/auth/logout",   { method: "POST" }),
  me:       ()       => req("/api/auth/me"),

  // Courses
  courses:        (include?: string, admin?: boolean) => req(`/api/courses?${include ? `include=${include}&` : ""}${admin ? "admin=1" : ""}`),
  course:         (id: string) => req(`/api/courses/${id}`),
  createCourse:   (b: any) => req("/api/courses", { method: "POST", body: JSON.stringify(b) }),
  updateCourse:   (id: string, b: any) => req(`/api/courses/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
  deleteCourse:   (id: string) => req(`/api/courses/${id}`, { method: "DELETE" }),

  // Enrollments
  myEnrollments:  () => req("/api/enrollments"),
  enroll:         (course_id: string) => req("/api/enrollments", { method: "POST", body: JSON.stringify({ course_id }) }),
  enrollment:     (courseId: string) => req(`/api/enrollments/${courseId}`),
  updateEnrollment: (courseId: string, b: any) => req(`/api/enrollments/${courseId}`, { method: "PATCH", body: JSON.stringify(b) }),

  // Admin
  adminUsers:     () => req("/api/admin/users"),
  updateUser:     (b: any) => req("/api/admin/users", { method: "PATCH", body: JSON.stringify(b) }),
  adminContent:   (b: any) => req("/api/admin/content", { method: "POST", body: JSON.stringify(b) }),

  // i18n
  i18n:           () => req("/api/admin/i18n"),
  saveI18n:       (overrides: any) => req("/api/admin/i18n", { method: "PUT", body: JSON.stringify({ overrides }) }),
};
