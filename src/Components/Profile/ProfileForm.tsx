// import React, { useCallback, useEffect, useState } from "react";
import React from "react";
import { Form, Field, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ProfileForm = () => {
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [gender, setGender] = useState("");
  // const [image, setImage] = useState(null);

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[A-Za-z]+$/, "*Only characters are allowed*")
      .min(3, "*Must be atleast 3 characters*")
      .max(10, "*Not more than 10 characters*")
      .required("*Required*"),
    lastName: Yup.string()
      .matches(/^[A-Za-z]+$/, "*Only characters are allowed*")
      .min(3, "*Must be atleast 3 characters*")
      .max(10, "*Not more than 10 characters*")
      .required("*Required*"),
    email: Yup.string().email("Invalid email!").required("*Required*"),
    gender: Yup.string()
      .oneOf(["Male", "Female"], "*Please select a gender*")
      .required("*Required*"),
  });

  // const addData = useCallback(async () => {
  //   try {
  //     const res = await axios.post("http://localhost:8001/addDataFromForm", {
  //       firstName,
  //       lastName,
  //       email,
  //       gender,
  //       image,
  //     });
  //     console.log("response: ", res);
  //   } catch (err) {
  //     console.log("error in adding data to the form", err);
  //   }
  // }, [firstName, lastName, email, gender, image]);

  // useEffect(() => {
  //   addData();
  // }, [addData]);

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          image: undefined,
        }}
        validationSchema={ProfileSchema}
        // onSubmit={(values, { resetForm, setSubmitting }) => {
        //   console.log('values: ', values.image);
        //   if (values.image !== undefined) {
        //     console.log(values);
        //     setEmail(values.email);
        //     setFirstName(values.firstName);
        //     setLastName(values.lastName);
        //     setGender(values.gender);
        //     setImage(values.image);
        //     resetForm();
        //   } else {
        //     setSubmitting(false);
        //   }
        // }}
        onSubmit={async (values, { resetForm }) => {
          const formData = new FormData();
          console.log('form data:', formData);
          if (values.image !== undefined) {
            formData.append("firstName", values.firstName);
            formData.append("lastName", values.lastName);
            formData.append("email", values.email);
            formData.append("gender", values.gender);
            formData.append("image", values.image);
          }
          try {
            const res = await axios.post(
              "http://localhost:8001/addDataFromForm",
              formData
            );
            console.log("response: ", res);
            if (res.status === 201) {
              resetForm();
            } else if (res.status === 406) {
              alert("Please fill all the input fields");
            }
          } catch (err) {
            console.log("error in adding data to the form", err);
          }
        }}
      >
        {({
          errors,
          touched,
          dirty,
          isValid,
          setFieldError,
          setFieldValue,
        }) => (
          <Form className="container my-20 mr-auto ml-auto border-2 border-slate-950 p-20 w-1/2">
            <div className="place-content-center m-2">
              <div className="font-mono antialiased">
                <label htmlFor="firstName">First Name</label>
              </div>
              <Field
                name="firstName"
                type="text"
                className="border-2 rounded-lg border-purple-600"
              />
              {errors.firstName && touched.firstName ? (
                <div className="text-red-500">{errors.firstName}</div>
              ) : null}
            </div>
            <div className="place-content-center m-2">
              <div className="font-mono antialiased">
                <label htmlFor="firstName">Last Name</label>
              </div>
              <Field
                name="lastName"
                type="text"
                className="border-2 rounded-lg border-purple-600"
              />
              {errors.lastName && touched.lastName ? (
                <div className="text-red-500">{errors.lastName}</div>
              ) : null}
            </div>
            <div className="place-content-center m-2">
              <div className="font-mono antialiased">
                <label htmlFor="firstName">Email</label>
              </div>
              <Field
                name="email"
                type="email"
                className="border-2 rounded-lg border-purple-600"
              />
              {errors.email && touched.email ? (
                <div className="text-red-500">{errors.email}</div>
              ) : null}
            </div>
            <div className="place-content-center m-2">
              <div className="font-mono antialiased">
                <label htmlFor="Male">Gender</label>
              </div>
              <label>
                <Field type="radio" name="gender" value="Male" />
                Male
              </label>
              <label>
                <Field type="radio" name="gender" value="Female" />
                Female
              </label>
              {errors.gender && touched.gender ? (
                <div className="text-red-500">{errors.gender}</div>
              ) : null}
            </div>
            <div className="place-content-center m-2">
              <div className="font-mono antialiased">
                <label htmlFor="image">Image</label>
              </div>
              <Field
                name="image"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                value={undefined}
                onChange={(event: { target: { files: any[] } }) => {
                  const file = event.target.files[0];
                  if (file) {
                    if (file.size > 300 * 1024) {
                      setFieldError(
                        "image",
                        "*File size should be less than 300KB*"
                      );
                    } else if (!file.type.startsWith("image/")) {
                      setFieldError("image", "*File type should be an image*");
                    } else {
                      setFieldValue("image", file);
                    }
                  } else {
                    setFieldValue("image", undefined);
                    setFieldError("image", "*Required*");
                  }
                }}
              />
              {errors.image && touched.image && (
                <div className="text-red-500">{errors.image}</div>
              )}
            </div>
            <button
              className="m-2 bg-cyan-500 hover:bg-cyan-600 cursor-pointer w-1/4 rounded-lg"
              type="submit"
              disabled={!(dirty && isValid)}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};
export default ProfileForm;
