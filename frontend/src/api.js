const BASE_URL = process.env.REACT_APP_API_URL || "";

export async function getHello() {
  const res = await fetch(`${BASE_URL}/api/hello/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getCode(text, id) {
  const res = await fetch(`${BASE_URL}/api/chroma_query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: text, user_id: id }),
  });
  if (!res.ok) {
    return "Error";
  };
  return res.json();
}

export async function getIState(id) {
  const res = await fetch(`${BASE_URL}/api/chroma_state/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: id }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

// GET functions
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/api/users/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getUser(userId) {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getClassrooms() {
  const res = await fetch(`${BASE_URL}/api/classrooms/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getClassroom(classroomId) {
  const res = await fetch(`${BASE_URL}/api/classrooms/${classroomId}/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getCourses() {
  const res = await fetch(`${BASE_URL}/api/courses/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getCourse(courseId) {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getAssignments() {
  const res = await fetch(`${BASE_URL}/api/assignments/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getAssignment(assignmentId) {
  const res = await fetch(`${BASE_URL}/api/assignments/${assignmentId}/`);
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

// POST functions (adjust fields as needed to match your backend models)
export async function createCourse(title) {
  const res = await fetch(`${BASE_URL}/api/courses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function createAssignment(courseId, name, statement) {
  const res = await fetch(`${BASE_URL}/api/assignments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ course: courseId, name, statement }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

// DELETE functions
export async function deleteUser(userId) {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return null;
}

export async function deleteClassroom(classroomId) {
  const res = await fetch(`${BASE_URL}/api/classrooms/${classroomId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return null;
}

export async function deleteCourse(courseId) {
  const res = await fetch(`${BASE_URL}/api/courses/${courseId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("API call failed");
  return null;
}

