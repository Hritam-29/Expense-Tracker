import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "./AuthContext";

describe("AuthContext", () => {
  beforeEach(() => localStorage.clear());

  test("login stores token, name, email and sets isLoggedIn", () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    act(() => {
      result.current.login("T297", "Rohit", "rohit@test.com");
    });

    expect(localStorage.getItem("token")).toBe("T297");
    expect(localStorage.getItem("name")).toBe("Rohit");
    expect(localStorage.getItem("email")).toBe("rohit@test.com");
    expect(result.current.isLoggedIn).toBe(true);
  });

  test("logout clears token and sets isLoggedIn false", () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

    act(() => {
      result.current.login("T297", "Rohit", "rohit@test.com");
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });
});
