
import React from "react";

import Auth from "./Auth";

function Register({ onRegister }) {

    return (
        <Auth name="register" title="Регистрация" buttonText="Зарегистрироваться" onSubmit={onRegister} />
    );
};

export default Register;