import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FileUploader } from "./file-uploader";

describe("FileUploader", () => {
  it("renders with default label", () => {
    render(<FileUploader id="upload" />);
    expect(screen.getByText("Click or drag to upload")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<FileUploader label="Upload your CV" id="cv" />);
    expect(screen.getByText("Upload your CV")).toBeInTheDocument();
  });
});
