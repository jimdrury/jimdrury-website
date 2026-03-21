import type { FC } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface FileUploaderProps
  extends ComponentPropsWithoutChildren<"input"> {
  label?: string;
}

export const FileUploader: FC<FileUploaderProps> = ({
  className,
  label,
  id,
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 border-2 border-dashed border-black bg-white text-black p-8 text-center shadow-[4px_4px_0_0] hover:bg-yellow-50 has-[:focus-visible]:focus-ring",
        className,
      )}
    >
      <FaCloudUploadAlt className="size-8" />
      <span className="text-sm font-semibold text-black">
        {label ?? "Click or drag to upload"}
      </span>
      <input type="file" id={id} className="sr-only" {...props} />
    </label>
  );
};
