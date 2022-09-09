import { HTMLInputTypeAttribute } from "react";
import { UseFormRegister } from "react-hook-form";

export interface IInput {
  id: string; // id of input
  type?: HTMLInputTypeAttribute | undefined; // input type
  className?: string; // style
  placeholder?: string; // placeholder
  maxLength?: number; // max length of input
  register?: UseFormRegister<any>; // register from useForm
}
export default function Input({
  id,
  type = "text",
  className = "shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md",
  placeholder,
  maxLength,
  register,
}: IInput) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {id}
      </label>
      <input
        id={id}
        type={type}
        className={className}
        placeholder={placeholder}
        maxLength={maxLength}
        {...register(id)}
      />
    </div>
  );
}
