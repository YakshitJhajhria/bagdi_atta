import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-123';

export async function verifyAdminToken(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return !!decoded;
  } catch (error) {
    return false;
  }
}

export interface UserPayload {
  userId: string;
  name: string;
  email: string;
  role: 'customer' | 'distributor' | 'admin';
}

export async function verifyUserToken(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
