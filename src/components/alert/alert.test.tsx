import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Alert,
  AlertBody,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "./alert";

describe("Alert", () => {
  it("renders with the alert role", () => {
    render(
      <Alert>
        <AlertBody>
          <AlertDescription>Test message</AlertDescription>
        </AlertBody>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders icon and description", () => {
    render(
      <Alert>
        <AlertIcon data-testid="icon">!</AlertIcon>
        <AlertBody>
          <AlertDescription>Important notice</AlertDescription>
        </AlertBody>
      </Alert>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Important notice")).toBeInTheDocument();
  });

  it("renders title only inside AlertBody", () => {
    render(
      <Alert>
        <AlertBody>
          <AlertTitle>Title only</AlertTitle>
        </AlertBody>
      </Alert>,
    );

    expect(screen.getByText("Title only")).toBeInTheDocument();
  });

  it("renders title and content", () => {
    render(
      <Alert>
        <AlertBody>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Body copy</AlertDescription>
        </AlertBody>
      </Alert>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(
      <Alert variant="error">
        <AlertBody>
          <AlertDescription>Error</AlertDescription>
        </AlertBody>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveClass("bg-red-100");
  });

  it("defaults to info variant", () => {
    render(
      <Alert>
        <AlertBody>
          <AlertDescription>Info</AlertDescription>
        </AlertBody>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveClass("bg-blue-100");
  });

  it("applies custom className", () => {
    render(
      <Alert className="custom-class">
        <AlertBody>
          <AlertDescription>Test</AlertDescription>
        </AlertBody>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });
});
