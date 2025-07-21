import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { _fetch } from "../libs/utils";
import { useSelector } from 'react-redux';
const ChangePassword = () => {
    const token = useSelector((state) => state.userappdetails.TOKEN);
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.oldPassword) newErrors.oldPassword = "Old password is required";
        if (!form.newPassword) newErrors.newPassword = "New password is required";
        if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
        if (form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const payload = { currentPassword: form.oldPassword, newPassword: form.newPassword };
        _fetch("change-password", payload, false, token).then(res => {
            if (res.status === "success") {
                toast.success("Password changed successfully!");
                setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
        }).catch(error => {
            toast.error("Login failed: " + error.message);
        });
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <h3>Change Password</h3>
            <form onSubmit={handleSubmit} autoComplete="off" style={{ maxWidth: 400 }}>
                <div className="mb-3">
                    <label className="form-label">Old Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.oldPassword ? "is-invalid" : ""}`}
                        name="oldPassword"
                        value={form.oldPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;