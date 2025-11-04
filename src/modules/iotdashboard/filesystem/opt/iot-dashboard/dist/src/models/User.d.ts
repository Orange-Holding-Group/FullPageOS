import { IUser, IUserCreate, IUserUpdate } from '../types';
declare class User {
    static findAll(): Promise<IUser[]>;
    static findById(id: number): Promise<IUser | undefined>;
    static findByEmail(email: string): Promise<IUser | undefined>;
    static findByUsername(username: string): Promise<IUser | undefined>;
    static create(userData: IUserCreate): Promise<IUser | undefined>;
    static update(id: number, userData: IUserUpdate): Promise<IUser | undefined>;
    static delete(id: number): Promise<boolean>;
    static verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    static count(): Promise<number>;
}
export default User;
//# sourceMappingURL=User.d.ts.map