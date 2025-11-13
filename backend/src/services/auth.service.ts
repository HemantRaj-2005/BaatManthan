import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import { compareValue, hashValue } from "../utils/bcrypt";
import { LoginSchemaType, RegisterSchemaType } from "../validators/auth.validator";


export const registerService = async (body: RegisterSchemaType) => {

    const {email} = body;

    const existingUser = await UserModel.findOne({email});
    if(existingUser){
        throw new UnauthorizedException("Email already in use");
    }

    const newUser = await UserModel.create({
        ...body,
    });

    await newUser.save();
    return newUser;
};
export const loginService = async (body: LoginSchemaType) => {

    const {email, password} = body;

    const user = await UserModel.findOne({email});
    if(!user){
        throw new NotFoundException("User not found");
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) throw new UnauthorizedException("Invalid email orpassword");

    return user;
};