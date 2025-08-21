import mongoose from "mongoose";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserModel } from "../models/UserModel";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const newUser = new UserModel({
      ...user,
      _id: new mongoose.Types.ObjectId(user._id),
    });
    const savedUser = await newUser.save();
    return new User(
      user._id,
      user.email,
      user.name,
      user.role,
      user.password,
      user.googleId ?? undefined,
      user.createdAt,
      user.updatedAt,
      user.isBlocked
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).exec();
    if (!user) return null;
    return new User(
      user._id,
      user.email,
      user.name,
      user.role,
      user.password,
      user.googleId ?? undefined,
      user.createdAt,
      user.updatedAt,
      user.isBlocked
    );
  }

  async findById(id: mongoose.Types.ObjectId): Promise<User | null> {
    const user = await UserModel.findById(id).exec();
    if (!user) return null;
    return new User(
      user._id,
      user.email,
      user.name,
      user.role,
      user.password,
      user.googleId ?? undefined,
      user.createdAt,
      user.updatedAt,
      user.isBlocked
    );
  }

  async verifyToken(idToken: string): Promise<{
    email: string;
    name: string;
    picture: string;
    googleId: string;
  }> {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid Google token");
    }

    return {
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture!,
      googleId: payload.sub!,
    };
  }

  async updatePassword(
    userId: mongoose.Types.ObjectId,
    hashedPassword: string
  ): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    ).exec();
    if (!updatedUser) return null;
    return new User(
      updatedUser._id,
      updatedUser.email,
      updatedUser.name,
      updatedUser.role,
      updatedUser.password,
      updatedUser.googleId ?? undefined,
      updatedUser.createdAt,
      updatedUser.updatedAt,
      updatedUser.isBlocked
    );
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find({ role: { $ne: "admin" } })
      .select("-password")
      .exec();

    return users.map(
      (u) =>
        new User(
          u._id,
          u.email,
          u.name,
          u.role,
          null, 
          undefined,
          u.createdAt,
          u.updatedAt,
          u.isBlocked
        )
    );
  }

  async updateBlockStatus(userId: mongoose.Types.ObjectId, isBlocked: boolean): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).exec();

    if (!updatedUser) return null;

    return new User(
      updatedUser._id,
      updatedUser.email,
      updatedUser.name,
      updatedUser.role,
      null,
      updatedUser.googleId ?? undefined,
      updatedUser.createdAt,
      updatedUser.updatedAt,
      updatedUser.isBlocked
    );
  }

}
