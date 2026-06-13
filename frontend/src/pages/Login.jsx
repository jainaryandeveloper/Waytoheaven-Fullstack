import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageWrapper from "../components/PageWrapper";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
  "user",
  JSON.stringify(res.data)
);

toast.success(
  "Login successful"
);

navigate("/");

      

    } catch (error) {
      console.log(error);
toast.error(
 error.response?.data?.message ||
"Invalid Email or Password"
);
    }
  };

 return (
  <PageWrapper>
    <>
      <Navbar />

      <div className="auth-container">

        <form
          className="auth-card"
          onSubmit={submitHandler}
        >

          <h2>Welcome Back</h2>

          <p>
            Login to continue exploring stays
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

      <Footer />
    </>

</PageWrapper>
);
}