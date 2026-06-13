import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageWrapper from "../components/PageWrapper";
export default function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await API.post(
            "/auth/register",
            {
              name,
              email,
              password
            }
          );

        console.log(
          res.data
        );

       toast.success(
  "Registration successful"
);

        navigate("/");

      } catch (error) {

        console.log(error);
toast.error(
 error.response?.data?.message ||
 "Registration failed"
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

          <h2>
            Create Account
          </h2>

          <p>
            Join and start exploring stays,in order to book please login!!
          </p>

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button type="submit">

            Register

          </button>

        </form>

      </div>

      <Footer />

    </>

</PageWrapper>
);
}