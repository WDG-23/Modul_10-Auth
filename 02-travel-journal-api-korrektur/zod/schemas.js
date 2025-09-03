import { z } from 'zod/v4';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])/;

export const userSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().trim().email(),
    password: z.string().min(8).max(512).regex(passwordRegex, {
      error: 'Password needs to contain at least on upper, one lower case, one number and a special character.'
    }),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, { error: "Passwords don't match" });

export const signInSchema = userSchema.omit({ firstName: true, lastName: true, confirmPassword: true });

export const postSchema = z.object({
  title: z.string('Title must be a string').min(1, 'Title is required'),
  image: z.string('Image must be a string').min(1, 'Image is required'),
  content: z.string('Content must be a string').min(1, 'Content is required')
  // author: z.string('Author must be a string').min(1, 'Author is required')
});
