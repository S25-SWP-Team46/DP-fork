import { act } from "react";

const BASE_URL = process.env.REACT_APP_API_URL || "";

export async function getChromaResponse(text, id) {
  const res = await fetch(`${BASE_URL}/api/chroma/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: text, user_id: id, action: 'execute' }),
  });
  if (!res.ok) {
    return "Error";
  };
  return res.json();
}

export async function getChromaInitialState(id) {
  const res = await fetch(`${BASE_URL}/api/chroma/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: id, action: 'state' }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

export async function getPostgresResponse(text, id) {
  const res = await fetch(`${BASE_URL}/api/postgres/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: text, user_id: id, action: 'execute' }),
  });
  if (!res.ok) {
    return "Error";
  };
  return res.json();
}

export async function getPostgresInitialState(id) {
  const res = await fetch(`${BASE_URL}/api/postgres/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: id, action: 'state' }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
}

