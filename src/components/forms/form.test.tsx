import { screen, render, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import Form from "./form";

const getSubmitBtn = () => screen.getByRole("button", { name: /submit/i });

describe("when the form is rendered", () => {
  beforeEach(() => {
    render(<Form />);
  })
  it("should render the form", () => {
    expect(screen.getByRole("heading", { name: /create product/i })).toBeInTheDocument();
  });

  it("should render form fields for name, size, type" , () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  })
  it("should render a submit button", () => {
    expect(getSubmitBtn()).toBeInTheDocument();
  })
});

describe("when the user submits the form without values for fields", () => {
  beforeEach(() => {
    render(<Form />);
  })

  it("should display validation error messages", async () => {

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/size is required/i)).not.toBeInTheDocument();

    await user.click(getSubmitBtn());

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/size is required/i)).toBeInTheDocument();
  })
})

describe("when the user blurs a field that is empty", () => {
  beforeEach(() => {
    render(<Form />);
  })

  it("should display validation error message when the user blurs a field that is empty", async () => {

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();

    fireEvent.focus(screen.getByLabelText(/name/i));
    fireEvent.blur(screen.getByLabelText(/name/i));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

  })
})