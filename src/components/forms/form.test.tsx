import { screen, render, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import Form from "./form";
import { server } from "../../mocks/node";
import { HttpResponse, http } from "msw";

const getSubmitBtn = () => screen.getByRole("button", { name: /submit/i });

const mockServerError = async (statusCode: number) => {
  server.use(
    http.post('/products', () => {
      return HttpResponse.json(null, {
        status: statusCode
      })
    })
  )
};

beforeEach(() => {
  render(<Form />);
})

describe("when the form is rendered", () => {
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
  it("should display validation error messages", async () => {

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/size is required/i)).not.toBeInTheDocument();

    await user.click(getSubmitBtn());

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/size is required/i)).toBeInTheDocument();
  })
})

describe("when the user blurs a field that is empty", () => {
  it("should display validation error message when the user blurs a field that is empty", async () => {

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();

    fireEvent.focus(screen.getByLabelText(/name/i));
    fireEvent.blur(screen.getByLabelText(/name/i));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

  })
})

describe("when the user submits the form with values for fields", async () => {
  it("should display success message and reset the form fields", async () => {

    await user.type(screen.getByLabelText(/name/i), "test");
    await user.type(screen.getByLabelText(/size/i), "test");
    //fill select for the type product
    await user.selectOptions(screen.getByRole("combobox"), "electronics");
    await user.click(getSubmitBtn());
    expect(await screen.findByText(/product stored successfully/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    expect(screen.getByLabelText(/size/i)).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("");
  })
})

describe("when the user submit the form and the server throws an unexpected error", () => {
  it("should display an appropiate message when the error has status 500", async() => {
    await mockServerError(500)

    await user.type(screen.getByLabelText(/name/i), "test");
    await user.type(screen.getByLabelText(/size/i), "test");
    //fill select for the type product
    await user.selectOptions(screen.getByRole("combobox"), "electronics");
    await user.click(getSubmitBtn());

    expect(await screen.findByRole('alert')).toHaveClass("text-red-800");
  })
})