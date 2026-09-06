import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(`\n    >> Error  :: Missing env variable : JWT_SECRET`);
  console.log(`    >> INTEROP CORE IS TERMINATED!\n`);

  process.exit(1);
}

export interface JwtPayload {
  platformId: string;
}

export const generateToken = (platformId: string): string => {
  return jwt.sign(
    { platformId },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};