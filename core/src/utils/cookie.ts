import type { Response } from "express";

const COOKIE_NAME = "platform_token";

export const setAuthCookie = (
  res: Response,
  token: string
): void => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 15 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  });
};